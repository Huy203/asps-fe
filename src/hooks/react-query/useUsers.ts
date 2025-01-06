import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { UserProfile } from "@/lib/types";
import { getAccountIdentifier } from "@/services/auth";
import { getUserProfile, updateUserProfile } from "@/services/user";
import { useToast } from "../use-toast";

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

export const useUserAvatar = () => {
  const { data, isLoading } = useUserProfile();
  return {
    ...data?.[0],
    isLoading,
  };
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: Partial<UserProfile>) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      toast({
        title: "Success",
        description: "Profile updated successfully",
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
