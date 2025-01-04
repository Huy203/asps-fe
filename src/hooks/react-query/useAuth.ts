import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HistoryState, useNavigate } from "@tanstack/react-router";

import {
  getOtp,
  resetPassword,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  verifyOtp,
} from "@/services/auth";

import { EnumActionOTP } from "@/lib/enums";
import { useToast } from "../use-toast";
import { useAuthStore } from "../useAuthStore";

export const authKeys = {
  key: ["authUser"] as const,
  detail: () => [...authKeys.key, "detail"] as const,
};

export const useSignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setAccessToken(JSON.stringify(data));
      navigate({ to: "/" });
      toast({
        title: "Success",
        description: "You have successfully logged in",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (_, variables) => {
      navigate({
        to: "/verify-otp",
        search: {
          email: variables.email,
          action: EnumActionOTP.SIGN_UP,
        },
      });
      toast({
        title: "Success",
        description: "Please verify your email",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignOut = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: "/log-in" });
      clearAccessToken();
      queryClient.clear();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGetOtp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: getOtp,
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Please check your email for the verification code",
        variant: "default",
      });
      navigate({ to: "/verify-otp", params: { email: variables.email } });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

type OTPState = HistoryState & { token: string };
export const useVerifyOtp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data, variables) => {
      if (variables.action == EnumActionOTP.SIGN_UP) {
        toast({
          variant: "default",
          title: "Verify email successfully!",
        });
        navigate({ to: "/log-in" });
      } else {
        navigate({ to: "/reset-password", state: { token: data.token } as OTPState });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: error.message,
        description: "Please enter the correct OTP",
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate({ to: "/log-in" });
      toast({
        title: "Success",
        description: "You have successfully reset your password",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignInWithGoogle = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      if (data) {
        setAccessToken(data.token);
        navigate({ to: "/" });
        toast({
          title: "Success",
          description: "You have successfully logged in",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
