import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { init } from "../utils/init";

export function CreateItems() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleCreateItems() {
    // Get the deployed contract instance
    const contrackt = await init();
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const uri = document.getElementById("uri").value;

    // Call the createItem function
    const transaction = await contrackt.createItem(name, quantity, uri);
    console.log("Item created successfully.");

    // Wait for the transaction promise to resolve
    const transactionReceipt = await transaction.wait();
    console.log(transactionReceipt);

    window.location.reload();
  }

  return (
    <>
      <Box>
        <Button
          position="center"
          colorScheme="blue"
          mr={3}
          variant="solid"
          onClick={onOpen}
        >
          Add Item
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create an item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  bg="gray"
                  variant="outline"
                  borderColor="black"
                  textColor="white"
                  placeholder="Name"
                  _placeholder={{ opacity: 0.5, color: "white" }}
                  id="name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Quantity</FormLabel>
                <Input
                  bg="gray"
                  variant="outline"
                  borderColor="black"
                  textColor="white"
                  type="number"
                  placeholder="(Numbers Only)"
                  _placeholder={{ opacity: 0.5, color: "white" }}
                  id="quantity"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>OnChain Data</FormLabel>
                <Input
                  bg="gray"
                  variant="outline"
                  borderColor="black"
                  textColor="white"
                  placeholder="onChain Data"
                  _placeholder={{ opacity: 0.5, color: "white" }}
                  id="uri"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCreateItems}>
                Add
              </Button>
              <Button
                colorScheme="red"
                mr={3}
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
