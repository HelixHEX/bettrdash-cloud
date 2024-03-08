import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUpdateProject } from "../lib/api/mutations";
import { useProject } from "../lib/api/queries";
import { useOutlet } from "../lib/hooks"
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  Link,
  VStack,
} from "@chakra-ui/react";
import ProjectNameBanner from '../components/projects/projectNameBanner'

const IMAGE =
  "https://res.cloudinary.com/practicaldev/image/fetch/s--qo_Wp38Z--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/e0nl7ziy1la7bpwj7rsp.png";

const Overview = () => {
  const { setBreadcrumbs } = useOutlet();
  const { projectId } = useParams();


  const { data, isPending } = useProject(projectId!);
  const project = data?.project;

  useEffect(() => {
    if (data) {
      if (data.project) {
        setBreadcrumbs([{ path: '/', label: 'Projects' }, { path: `/projects/${projectId}`, label: project.name, color: 'red.400' }])
      }
    }
  }, [data, setBreadcrumbs])

  if (isPending) return null;


  return (
    <Flex w="100%" flexDir={"column"}>
      <Project project={project} />
    </Flex>
  )
}

const Project = ({ project }: { project: ProjectProps }) => {
  const [loading] = useState<boolean>(false);
  const [unsaved, setUnsaved] = useState<boolean>(false);
  const toast = useToast();
  const textColor = useColorModeValue('gray.900', 'gray.200')
  const inputBg = useColorModeValue("white", "gray.900");
  const bg = useColorModeValue('gray.100', 'gray.800')
  const imageBG = useColorModeValue("gray.400", "gray.900");
  const { mutate: updateProject } = useUpdateProject()

  const [updatedProject, setUpdatedProject] = useState<any>({
    id: project.id,
    name: project.name,
    live_url: project.live_url,
    github_url: project.github_url,
    language: project.language,
    description: project.description,
    active: project.active,
    image_url: project.image_url,
  });

  const handleChange = (e: | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUnsaved(true);
    setUpdatedProject({ ...updatedProject, [name]: value });
  }

  const handleSave = () => {
    if (updatedProject.name === "") {
      toast({
        position: "bottom-right", variant: 'subtle',
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      updateProject(updatedProject)
    }
  }

  return (
    <>
      <ProjectNameBanner name={project.name}>
        <Flex alignSelf={"center"} ml={4}>
          <Heading alignSelf={"center"} fontSize={15}>
            Active:{" "}
          </Heading>
          <Switch
            onChange={() => {
              setUnsaved(true);
              setUpdatedProject({
                ...updatedProject,
                active: !updatedProject.active,
              });
            }}
            isChecked={updatedProject.active}
            colorScheme={"green"}
            ml={3}
            alignSelf={"center"}
          />
        </Flex>
      </ProjectNameBanner>
      <VStack bg={bg} spacing={8} py={4} px={10}>
        <Image
          rounded={10}
          bg={imageBG}
          alt="project image"
          w={{ base: "100%", md: 120 }}
          h={120}
          src={project.image_url}
          fallbackSrc={IMAGE}
          alignSelf={"start"}
        />
        <Flex color={textColor} w={"100%"} flexDir={"column"}>
          <Heading fontSize={15}>Name</Heading>
          <Input
            mt={2}
            w="100%"
            bg={inputBg}
            name="name"
            border="none"
            value={updatedProject.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </Flex>
        <Flex color={textColor} w={"100%"} flexDir={"column"}>
          <Heading fontSize={15}>Description: </Heading>
          <Textarea
            minH={92}
            w="100%"
            mt={2}

            bg={inputBg}
            border="none"
            name="description"
            placeholder="Description"
            value={updatedProject.description}
            onChange={handleChange}
          />
        </Flex>
        <Flex color={textColor} w={"100%"} flexDir={"column"}>
          <Heading fontSize={15}>Programming Language: </Heading>
          <Input
            mt={2}
            bg={inputBg}
            border="none"
            name="language"
            value={updatedProject.language}
            onChange={handleChange}
            placeholder="Language"
          />
        </Flex>

        <Flex color={textColor} w={"100%"} flexDir={"column"}>
          <Heading fontSize={15}>Github URL: </Heading>
          <Input
            mt={2}
            border="none"
            bg={inputBg}
            name="github_url"
            value={updatedProject.github_url}
            onChange={handleChange}
            placeholder="Github Url"
          />
        </Flex>
        <Flex color={textColor} w={"100%"} flexDir={"column"}>
          <Heading fontSize={15}>Image URL: </Heading>
          <Input
            mt={2}
            bg={inputBg}
            border="none"
            name="image_url"
            value={updatedProject.image_url}
            onChange={handleChange}
            placeholder="Image Url"
          />
        </Flex>
        <VStack spacing={8} alignSelf={"end"}>
          <Button
            alignSelf={"end"}
            isLoading={loading}
            _hover={{ color: "#1A202C", bg: "gray.200" }}
            disabled={!unsaved}
            color="white"
            onClick={handleSave}
            bgGradient={"linear(to-r, red.400,pink.400)"}
          >
            Save
          </Button>
          <Flex flexDir={"column"}>
            {/* <Heading fontSize={28} fontWeight={"bold"} color={"red.500"}>
              DANGER ZONE
            </Heading> */}
            {/* <DeleteProject id={project.id} /> */}
          </Flex>
        </VStack>
      </VStack>
    </>
  )
}

export default Overview
