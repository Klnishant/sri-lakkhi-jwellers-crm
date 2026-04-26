// app/api/create-bill/route.ts

import dbconnect from "@/src/lib/dbconnect";
import Product from "@/src/models/Product";
import OrderModel from "@/src/models/Order";
import { uploadPDF } from "@/src/helper/uploadPdf";
import { addCustomer } from "@/src/lib/billing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await dbconnect();

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const bodyString = formData.get("body") as string;

    if (!file || !bodyString) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const body = JSON.parse(bodyString);

    const { customerDetails, items, billingDetails } = body;

    const {
      goldRatePer10g,
      silverRatePerKg,
      sellerGSTIN,
      placeOfSupply,
      isInterState,
      discount = 0,
      customDuty = 0,
      invoiceNumber,
      invoiceDate,
      metalGSTRate,
      makingGSTRate,
    } = billingDetails;

    // =========================
    // 🔹 CUSTOMER
    // =========================
    const customer = await addCustomer(customerDetails);

    if (!customer.success || !customer.data) {
      return new Response(JSON.stringify(customer), {
        status: customer.status,
      });
    }

    // =========================
    // 🔹 PDF UPLOAD
    // =========================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const pdfUrl = (await uploadPDF(buffer)) as { secure_url: string };

    // =========================
    // 🔥 CALCULATION START
    // =========================
    let products: any[] = [];

    let totalTaxableValue = 0;

    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    let totalMetalGST = 0;
    let totalMakingGST = 0;

    let grossWeight = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error("Product not found");

      const quantity = item.quantity;

      if (!quantity || quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      if (item.makingCharge === undefined || item.makingCharge === null) {
        throw new Error("Making charge is required");
      }

      // =========================
      // 🔥 DYNAMIC METAL PRICE
      // =========================
      let metalPrice = 0;

      if (product.type === "Gold") {
        metalPrice = (goldRatePer10g * product.weight) / 10;
      } else if (product.type === "Silver") {
        metalPrice = (silverRatePerKg * product.weight) / 1000;
      } else {
        metalPrice = product.price || 0;
      }

      const makingCharge = item.makingCharge;

      const metalValue = metalPrice * quantity;
      const makingValue = makingCharge * quantity;

      const totalTaxable = metalValue + makingValue;

      // =========================
      // 🔥 GST CALCULATION
      // =========================
      const gstRateMetal = metalGSTRate ?? 0;
      const gstRateMaking = makingGSTRate ?? 0;

      const metalGST = (metalValue * gstRateMetal) / 100;
      const makingGST = (makingValue * gstRateMaking) / 100;

      let cgstMetal = 0,
        sgstMetal = 0,
        igstMetal = 0;

      let cgstMaking = 0,
        sgstMaking = 0,
        igstMaking = 0;

      if (isInterState) {
        igstMetal = metalGST;
        igstMaking = makingGST;
      } else {
        cgstMetal = metalGST / 2;
        sgstMetal = metalGST / 2;

        cgstMaking = makingGST / 2;
        sgstMaking = makingGST / 2;
      }

      const totalGST =
        cgstMetal +
        sgstMetal +
        igstMetal +
        cgstMaking +
        sgstMaking +
        igstMaking;

      // =========================
      // 🔹 PUSH PRODUCT
      // =========================
      products.push({
        productId: product._id,
        name: product.name,
        quantity,

        hsn: product.hsn,

        metalPrice,
        makingCharge,

        metalValue,
        makingValue,

        gstRateMetal,
        gstRateMaking,

        cgstMetal,
        sgstMetal,
        igstMetal,

        cgstMaking,
        sgstMaking,
        igstMaking,

        totalTaxable,
        totalGST,
      });

      // =========================
      // 🔹 TOTALS
      // =========================
      totalTaxableValue += totalTaxable;

      totalCGST += cgstMetal + cgstMaking;
      totalSGST += sgstMetal + sgstMaking;
      totalIGST += igstMetal + igstMaking;

      totalMetalGST += metalGST;
      totalMakingGST += makingGST;

      grossWeight += product.weight * quantity;
    }

    // =========================
    // 🔹 FINAL AMOUNT
    // =========================
    const totalAmount =
      totalTaxableValue + totalCGST + totalSGST + totalIGST;

    const totalPayableAmmount = totalAmount - discount;

    // =========================
    // 🔹 CREATE ORDER
    // =========================
    const order = await OrderModel.create({
      customerId: customer.data._id,

      products,

      totalTaxableValue,

      totalCGST,
      totalSGST,
      totalIGST,

      totalMetalGST,
      totalMakingGST,

      totalAmount,
      totalPayableAmmount,

      grossWeight,
      customDuty,

      // 🔹 backward compatibility
      cgst: totalCGST,
      sgst: totalSGST,
      igst: totalIGST,
      gstOnMakingCharge: totalMakingGST,

      discount,

      sellerGSTIN,
      placeOfSupply,
      isInterState,

      invoiceNumber,
      invoiceUrl: pdfUrl?.secure_url,

      status: "Completed",
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: order,
        pdf: pdfUrl?.secure_url,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create bill",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}