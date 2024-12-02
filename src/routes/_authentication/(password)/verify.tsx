import VerifyPage from "@/components/pages/auth/password/verify";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authentication/(password)/verify")({
  validateSearch: (search) => {
    const schema = z.object({
      email: z.string().email(),
    });
    return schema.parse(search);
  },
  component: VerifyPage,
});
