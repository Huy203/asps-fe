import { EnumGender } from "../enums";
import { Image } from "./common.type";

export type AccountIdentifier = {
  username: string;
  id: string;
  dob: string;
};

export type Level = {
  id: number;
  xp: number;
};

export type Streak = {
  id: number;
  current: number;
  target: number;
  record: number;
  extended: boolean;
};

// export type LearnerProfile = {
//   id: string;
//   rank: EnumRank;
//   levelId: number;
//   xp: number;
//   carrots: number;
//   streakId: number;
//   createdAt: string;
//   updatedAt: string;
//   level: Level;
//   streak?: Streak;
// };

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  role: string;
  fullName: string | null;
  dob: Date | null;
  gender: EnumGender | null;
  createdAt: string;
  // learnerProfile: LearnerProfile | null;
  avatarId: string | null;
  avatar?: Image;
};
