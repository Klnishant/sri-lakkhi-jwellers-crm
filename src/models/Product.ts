import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IPRODUCTS extends Document {
    name: string;
    description: string;
    weight: number;
    price: number;
    stock: number;
    type: "Gold" | "Silver" | "Other";
    purity: "18k" | "22k" | "24k" | "Other";
    makingCharge: number;
    huid: string;
    hsn: number;
    supplier: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IPRODUCTS>(
    {
        name: { type: String, required: true },
        description: { type: String },
        weight: { type: Number, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        type: { type: String, enum: ["Gold", "Silver", "Other"], required: true },
        purity: { type: String, enum: ["18k", "22k", "24k", "Other"], required: true },
        makingCharge: { type: Number },
        huid: { type: String },
        hsn: { type: Number },
        supplier: { type: Schema.Types.ObjectId, ref: "Suplier" },
    },
    { timestamps: true }
);

const ProductModel = (mongoose.models.Product as mongoose.Model<IPRODUCTS>) || mongoose.model<IPRODUCTS>('Product', ProductSchema);

export default ProductModel;