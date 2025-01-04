import ForgotPasswordPage from "@/components/pages/auth/forgot-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authentication/forgot-password")({
  component: ForgotPasswordPage,
});
