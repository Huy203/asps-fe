import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useSignOut } from "@/hooks/react-query/useAuth";
import { useUserProfile } from "@/hooks/react-query/useUsers";

import Confetti, { ConfettiRef } from "../ui/confetti";
import Ripple from "../ui/ripple";

const formSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, "Username must be at least 1 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
      username: "",
    },
    resolver: zodResolver(formSchema),
  });
  const signOutMutation = useSignOut();
  const { data, isLoading, isSuccess } = useUserProfile();
  const confettiRef = useRef<ConfettiRef>(null);

  function onSubmit(_: FormInputs) {
    signOutMutation.mutate();
  }

  useEffect(() => {
    if (isSuccess && data) {
      form.reset(data);
    }
  }, [data, isSuccess]);

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-blue-200 to-pink-200 sm:pb-16 sm:pt-10">
      <Ripple className="z-0" />

      <div className="z-10 flex h-fit w-full flex-col gap-2 px-2 md:w-1/2 lg:w-[30%]">
        {isLoading ? (
          <Loader2 className="mx-auto size-12 animate-spin" />
        ) : (
          <>
            <Card className="z-10">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Profile screen</CardTitle>
                {/* <CardDescription className="text-center">
          Enter your account information here, and click Log in.
          </CardDescription> */}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="example@gmail.com"
                              error={Boolean(form.formState.errors.email)}
                              {...field}
                              onChange={field.onChange}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Username"
                              error={Boolean(form.formState.errors.username)}
                              {...field}
                              onChange={field.onChange}
                              disabled
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 w-full border-destructive bg-transparent text-destructive hover:bg-destructive/5 hover:text-destructive"
                      disabled={signOutMutation.isPending}
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
