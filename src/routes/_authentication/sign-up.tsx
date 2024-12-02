import { createFileRoute } from "@tanstack/react-router";

import SignUpPage from "@/components/pages/auth/sign-up";

export const Route = createFileRoute("/_authentication/sign-up")({
  component: SignUpPage,
});
