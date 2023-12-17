import { Flex, Text } from "@chakra-ui/react";
import {Link as RouterLink} from 'react-router-dom'
interface Props {
  fontSize?: any;
}

const Logo = ({ fontSize=24 }: Props) => {
  return (
    <Flex  as={RouterLink} to='/' fontSize={fontSize} fontWeight={'bold'} w={100} flexDir="row">
      <Text color="red.400">B</Text>
      <Text>ettr</Text>
      <Text color="pink.400">D</Text>
      <Text>ash</Text>
    </Flex>
  );
};

export default Logo;





