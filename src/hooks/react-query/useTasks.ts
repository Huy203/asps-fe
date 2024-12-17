import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { createTask, deleteTask, getTasks, updateTask } from "@/services/task";
import { Task } from "@/lib/types";
import { TaskPriority, TaskStatus } from "@/lib/enums";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGetTasks = (
  search?: string,
  priority?: TaskPriority,
  status?: TaskStatus,
  sort?: string
) => {
  return useQuery({
    queryKey: ["tasks", search, priority, status, sort],
    queryFn: () => getTasks({ search, priority, status, sort }),
  });
};
