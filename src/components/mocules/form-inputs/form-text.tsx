import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";

export type FormTextProps = InputProps & {
  name: string;
  label: string;
};

export default function FormText({ name, label, required, className, ...props }: FormTextProps) {
  const { control, formState } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              error={Boolean(formState.errors[name])}
              {...field}
              onChange={(e) => {
                const value =
                  props.type === "number"
                    ? e.target.value
                      ? +e.target.value.replace(/^0+(?=\d)/, "")
                      : undefined
                    : e.target.value;
                field.onChange(value);
              }}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
