import React from "react";
import {
  Button,
  Heading,
  HStack,
  useDisclosure,
  useToast,
  Text,
  useColorModeValue,
  Switch,
  Input,
  Textarea,
  Select,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import Modal from "../modal";
import { useCreateProject } from "../../lib/api/mutations";

const NewProjectModal = () => {
  const { mutate: createProject, isPending } = useCreateProject();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState<string>("");
  const [url, setURL] = useState<string>("");
  const [environment, setEnvironment] = useState<string>("");
  const [github_url, setGithubUrl] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [image_url, setImageUrl] = useState<string>("");
  const toast = useToast();

  const inputBg = useColorModeValue("gray.200", "gray.900");

  const addProject = () => {
    if (!name) {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "Name field is required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      createProject({
        name,
        description,
        github_url,
        language,
        active,
        url,
        environment,
        image_url,
      });
      onClose();
      setName("");
      setGithubUrl("");
      setLanguage("");
      setDescription("");
      setActive(false);
    }
  };
  return (
    <>
      <Button
        _hover={{ color: "gray.800", bg: "gray.200" }}
        color="white"
        bgGradient={"linear(to-r, red.400,pink.400)"}
        onClick={onOpen}
        alignSelf={"center"}
      >
        New Project
      </Button>
      <Modal
        disabled={isPending}
        title={"New Project"}
        actionText="Add Project"
        isOpen={isOpen}
        onClose={onClose}
        onAction={addProject}
      >
        <Heading color="gray.500" fontSize={12}>
          Active?
        </Heading>
        <HStack>
          <Text fontSize={20} fontWeight={"200"}>
            Active?
          </Text>
          <Switch
            isChecked={active}
            onChange={() => setActive(!active)}
            colorScheme={"green"}
          />
        </HStack>
        <Heading color="gray.500" fontSize={12} mt={5}>
          Project Name
        </Heading>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Description
        </Heading>
        <Textarea
          name={"description"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          Select Language
        </Heading>
        <Select
          mt={3}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Select Language"
          backgroundColor={inputBg}
          borderColor={inputBg}
        >
          <option>Javascript</option>
          <option>Python</option>
          <option>Ruby on Rails</option>
          <option>HTML</option>
          <option>Java</option>
          <option>C++</option>
          <option>C</option>
          <option>C#</option>
        </Select>
        <HStack>
          <Flex flexDir={"column"}>
            <Heading color="gray.500" fontSize={12} mt={5}>
              URL
            </Heading>
            <Input
              name="url"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="URL"
              mt={3}
              backgroundColor={inputBg}
              borderColor={inputBg}
            />
          </Flex>
          <Flex flexDir={"column"}>
            <Heading color="gray.500" fontSize={12} mt={5}>
              Environment
            </Heading>
            <Input
              name="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="Environment"
              mt={3}
              backgroundColor={inputBg}
              borderColor={inputBg}
            />
          </Flex>
        </HStack>
        <Heading color="gray.500" fontSize={12} mt={5}>
          github_url
        </Heading>
        <Input
          name="github_url"
          value={github_url}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="Github URL"
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
        />
        <Heading color="gray.500" fontSize={12} mt={5}>
          image_url
        </Heading>
        <Input
          name="image_url"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          mt={3}
          backgroundColor={inputBg}
          borderColor={inputBg}
          placeholder="Image URL"
        />
      </Modal>
    </>
  );
};

export default NewProjectModal;
