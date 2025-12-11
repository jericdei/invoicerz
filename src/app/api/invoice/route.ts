import { generateInvoiceService } from "@/services/invoice-service";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const invoice = await generateInvoiceService(reqData);

    return Response.json({
      message: "Invoice generated successfully",
      invoice,
    });
  } catch (err) {
    console.error("An error occurred while generating invoice: ", err);

    return Response.json(
      {
        message: "An error occurred while generating invoice",
        error: err,
      },
      { status: 500 }
    );
  }
}
