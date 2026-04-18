import cloudinary from "@/src/lib/cloudinary";

export async function uploadPDF(pdfBuffer: Buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // 🔥 important for PDF
        folder: "invoices",
        public_id: `invoice_${Date.now()}.pdf`, // 👈 IMPORTANT,
        type: "upload",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(pdfBuffer);
  });
}