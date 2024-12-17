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
import { useCreateTask, useUpdateTask } from "@/hooks/react-query/useTasks";
import { Loader2 } from "lucide-react";
import { Task } from "@/lib/types";
import { useEffect } from "react";

const taskSchema = z.object({
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
    .transform((value) => Number(value)),
  status: z.nativeEnum(TaskStatus, { message: "Invalid status" }).optional(),
});

const formatDateTimeLocal = (date: Date) => {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const FormTask = ({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}) => {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      priorityLevel: TaskPriority.Low,
      startTime: formatDateTimeLocal(new Date()),
      estimatedTime: 0,
      status: TaskStatus["To do"],
    },
  });

  const { handleSubmit } = form;
  const { mutate: createMutate, isPending: createPending } = useCreateTask();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateTask();

  function onSubmit(data: {
    name: string;
    description?: string;
    priorityLevel?: TaskPriority;
    startTime: string;
    estimatedTime: number;
    status?: TaskStatus;
  }) {
    const transformedData = {
      ...data,
      startTime: new Date(data.startTime),
    };

    if (task) {
      updateMutate(
        { id: task.id, payload: transformedData },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        }
      );
      return;
    }
    createMutate(transformedData, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  useEffect(() => {
    if (task) {
      form.setValue("name", task.name);
      form.setValue("description", task.description);
      form.setValue("priorityLevel", task.priorityLevel);
      form.setValue("startTime", formatDateTimeLocal(new Date(task.startTime)));
      form.setValue("estimatedTime", task.estimatedTime);
      form.setValue("status", task.status);
    } else {
      form.reset();
    }
  }, [task]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-[450px] flex-col gap-4"
        onInteractOutside={() => form.reset()}
      >
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>
            {task ? "Update your task" : "Create new task"} by adding information here. Click save
            when you're done.
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
                  options={Object.entries(TaskPriority).map(([key, value]) => ({
                    value,
                    label: key,
                  }))}
                />
                <FormSelect
                  name="status"
                  label="Status"
                  options={Object.entries(TaskStatus).map(([key, value]) => ({
                    value,
                    label: key,
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
            <Button onClick={handleSubmit(onSubmit)} disabled={createPending || updatePending}>
              {(createPending || updatePending) && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
