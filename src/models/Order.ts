// models/Order.ts

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  customerId: Types.ObjectId;

  // =========================
  // 🔥 PRODUCTS (GST SPLIT)
  // =========================
  products: {
    productId: Types.ObjectId;

    // 🔹 BASIC
    name: string;
    quantity: number;

    // 🔹 SNAPSHOT
    hsn: number;
    metalPrice: number;
    makingCharge: number;

    metalValue: number;
    makingValue: number;

    // 🔥 GST RATES
    gstRateMetal: number;   // 3%
    gstRateMaking: number;  // 5%

    // 🔥 GST SPLIT
    cgstMetal: number;
    sgstMetal: number;
    igstMetal: number;

    cgstMaking: number;
    sgstMaking: number;
    igstMaking: number;

    // 🔥 TOTALS
    totalTaxable: number;
    totalGST: number;
  }[];

  // =========================
  // 🔹 OLD FIELDS (BACKWARD)
  // =========================
  totalAmount: number;

  status: "Pending" | "Processing" | "Completed" | "Cancelled";

  grossWeight: number;
  customDuty: number;

  // 🔥 KEEP but now derived
  sgst: number;
  cgst: number;
  igst: number;

  gstOnMakingCharge: number; // only making GST total

  discount: number;
  totalPayableAmmount: number;

  invoiceNumber: string;
  invoiceUrl: string;

  oldProducts: {
    name: string;
    description: string;
    weight: number;
    price: number;
    quantity: number;
    type: "Gold" | "Silver" | "Other";
    purity: "18k" | "22k" | "24k" | "Other";
    huid: string;
  }[];

  // =========================
  // 🔥 GST META
  // =========================
  sellerGSTIN: string;
  placeOfSupply: string;
  isInterState: boolean;

  // 🔥 TOTAL GST SPLIT
  totalTaxableValue: number;

  totalMetalGST: number;
  totalMakingGST: number;

  totalCGST: number;
  totalSGST: number;
  totalIGST: number;

  type: "invoice" | "credit_note" | "debit_note";
  isReverseCharge: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User" },

    // =========================
    // 🔥 PRODUCTS
    // =========================
    products: [
      {
        productId: { type: Schema.Types.ObjectId },

        name: String,
        quantity: Number,

        hsn: Number,
        metalPrice: Number,
        makingCharge: Number,

        metalValue: Number,
        makingValue: Number,

        gstRateMetal: Number,
        gstRateMaking: Number,

        cgstMetal: Number,
        sgstMetal: Number,
        igstMetal: Number,

        cgstMaking: Number,
        sgstMaking: Number,
        igstMaking: Number,

        totalTaxable: Number,
        totalGST: Number,
      },
    ],

    // =========================
    // 🔹 OLD FIELDS
    // =========================
    totalAmount: Number,

    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Cancelled"],
      default: "Pending",
    },

    grossWeight: Number,
    customDuty: Number,

    cgst: Number,
    sgst: Number,
    igst: Number,

    gstOnMakingCharge: Number,

    discount: Number,
    totalPayableAmmount: Number,

    invoiceNumber: { type: String, required: true },
    invoiceUrl: String,

    oldProducts: [
      {
        name: String,
        description: String,
        weight: Number,
        price: Number,
        quantity: Number,
        type: String,
        purity: String,
        huid: String,
      },
    ],

    // =========================
    // 🔥 GST META
    // =========================
    sellerGSTIN: String,
    placeOfSupply: String,
    isInterState: Boolean,

    totalTaxableValue: Number,

    totalMetalGST: Number,
    totalMakingGST: Number,

    totalCGST: Number,
    totalSGST: Number,
    totalIGST: Number,

    type: {
      type: String,
      enum: ["invoice", "credit_note", "debit_note"],
      default: "invoice",
    },

    isReverseCharge: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);