import { Bucket, FetchingData } from "@/lib/types";
import api from "./kyInstance";

export const getFile = async (id: string) => {
  return await api.get(`files/${id}`);
};

export const postFile = async ({ file }: { file: File }) => {
  const formData = new FormData();
  formData.append("file", file);

  return (await api.post(`files`, { body: formData }).json<FetchingData<Bucket>>()).data;
};
