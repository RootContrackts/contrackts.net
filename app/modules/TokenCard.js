import {
  Heading,
  Text,
  Box,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
  Image,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { fetchSaleItems } from "../contracktjs/fetchSaleItems";
import { getInventory } from "../contracktjs/getInventory";

import { init } from "../utils/init";

export function TokenCard() {
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [itemIndex, setItemIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await fetchSaleItems();
      setItems(fetchedItems);
      const inventoryItems = await getInventory();
      setInventory(inventoryItems);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleRowClick = (index) => {
    setSelectedItem(items[index]);
    setItemIndex(index);
    console.log("Selected Item", selectedItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBuyitem = async () => {
    try {
      const contrackt = await init();

      console.log("Index", itemIndex);
      console.log("Selected Item", selectedItem);
      // console.log(selectedItem.itemId);
      const transaction = await contrackt.buyItem(itemIndex, quantity);
      const transactionReceipt = await transaction.wait();
      console.log("Item bought successfully.", transactionReceipt);
      window.location.reload();
    } catch (error) {
      console.error("Error buying item:", error);
    }
    closeModal();
  };

  return (
    <>
      <Box>
        <Heading fontSize="lg" mb={2}>
          Items:
        </Heading>
        <SimpleGrid
          spacing={3}
          templateColumns="repeat(auto-fill, minmax(400px, 1fr))"
        >
          {isLoading ? (
            <Flex
              height="100vh"
              width="100%"
              top="0"
              left="0"
              position="fixed"
              justifyContent="center"
              alignItems="center"
              backgroundColor="rgba(0, 0, 0, 0.5)"
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="gray.500"
                size="xl"
              />
            </Flex>
          ) : (
            items.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">{inventory[item.itemId].name}</Heading>
                    <Heading size="sm">{index + 1}</Heading>
                  </Flex>
                </CardHeader>
                <Flex justifyContent="center" alignItems="center" mt={4}>
                  <Image
                    objectFit="fill"
                    boxSize="100px"
                    src="https://cdn.pixabay.com/photo/2015/06/11/13/40/apple-805819_960_720.png"
                    alt="Apple"
                  />
                </Flex>
                <CardBody>
                  <Flex direction="column" alignItems="center">
                    <Text textAlign="center" fontWeight="bold">
                      Seller
                    </Text>
                    <Box
                      textAlign="center"
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      maxWidth="100%"
                    >
                      {item.seller}
                    </Box>
                    <Text textAlign="center" fontWeight="bold">
                      URI
                    </Text>
                    <Text textAlign="center">{item.uri}</Text>
                  </Flex>
                  <Flex justifyContent="space-between" mt={4}>
                    <Text textAlign="left">Price: {item.price}</Text>
                    <Text textAlign="right">Quantity: {item.quantity}</Text>
                  </Flex>
                </CardBody>
                <CardFooter>
                  <Flex justifyContent="center" width="100%">
                    <Button
                      spacing={2}
                      mb={4}
                      colorScheme="blue"
                      variant="outline"
                      borderColor="black"
                      textColor="black"
                      width="100%"
                      onClick={() => handleRowClick(index)}
                    >
                      Buy
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            ))
          )}
        </SimpleGrid>
      </Box>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedItem && <Heading size="md">Buy Item Details</Heading>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <Card>
                <CardHeader>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md">{itemIndex + 1}</Heading>
                    <Heading size="md">{selectedItem.quantity}</Heading>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <FormControl mt={4}>
                    <FormLabel>Buy Quantity</FormLabel>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    spacing={2}
                    mb={4}
                    colorScheme="blue"
                    variant="solid"
                    width="100%"
                    onClick={() => handleBuyitem()}
                  >
                    Buy{" "}
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
