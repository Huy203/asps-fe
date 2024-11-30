import { Link } from "@tanstack/react-router";

import { useSignOut } from "@/hooks/react-query/useAuth";
import { useAccountIdentifier } from "@/hooks/react-query/useUsers";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getAuthValueFromStorage } from "@/services";

import { Button } from "../ui";

export default function HomePage() {
  const signOut = useSignOut();
  const { data, isError, isLoading } = useAccountIdentifier();
  const { accessToken, setAccessToken } = useAuthStore();

  if (!accessToken) {
    const token = getAuthValueFromStorage()?.accessToken;
    if (token) {
      setAccessToken(token);
    }
  }

  if (isError) {
    signOut.mutate();
    return <div>Session expired</div>;
  }
  return (
    <main className="grid h-screen place-items-center content-center gap-10">
      {isLoading ? (
        <div className="text-center text-2xl font-bold">Loading... </div>
      ) : (
        data && (
          <>
            <div className="text-center text-2xl font-bold">
              Welcome to the home page, {data.username}!
            </div>
            {accessToken ? (
              <div>Access token founded</div>
            ) : (
              <div>Access token not found, requesting...</div>
            )}
          </>
        )
      )}
      <Link to="/profile">
        <Button>Go to profile</Button>
      </Link>
    </main>
  );
}
