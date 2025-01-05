import NavBar from "../mocules/nav-bar";
import SideBar from "../organisms/side-bar";

export default function DashboardLayout({ children }: React.PropsWithChildren<object>) {
  return (
    <div className="relative flex h-screen bg-[#F8F8F8]">
      <div className="sticky top-0 z-50 h-screen">
        <SideBar />
      </div>

      <main className="z-0 flex-1 overflow-y-auto pt-12 sm:pt-0">
        <NavBar />
        {children}
      </main>
    </div>
  );
}
