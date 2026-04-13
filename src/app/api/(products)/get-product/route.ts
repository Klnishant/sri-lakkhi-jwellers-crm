import dbconnect from "@/src/lib/dbconnect";
import ProductModel from "@/src/models/Product";

export async function GET(req: Request) {
    await dbconnect();
    
    try {
        const products = await ProductModel.find();

        return new Response(JSON.stringify({ success: true, products }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "An error occurred while fetching products." }), { status: 500 });

    }
}