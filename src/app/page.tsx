import InvoiceForm from "@/components/invoice-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import Link from "next/link";
import DeleteInvoiceButton from "@/components/delete-invoice-button";

export default async function Home() {
  const invoices = await db.query.invoices.findMany({
    columns: {
      id: true,
      invoice_no: true,
      from: true,
      to: true,
      path: true,
    },
    orderBy: (invoices, { desc }) => [desc(invoices.invoice_no)],
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="font-bold text-3xl mb-8">Invoicerz</h1>

      <InvoiceForm />

      <h2 className="mt-16 font-bold text-2xl">Generated Invoices</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {invoices.map((invoice) => (
          <Link key={invoice.id} href={`/invoice/${invoice.id}`}>
            <Card>
              <CardHeader className="relative pr-10">
                <CardTitle className="truncate">{invoice.path}</CardTitle>
                <DeleteInvoiceButton invoiceId={invoice.id} />
              </CardHeader>
              <CardContent>
                <p>
                  {invoice.from} to {invoice.to}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
