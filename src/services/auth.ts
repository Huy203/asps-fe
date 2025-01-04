import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as signOutFirebase,
} from "firebase/auth";

import { auth } from "@/lib/config/firebase";
import { FetchingData } from "@/lib/types";
// import { AccountIdentifier } from "@/lib/types/user.type";
import { EnumActionOTP } from "@/lib/enums";
import { AccountIdentifier } from "@/lib/types/user.type";
import api, { apiAuth, apiCustomToken } from "@/services/kyInstance";

// const delay = 500;
export const localStorageTokenKey = "auth_client_token";

export type AuthInfo = {
  // accessToken: string;
  // refreshToken: string;
  token: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

export const getAuthValueFromStorage = () => {
  return localStorage.getItem(localStorageTokenKey)
    ? (JSON.parse(localStorage.getItem(localStorageTokenKey) ?? "") as AuthInfo)
    : null;
};

export const signIn = async (payload: SignInPayload) => {
  const data = (
    await apiAuth.post("auth/sign-in", { json: payload }).json<FetchingData<AuthInfo>>()
  ).data;

  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export const signUp = async (payload: SignUpPayload) => {
  const data = (
    await apiAuth.post("auth/sign-up", { json: payload }).json<FetchingData<AuthInfo>>()
  ).data;
  // localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signOut = async () => {
  const auth = getAuth();
  await signOutFirebase(auth);
  localStorage.clear();
  return;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  action: EnumActionOTP;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const data = (await api.post("auth/verify-otp", { json: payload }).json<FetchingData<AuthInfo>>())
    .data;
  // if (payload.action == EnumActionOTP.SIGN_UP) {
  //   await apiCustomToken(data.token).post("auth/profile");
  // }
  return data;
};

export type OTPPayload = {
  email: string;
};
export const getOtp = async (payload: OTPPayload) => {
  return (
    await api.post("auth/reset-password/otp", { json: payload }).json<FetchingData<EnumActionOTP>>()
  ).data;
};

type ResetPasswordPayload = {
  password: string;
};
export const resetPassword = async (payload: ResetPasswordPayload & { token: string }) => {
  return (
    await apiCustomToken(payload.token)
      .post("auth/reset-password", { json: { password: payload.password } })
      .json<FetchingData<AuthInfo>>()
  ).data;
};

// export const refreshToken = async () => {
//   const authInfo = getAuthValueFromStorage();
//   if (authInfo?.refreshToken) {
//     const data = (
//       await apiAuth
//         .post("auth/refresh", {
//           json: { refreshToken: authInfo.refreshToken },
//         })
//         .json<FetchingData<AuthInfo>>()
//     ).data;
//     localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
//     return data;
//   }
//   throw new Error("No refresh token founded.");
// };

export const getAccountIdentifier = async () => {
  return (await api.get("users/account").json<FetchingData<AccountIdentifier>>()).data;
};

// // FIREBASE
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(userCredential);
  if (!credential) return;

  const data = (
    await apiAuth
      .post("auth/provider", {
        json: {
          credential: credential.idToken,
          provider: provider.providerId,
        },
      })
      .json<FetchingData<AuthInfo>>()
  ).data;

  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};
