import { useQuery } from "@tanstack/react-query";

import { getAccountIdentifier } from "@/services";
import { getUserProfile } from "@/services/user";

export const userKeys = {
  key: ["account"] as const,
  identifier: () => [...userKeys.key, "identifier"] as const,
  profile: () => [...userKeys.key, "profile"] as const,
};

export const useAccountIdentifier = () => {
  return useQuery({
    queryKey: userKeys.identifier(),
    queryFn: getAccountIdentifier,
    staleTime: Infinity,
    retry: false,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    staleTime: Infinity,
  });
};
