import ChakraProvider from "./chakra";
import QueryClientProvider from "./react-query";
import { UserProvider } from "./user";

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
