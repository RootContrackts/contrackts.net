import { useState, useEffect } from "react";

import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import customTheme from "../styles/theme";
import { authenticate } from "../utils/auth";
import { useRouter } from "next/navigation";

const NaviBar = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [connected, setConnected] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Authenticate the user's session
    authenticate()
      .then((address) => {
        // Set the connected address in state
        setConnectedAddress(address);
      })
      .catch((error) => {
        // Redirect to the login page if the user is not authenticated
        router.push("/");
      });
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      const address = await authenticate();
      setConnectedAddress(address);
      setConnected(connected);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      as="nav"
      h={16}
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      px={8}
      py={4}
      boxShadow="lg"
      position="fixed"
      w="full"
      zIndex="9999"
      css={{
        transition: "background-color 0.2s ease-out",
        "&:hover": {
          backgroundColor: customTheme.colors.gray[100],
        },
      }}
    >
      <HStack
        color={customTheme.colors.brand[0]}
        spacing={8}
        alignItems={"left"}
      >
        <Box fontWeight="bold" as="kbd">
          CONTRACKTS SCM
        </Box>
      </HStack>
      <Flex alignItems={"right"}>
        <Menu>
          {connectedAddress ? (
            <Button
              position="center"
              colorScheme="blue"
              onClick={handleConnectMetaMask}
            >
              Connected
            </Button>
          ) : null}
        </Menu>
      </Flex>{" "}
    </Flex>
  );
};

export default NaviBar;
