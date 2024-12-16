import { TaskPriority, TaskStatus } from "@/lib/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSelect from "../mocules/form-inputs/form-select";
import FormText from "../mocules/form-inputs/form-text";
import { Button, Form } from "../ui";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const schema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priorityLevel: z
    .nativeEnum(TaskPriority, {
      message: "Invalid priority level",
    })
    .optional(),
  startTime: z.string().transform((value) => new Date(value)),
  estimatedTime: z
    .number()
    .refine((value) => !isNaN(Number(value)), {
      message: "Estimated time must be a number",
    })
    .transform((value) => Number(value))
    .optional(),
  status: z.nativeEnum(TaskStatus, { message: "Invalid status" }).optional(),
});

export const FormTask = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priorityLevel: undefined,
      startTime: new Date(),
      estimatedTime: undefined,
      status: TaskStatus.Todo,
    },
  });
  function onSubmit(data: z.infer<typeof schema>) {
    const transformedData = {
      ...data,
      startTime: new Date(data.startTime).getTime(),
    };
    console.log(transformedData);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-[450px] flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>
            Create new task by adding information here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex flex-col gap-2">
              <FormText name="name" label="Task Name" required placeholder="Enter task name" />
              <FormText
                name="description"
                label="Description"
                placeholder="Enter task description (optional)"
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormSelect
                  name="priorityLevel"
                  label="Priority Level"
                  options={Object.values(TaskPriority).map((priority) => ({
                    value: priority,
                    label: priority,
                  }))}
                />
                <FormSelect
                  name="status"
                  label="Status"
                  options={Object.values(TaskStatus).map((status) => ({
                    value: status,
                    label: status,
                  }))}
                />
                <FormText name="startTime" label="Start Time" required type="datetime-local" />
                <FormText
                  name="estimatedTime"
                  label="Estimated Time (hours)"
                  type="number"
                  placeholder="e.g., 5"
                />
              </div>
            </div>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="destructive">Delete</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={form.handleSubmit(onSubmit)}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
