import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Heading,
  Card,
  Flex,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getInventory } from "../contracktjs/getInventory";
import { init } from "../utils/init";

export function TokenTable() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [price, setPrice] = useState("");
  const [saleQty, setSaleQty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await getInventory();
      setItems(fetchedItems);
      setIsLoading(false);
      console.log("Inventory Items", items);
    };

    fetchData();
  }, []);

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleListForSale = async () => {
    try {
      const contrackt = await init();
      const transaction = await contrackt.listItemForSale(
        selectedItem.itemId,
        saleQty,
        price
      );
      const transactionReceipt = await transaction.wait();
      console.log("Item listed for sale successfully.", transactionReceipt);
      window.location.reload();
    } catch (error) {
      console.error("Error listing item for sale:", error);
    }
    closeModal();
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Quantity</Th>
              <Th>Onchain Data</Th>
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
                      <Skeleton height="20px" width="80px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="40px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" width="120px" />
                    </Td>
                  </Tr>
                ))
              : items.map((item, index) => {
                  return (
                    <Tr
                      key={index}
                      _hover={{ cursor: "pointer", background: "gray.200" }}
                      onClick={() => handleRowClick(item)}
                    >
                      <Td>{item.itemId + 1}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>{item.uri}</Td>
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedItem && <Heading size="md">Item Details</Heading>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <Card>
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">{selectedItem.name}</Heading>
                    <Heading size="sm">{selectedItem.symbol}</Heading>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Flex direction="column" alignItems="center">
                    <Text textAlign="center" fontWeight="bold">
                      Owner
                    </Text>
                    <Box
                      textAlign="center"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      maxWidth="100%"
                    >
                      {selectedItem.seller}
                    </Box>
                    <Text textAlign="center" fontWeight="bold">
                      URI
                    </Text>
                    <Text textAlign="center">{selectedItem.uri}</Text>
                  </Flex>
                  <Text textAlign="right">
                    Quantity: {selectedItem.quantity.toString()}
                  </Text>

                  <FormControl mt={4}>
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      placeholder="Quantity for Sale"
                      value={saleQty}
                      onChange={(e) => setSaleQty(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    spacing={2}
                    mb={4}
                    colorScheme="blue"
                    variant="outline"
                    borderColor="black"
                    textColor="black"
                    width="100%"
                    onClick={handleListForSale}
                  >
                    List for sale
                  </Button>
                </CardBody>
              </Card>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
