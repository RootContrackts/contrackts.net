//Dashboard.js

"use client";
import { Box, Flex, useColorModeValue, SimpleGrid } from "@chakra-ui/react";
import {
  Spacer,
  StatArrow,
  StatHelpText,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import customTheme from "../styles/theme";
import Sidebar from "../modules/sidebar";
import NaviBar from "../modules/navbar";
import TokenGraph from "../modules/TokenGraph";

export default function Dashboard() {
  return (
    <Flex flexDirection="column" bg={customTheme.colors.brand[1]}>
      <NaviBar></NaviBar>
      <Flex flexDirection="row" marginTop={16}>
        <Sidebar currentPage="/dashboard" />
        <Box
          bg={useColorModeValue(
            customTheme.colors.brand[1],
            customTheme.colors.brand[1]
          )}
          h="100vh"
          w="100%"
          display="flex"
          p={4}
          color="black"
        >
          <Box flexDirection="row" w="100%">
            <StatGroup w="100%" p={4} ml={4} mb={16}>
              <Flex>
                <Stat w="200px" h="10">
                  <StatLabel>For Sale</StatLabel>
                  <StatNumber>45</StatNumber>
                </Stat>
                <Stat w="200px" h="10">
                  <StatLabel>Pending</StatLabel>
                  <StatNumber>45</StatNumber>
                </Stat>
                <Stat w="200px" h="10">
                  <StatLabel>Cancelled</StatLabel>
                  <StatNumber>45</StatNumber>
                </Stat>
                <Stat w="200px" h="10">
                  <StatLabel>Delivered</StatLabel>
                  <StatNumber>45</StatNumber>
                </Stat>
              </Flex>
            </StatGroup>
            <Flex justifyContent="center" alignItems="center">
              <Box w="500px">
                <TokenGraph />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
