import ChakraProvider from "./chakra";
import QueryClientProvider from "./react-query";
import { UserProvider } from "./user";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <ChakraProvider>
        <UserProvider>{children}</UserProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default Providers;
