import { BookOpen, FileQuestion, Users } from "lucide-react";

import Logo from "@/assets/logo.svg";

import { SideBarFeature, SideBarFeatureProps } from "./side-bar-feature";

const features: SideBarFeatureProps[] = [
  {
    to: "/daily-lessons",
    icon: <BookOpen size={16} />,
    label: "Daily lessons",
  },
  { to: "/questions", icon: <FileQuestion size={16} />, label: "Questions" },
  { to: "/users", icon: <Users size={16} />, label: "User management" },
];

export default function SideBar() {
  return (
    <aside>
      <div className="relative flex h-full w-[240px] flex-col border-r py-[36px]">
        <nav className="w-full">
          <img src={Logo} className="ml-5 h-6" />
          <ul className="flex w-full flex-col space-y-2 overflow-hidden pt-6">
            {features.map((feat, idx) => {
              if (typeof feat === "object")
                return <SideBarFeature key={idx} feature={feat} isExpanded={true} />;
              return <div key={idx} className="h-px w-full bg-border" />;
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
