import { TaskPriority, TaskStatus } from "@/lib/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import FormSelect from "../mocules/form-inputs/form-select";
import FormText from "../mocules/form-inputs/form-text";
import { Button, Form } from "../ui";

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
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Estimated time must be a number",
    })
    .transform((value) => Number(value))
    .optional(),
  status: z.nativeEnum(TaskStatus, { message: "Invalid status" }).optional(),
  focusDurations: z
    .array(
      z.object({
        start: z.string().transform((value) => new Date(value)),
        duration: z.number().int().positive(),
      })
    )
    .optional(),
});

type FormTaskProps = {
  onTaskAdded: () => void;
};

export const FormTask = ({ onTaskAdded }: FormTaskProps) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      priorityLevel: undefined,
      startTime: new Date(),
      estimatedTime: undefined,
      status: undefined,
      focusDurations: [{ start: new Date(), duration: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "focusDurations",
  });
  function onSubmit(data: z.infer<typeof schema>) {
    const transformedData = {
      ...data,
      startTime: new Date(data.startTime).getTime(),
      focusDurations: data.focusDurations?.map((duration) => ({
        ...duration,
        start: new Date(duration.start).getTime(),
      })),
    };
    console.log(transformedData);
    onTaskAdded();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
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
              required
              type="number"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Focus Durations</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4">
              <FormText
                name={`focusDurations.${index}.start`}
                label="Start Time"
                type="datetime-local"
              />
              <FormText
                name={`focusDurations.${index}.duration`}
                label="Duration (minutes)"
                type="number"
                placeholder="e.g., 30"
              />
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="destructive"
                className="mt-2"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ start: new Date(), duration: 0 })}
          >
            Add Another Focus Duration
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
