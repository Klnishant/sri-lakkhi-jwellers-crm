import dbconnect from "@/src/lib/dbconnect";
import ProductModel from "@/src/models/Product";

export async function POST(req: Request) {
    await dbconnect();

    try {
        const { name, description, weight, price, stock, type, purity, makingCharge, huid, hsn } = await req.json();
        
        if(!name || !weight || !price || !stock || !type){
            return new Response(JSON.stringify({success:false,message:"Name, weight, price, stock and type are required."}),{status:400})
        }
        const product = new ProductModel({
            name,
            description,
            weight,
            price,
            stock,
            type,
            purity,
            makingCharge,
            huid,
            hsn
        })
        const savedProduct = await product.save();

        if(savedProduct){
            return new Response(JSON.stringify({success:true,message:"Product added successfully."}),{status:201})
        } else {
            return new Response(JSON.stringify({success:false,message:"Failed to add product."}),{status:500})
        }
    } catch (error) {
        return new Response(JSON.stringify({success:false,message:"An error occurred while adding the product.",error}),{status:500})
    }
}