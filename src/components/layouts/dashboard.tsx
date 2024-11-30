import NavBar from "../mocules/nav-bar";
import SideBar from "../organisms/side-bar";

export default function DashboardLayout({ children }: React.PropsWithChildren<object>) {
  return (
    <div className="flex h-full">
      <div className="sticky left-0 top-0 z-10 flex h-dvh bg-white">
        <SideBar />
      </div>

      <main className="flex flex-1 flex-col">
        <NavBar />
        {children}
      </main>
    </div>
  );
}
