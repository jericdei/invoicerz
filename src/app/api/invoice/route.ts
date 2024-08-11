import fs from "node:fs";
import createReport from "docx-templates";
import path from "node:path";
import { format } from "date-fns";

const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

export async function POST(request: Request) {
  const data = await request.json();

  const inputPath = path.join(process.cwd(), "src/templates/invoice.docx");

  const template = fs.readFileSync(inputPath);

  const buffer = await createReport({
    template,
    cmdDelimiter: ["{", "}"],
    data: {
      date: format(data.date, "MMMM dd, yyyy"),
      invoice_no: data.invoice_no,
      from: format(data.from, "MMMM dd, yyyy"),
      to: format(data.to, "MMMM dd, yyyy"),
      amount: new Intl.NumberFormat("en-PH").format(data.amount),
    },
  });

  const pdf = await libre.convertAsync(buffer, ".pdf", undefined);

  const headers = new Headers();
  headers.append("Content-Type", "application/pdf");
  headers.append("Content-Disposition", `attachment; filename="invoice.pdf"`);

  return new Response(pdf, { headers });
}
