import { API_URL } from "../../constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getSession = async () => {
  const res = await axios.get(`${API_URL}/auth/session`, {});
  console.log(res);
  return res.data;
};

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });
};
