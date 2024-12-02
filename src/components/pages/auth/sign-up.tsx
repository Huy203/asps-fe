import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormText from "@/components/mocules/form-inputs/form-text";
import { useSignUp } from "@/hooks/react-query/useAuth";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      return ctx.addIssue({
        message: "Passwords do not match",
        path: ["confirmPassword"],
        code: "custom",
      });
    }
    return true;
  });

type FormInputs = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });
  const signUpMutation = useSignUp();

  function onSubmit(data: FormInputs) {
    signUpMutation.mutate({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Hello new friend!</CardTitle>
        <CardDescription className="text-center">
          Enter your account information here, and click Sign up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormText name="email" label="Email" placeholder="example@gmail.com" required={true} />
            <FormText
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              required={true}
            />
            <FormText
              name="confirmPassword"
              label="Confirm password"
              type="password"
              placeholder="********"
              required={true}
            />

            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Sign up
            </Button>
            <div className="text-center text-sm">
              Already had an account?&nbsp;
              <Link to="/log-in" className="font-bold">
                Log in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
