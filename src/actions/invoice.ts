"use server";

import fs from "node:fs";
import createReport from "docx-templates";
import path from "node:path";

const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);

export async function createInvoice(formData: FormData) {
  console.log(formData);

  const inputPath = path.join(process.cwd(), "src/templates/invoice.docx");

  const template = fs.readFileSync(inputPath);

  const buffer = await createReport({
    template,
    data: {
      date: formData.get("date"),
      invoice_no: formData.get("invoice_no"),
      from: formData.get("from"),
      to: formData.get("to"),
      amount: formData.get("amount"),
    },
  });

  const pdf = await libre.convertAsync(buffer, ".pdf", undefined);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
