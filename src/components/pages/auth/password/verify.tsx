import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyOTP } from "@/hooks/react-query/useAuth";
import { useSearch } from "@tanstack/react-router";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const formSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

type FormInputs = z.infer<typeof formSchema>;

export default function VerifyPage() {
  const form = useForm<FormInputs>({
    defaultValues: { otp: "" },
    resolver: zodResolver(formSchema),
  });
  const verifyMutation = useVerifyOTP();

  const { email } = useSearch({ strict: false });

  function onSubmit(data: FormInputs) {
    verifyMutation.mutate({
      email: email,
      otp: data.otp,
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          Enter the OTP sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              onChange={(value) => {
                form.setValue("otp", value);
              }}
            >
              <InputOTPGroup className="flex items-center justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {form.formState.errors.otp && (
              <p className="text-sm text-red-500">{form.formState.errors.otp.message}</p>
            )}
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending && (
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
