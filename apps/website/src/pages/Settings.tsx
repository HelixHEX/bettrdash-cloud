import { useEffect } from "react";
import { useQuery } from "react-query";
import {
  apiKeyAPI,
  queryClient,
  settingsApi,
  updatePaymentMethodLink,
  useCancelSubscription,
} from "../api";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api/constants";
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
  VStack,
} from "@chakra-ui/react";
import ModalComp from "../components/ModalComp";
import Loading from "../components/Loading";
import { formatDate } from "../utils/lib";

declare const window: any;

axios.defaults.withCredentials = true;

const Settings = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const { toggleColorMode, colorMode } = useColorMode();
  const toast = useToast();
  const bg = useColorModeValue("white", "gray.800");
  const {mutate} = useCancelSubscription()
  const { data: apiKeyData, status: apiKeyStatus } = useQuery(
    "api_key",
    apiKeyAPI
  );
  const { data: settingsData, status: settingsStatus } = useQuery(
    "settings",
    settingsApi
  );
  const { data: updatePaymentData, status: updatePaymentStatus } = useQuery(
    "update_payment",
    updatePaymentMethodLink
  );

  useEffect(() => {
    window.createLemonSqueezy();
  }, []);

  if (
    apiKeyStatus === "loading" ||
    settingsStatus === "loading" ||
    updatePaymentStatus === "loading"
  ) {
    return <Loading />;
  }

  if (
    apiKeyStatus === "error" ||
    settingsStatus === "error" ||
    updatePaymentStatus === "error"
  ) {
    return <Text>Something went wrong</Text>;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const updateSettings = async (setting: any, newValue: any) => {
    await axios
      .post(`${API_URL}/settings/update`, {
        settings: { [setting]: newValue },
      })
      .then((res) => {
        if (res.data.success) {
          toast({
            title: "Success",
            description: "Settings updated",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries(["settings"]);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  };

  return (
    <>
      <VStack
        bg={bg}
        boxShadow={"xl"}
        w={"100%"}
        padding={5}
        rounded={5}
        spacing={5}
        justify="start"
      >
        <Flex flexDir={"column"} w="100%">
          <Heading>Appearance</Heading>
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
        </Flex>
        <Divider mt={5} />
        <Flex w="100%" mt={5} flexDir="column">
          <Heading>API Settings</Heading>
          <Text mt={3} alignSelf={"center"}>
            {apiKeyData.message}
          </Text>
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
          <Text alignSelf={"center"}>{apiKeyData.message}</Text>
          <Heading mt={3} fontSize={15}>
            API Key:{" "}
          </Heading>
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
          <Text alignSelf={"center"}>{apiKeyData.message}</Text>
          <Flex mt={3}>
            <Heading alignSelf={"center"} fontSize={15}>
              Show Inactive Projects:{" "}
            </Heading>
            <Switch
              onChange={() =>
                updateSettings(
                  "show_inactive_projects",
                  !settingsData.settings.show_inactive_projects
                )
              }
              isChecked={settingsData.settings.show_inactive_projects}
              colorScheme="green"
              ml={3}
              alignSelf="center"
            />
          </Flex>
          <GenerateKey />
        </Flex>
        <Divider mt={5} />
        <Flex flexDir={"column"} w="100%">
          <Heading>Subscription</Heading>
          {settingsData.settings.subscription ? (
            <>
              <Flex mt={3}>
                <Heading alignSelf={"center"} fontSize={15}>
                  Current Subscription:{" "}
                </Heading>
                <Text ml={2}>Growth Plan</Text>
              </Flex>
              <Flex>
                <Flex mt={3}>
                  {settingsData.settings.subscription.plan === "Growth Plan" ? (
                    <>
                      <Heading alignSelf={"center"} fontSize={15}>
                        Renews
                      </Heading>
                      <Text>
                        {formatDate(
                          new Date(settingsData.settings.subscription.renews_at)
                        )}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Heading alignSelf={"center"} fontSize={15}>
                        Expires
                      </Heading>
                      <Text>
                        {formatDate(
                          new Date(settingsData.settings.subscription.ends_at)
                        )}
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
              <Text
                onClick={() =>
                  window.LemonSqueezy.Url.Open(updatePaymentData.link)
                }
                mt={3}
                w={319}
                fontWeight={"bold"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
                cursor={"pointer"}
                _hover={{ color: "gray.900" }}
              >
                View and update your payment method
              </Text>
              <Text
                
                onClick={onOpen}
                mt={3}
                w={319}
                fontWeight={"bold"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
                cursor={"pointer"}
                _hover={{ color: "gray.400" }}
              >
                {settingsData.settings.subscription.plan === "Growth Plan"
                  ? "Cancel subscription"
                  : "Resume Subscription"}
              </Text>
            </>
          ) : (
            <>
              <Flex mt={3}>
                <Heading alignSelf={"center"} fontSize={15}>
                  Current Subscription:{" "}
                </Heading>
                <Text ml={2}>Hobby Plan</Text>
              </Flex>
              <Text
                // onClick={() =>
                //   window.LemonSqueezy.Url.Open(updatePaymentData.link)
                // }
                mt={3}
                w={319}
                fontWeight={"bold"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
                cursor={"pointer"}
                _hover={{ color: "gray.400" }}
              >
                Upgrade Subscription
              </Text>
            </>
          )}
        </Flex>
      </VStack>
      <ModalComp
      title='Sad to see you go :('
        isOpen={isOpen}
        onClose={onClose}
        actionText='Cancel Subscription'
        onAction={() => mutate({id: settingsData.settings.subscription.id})}
      >
      <Text>{'You will still have access until the end of your next billing date to use your subscription. You can still resume your subscription before your end date.'}</Text>
      </ModalComp>
    </>
  );
};

const GenerateKey = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const generateToken = async () => {
    await axios.post(`${API_URL}/settings/generate-key`).then((res) => {
      if (res.data.success) {
        queryClient.invalidateQueries(["api_key"]);
        onClose();
        toast({
          title: "Success",
          description: "API key generated",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      <Button mt={5} onClick={onOpen}>
        Generate API Key
      </Button>
      <ModalComp
        title="Are you sure?"
        isOpen={isOpen}
        onClose={onClose}
        onAction={generateToken}
        actionText="Generate"
      >
        <Text>This will generate a new key</Text>
        <Text>All applications using the old key will no longer work</Text>
      </ModalComp>
    </>
  );
};

export default Settings;
