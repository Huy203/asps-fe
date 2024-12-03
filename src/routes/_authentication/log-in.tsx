import { createFileRoute } from "@tanstack/react-router";

import LogInPage from "@/components/pages/auth/log-in";

export const Route = createFileRoute("/_authentication/log-in")({
  component: LogInPage,
});
