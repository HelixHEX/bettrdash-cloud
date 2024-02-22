import { Heading } from "@chakra-ui/react";
import React, { createContext } from "react";
// import { useNavigate } from "react-router-dom";
import { auth } from "../api/queries";

interface UserContextProps {
  user: User | null;
}

const UserContext = createContext<UserContextProps>({
  user: null,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isError, isLoading: loading } = auth.useSession();
  let user = data?.user;

  const authPage =
    window.location.href.includes("login") ||
    window.location.href.includes("signup");

  if (loading && !user) return <Heading>Loading...</Heading>;

  if (isError && !authPage) return (window.location.href = "#/login");

  if (user && authPage) return window.location.replace("/");
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export { UserProvider, UserContext };
