import InvoiceForm from "@/components/invoice-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="font-bold text-3xl mb-8">Invoicerz</h1>

      <InvoiceForm />
    </main>
  );
}
