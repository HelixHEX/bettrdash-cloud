import {
  HStack,
  Heading,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = (project: ProjectProps) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState<boolean>(false)
  const hoverBg = useColorModeValue('gray.900', 'white')
  return (
    <Flex
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      transition={'0.5s ease'}
      _hover={{
        cursor: "pointer",
        borderWidth: 4,
        transform: 'translate(10px, -10px)',
        boxShadow: '-10px 10px 0px #ED64A6',
        borderImage: 'linear-gradient(45deg, white, white) 1'
      }}
      onClick={() => navigate(`/projects/${project.id}`)}
      role={"group"}
      maxW={"100%"}
      w={"full"}
      bgGradient={useColorModeValue('linear(to-br, white, gray.100)', 'linear(to-br, gray.600, gray.900)')}
      h={250}
      borderWidth={4}
      style={{ borderImage: 'linear-gradient(45deg, #3D3D3D, #787878) 1' }}
      p={4}
      justifyContent={"space-between"}
      flexDir={"column"}
    >

      <Text color={hover ? hoverBg : 'gray.500'} fontWeight={'bold'} fontSize={'sm'}>{project.name}</Text>
      <HStack>
        {project.defaultWebsiteId && (
          <HStack>
            <Heading color="gray.500" fontSize={14}>
              STATUS:
            </Heading>
            <Heading
              color={
                project.websites![0].status === "UP" ? "green.400" : "red.400"
              }
              fontSize={14}
            >
              {project.websites![0].status}
            </Heading>
          </HStack>
        )}
        <HStack>
          <Heading color="gray.500" fontSize={14}>
            ACTIVE:
          </Heading>
          <Heading
            color={
              project.active ? "green.400" : "red.400"
            }
            fontSize={14}
          >
            {project.active ? 'YES' : 'NO'}
          </Heading>
        </HStack>
      </HStack>
    </Flex>
  )
}

export default ProjectCard
