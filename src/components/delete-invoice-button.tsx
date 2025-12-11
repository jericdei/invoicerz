"use client";

import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { deleteInvoice } from "@/actions/invoice-actions";

export default function DeleteInvoiceButton({
  invoiceId,
}: {
  invoiceId: number;
}) {
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = confirm("Are you sure you want to delete this invoice?");

    if (!confirmed) {
      return;
    }

    await deleteInvoice(invoiceId);

    toast({
      title: "Success",
      description: "Invoice deleted successfully",
    });
  };

  return (
    <Button
      className="cursor-pointer absolute top-2 right-2 hover:text-red-500"
      variant="ghost"
      onClick={handleDelete}
    >
      <X className="w-4 h-4 " />
    </Button>
  );
}
