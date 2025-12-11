import fs from "node:fs";
import createReport from "docx-templates";
import path from "node:path";
import { format } from "date-fns";
import { db } from "@/db";
import { invoices } from "@/db/schema";

const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

export type GenerateInvoiceInput = {
  date: Date;
  amount?: number;
};

export async function generateInvoiceService(data: GenerateInvoiceInput) {
  const inputPath = path.join(process.cwd(), "src/templates/invoice.docx");
  const template = fs.readFileSync(inputPath);

  const latestInvoice = await db.query.invoices.findFirst({
    orderBy: (inv, { desc }) => desc(inv.invoice_no),
  });

  const invoice_no = latestInvoice?.invoice_no
    ? latestInvoice.invoice_no + 1
    : 19;

  const formatDate = (date: Date) =>
    format(new Date(date).toLocaleDateString("en-PH"), "MMMM dd, yyyy");

  const date = new Date(data.date);
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth(), 15);

  if (date.getDate() > 15) {
    from.setDate(16);
    to.setDate(30);
  }

  const invoiceData = {
    invoice_no,
    date: formatDate(date),
    from: formatDate(from),
    to: formatDate(to),
    amount: String(data.amount ?? process.env.INVOICE_AMOUNT ?? 42500),
  };

  const buffer = await createReport({
    // @ts-ignore
    template,
    cmdDelimiter: ["{", "}"],
    data: invoiceData,
  });

  const pdf = await libre.convertAsync(buffer, ".pdf", undefined);

  const formattedDate = format(to, "yyyyMMdd");

  const fileName = `invoices/${formattedDate}-Invoice-Jeric.pdf`;
  const filePath = path.join(process.cwd(), fileName);

  await Bun.write(filePath, pdf);

  const invoice = await db
    .insert(invoices)
    .values({
      ...invoiceData,
      path: filePath.replace("/app/invoices/", ""),
    })
    .returning();

  return invoice[0];
}
