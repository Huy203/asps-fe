export type AccountIdentifier = {
  username: string;
  id: string;
  dob: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  avatar?: string;
};
