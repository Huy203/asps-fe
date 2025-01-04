import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormText from "@/components/mocules/form-inputs/form-text";
import { useResetPassword } from "@/hooks/react-query/useAuth";
import { useLocation } from "@tanstack/react-router";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormInputs = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const form = useForm<FormInputs>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(formSchema),
  });

  const { token } = useLocation().state as { token: string };
  const resetPasswordMutation = useResetPassword();

  function onSubmit(data: FormInputs) {
    resetPasswordMutation.mutate({
      password: data.password,
      token: token,
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Reset password</CardTitle>
        <CardDescription className="text-center">
          Enter your new password and confirm it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormText name="password" label="Password" type="password" placeholder="********" />
            <FormText
              name="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="********"
            />
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Reset password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
