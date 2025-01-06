import ChangeImageDialog from "@/components/organisms/avatar/image-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateBucket } from "@/hooks/react-query/useBucket";
import { useUserProfile } from "@/hooks/react-query/useUsers";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_ENDPOINT || "http://localhost:3000";

export default function Avatar() {
  const { data: profile, isLoading } = useUserProfile();

  const updateBucket = useUpdateBucket();

  const handleChangeImage = (files: File[]) => {
    const file: File = files[0];
    updateBucket.mutate({ file: file });
  };

  if (isLoading) {
    return <Skeleton className="size-32 rounded-full" />;
  }

  return (
    <ChangeImageDialog onSubmit={handleChangeImage}>
      <div
        className={cn(
          "relative box-content grid size-32 place-items-center overflow-hidden rounded-full border-4 border-white bg-neutral-200 transition-all duration-200 hover:cursor-pointer",
          updateBucket.isPending ? "" : "[&_div]:invisible [&_div]:hover:visible"
        )}
      >
        {updateBucket.isPending ? (
          <Skeleton className="size-32" />
        ) : (
          <>
            {profile?.[0].avatar ? (
              <img
                className="absolute left-0 top-0 size-32 rounded-full bg-white object-cover"
                src={`${BASE_URL}/files/be8a233a-3c03-4e40-8711-3991a7bbd00e`}
                loading="lazy"
                alt={profile?.[0].name ?? "Avatar"}
              />
            ) : (
              <span className="text-5xl uppercase text-white">
                {profile?.[0].name?.charAt(0) || "--"}
              </span>
            )}
            <div className="absolute left-0 top-0 grid size-32 place-items-center bg-black/40">
              <Camera size={32} className="text-white" />
            </div>
          </>
        )}
      </div>
    </ChangeImageDialog>
  );
}
