import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      // sets a custom bg color for dark mode only
      bg: mode(
        // light mode value retrieved from theme
        props.theme.semanticTokens.colors['chakra-body-bg']._light,
        // your custom value for dark mode
        '#252C32',
      )(props),
    },
  }),
};

// 3. extend the theme
const theme = extendTheme({ config, 
  colors: {
    gray: {

      700: '#1F1F1F',
      800: '#161616',
      900: '#131313'
    }
  }
});

export default theme;
