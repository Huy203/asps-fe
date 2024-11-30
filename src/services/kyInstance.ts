import { redirect } from "@tanstack/react-router";
import ky from "ky";

import { getAuthValueFromStorage, refreshToken, signOut } from "./auth";

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
        request.headers.set("Authorization", `Bearer ${authInfo?.accessToken}`);
      },
    ],
    afterResponse: [
      async (request, __, response) => {
        if (response.status === 401) {
          const authInfo = getAuthValueFromStorage();
          if (authInfo?.refreshToken) {
            try {
              const newAccessToken = await refreshToken();
              request.headers.set("Authorization", `Bearer ${newAccessToken.accessToken}`);
              return ky(request);
            } catch (e) {
              console.error(e);
            }
          } else {
            await signOut();
            redirect({ to: "/log-in" });
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
