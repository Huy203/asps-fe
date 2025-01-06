import { FetchingData } from "@/lib/types";
import api from "./kyInstance";
import { Analytics, Feedback } from "@/lib/types/ai.type";

export const getFeedback = async () => {
  return (await api.get("ai/feedback").json<FetchingData<Feedback>>()).data;
};

export const getAnalytics = async () => {
  return (await api.get("ai/analytics").json<FetchingData<Analytics>>()).data;
};
