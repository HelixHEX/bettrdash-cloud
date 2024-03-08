import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom'
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../lib/providers/user";
import { ColorModeSwitcher } from "../../components/colorModeSwitcher";
import Logo from "../../components/logo";
import { useLogin } from '../../lib/api/mutations/auth'

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const toast = useToast();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const bg = useColorModeValue("gray.50", "gray.800")
  const bg2 = useColorModeValue("white", "gray.700")
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "" || password === "") {
      toast({
        position: "bottom-right",
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      login({ email, password })
    }
  }


  if (user) return <Navigate to="/" />;

  return (<Flex
    minH={"100vh"}
    align={"center"}
    flexDir={'column'}
    bg={bg}
  >
    <Flex py={5} px={{ base: 4, md: 12 }} w='100%' justify={'space-between'}>
      <Logo fontSize={{ base: '2xl', md: '4xl' }} />
      <ColorModeSwitcher />
    </Flex>
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Heading fontSize={"4xl"}>Sign in to your account</Heading>
      <Box
        rounded={"lg"}
        bg={bg2}
        boxShadow={"lg"}
        p={8}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <HStack>
                <Text>New User?</Text>
                <Link as={RouterLink} bgClip='text' bgGradient={"linear(to-r, red.400,pink.400)"} to="/signup" >
                  Sign Up!
                </Link>
              </HStack>
              <Button
                isDisabled={isPending}
                type="submit"
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Stack>
  </Flex>)
}
