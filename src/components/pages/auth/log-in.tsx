import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useSignIn, useSignInWithGoogle } from "@/hooks/react-query/useAuth";
import FormText from "../../mocules/form-inputs/form-text";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function LogInPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const signInMutation = useSignIn();
  const signInWithGoogleMutation = useSignInWithGoogle();

  function onSubmit(data: FormInputs) {
    console.log(data);
    signInMutation.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your account information here, and click Log in.
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
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="p-0 text-right text-sm hover:text-blue-500 hover:no-underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Log in
            </Button>
            <p className="w-full text-center">Or</p>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                signInWithGoogleMutation.mutate();
              }}
            >
              Sign in with Google
            </Button>
            <div className="text-center text-sm">
              Don't have account?&nbsp;
              <Link to="/sign-up" className="font-bold">
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
