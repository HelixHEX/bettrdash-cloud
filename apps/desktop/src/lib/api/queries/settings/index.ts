import { useQuery } from "@tanstack/react-query";
import { api } from "../..";

const getAPIKey = async () => {
  const res = await api.get("/web/api-settings/key");
  return res.data;
};

export const useAPIKey = () => {
  return useQuery({
    queryKey: ["api_key"],
    queryFn: getAPIKey,
  });
};

const getAPISettings = async () => {
  const res = await api.get("/web/api-settings/settings");
  return res.data;
};

export const useSettings = () => {
  return useQuery({
    queryKey: ["api_settings"],
    queryFn: getAPISettings,
  });
};
