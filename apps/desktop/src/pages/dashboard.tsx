import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import NewProjectModal from "../components/projects/newProjectModal";
import React from "react";
import Projects from "../components/projects";

export default function Dashboard() {
  return (
    <Flex p={{ base: 5, md: 32 }} flexDir={"column"}>
      <Flex>
        <Heading
          mr={4}
          alignSelf={"center"}
          color={useColorModeValue("gray.900", "gray.100")}
        >
          Projects
        </Heading>
        <NewProjectModal />
      </Flex>
      <Projects />
    </Flex>
  );
}
