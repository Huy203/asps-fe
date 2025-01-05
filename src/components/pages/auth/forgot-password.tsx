import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, MoveLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { useGetOtp } from "@/hooks/react-query/useAuth";
import { EnumActionOTP } from "@/lib/enums";

const formSchema = z.object({
  email: z.string().email(),
});

type FormInputs = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormInputs>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });
  const sendOTP = useGetOtp();
  const navigate = useNavigate();

  function onSubmit(data: FormInputs) {
    sendOTP.mutate(
      {
        email: data.email,
      },
      {
        onSuccess: (_, data) => {
          navigate({
            to: "/verify-otp",
            search: {
              email: data.email,
              action: EnumActionOTP.RESET_PASSWORD,
            },
          });
        },
      }
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <div className="-mb-8 w-80">
          <Link
            to="/log-in"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors duration-150 ease-in hover:cursor-pointer hover:text-black"
          >
            <MoveLeft size={16} />
            <p className="text-sm font-medium">{"Back"}</p>
          </Link>
        </div>
        <div>
          <div className="mb-3 text-center text-3xl font-bold">{"Forgot Password"}</div>
          <div className="max-w-80 text-center text-sm">
            {"Enter your email to reset your password"}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-80 flex-col gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Email"}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="example@gmail.com"
                      error={Boolean(form.formState.errors.email)}
                      {...field}
                      onChange={field.onChange}
                      StartIcon={Mail}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="mt-4 w-full bg-primary"
              disabled={sendOTP.isPending}
            >
              {sendOTP.isPending && <Loader2 className="mr-1 size-5 animate-spin text-white" />}
              {"Send OTP"}
            </Button>
          </form>
        </Form>
      </div>
      <div />
    </>
  );
}
