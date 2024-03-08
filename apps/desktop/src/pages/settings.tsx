import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSettings, useAPIKey } from "../lib/api/queries";
import axios from "axios";
import {
  Text,
  Heading,
  Button,
  Flex,
  useToast,
  useDisclosure,
  Switch,
  Center,
  Divider,
  Select,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Modal from '../components/modal'
import { useNavigate } from "react-router-dom";
import ModalComp from "../components/modal";
import Loading from "../components/loading";
import GenerateKey from '../components/settings/generateKey'
import { API_URL } from "../lib/api/constants";
import { useUpdateSettings } from "../lib/api/mutations/settings";

axios.defaults.withCredentials = true;

export default function SettingsPage() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { isLoading: loadingSettings, data: apiSettingsData } = useSettings();

  const [settings, setSettings] = useState<any>({});
  const toast = useToast();
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const { isLoading: loadingAPIKey, data: apiKeyData } = useAPIKey()
  const { mutate: updateSettings } = useUpdateSettings();

  useEffect(() => {
    console.log(settings)
  }, [settings])
  if (loadingAPIKey || loadingSettings) return <Heading>Loading...</Heading>

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      position: "bottom-right",
      title: "Copied",
      description: "API key copied to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUpdateSettings = async (setting: any, newValue: any) => {
    setSettings({ ...settings, [setting]: newValue });
    console.log(settings)
    updateSettings({ settings: { ...settings, [setting]: newValue } })
  };

  return (
    <Center>
      <Flex
        bg={bg}
        flexDir={"column"}
        boxShadow={"xl"}
        w={"100%"}
        padding={5}
        rounded={5}
      >
        <Flex flexDir={"column"}>
          <Heading
            w={20}
            size="sm"
            _hover={{ cursor: "pointer", textDecorationLine: "underline" }}
            fontWeight={"600"}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Heading>
          <Heading mt={3}>Appearance</Heading>
          <Flex mt={3}>
            <Heading alignSelf={"center"} fontSize={15}>
              Mode:{" "}
            </Heading>
            <Select
              ml={3}
              value={colorMode}
              onChange={(e) => toggleColorMode()}
              w={120}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </Flex>
          <Divider mt={5} />
          <Heading mt={5}>API Settings</Heading>
          <Text mt={5} alignSelf={"center"}>
            {apiKeyData.message}
          </Text>
          <Flex mt={3} flexDir={"column"}>
            <Heading fontSize={15}>API URL: </Heading>
            <Flex justify={"space-between"}>
              <Text w={{ base: "70%", md: "90%" }} alignSelf={"center"}>
                https://api.bettrdash.com/projects/?key=
                {apiKeyData.apiKey}
              </Text>
              <Button
                bgGradient={"linear(to-r, red.400,pink.400)"}
                onClick={() =>
                  copyToClipboard(
                    `https://api.bettrdash.com/projects/?key=${apiKeyData.apiKey}`
                  )
                }
                size="sm"
                color="white"
                _hover={{ bg: "gray.200", color: "gray.800" }}
              >
                Copy
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={"column"} mt={5}>
          <Text alignSelf={"center"}>{apiKeyData.message}</Text>
          <Flex flexDir={"column"}>
            <Heading fontSize={15}>API Key: </Heading>
            <Flex justify={"space-between"}>
              <Text w={{ base: "70%", md: "90%" }} alignSelf={"center"}>
                {apiKeyData.apiKey}
              </Text>
              <Button
                bgGradient={"linear(to-r, red.400,pink.400)"}
                onClick={() => copyToClipboard(`${apiKeyData.apiKey}`)}
                size="sm"
                color="white"
                _hover={{ bg: "gray.200", color: "gray.800" }}
              >
                Copy
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={"column"} mt={5}>
          <Text alignSelf={"center"}>{apiKeyData.message}</Text>
          <Flex>
            <Heading alignSelf={"center"} fontSize={15}>
              Show Inactive Projects:{" "}
            </Heading>
            <Switch
              onChange={() =>
                handleUpdateSettings(
                  "show_inactive_projects",
                  !settings.show_inactive_projects
                )
              }
              isChecked={settings.show_inactive_projects}
              colorScheme="green"
              ml={3}
              alignSelf="center"
            />
          </Flex>
        </Flex>
        <GenerateKey />
      </Flex>
    </Center>
  )
}
