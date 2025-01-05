import ResetPasswordPage from "@/components/pages/auth/reset-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authentication/reset-password")({
  component: ResetPasswordPage,
});
