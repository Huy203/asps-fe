import { EnumGender } from "../enums";
import { Image } from "./common.type";

export type AccountIdentifier = {
  username: string;
  id: string;
  dob: string;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  role: string;
  name: string | null;
  dob: Date | null;
  gender: EnumGender | null;
  avatarId: string | null;
  avatar?: Image;
};
