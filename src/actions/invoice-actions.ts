"use server";

import { Inputs } from "@/components/invoice-form";
import { db } from "@/db";
import { invoices as invoicesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateInvoiceService } from "@/services/invoice-service";

export async function generateInvoice(data: Inputs) {
  try {
    const invoice = await generateInvoiceService(data);

    revalidatePath("/");

    return {
      message: "Invoice generated successfully",
      invoiceId: invoice.id,
    };
  } catch (err) {
    console.error("An error occurred while generating invoice: ", err);
    throw new Error("An error occurred while generating invoice");
  }
}

export async function deleteInvoice(invoiceId: number) {
  await db.delete(invoicesTable).where(eq(invoicesTable.id, invoiceId));

  revalidatePath("/");

  return {
    message: "Invoice deleted successfully",
  };
}
