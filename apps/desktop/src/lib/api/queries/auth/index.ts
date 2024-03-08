import { useQuery } from "@tanstack/react-query";
import { api } from "../..";

const getSession = async () => {
  const res = await api.get("/web/auth/session", {});
  console.log(res.data);
  return res.data;
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    retry: false,
  });
};
