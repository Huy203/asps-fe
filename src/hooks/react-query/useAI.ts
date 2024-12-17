import { getFeedback } from "@/services/ai";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedback = (enabled: boolean) => {
  return useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedback,
    staleTime: Infinity,
    enabled,
  });
};
