import dbconnect from "@/src/lib/dbconnect";
import Order from "@/src/models/Order";

export async function POST(req: Request) {
    await dbconnect();

    try {
        const body = await req.json();

        if(!body.customerId || !body.products || !body.totalAmount || !body.grossWeight || !body.customDuty || !body.sgst || !body.cgst || !body.igst || !body.gstOnMakingCharge || !body.discount || !body.totalPayableAmmount) {
            return new Response(JSON.stringify({ success: false, message: "Missing required fields." }), { status: 400 });
        }
        const newOrder = new Order({
            customerId: body.customerId,
            products: body.products,
            totalAmount: body.totalAmount,
            grossWeight: body.grossWeight,
            customDuty: body.customDuty,
            sgst: body.sgst,
            cgst: body.cgst,
            igst: body.igst,
            gstOnMakingCharge: body.gstOnMakingCharge,
            discount: body.discount,
            totalPayableAmmount: body.totalPayableAmmount,
        });

        const savedOrder = await newOrder.save();
        
        if (!savedOrder) {
            return new Response(JSON.stringify({ success: false, message: "Failed to create order." }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, savedOrder, message: "Order created successfully." }), { status: 201 });
    } catch (error: any) {
        console.error("Error creating order:", error?.message);
        return new Response(JSON.stringify({ success: false, message: "Failed to create order." }), { status: 500 });
    }
}