export type Bucket = {
  id: string;
  name: string;
  owner: string;
  permission: string;
  url: string;
};

export type Image = Bucket;
export type Audio = Bucket;

export type PresignedUrl = {
  id: string;
  url: string;
};
