import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { useUpdateUserProfile, useUserProfile } from "@/hooks/react-query/useUsers";
import { useEffect } from "react";
import { z } from "zod";
import FormText from "../mocules/form-inputs/form-text";
import Avatar from "../organisms/avatar/avatar";
import { Skeleton } from "../ui/skeleton";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Full name must be at least 1 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });
  const { data, isLoading, isSuccess } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  function onSubmit(data: FormInputs) {
    updateProfileMutation.mutate(data);
  }

  useEffect(() => {
    if (isSuccess && data) {
      form.reset(data[0] as FormInputs);
    }
  }, [data, isSuccess]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-100 p-4">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="col-span-3 p-8">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>
      <div className="overflow-hidden rounded-3xl bg-white pb-8">
        <img
          className="h-40 w-full object-cover"
          src="https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="grid gap-8 px-8 pt-4">
          <div className="relative col-span-3 items-center justify-center pt-16">
            <div className="absolute top-0 -mt-4 flex -translate-y-1/2 flex-row items-end gap-4">
              <Avatar />
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="mb-2 h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </>
                ) : (
                  <h5 className="text-xl font-semibold">{data?.[0].name}</h5>
                )}
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormText name="email" label="Email" value={form.getValues("email")} disabled />
                <FormText name="name" label="Name" value={form.getValues("name")} />

                <Button
                  type="submit"
                  className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
                  disabled={
                    updateProfileMutation.isPending || form.getValues("name") === data?.[0].name
                  }
                >
                  Update Profile
                </Button>
              </form>
            </Form>
            {/* <Button
              type="button"
              variant="outline"
              className="mt-4 w-full border-red-500 text-red-500 hover:bg-red-100"
              disabled={signOutMutation.isPending}
              onClick={() => {
                signOutMutation.mutate();
              }}
            >
              {signOutMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-red-500" />
              )}
              Log out
              <LogOut className="ml-2 size-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
