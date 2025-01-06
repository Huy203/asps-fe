import { useMutation, useQuery } from "@tanstack/react-query";

import { getFile, postFile } from "@/services/bucket";
import { useUpdateUserProfile } from "./useUsers";

export const useGetBucket = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["bucket"],
    queryFn: () => getFile(id),
  });
};

export const useUpdateBucket = () => {
  const updateUserProfile = useUpdateUserProfile();
  return useMutation({
    mutationFn: postFile,
    onSuccess: (data) => {
      updateUserProfile.mutate({
        avatar: data.id,
      });
    },
  });
};
