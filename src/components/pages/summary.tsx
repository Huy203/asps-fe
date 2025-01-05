import { useGetTasks } from "@/hooks/react-query/useTasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";
import { ThreeDotsLoader } from "../mocules/three-dot-loader";
import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import { TaskPriority, TaskStatus } from "@/lib/enums";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Label, Legend, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { PriorityMapBorderColor, StatusMapTextColor } from "../organisms/support";

const statusChartConfig = {
  tasks: {
    label: "Tasks",
  },
  completed: {
    label: "Completed",
    color: StatusMapTextColor[TaskStatus.Completed],
  },
  expired: {
    label: "Expired",
    color: StatusMapTextColor[TaskStatus.Expired],
  },
  inProgress: {
    label: "In Progress",
    color: StatusMapTextColor[TaskStatus["In progress"]],
  },
  todo: {
    label: "To Do",
    color: StatusMapTextColor[TaskStatus["To do"]],
  },
};

const priotityChartConfig = {
  tasks: {
    label: "Tasks",
  },
  high: {
    label: "High",
    color: PriorityMapBorderColor[TaskPriority.High],
  },
  medium: {
    label: "Medium",
    color: PriorityMapBorderColor[TaskPriority.Medium],
  },
  low: {
    label: "Low",
    color: PriorityMapBorderColor[TaskPriority.Low],
  },
};

export default function SummaryPage() {
  const { data: tasks, isPending } = useGetTasks();
  const [last7Days, setLast7Days] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      const last7Days = tasks.filter((task) => {
        const taskDate = new Date(task.startTime);
        const today = new Date();
        const last7Days = new Date(today.setDate(today.getDate() - 7));
        return taskDate > last7Days;
      });
      setLast7Days(last7Days);
    }
  }, [tasks]);

  if (!tasks) return null;

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {isPending ? (
        <ThreeDotsLoader />
      ) : (
        <>
          <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {last7Days.filter((t) => t.status === TaskStatus.Completed).length} completed
                </CardTitle>
                <CardDescription>in the last 7 days</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{last7Days.length} created</CardTitle>
                <CardDescription>in the last 7 days</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  {" "}
                  {last7Days.filter((t) => t.status === TaskStatus.Expired).length} due
                </CardTitle>
                <CardDescription>in the last 7 days</CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Card>
              <CardHeader>
                <CardTitle>Status Overview</CardTitle>
                <CardDescription>
                  Get a snapshot of the status of your tasks.{" "}
                  <Link to="/tasks" className="text-primary underline-offset-4 hover:underline">
                    View all tasks
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={statusChartConfig}
                  className="mx-auto aspect-square max-h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={[
                        {
                          status: "completed",
                          tasks: tasks.filter((t) => t.status === TaskStatus.Completed).length,
                          fill: "var(--color-completed)",
                        },
                        {
                          status: "expired",
                          tasks: tasks.filter((t) => t.status === TaskStatus.Expired).length,
                          fill: "var(--color-expired)",
                        },
                        {
                          status: "inProgress",
                          tasks: tasks.filter((t) => t.status === TaskStatus["In progress"]).length,
                          fill: "var(--color-inProgress)",
                        },
                        {
                          status: "todo",
                          tasks: tasks.filter((t) => t.status === TaskStatus["To do"]).length,
                          fill: "var(--color-todo)",
                        },
                      ]}
                      dataKey="tasks"
                      nameKey="status"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {tasks.length}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Total Tasks
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority breakdown</CardTitle>
                <CardDescription>
                  Get a holistic view of how work is being prioritized.{" "}
                  <Link to="/tasks" className="text-primary underline-offset-4 hover:underline">
                    See what you've been focusing on
                  </Link>
                </CardDescription>
                <CardContent className="p-0 pt-6">
                  <ChartContainer
                    config={priotityChartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      data={[
                        {
                          priority: "high",
                          tasks: tasks.filter((t) => t.priorityLevel === TaskPriority.High).length,
                          fill: "var(--color-high)",
                        },
                        {
                          priority: "medium",
                          tasks: tasks.filter((t) => t.priorityLevel === TaskPriority.Medium)
                            .length,
                          fill: "var(--color-medium)",
                        },
                        {
                          priority: "low",
                          tasks: tasks.filter((t) => t.priorityLevel === TaskPriority.Low).length,
                          fill: "var(--color-low)",
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="priority"
                        tickMargin={10}
                        tickFormatter={(value) =>
                          priotityChartConfig[value as keyof typeof priotityChartConfig]?.label
                        }
                      />
                      <YAxis interval={1} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="tasks" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
