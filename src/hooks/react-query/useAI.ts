import { getAnalytics, getFeedback } from "@/services/ai";
import { useQuery } from "@tanstack/react-query";

export const useGetFeedback = (enabled: boolean) => {
  return useQuery({
    queryKey: ["feedback"],
    queryFn: getFeedback,
    staleTime: Infinity,
    enabled,
  });
};

export const useGetAnalytics = (enabled: boolean) => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    staleTime: Infinity,
    enabled,
  });
};
