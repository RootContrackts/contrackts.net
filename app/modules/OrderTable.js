import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Button,
  Link,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchOrderItems } from "../contracktjs/fetchOrderItems";
import React from "react";
import { init } from "../utils/init";

export function OrderTable() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intermediaries, setIntermediaries] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await fetchOrderItems();
      setItems(fetchedItems);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleCancel = async (orderId) => {
    try {
      const contrackt = await init();

      const transaction = await contrackt.cancelItem(orderId);
      const transactionReceipt = await transaction.wait();
      console.log("Item cancelled successfully.", transactionReceipt);
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling item:", error);
    }
  };

  const handleTrack = async (orderId) => {
    const [intermediaries, status] = await contrackt.getIntermediariesAndStatus(
      orderId
    );
    setIntermediaries(intermediaries);
    setStatus(status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent overflow="hidden" maxW="max-content">
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="400px" overflowY="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Intermediaries</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {intermediaries.map((intermediary, index) => (
                  <React.Fragment key={index}>
                    <Tr>
                      <Td>{intermediary}</Td>
                      <Td>{status[index][0]}</Td>
                    </Tr>
                    {status[index].slice(1).map((stat, subIndex) => (
                      <Tr key={subIndex}>
                        <Td></Td>
                        <Td>{stat}</Td>
                      </Tr>
                    ))}
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textAlign="center">OrderID</Th>
              <Th textAlign="center">Seller</Th>
              <Th textAlign="center">Quantity</Th>
              <Th textAlign="center">Status</Th>
              <Th textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading
              ? // Render skeleton loading rows while data is being fetched
                Array.from({ length: 5 }).map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <Skeleton height="20px" width="30px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="180px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="40px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="120px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="60px" />
                    </Td>
                  </Tr>
                ))
              : items.map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        <Text fontSize="sm">{item.orderId + 1}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{item.seller}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{item.quantity}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{item.status}</Text>
                      </Td>
                      <Td>
                        <Flex align="center" justify="center" gap={2}>
                          <Button
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => handleTrack(item.orderId)}
                          >
                            Track
                          </Button>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            onClick={() => handleCancel(item.orderId)}
                          >
                            Cancel
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
