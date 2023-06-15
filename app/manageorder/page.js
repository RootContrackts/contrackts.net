"use client";
import React from "react";
import {
  Heading,
  Button,
  Stack,
  Flex,
  Text,
  Input,
  Box,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Select,
} from "@chakra-ui/react";
import customTheme from "../styles/theme";
import Sidebar from "../modules/sidebar";
import NaviBar from "../modules/navbar";
import { useState, useEffect } from "react";
import { fetchOrderItems } from "../contracktjs/fetchOrderItems";
import { init } from "../utils/init";

const TrackOrderPage = () => {
  const contrackt = init();
  const [orderId, setOrderId] = useState("");
  const [intermediaries, setIntermediaries] = useState([]);
  const [status, setStatus] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [items, setItems] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessStatus, setAccessStatus] = useState([]);
  const [intermediaryAdd, setIntermediaryAdd] = useState("");
  const [selectedIntermediary, setSelectedIntermediary] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [intermediaryUpdateStatus, setIntermediaryUpdateStatus] = useState("");

  useEffect(() => {
    getIntermediaryAccess();
  }, [intermediaries]);

  const handleIntermediaryChange = (event) => {
    setSelectedIntermediary(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleInputUpdate = (event) => {
    setIntermediaryUpdateStatus(event.target.value);
  };

  const handleClick = async () => {
    setLoading(true);
    const fetchedItems = await fetchOrderItems();
    getIntermediaryAndStatus();
    setItems(fetchedItems);
    setShowTable(true);
    setLoading(false);
  };

  const handleInputAdd = (event) => {
    setIntermediaryAdd(event.target.value);
  };

  const handleAdd = async () => {
    try {
      await contrackt.addIntermediary(orderId, intermediaryAdd);
      setIntermediaryAdd("");
    } catch (error) {
      console.log("Error fetch intermediaries and status:", error);
    }
  };

  const handleAccess = async () => {
    try {
      const _access = selectedStatus === "Active";
      await contrackt.controllIntermediaryAccessHold(
        orderId,
        selectedIntermediary,
        _access
      );
      setSelectedIntermediary("");
      setSelectedStatus("");
    } catch (error) {
      console.log("Error setting status:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await contrackt.updateOrderStatus(orderId, intermediaryUpdateStatus);
    } catch (error) {
      console.log("Error delivering item:", error);
    }
  };

  const handleRevoke = async () => {
    try {
      await contrackt.renounceIntermediary(orderId);
    } catch (error) {
      console.log("Error delivering item:", error);
    }
  };

  const handleDeliver = async () => {
    try {
      await contrackt.deliverItem(orderId);
    } catch (error) {
      console.log("Error delivering item:", error);
    }
  };

  const getIntermediaryAndStatus = async () => {
    try {
      const [intermediaries, status] =
        await contrackt.getIntermediariesAndStatus(orderId);
      setIntermediaries(intermediaries);
      setStatus(status);
    } catch (error) {
      console.log("Error fetch intermediaries and status:", error);
    }
  };

  const getIntermediaryAccess = async () => {
    try {
      const _access = [];
      for (let i = 0; i < intermediaries.length; i++) {
        const intermediary = intermediaries[i];
        const isActive = await contrackt.isIntermediaryAccessActive(
          orderId,
          intermediary
        );
        _access.push(isActive);
      }
      setAccessStatus(_access);
    } catch (error) {
      console.log("Error returning access:", error);
    }
  };

  const handleChange = (event) => {
    setOrderId(event.target.value);
  };

  return (
    <Flex flexDirection="column" bg={customTheme.colors.brand[1]}>
      <NaviBar />
      <Flex flexDirection="row" marginTop={16}>
        <Sidebar currentPage="/manageorder" />
        <Box
          bg={customTheme.colors.brand[1]}
          h="100%"
          w="100%"
          display="flex"
          p={4}
          color="black"
        >
          <Container maxW="container.xl" bg={customTheme.colors.gray[200]}>
            <Box padding="4"></Box>
            <Text>Enter your order ID:</Text>
            <Input
              placeholder="Order ID"
              value={orderId}
              onChange={handleChange}
            />
            <Button colorScheme="blue" onClick={handleClick} disabled={loading}>
              {loading ? <Spinner size="sm" color="white" /> : "Manage"}
            </Button>
            {showTable && (
              <Box mt={4}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box bg="gray.100" p={4} borderRadius="md" marginRight={4}>
                    <Text size="lg" mb={2}>
                      Order ID
                    </Text>
                    <Heading as="h4" size="md" textAlign="center">
                      {orderId}
                    </Heading>
                  </Box>
                  <Box bg="gray.100" p={4} borderRadius="md">
                    <Text size="lg" mb={2}>
                      Status
                    </Text>
                    <Heading as="h4" size="md" textAlign="center">
                      {items[orderId]?.status}
                    </Heading>
                  </Box>
                </Box>
                <Flex direction="row" align="center" mt={4}>
                  <label>Add Intermediary:</label>
                  <Input
                    placeholder="Intermediary Address"
                    value={intermediaryAdd}
                    onChange={handleInputAdd}
                  />
                  <Button
                    colorScheme="blue"
                    marginRight={4}
                    onClick={handleAdd}
                  >
                    Add
                  </Button>
                </Flex>
                <Flex direction="row" align="center" mt={4}>
                  <label>Set Intermediary Access:</label>
                  <Select
                    value={selectedIntermediary}
                    onChange={handleIntermediaryChange}
                    placeholder="Select Intermediary"
                    ml={2}
                  >
                    {intermediaries.map((intermediary) => (
                      <option key={intermediary} value={intermediary}>
                        {intermediary}
                      </option>
                    ))}
                  </Select>
                  <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    placeholder="Select Status"
                    ml={2}
                  >
                    <option value="Active">Active</option>
                    <option value="Hold">Hold</option>
                  </Select>
                  <Button
                    colorScheme="blue"
                    marginLeft={2}
                    onClick={handleAccess}
                  >
                    Set
                  </Button>
                </Flex>
                <Flex direction="row" align="center" mt={4}>
                  <label>Update Status by Intermediary</label>
                  <Input
                    placeholder="Intermediary Status"
                    value={intermediaryUpdateStatus}
                    onChange={handleInputUpdate}
                  />
                  <Button
                    colorScheme="blue"
                    marginRight={4}
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Flex>
                <Flex justifyContent="center">
                  <Button
                    colorScheme="blue"
                    marginRight={4}
                    onClick={handleRevoke}
                  >
                    Revoke All
                  </Button>
                  <Button
                    colorScheme="blue"
                    marginRight={4}
                    onClick={handleDeliver}
                  >
                    Deliver Item
                  </Button>
                </Flex>
                <Box mt={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Intermediaries</Th>
                        <Th>Access</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {intermediaries.map((intermediary, index) => (
                        <React.Fragment key={index}>
                          <Tr>
                            <Td>{intermediary}</Td>
                            <Td>{accessStatus[index] ? "Active" : "Hold"}</Td>
                            <Td>{status[index][0]}</Td>
                          </Tr>
                          {status[index].slice(1).map((stat, subIndex) => (
                            <Tr key={subIndex}>
                              <Td></Td>
                              <Td></Td>
                              <Td>{stat}</Td>
                            </Tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default TrackOrderPage;
