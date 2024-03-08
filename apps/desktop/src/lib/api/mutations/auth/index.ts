import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../..";
import type { LoginProps } from "../../types";

const login = async (login: LoginProps) => {
  const res = await api.post("/web/auth/login", login);
  return res.data;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("sessionId", data.session);
      queryClient.invalidateQueries({ queryKey: ["session"] });
      window.location.reload();
    },
    onError: () => {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "Incorrect email/password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
