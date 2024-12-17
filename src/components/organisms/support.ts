import { TaskPriority, TaskStatus } from "@/lib/enums";

export const PriotityMapBorderColor: Record<TaskPriority, string> = {
  [TaskPriority.High]: "#ef4444",
  [TaskPriority.Medium]: "#eab308",
  [TaskPriority.Low]: "#3b82f6",
};

export const StatusMapTextColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "rgb(51 65 85)",
  [TaskStatus["In progress"]]: "rgb(29 78 216)",
  [TaskStatus.Completed]: "#15803d",
  [TaskStatus.Expired]: "#b91c1c",
};

export const StatusMapColor: Record<TaskStatus, string> = {
  [TaskStatus["To do"]]: "rgb(248 250 252)",
  [TaskStatus["In progress"]]: "rgb(239 246 255)",
  [TaskStatus.Completed]: "#f0fdf4",
  [TaskStatus.Expired]: "#fef2f2",
};
