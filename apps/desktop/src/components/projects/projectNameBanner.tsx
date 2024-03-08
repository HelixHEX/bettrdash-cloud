import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

interface IProps {
  name: string
  children?: React.ReactNode
}
const ProjectNameBanner: React.FC<IProps> = ({ name, children }) => {
  return (
    <Flex p={10} bg={useColorModeValue('white', 'gray.900')}>
      <Heading fontSize={30} color={useColorModeValue('gray.900', 'white')}>
        {name}
      </Heading>
      {children}
    </Flex>
  )
}

export default ProjectNameBanner
