"use client";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Datepicker from "./ui/datepicker";
import { Control, Controller, useForm } from "react-hook-form";

export type Inputs = {
  invoice_no: number;
  date: Date;
  from: Date;
  to: Date;
  amount: number;
};

function InputDatepicker({
  name,
  control,
  label,
}: {
  name: keyof Inputs;
  control: Control<Inputs>;
  label: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <Datepicker
          placeholder={label}
          selected={field.value as Date}
          onChange={(date) => field.onChange(date)}
        />
      )}
    />
  );
}

export default function InvoiceForm() {
  const { register, handleSubmit, control, formState } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    const response = await fetch("/api/invoice", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(response);
    }

    response.blob().then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.click();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 font-sans">
        <Input
          type="number"
          placeholder="Invoice #"
          {...register("invoice_no", { valueAsNumber: true, required: true })}
        />

        <InputDatepicker name="date" control={control} label="Date" />
        <InputDatepicker name="from" control={control} label="From" />
        <InputDatepicker name="to" control={control} label="To" />
        <Input
          type="number"
          placeholder="Amount"
          {...register("amount", { required: true })}
        />

        <Button
          isLoading={formState.isSubmitting}
          disabled={!formState.isValid || formState.isSubmitting}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
