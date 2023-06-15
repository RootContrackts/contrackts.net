"use client";
import { Box, Flex, Container } from "@chakra-ui/react";
import customTheme from "../styles/theme";
import Sidebar from "../modules/sidebar";
import NaviBar from "../modules/navbar";
import { CreateItems } from "../contracktjs/createItems";
import { TokenTable } from "../modules/TokenTable";

export default function Inventory() {
  return (
    <Flex flexDirection="column" bg={customTheme.colors.brand[1]}>
      <NaviBar />
      <Flex flexDirection="row" marginTop={16}>
        <Sidebar currentPage="/inventory" />
        <Box
          bg={customTheme.colors.brand[1]}
          h="100%"
          w="100%"
          display="flex"
          p={4}
          color="black"
        >
          <Container maxW="container.xl" bg={customTheme.colors.gray[200]}>
            <Box padding="4">
              <CreateItems />
            </Box>
            <Box padding="4">
              <TokenTable />
            </Box>
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
}
