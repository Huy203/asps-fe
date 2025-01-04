import { TaskPriority, TaskStatus } from "@/lib/enums";

export const PriorityMapBorderColor: Record<TaskPriority, string> = {
  [TaskPriority.High]: "#ef4444",
  [TaskPriority.Medium]: "#eab308",
  [TaskPriority.Low]: "#3b82f6",
};

export const StatusMapTextColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "#334155",
  [TaskStatus["In progress"]]: "#1d4ed8",
  [TaskStatus.Completed]: "#15803d",
  [TaskStatus.Expired]: "#b91c1c",
};

export const StatusMapColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "#f8fafc",
  [TaskStatus["In progress"]]: "#eff6ff",
  [TaskStatus.Completed]: "#f0fdf4",
  [TaskStatus.Expired]: "#fef2f2",
};
