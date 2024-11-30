import { getAuthValueFromStorage } from "@/services";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authentication")({
  beforeLoad: async () => {
    try {
      if (getAuthValueFromStorage()) {
        return redirect({ to: "/" });
      }
      return true;
    } catch (e) {
      console.error(e);
      return redirect({ to: "/log-in" });
    }
  },
  component: AuthLayout,
});

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-2 overflow-auto bg-slate-50 sm:pb-16 sm:pt-10">
      <div className="flex h-fit w-full flex-col gap-2 px-2 md:w-1/2 lg:w-[30%]">
        <Outlet />
      </div>
    </div>
  );
}
