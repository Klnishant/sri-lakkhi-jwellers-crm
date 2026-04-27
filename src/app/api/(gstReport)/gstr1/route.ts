// app/api/gstr1/route.ts

import { NextResponse } from "next/server";
import dbconnect from "@/src/lib/dbconnect";
import Order from "@/src/models/Order";
import * as XLSX from "xlsx";
import JSZip from "jszip";

export async function GET(req: Request) {
  await dbconnect();

  try {
    const { searchParams } = new URL(req.url);

    const gstin = searchParams.get("gstin");
    const from = new Date(searchParams.get("from")!);
    const to = new Date(searchParams.get("to")!);

    const match = {
      createdAt: { $gte: from, $lte: to },
    };

    // =========================
    // 🔹 B2B
    // =========================
    // const b2b = await Order.aggregate([
    //   { $match: { ...match, type: "invoice", sellerGSTIN: { $exists: true } } },
    //   { $unwind: "$products" },
    //   {
    //     $group: {
    //       _id: "$invoiceNumber",
    //       taxableValue: { $sum: "$products.totalTaxable" },
    //       igst: { $sum: { $add: ["$products.igstMetal", "$products.igstMaking"] } },
    //       cgst: { $sum: { $add: ["$products.cgstMetal", "$products.cgstMaking"] } },
    //       sgst: { $sum: { $add: ["$products.sgstMetal", "$products.sgstMaking"] } },
    //     },
    //   },
    // ]);

    // =========================
    // 🔹 B2CS
    // =========================
    const b2cs = await Order.aggregate([
      { $match: { ...match, type: "invoice", totalAmount: { $lt: 250000 } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$placeOfSupply",
          taxableValue: { $sum: "$products.totalTaxable" },
          igst: { $sum: { $add: ["$products.igstMetal", "$products.igstMaking"] } },
          cgst: { $sum: { $add: ["$products.cgstMetal", "$products.cgstMaking"] } },
          sgst: { $sum: { $add: ["$products.sgstMetal", "$products.sgstMaking"] } },
        },
      },
    ]);

    // =========================
    // 🔹 B2CL
    // =========================
    const b2cl = await Order.aggregate([
      {
        $match: {
          ...match,
          type: "invoice",
          totalAmount: { $gte: 250000 },
          isInterState: true,
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$invoiceNumber",
          taxableValue: { $sum: "$products.totalTaxable" },
          igst: { $sum: { $add: ["$products.igstMetal", "$products.igstMaking"] } },
        },
      },
    ]);

    // =========================
    // 🔹 CDN
    // =========================
    const cdn = await Order.aggregate([
      { $match: { ...match, type: { $in: ["credit_note", "debit_note"] } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: { invoice: "$invoiceNumber", type: "$type" },
          taxableValue: { $sum: "$products.totalTaxable" },
          igst: { $sum: { $add: ["$products.igstMetal", "$products.igstMaking"] } },
          cgst: { $sum: { $add: ["$products.cgstMetal", "$products.cgstMaking"] } },
          sgst: { $sum: { $add: ["$products.sgstMetal", "$products.sgstMaking"] } },
        },
      },
    ]);

    // =========================
    // 🔹 HSN
    // =========================
    const hsn = await Order.aggregate([
      { $match: match },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.hsn",
          description: { $first: "$products.name" },
          quantity: { $sum: "$products.quantity" },
          taxableValue: { $sum: "$products.totalTaxable" },
          igst: { $sum: { $add: ["$products.igstMetal", "$products.igstMaking"] } },
          cgst: { $sum: { $add: ["$products.cgstMetal", "$products.cgstMaking"] } },
          sgst: { $sum: { $add: ["$products.sgstMetal", "$products.sgstMaking"] } },
        },
      },
    ]);

    // =========================
    // 🔥 GST PORTAL JSON
    // =========================
    const gstr1JSON = {
      gstin: gstin ?? "",
      fp: `${from.getMonth() + 1}${from.getFullYear()}`,
      b2cs,
      b2cl,
      //cdn,
      hsn,
    };

    // =========================
    // 📊 EXCEL GENERATION
    // =========================
    const wb = XLSX.utils.book_new();

    const createSheet = (name: string, data: any[]) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    //createSheet("B2B", b2b);
    createSheet("B2CS", b2cs);
    createSheet("B2CL", b2cl);
    //createSheet("CDN", cdn);
    createSheet("HSN", hsn);

    const excelBuffer = XLSX.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    });

    // =========================
    // 📦 ZIP
    // =========================
    const zip = new JSZip();

    zip.file("gstr1.json", JSON.stringify(gstr1JSON, null, 2));
    zip.file("gstr1.xlsx", excelBuffer);

   const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // const arrayBuffer = Buffer.from(zipBuffer);

    // const zipBlob = new Blob([arrayBuffer], { type: "application/zip" });


    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=gstr1.zip",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}