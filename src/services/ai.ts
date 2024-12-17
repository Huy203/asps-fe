import { FetchingData } from "@/lib/types";
import api from "./kyInstance";
import { Feedback } from "@/lib/types/ai.type";

export const getFeedback = async () => {
  return (await api.get("ai/feedback").json<FetchingData<Feedback>>()).data;
};
