"use client";
import { useState, useEffect } from "react";
import { Box, Heading, Button, Flex, Stack } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import { authenticate } from "../utils/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Authenticate the user's session
    authenticate()
      .then((address) => {
        // Redirect to the main page after authentication
        router.push("/dashboard");
      })
      .catch((error) => {
        // Log the error
        console.error(error);
      });
  }, []);

  const handleConnectMetaMask = async () => {
    try {
      setIsLoading(true);
      const address = await authenticate();
      // Redirect to the main page after authentication
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={customTheme.colors.gray[200]}
    >
      <Box p={8} rounded="md" bg="white" boxShadow="lg">
        <Heading color={customTheme.colors.brand[0]} m={4}>
          Contrackts SCM
        </Heading>
        <Flex
          justifyContent="center"
          color={customTheme.colors.brand[0]}
          p={4}
        >
          Sign in with MetaMask
        </Flex>

        <Flex justifyContent="center">
          <Stack direction="row" spacing={4}>
            <Button
              colorScheme="blue"
              variant="outline"
              borderColor="black"
              textColor="black"
              isLoading={isLoading}
              loadingText="Connecting"
              onClick={handleConnectMetaMask} 
            >
              Connect Wallet
            </Button>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
}
