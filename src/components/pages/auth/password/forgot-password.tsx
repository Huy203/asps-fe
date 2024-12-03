import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormText from "@/components/mocules/form-inputs/form-text";
import { useForgotPassword } from "@/hooks/react-query/useAuth";

const formSchema = z.object({
  email: z.string().email(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormInputs>({
    defaultValues: { email: "" },
    resolver: zodResolver(formSchema),
  });
  const forgotPasswordMutation = useForgotPassword();

  function onSubmit(data: FormInputs) {
    forgotPasswordMutation.mutate(data);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Forgot password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <FormText name="email" label="Email" placeholder="Example@gmail.com" />
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              Verify
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
