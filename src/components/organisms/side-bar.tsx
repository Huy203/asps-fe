import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  GlobeIcon,
  LayoutDashboardIcon,
  ListTodoIcon,
  LogOut,
  Menu,
  User,
} from "lucide-react";

import { useSignOut } from "@/hooks/react-query/useAuth";

import { useUserProfile } from "@/hooks/react-query/useUsers";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button, Separator } from "../ui";
import { Skeleton } from "../ui/skeleton";
import { SideBarFeature, SideBarFeatureProps } from "./side-bar-feature";

const features: SideBarFeatureProps[] = [
  {
    to: "/dashboard",
    icon: <LayoutDashboardIcon size={20} />,
    label: "Dashboard",
  },
  {
    to: "/tasks",
    icon: <ListTodoIcon size={20} />,
    label: "Tasks",
  },
  {
    to: "/summary",
    icon: <GlobeIcon size={20} />,
    label: "Summary",
  },
];

export default function SideBar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const signOut = useSignOut();
  // const { avatar } = useUserAvatar();
  const { data: user, isSuccess } = useUserProfile();

  return (
    <>
      <div className="fixed flex w-full items-center justify-start space-x-2 bg-white p-4 pt-4 sm:hidden">
        <button onClick={() => setSidebarOpen((prev) => !prev)} aria-label="Open Sidebar">
          <Menu size={24} />
        </button>

        <span className="text-lg font-bold text-primary">AI STUDY PLANNER</span>
      </div>
      <aside
        className={cn(
          "fixed h-full w-[280px] border-r bg-white transition-all duration-500 ease-in-out sm:static",
          isSidebarOpen ? "left-0 sm:left-0" : "left-[-280px] sm:left-0"
        )}
      >
        <div className="relative flex h-full flex-col px-4 pb-4 pt-9">
          <nav className="flex h-screen w-full flex-col justify-between">
            <div>
              <div className="relative flex flex-row items-center justify-center gap-2">
                <Calendar size={20} />
                <span className="text-lg font-bold text-primary"> AI STUDY PLANNER</span>
                <Button
                  className={cn(
                    "absolute grid size-8 cursor-pointer place-items-center rounded-full border bg-white text-neutral-400 shadow-md transition-transform duration-300 ease-in-out hover:text-neutral-700 sm:hidden",
                    isSidebarOpen
                      ? "right-0 translate-x-8 [&_svg]:rotate-180"
                      : "absolute right-0 hidden translate-x-1/2 [&_svg]:rotate-180"
                  )}
                  onClick={() => setSidebarOpen((prev) => !prev)}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>

              <Separator className="mt-6" />
              <ul className="flex w-full flex-col space-y-2 overflow-hidden pt-3">
                {features.map((feat, idx) => {
                  if (typeof feat === "object")
                    return <SideBarFeature key={idx} feature={feat} isExpanded={true} />;
                  return <div key={idx} className="h-px w-full bg-border" />;
                })}
              </ul>
            </div>
          </nav>
          <div className="flex flex-col gap-4 p-2">
            <Separator />
            <Link to="/profile">
              <div className="flex flex-row items-center justify-center gap-2">
                {/* {avatar ? (
                    <img src={avatar.url} className="!size-10 rounded-full" />
                  ) : ( */}
                <div className="grid !size-10 place-items-center rounded-full bg-neutral-100 text-white">
                  <User size={20} />
                </div>
                {/* )} */}
                <div className="flex h-10 w-full flex-1 flex-col justify-between overflow-hidden">
                  {user && isSuccess ? (
                    <>
                      <p className="text-small font-semibold text-black">{user[0].name}</p>
                      <p className="text-supporting-text truncate text-xs">{user[0].email}</p>
                    </>
                  ) : (
                    <>
                      <Skeleton className="h-[17px] w-20" />
                      <Skeleton className="w-22 h-[17px]" />
                    </>
                  )}
                </div>
                <Button onClick={() => signOut.mutate()} variant="ghost">
                  <LogOut size={20} />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
