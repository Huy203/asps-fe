import { useGetTasks } from "@/hooks/react-query/useTasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui";
import { ThreeDotsLoader } from "../mocules/three-dot-loader";
import { useEffect, useState } from "react";
import { Task } from "@/lib/types";
import { TaskPriority, TaskStatus } from "@/lib/enums";
import { Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
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
  const { data: tasks, isPending } = useGetTasks(undefined, undefined, undefined, "startTime:desc");
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

  const focusSessionData = Object.entries(
    tasks.reduce((acc: { [key: string]: { [key: string]: number } }, task) => {
      task.focusDurations?.forEach((duration) => {
        const day = new Date(duration.start).toLocaleDateString();
        if (!acc[day]) {
          acc[day] = {};
        }
        if (!acc[day][task.name]) {
          acc[day][task.name] = 0;
        }
        acc[day][task.name] += duration.duration;
      });
      return acc;
    }, {})
  ).map(([day, durations]) => ({ day, ...durations }));

  const focusSessionConfig = focusSessionData.reduce(
    (acc: { [key: string]: { label: string; color: string } }, item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "day" && !acc[key]) {
          acc[key] = {
            label: key,
            color: `hsl(--chart-${Object.keys(acc).length + 1})`,
          };
        }
      });
      return acc;
    },
    {}
  );
  console.log(focusSessionConfig);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {isPending ? (
        <ThreeDotsLoader />
      ) : (
        <>
          <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <ChartLegend content={<ChartLegendContent nameKey="status" />} />
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
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="tasks" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Focus session progress</CardTitle>
                <CardDescription>
                  See how your focus sessions are progressing at a glance.{" "}
                  <Link to="/tasks" className="text-primary underline-offset-4 hover:underline">
                    View all tasks
                  </Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={focusSessionConfig}>
                  <BarChart accessibilityLayer data={focusSessionData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    {tasks.map((task, index) => (
                      <Bar
                        key={index}
                        dataKey={task.name}
                        stackId="a"
                        fill={`hsl(var(--chart-${index + 1}))`}
                        radius={[4, 4, 4, 4]}
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
