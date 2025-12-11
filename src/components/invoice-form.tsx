"use client";

import { Button } from "./ui/button";
import Datepicker from "./ui/datepicker";
import { Control, Controller, FieldPath, useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";
import { Input } from "./ui/input";
import { generateInvoice } from "@/actions/invoice-actions";

const DEFAULT_AMOUNT = 42_500;

export type Inputs = {
  date: Date;
  amount: number;
};

function InputDatepicker({
  name,
  control,
  label,
}: {
  name: FieldPath<Inputs>;
  control: Control<Inputs>;
  label: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={new Date()}
      rules={{ required: true }}
      render={({ field }) => (
        <Datepicker
          placeholder={label}
          selected={new Date(field.value)}
          onChange={(date) => field.onChange(date)}
        />
      )}
    />
  );
}

export default function InvoiceForm() {
  const { handleSubmit, control, formState, register } = useForm<Inputs>({
    defaultValues: {
      amount: DEFAULT_AMOUNT,
      date: new Date(),
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: Inputs) => {
    try {
      const result = await generateInvoice(data);

      toast({
        title: "Success",
        description: result.message,
      });

      setTimeout(() => {
        window.open(`/invoice/${result.invoiceId}`, "_blank");
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 font-sans">
        <InputDatepicker name="date" control={control} label="Date" />

        <Input {...register("amount")} placeholder="Amount" />

        <Button
          isLoading={formState.isSubmitting}
          disabled={!formState.isValid || formState.isSubmitting}
        >
          Generate Invoice
        </Button>
      </div>
    </form>
  );
}
