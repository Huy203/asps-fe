import { FetchingData } from "@/lib/types";
import api from "./kyInstance";
import { Logging } from "@/lib/types/logging.type";

export const getLogging = async () => {
  return (await api.get("logging").json<FetchingData<Logging>>()).data;
};
