import { extendTheme } from "@chakra-ui/react";
import "../globals.css";

const colors = {
  brand: {
    0: "#000000",
    1: "#FFFFFF",
  },
  blue: {
    2: "#3e6ae1",
  },
  gray: {
    50: "#f9fafb",
    100: "#f4f6f8",
    200: "#e5e5e5",
    300: "#d4d4d8",
    400: "#a3a3a8",
    500: "#737380",
    600: "#52525b",
    700: "#40404c",
    800: "#2c2c35",
    900: "#1c1c24",
  },
};
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
/>;

// 3. extend the theme
const fonts = {
  body: "'Roboto', sans-serif",
  heading: "'Roboto', sans-serif",
};

const config = {
  initialColorMode: "light", // 'dark' | 'light'
  useSystemColorMode: false,
};
const theme = extendTheme({ colors, fonts, config });

export default theme;
