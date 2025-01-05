import { redirect } from "@tanstack/react-router";
import ky from "ky";

import { getAuthValueFromStorage, signOut } from "./auth";

const BASE_URL = import.meta.env.VITE_PUBLIC_API_ENDPOINT || "http://localhost:3000";

export const apiCustomToken = (token: string) =>
  ky.create({
    prefixUrl: BASE_URL,
    hooks: {
      beforeRequest: [
        async (request) => {
          request.headers.set("Authorization", `Bearer ${token}`);
        },
      ],
    },
  });
const api = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const authInfo = getAuthValueFromStorage();
        request.headers.set("Authorization", `Bearer ${authInfo?.token}`);
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        if (response.status === 401) {
          // const authInfo = getAuthValueFromStorage();
          // if (authInfo?.refreshToken) {
          //   try {
          //     const newAccessToken = await refreshToken();
          //     request.headers.set("Authorization", `Bearer ${newAccessToken.accessToken}`);
          //     return ky(request);
          //   } catch (e) {
          //     console.error(e);
          //     await signOut();
          //     redirect({ to: "/log-in" });
          //   }
          // } else {
          console.log("Unauthorized response received, signing out...");
          await signOut();
          console.log("Redirecting to /log-in...");
          redirect({ to: "/log-in" });
          // }
        } else {
          if (!response.ok) {
            const body: {
              message: string;
            } = await response.json();
            throw new Error(body.message);
          }
        }
        return response;
      },
    ],
  },
});

export const apiAuth = ky.create({
  prefixUrl: BASE_URL,
  hooks: {
    afterResponse: [
      async (_, __, response) => {
        if (!response.ok) {
          const body: {
            message: string;
          } = await response.json();
          throw new Error(body.message);
        }
      },
    ],
  },
});

export default api;
