import { db } from "@/db";
import { notFound } from "next/navigation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  const invoice = await db.query.invoices.findFirst({
    where: (inv, { eq }) => eq(inv.id, id),
  });

  if (!invoice) {
    notFound();
  }

  const file = Bun.file(`./invoices/${invoice.path}`);

  if (!file) {
    notFound();
  }

  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
