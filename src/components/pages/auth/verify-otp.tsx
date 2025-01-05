import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2, MoveLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useGetOtp, useVerifyOtp } from "@/hooks/react-query/useAuth";
import useCountdown from "@/hooks/use-countdown";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your OTP must be 6 characters.",
  }),
});

type FormInputs = z.infer<typeof formSchema>;

const formatEmail = (email: string) => {
  const parts = email.split("@");
  return parts[0][0] + "*****" + parts[0].slice(-1) + "@" + parts[1];
};

export default function VerifyOtpPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { email, action } = useSearch({
    strict: false,
  });
  const verifyOtpMutation = useVerifyOtp();
  const getOtp = useGetOtp();
  const navigate = useNavigate();
  const { time, timeLeft, restart, resume } = useCountdown(5 * 60);

  const onSubmit = (data: FormInputs) => {
    verifyOtpMutation.mutate({
      email,
      otp: data.otp,
      action,
    });
  };

  useEffect(() => {
    if (!email) navigate({ to: "/log-in" });
  }, [email, navigate]);

  useEffect(() => {
    resume();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <div className="-mb-8 w-80">
          <Link
            to="/log-in"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-150 ease-in hover:cursor-pointer hover:text-black"
          >
            <MoveLeft size={16} />
            <p className="text-sm font-medium">{"Back to Log In"}</p>
          </Link>
        </div>
        <div>
          <div className="mb-3 text-center text-3xl font-bold">{"Verify OTP"}</div>
          <div className="max-w-96 text-center text-sm">
            {
              "We have sent a verification code to your email. Please enter the code below to verify your"
            }
            &nbsp;
            <span className="text-orange-700">{formatEmail(email)}</span>.
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-80 flex-col gap-2">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="mt-4 w-full bg-primary"
              size="lg"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending && (
                <Loader2 className="mr-1 size-5 animate-spin text-white" />
              )}
              {"Verify"}
            </Button>
            <div className="mt-1 flex flex-col text-center text-sm">
              {"Didn't receive the code?"}
              <Button
                variant="link"
                className="font-bold hover:cursor-pointer"
                onClick={() => {
                  restart();
                  getOtp.mutate({
                    email,
                  });
                }}
                disabled={timeLeft > 0}
              >
                {timeLeft > 0 ? `Resend in ${time} seconds` : "Resend again"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div />
    </>
  );
}
