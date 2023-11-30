import { extendTheme, theme as originalTheme, type ThemeConfig, ThemeComponents, ThemeComponentProps } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
const styles = {
  fonts: {
    heading: 'Poppins',
    body: 'Poppins'
  },
  colors: {
    gray: {
      600: "#2C2C2C",
      700: '#1F1F1F',
      800: '#161616',
      900: '#131313'
    }
  },
};

const components = {
 components: {
  Alert: {
    variants: {
      subtle: (props:any) => {
        const {colorScheme} = props
        if (colorScheme === 'green') {
          return {
            container: {
              bg: `${colorScheme}.400`,
              opacity: '0.1'
            }
          }
        }
        return originalTheme.components.Alert.variants?.subtle(props)
      }
    }
   }
 }
}

// 3. extend the theme
const theme = extendTheme({ config, 
  ...styles,
  // ...components
});

export default theme;
