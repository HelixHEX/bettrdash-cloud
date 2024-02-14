import ChakraProvider from "./chakra";
import QueryClientProvider from "./react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};

export default Providers;
