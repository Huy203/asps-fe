import { Link } from "@tanstack/react-router";

import { useAuthStore } from "@/hooks/useAuthStore";
import { getAuthValueFromStorage } from "@/services";

import { Button } from "../ui";
import Ripple from "../ui/ripple";

export default function HomePage() {
  // const signOut = useSignOut();
  // const { data, isError, isLoading } = useAccountIdentifier();
  const isLoading = false;
  const { accessToken, setAccessToken } = useAuthStore();

  if (!accessToken) {
    const token = getAuthValueFromStorage()?.accessToken;
    if (token) {
      setAccessToken(token);
    }
  }

  // if (isError) {
  //   signOut.mutate();
  //   return <div>Session expired</div>;
  // }

  return (
    <main className="grid h-screen place-items-center content-center gap-10">
      <Ripple className="z-0" />

      {isLoading ? (
        <div className="text-center text-2xl font-bold">Loading... </div>
      ) : (
        <>
          <div className="text-center text-2xl font-bold">
            Welcome to the home page, example user!
          </div>
          {accessToken ? (
            <div>Access token founded</div>
          ) : (
            <div>Access token not found, requesting...</div>
          )}
          <Link to="/profile">
            <Button>Go to profile</Button>
          </Link>
        </>
      )}
    </main>
  );
  // return (
  //   <main className="grid h-screen place-items-center content-center gap-10">
  //     <Ripple className="z-0" />
  //     {isLoading ? (
  //       <div className="text-center text-2xl font-bold">Loading... </div>
  //     ) : (
  //       data && (
  //         <>
  //           <div className="text-center text-2xl font-bold">
  //             Welcome to the home page, {data.username}!
  //           </div>
  //           {accessToken ? (
  //             <div>Access token founded</div>
  //           ) : (
  //             <div>Access token not found, requesting...</div>
  //           )}
  //           <Link to="/profile">
  //             <Button>Go to profile</Button>
  //           </Link>
  //         </>
  //       )
  //     )}
  //   </main>
  // );
}
