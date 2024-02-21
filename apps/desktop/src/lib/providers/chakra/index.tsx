import { ColorModeScript, ChakraProvider as Provider } from "@chakra-ui/react";
import theme from "./theme";

const ChakraProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider theme={theme}>
      {children}
      <ColorModeScript initialColorMode={theme.initialColorMode} />
    </Provider>
  );
};

export default ChakraProvider;
