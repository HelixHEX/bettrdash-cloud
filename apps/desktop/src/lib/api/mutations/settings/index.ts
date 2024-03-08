import { useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../..";

const generateApiKey = async () => {
  const res = await api.post("/web/api-settings/generate-key");
  return res.data;
};

export const useGenerateApiKey = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  return useMutation({
    mutationFn: generateApiKey,
    onSuccess: () => {
      onClose();
      window.location.reload();
    },
    onError: (data) => {
      toast({
        position: "bottom-right",
        title: "Error",
        description: data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

const updateSettings = async (settings: any) => {
  const res = await api.post("/web/api-settings/settings/update", settings);
  return res.data;
};

export const useUpdateSettings = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      // window.location.reload();
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
        toast({
          position: "bottom-right",
          title: "Success",
          description: "Settings updated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        position: "bottom-right",
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
