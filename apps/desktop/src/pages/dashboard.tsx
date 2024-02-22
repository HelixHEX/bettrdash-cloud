import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

export default function Dashboard() {
  return (
    <Flex p={{ base: 5, md: 32 }} flexDir={"col"}>
      <Flex>
        <Heading
          mr={4}
          alignSelf={"center"}
          color={useColorModeValue("gray.900", "gray.100")}
        >
          Projects
        </Heading>
      </Flex>
    </Flex>
  );
}
