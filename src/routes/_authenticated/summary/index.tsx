import SummaryPage from "@/components/pages/summary";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/summary/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SummaryPage />;
}
