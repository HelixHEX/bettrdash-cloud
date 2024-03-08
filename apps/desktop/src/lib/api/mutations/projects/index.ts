import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../..";
import type { CreateProjectProps } from "../../types";

const createProject = async (project: CreateProjectProps) => {
  const res = await api.post("/web/projects/new", project);
  console.log(res.data);
  return res.data;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: createProject,
    onError: () => {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "There was an error adding the project",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    onSuccess: (data) => {
      if (data.message) {
        toast({
          position: "bottom-right",
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    },
  });
};
