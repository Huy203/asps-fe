import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import ErrorFallback from "@/components/ErrorFallback";
import { getAuthValueFromStorage } from "@/services";
import SideBar from "@/components/organisms/side-bar";

const AuthenticatedPage = () => {
  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      <div className="sticky top-0 h-screen">
        <SideBar />
      </div>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    try {
      if (!getAuthValueFromStorage()) {
        return redirect({ to: "/log-in" });
      }
      if (location.pathname === "/log-in" || location.pathname === "/sign-up") {
        return redirect({ to: "/" });
      }
      if (location.pathname === "/") {
        return redirect({ to: "/dashboard" });
      }
      return true;
    } catch (e) {
      console.error(e);
      return redirect({ to: "/log-in" });
    }
  },
  pendingComponent: () => {
    return <span>Loading Protected</span>;
  },
  errorComponent: (error) => {
    console.error(error);
    return <ErrorFallback />;
  },
  component: AuthenticatedPage,
});
