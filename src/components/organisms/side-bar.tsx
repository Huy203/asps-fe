import { Link } from "@tanstack/react-router";
import { Calendar, LayoutDashboardIcon, ListTodoIcon, LogOut, User } from "lucide-react";

import { useSignOut } from "@/hooks/react-query/useAuth";

import { Button, Separator } from "../ui";
import { SideBarFeature, SideBarFeatureProps } from "./side-bar-feature";
import { Skeleton } from "../ui/skeleton";

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
];

export default function SideBar() {
  const signOut = useSignOut();
  // const { avatar } = useUserAvatar();
  // const { data: user, isSuccess } = useUserProfile();

  return (
    <aside className="h-full w-[280px] shrink-0 border-r bg-white">
      <div className="relative flex h-full flex-col px-4 pb-4 pt-9">
        <nav className="flex h-screen w-full flex-col justify-between">
          <div>
            <div className="flex items-center justify-center gap-2">
              <Calendar size={20} />{" "}
              <span className="text-lg font-bold text-primary"> AI STUDY PLANNER</span>
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
          <div className="flex flex-col gap-4 p-2">
            <Separator />
            <Link
            // to="/profile"
            >
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center justify-center gap-2">
                  {/* {avatar ? (
                    <img src={avatar.url} className="!size-10 rounded-full" />
                  ) : ( */}
                  <div className="grid !size-10 place-items-center rounded-full bg-neutral-100 text-white">
                    <User size={20} />
                  </div>
                  {/* )} */}
                  <div className="flex h-10 w-full flex-1 flex-col justify-between overflow-hidden">
                    {/* {user && isSuccess ? (
                      <>
                        <p className="text-small font-semibold text-black">{user.fullName}</p>
                        <p className="text-supporting-text truncate text-xs">{user.email}</p>
                      </>
                    ) : ( */}
                    <>
                      <Skeleton className="h-[17px] w-20" />
                      <Skeleton className="w-22 h-[17px]" />
                    </>
                    {/* )} */}
                  </div>
                </div>
                <Button onClick={() => signOut.mutate()} variant="ghost">
                  <LogOut size={20} />
                </Button>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
