import { TaskPriority, TaskStatus } from "../enums";
import { FocusDuration } from "./focus-duration";

export type Task = {
  id: string;
  name: string;
  description: string;
  priorityLevel: TaskPriority;
  status: TaskStatus;
  startTime: Date;
  estimatedTime: number;
  focusDurations?: FocusDuration[];
};
