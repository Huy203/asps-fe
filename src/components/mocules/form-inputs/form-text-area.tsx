import { useFormContext } from "react-hook-form";

import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export type FormTextAreaProps = {
  name: string;
  label?: string;
  className?: string;
};

export default function FormTextArea({ name, label, className }: FormTextAreaProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Textarea {...field} rows={8} />
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
