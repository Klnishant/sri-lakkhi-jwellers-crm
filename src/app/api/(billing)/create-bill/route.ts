import { generatePDF } from "@/src/helper/generatePdf";
import { uploadPDF } from "@/src/helper/uploadPdf";
import { addCustomer, addOldProducts, createOrder } from "@/src/lib/billing";
import dbconnect from "@/src/lib/dbconnect";
import OrderModel from "@/src/models/Order";
import axios from "axios";
import { log } from "console";
import { success } from "zod";
import { v2 as cloudinary } from "cloudinary";

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
        { status: 400 },
      );
    }

    const body = JSON.parse(bodyString);

   const { customerDetails, items, oldItems, billingDetails } = body;

    const customerDetailsObj = await addCustomer(customerDetails) as any as {
      success: boolean;
      data: any;
      error: string;
      status: number;
      message: string;
    };

    console.log("Customer Details Object", customerDetailsObj);

    if (!customerDetailsObj.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: customerDetailsObj.message,
          error: customerDetailsObj.error,
        }),
        { status: customerDetailsObj.status },
      );
    }

    console.log("Customer Details", customerDetailsObj);

    const
     bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const pdfUrl = (await uploadPDF(buffer)) as { secure_url: string } | null;
    console.log("PDF URL", pdfUrl);

    
    const orderData = {
      customerId: customerDetailsObj.data._id,
      products: body.items,
      totalAmount: body.billingDetails.grandTotal,
      grossWeight: body.billingDetails.grossWeight,
      customDuty: body.billingDetails.customDuty,
      sgst: body.billingDetails.sgst,
      cgst: body.billingDetails.cgst,
      igst: body.billingDetails.igst,
      gstOnMakingCharge: body.billingDetails.gstOnMakingCharge,
      discount: body.billingDetails.discount || 0,
      totalPayableAmmount: body.billingDetails.invoiceValue,
      invoiceNumber: body.billingDetails.invoiceNumber,
      invoiceUrl: pdfUrl?.secure_url,
      oldProducts: body.olditems || [],
    };

    const orderObject = await createOrder(orderData) as any as {
      success: boolean;
      data: any;
      error: string;
      status: number;
      message: string;
    };

    log("Order Object: ", orderObject);

    if (!orderObject.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: orderObject.message,
          error: orderObject.error,
        }),
        { status: 500 },
      );
    }
    console.log("Order Object: ", orderObject);

    return new Response(JSON.stringify({ success: true, data:pdfUrl?.secure_url, message: "Order created successfully." }), { status: 201 });
  } catch (error: any) {
    console.error("Error creating bill:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create bill",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
