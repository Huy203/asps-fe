import { FetchingData, Task } from "@/lib/types";
import api from "./kyInstance";
import { TaskPriority, TaskStatus } from "@/lib/enums";

export const createTask = async (payload: Partial<Task>) => {
  return (await api.post("tasks", { json: payload }).json<FetchingData<Task>>()).data;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
  return (await api.put(`tasks/${id}`, { json: payload }).json<FetchingData<Task>>()).data;
};

export const deleteTask = async (id: string) => {
  return (await api.delete(`tasks/${id}`).json<FetchingData<Task>>()).data;
};

export const getTasks = async (searchParams: {
  search?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  sort?: string;
}) => {
  const formattedSearchParams = Object.fromEntries(
    Object.entries(searchParams).filter(([_, value]) => value !== undefined)
  );
  return (
    await api
      .get("tasks", {
        searchParams: formattedSearchParams,
      })
      .json<FetchingData<Task[]>>()
  ).data;
};
