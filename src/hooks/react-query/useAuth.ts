import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  forgotPassword,
  resetPassword,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  verifyOtp,
} from "@/services/auth";

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
    onSuccess: () => {
      navigate({ to: "/log-in" });
      toast({
        title: "Success",
        description: "You have successfully signed up",
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

export const useForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Please check your email for the OTP",
        variant: "default",
      });
      navigate({ to: "/verify", params: { email: variables.email } });
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

export const useVerifyOTP = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Please check your email for the OTP",
        variant: "default",
      });
      navigate({ to: "/reset-password" });
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

export const useResetPassword = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password has been reset",
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
