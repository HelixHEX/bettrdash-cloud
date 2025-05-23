import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { checkAuth } from "../api";
import Loading from "../components/Loading";
// import Nav from "../components/NavOld";
import Nav from "../components/Nav";
import { BreadCrumbProps, UserProps } from "../utils/types";
import Landing from "./Landing";
import { useState } from "react";

type ContextType = {
  user: UserProps | null;
  breadcrumbs: BreadCrumbProps['breadcrumbs']
  setBreadcrumbs: BreadCrumbProps['setBreadcrumbs']
};

const App = () => {
  const { data, status } = useQuery("session", checkAuth);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumbProps['breadcrumbs']>([{path: '/', label: 'Projects'}]);
  if (status === "loading") {
    return (
      <Landing />
    );
  }

  if (status === "error") {
    return <Landing />
  }

  // if (!data.success) return <Navigate replace to="/login" />;

  return (
    <>
      <Flex flexDir={"column"} w="100%" h="100vh" minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
        {data.user ? (
          <Nav breadcrumbs={breadcrumbs} user={data.user}>
            <Outlet
              context={{ user: data.user, breadcrumbs, setBreadcrumbs }}
            />
          </Nav>
        ) : (
          <Landing />
        )}
      </Flex>
    </>
  );
};

export const useOutlet = () => {
  return useOutletContext<ContextType>();
};

export default App;
