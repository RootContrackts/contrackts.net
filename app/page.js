"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Flex,
  Heading,
  Button,
  HStack,
  Menu,
  Divider,
  Stack,
  AbsoluteCenter,
  MenuButton,
  MenuItem,
  useColorModeValue,
  Text,
  Image,
  Carousel,
  CarouselItem,
} from "@chakra-ui/react";

import customTheme from "./styles/theme";

export default function Lander() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const images = ["/images/i1.png", "/images/i2.png"];

  const [currentImage, setCurrentImage] = useState(0);

  const handleSlide = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(handleSlide, 5000); // Change slide every 3 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDemoButton = async () => {
    try {
      setIsLoading(true);
      router.push("/demo");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
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
        marginBottom="2rem"
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
            <Button
              position="center"
              colorScheme="blue"
              variant="solid"
              isLoading={isLoading}
              loadingText="Connecting"
              onClick={handleDemoButton}
            >
              DEMO
            </Button>
          </Menu>
        </Flex>{" "}
      </Flex>

      <Divider />

      <Box
        position="relative"
        padding="10"
        flexDirection="row"
        marginBottom="2rem"
      >
        <Box boxSize="100%">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              transition: "opacity 0.5s ease",
              opacity: currentImage === 0 ? 1 : 0,
            }}
          >
            <Image src={images[0]} alt="Image 1" width="100%" height="100%" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              transition: "opacity 0.5s ease",
              opacity: currentImage === 1 ? 1 : 0,
            }}
          >
            <Image src={images[1]} alt="Image 2" width="100%" height="100%" />
          </div>
        </Box>
      </Box>
      <Box
        position="relative"
        padding="10"
        flexDirection="row"
        marginTop={1000}
      >
        <Box boxSize="100%">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/images/i3.png"
              alt="i3"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}
