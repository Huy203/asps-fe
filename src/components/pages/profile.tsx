import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";

import { useSignOut } from "@/hooks/react-query/useAuth";

import { useUpdateUserProfile, useUserProfile } from "@/hooks/react-query/useUsers";
import { useEffect } from "react";
import { z } from "zod";
import FormText from "../mocules/form-inputs/form-text";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Full name must be at least 1 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });
  const signOutMutation = useSignOut();
  // TODO: uncomment this block when connected to the backend
  const { data, isLoading, isSuccess } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  function onSubmit(data: FormInputs) {
    updateProfileMutation.mutate(data);
  }

  // TODO: uncomment this block when connected to the backend
  useEffect(() => {
    if (isSuccess && data) {
      // form.reset(data[0]);
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
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Profile</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormText name="email" label="Email" value={form.getValues("email")} disabled />
            <FormText name="name" label="Name" value={form.getValues("name")} />

            <Button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              Update Profile
            </Button>
          </form>
        </Form>
        <Button
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
        </Button>
      </div>
    </div>
  );
}
