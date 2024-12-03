import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useSignOut } from "@/hooks/react-query/useAuth";

import { useUserProfile } from "@/hooks/react-query/useUsers";
import FormText from "../mocules/form-inputs/form-text";
import Confetti, { ConfettiRef } from "../ui/confetti";

const formSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(1, "Username must be at least 1 characters long").optional(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "example@gmail.com",
      username: "user",
    },
    resolver: zodResolver(formSchema),
  });
  const signOutMutation = useSignOut();
  // TODO: uncomment this block when connected to the backend
  const { data, isLoading, isSuccess } = useUserProfile();
  const confettiRef = useRef<ConfettiRef>(null);

  function onSubmit(data: FormInputs) {
    console.group("logout" + data);
    signOutMutation.mutate();
  }

  // TODO: uncomment this block when connected to the backend
  useEffect(() => {
    if (isSuccess && data) {
      form.reset(data);
    }
  }, [data, isSuccess]);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-blue-200 to-pink-200 sm:pb-16 sm:pt-10">
      <div className="z-10 flex h-fit w-full flex-col gap-2 px-2 md:w-1/2 lg:w-[30%]">
        {/* TODO: uncomment this block when connected to the backend */}
        {isLoading ? (
          <Loader2 className="mx-auto size-12 animate-spin" />
        ) : (
          <>
            <Card className="z-10">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Profile screen</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <FormText name="email" label="Email" disabled />
                    <FormText name="username" label="Username" disabled />

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 w-full border-destructive bg-transparent text-destructive hover:bg-destructive/5 hover:text-destructive"
                      disabled={signOutMutation.isPending}
                      onClick={() => {
                        signOutMutation.mutate();
                      }}
                    >
                      {signOutMutation.isPending && (
                        <Loader2 className="mr-1 size-5 animate-spin text-white" />
                      )}
                      Log out
                      <LogOut className="ml-2 size-4" />
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full"
              onMouseEnter={() => {
                confettiRef.current?.fire({});
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
