import { Heading } from "@chakra-ui/react";
import React, { createContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useSession } from "../api/queries";

interface UserContextProps {
  user: User | null;
}

const UserContext = createContext<UserContextProps>({
  user: null,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isError, isLoading: loading } = useSession();
  let user = data?.user;

  useEffect(() => {
    console.log(user);
  }, [user])
  const authPage =
    window.location.href.includes("login") ||
    window.location.href.includes("signup");


  if (loading) return <Heading>Loading...</Heading>;

  if (!user && !authPage) return window.location.href = "#/login"

  if (user && authPage) return window.location.href = "#"

  return (
    <UserContext.Provider value={{ user }}>
      {/* <button onClick={() => (window.location.href = "#/")}>
        {location.hash.toString()}
      </button> */}
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
