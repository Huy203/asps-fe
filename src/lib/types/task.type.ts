import { TaskPriority, TaskStatus } from "../enums";

export type Task = {
  id: string;
  name: string;
  description: string;
  priorityLevel: TaskPriority;
  status: TaskStatus;
  startTime: Date;
  estimatedTime: number;
};
