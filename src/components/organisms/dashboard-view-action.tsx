import { useForm } from "react-hook-form";
import FormSelect from "../mocules/form-inputs/form-select";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";
import { TaskPriority, TaskStatus } from "@/lib/enums";

const formSchema = z.object({
  search: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function DashboardViewAction() {
  const form = useForm<FormInputs>({
    defaultValues: {
      search: "",
      priority: "",
      status: "",
    },
    resolver: zodResolver(formSchema),
  });
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-1 items-center justify-start gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full lg:w-auto">
              <FormControl>
                <Input
                  placeholder={"Search"}
                  className="h-9 w-full bg-white placeholder:text-neutral-300 focus:outline-none"
                  StartIcon={Search}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormSelect
          name="priority"
          placeholder={"Priority"}
          options={Object.entries(TaskPriority).map(([label, value]) => {
            return {
              label,
              value,
            };
          })}
        />
        <FormSelect
          name="status"
          placeholder={"Status"}
          options={Object.entries(TaskStatus).map(([label, value]) => {
            return {
              label,
              value,
            };
          })}
        />
      </form>
    </Form>
  );
}
