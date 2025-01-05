import { getLogging } from "@/services/logging";
import { useQuery } from "@tanstack/react-query";

export const useGetLogging = () => {
  return useQuery({
    queryKey: ["logging"],
    queryFn: getLogging,
    staleTime: Infinity,
  });
};
