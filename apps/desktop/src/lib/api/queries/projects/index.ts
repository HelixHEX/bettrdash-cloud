import { useQuery } from "@tanstack/react-query";
import { api } from "../..";

export const getProjects = async ({ filter }: { filter: string }) => {
  const res = await api.get(`/web/projects/all?filter=${filter}`);
  return res.data;
};

export const useProjects = (filter: string) => {
  return useQuery({
    queryKey: ["projects", filter],
    queryFn: () => getProjects({ filter }),
  });
};
