import dbconnect from "@/src/lib/dbconnect";
import CustomerModel from "@/src/models/Customer";
import { success } from "zod";

export async function PATCH(req: Request) {
    await dbconnect();

    try {
        const body = await req.json();

        if(!body.phone){
            return Response.json({success: false, message: "Phone number is required",},{status:401});
    
        }

        const customer = await CustomerModel.findOne({
            $and : [{phone: body.phone},{name: body.name}]
        });

        if(!customer){
            return Response.json({success: false, message: "Customer not found",},{status:404});
        }

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(customer._id,{
            ...body,
            dueAmount: Number(body.dueAmount),
            advanceAmount: Number(body.advanceAmount),
        },{new: true});

        if(!updatedCustomer){
            return Response.json({success: false, message: "Failed to update customer",},{status:500});
        }
        else{
            return Response.json({success: true, data:updatedCustomer, message: "Customer updated successfully",},{status:200});
        }
    } catch (error: any) {
        console.error("Error in updating Customer: ",error.message);
        return Response.json({success: false, message: "Failed to update customer", error:error.message},{status:500})
    }
}