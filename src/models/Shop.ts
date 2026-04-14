import mongoose, { Schema, Document } from "mongoose";

export interface ISHOP extends Document {
    name: string;
    gstin: string;
    address: string;
    contactNumber: string;
    email: string;
    termsAndConditions: string;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema = new Schema<ISHOP>(
    {
        name: { type: String, required: true },
        gstin: { type: String, required: true },
        address: { type: String, required: true },
        contactNumber: { type: String, required: true },
        email: { type: String, required: true },
        termsAndConditions: { type: String },
    },
    { timestamps: true }
);

const ShopModel = (mongoose.models.SHOP as mongoose.Model<ISHOP>) || mongoose.model<ISHOP>("SHOP", ShopSchema);

export default ShopModel;