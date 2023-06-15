// Sidebar.js

import {
  Button,
  Box,
  Menu,
  MenuItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import customTheme from "../styles/theme";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";
// import { useBreakpointValue } from "@chakra-ui/react";

const Sidebar = ({ currentPage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [placement, setPlacement] = useState("left");
  // const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    // <>
    //   {/* Mobile View */}
    //   {isMobile && (
    //     <>
    //       <Button
    //         colorScheme="blue"
    //         leftIcon={<HamburgerIcon />}
    //         onClick={onOpen}
    //       ></Button>
    //       <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
    //         <DrawerOverlay />
    //         <DrawerContent
    //           w="200px"
    //           bg={useColorModeValue(
    //             customTheme.colors.gray[200],
    //             customTheme.colors.gray[200]
    //           )}
    //           p={4}
    //           h="100vh"
    //         >
    //           <DrawerHeader color="black" borderBottomWidth="1px">
    //             Profile
    //           </DrawerHeader>
    //           <DrawerBody>
    //             <Box>
    //               <Menu>
    //                 <Link href="/dashboard">
    //                   <MenuItem
    //                     color={currentPage === "/dashboard" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Dashboard
    //                   </MenuItem>
    //                 </Link>
    //                 <Link href="/inventory">
    //                   <MenuItem
    //                     color={currentPage === "/inventory" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Inventory
    //                   </MenuItem>
    //                 </Link>
    //                 <Link href="#">
    //                   <MenuItem
    //                     color={currentPage === "purchases" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Marketplace
    //                   </MenuItem>
    //                 </Link>
    //                 <Link href="#">
    //                   <MenuItem
    //                     color={currentPage === "/sales" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Sales
    //                   </MenuItem>
    //                 </Link>
    //                 <Link href="#">
    //                   <MenuItem
    //                     color={currentPage === "/invoices" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Invoices
    //                   </MenuItem>
    //                 </Link>
    //                 <Link href="#">
    //                   <MenuItem
    //                     color={currentPage === "/reports" ? "blue" : "black"}
    //                     _hover={{ color: "blue" }}
    //                     _active={{ color: "blue" }}
    //                   >
    //                     Reports
    //                   </MenuItem>
    //                 </Link>
    //               </Menu>
    //             </Box>
    //           </DrawerBody>
    //         </DrawerContent>
    //       </Drawer>
    //     </>
    //   )}

    // {/* Desktop View */}
    // {!isMobile && (
    <Box
      position="sticky"
      top={0}
      w="200px"
      bg={useColorModeValue(
        customTheme.colors.gray[200],
        customTheme.colors.gray[200]
      )}
      p={4}
      h="100vh"
    >
      <Menu>
        <Link href="/dashboard">
          <MenuItem
            color={currentPage === "/dashboard" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/dashboard" ? "bold" : "normal"}
          >
            Dashboard
          </MenuItem>
        </Link>
        <Link href="/inventory">
          <MenuItem
            color={currentPage === "/inventory" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/inventory" ? "bold" : "normal"}
          >
            Inventory
          </MenuItem>
        </Link>
        <Link href="/marketplace">
          <MenuItem
            color={currentPage === "/marketplace" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/marketplace" ? "bold" : "normal"}
          >
            Marketplace
          </MenuItem>
        </Link>
        <Link href="/orders">
          <MenuItem
            color={currentPage === "/orders" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/orders" ? "bold" : "normal"}
          >
            My Orders
          </MenuItem>
        </Link>
        <Link href="/manageorder">
          <MenuItem
            color={currentPage === "/manageorder" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/manageorder" ? "bold" : "normal"}
          >
            Manage Orders
          </MenuItem>
        </Link>
        <Link href="#">
          <MenuItem
            color={currentPage === "/sales" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/sales" ? "bold" : "normal"}
          >
            Sales
          </MenuItem>
        </Link>
        <Link href="#">
          <MenuItem
            color={currentPage === "/invoices" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/invoices" ? "bold" : "normal"}
          >
            Invoices
          </MenuItem>
        </Link>
        <Link href="#">
          <MenuItem
            color={currentPage === "/reports" ? "#3182ce" : "black"}
            _hover={{ color: "#3182ce" }}
            _active={{ color: "#3182ce" }}
            fontWeight={currentPage === "/reports" ? "bold" : "normal"}
          >
            Reports
          </MenuItem>
        </Link>
      </Menu>
    </Box>
    // )}
    // </>
  );
};

export default Sidebar;
