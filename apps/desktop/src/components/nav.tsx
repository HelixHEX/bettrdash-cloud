import {
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  useColorModeValue,
  useDisclosure,
  FlexProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { IconType } from "react-icons";
import { Outlet, useParams } from "react-router-dom";
import { useHomePage, useProfilePage, useSettingsPage } from "../lib/hooks";
import { Breadcrumbs } from "../types";

export default function RootLayout() {
  const isHomePage = useHomePage();
  const isSettingsPage = useSettingsPage();
  const isProfilePage = useProfilePage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumbs>([
    { path: "/", label: "projects" },
  ]);

  return (
    <Flex
      flexDir={"column"}
      w="100%"
      h="100vh"
      minH="100vh"
      bg={useColorModeValue("white", "gray.900")}
    >
      <Box h="100vh" bg={useColorModeValue("#F0F0F0", "gray.900")}>
        <SidebarContent
          display={{
            base: "none",
            md:
              isHomePage || isProfilePage || isSettingsPage ? "none" : "block",
          }}
          onClose={() => onClose}
          breadcrumbs={breadcrumbs}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent breadcrumbs={breadcrumbs} onClose={onClose} />
          </DrawerContent>
        </Drawer>
        <Box
          mt={{ base: 0, md: 20 }}
          ml={{
            base: 0,
            md: isHomePage || isProfilePage || isSettingsPage ? 0 : 60,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  breadcrumbs: Breadcrumbs;
}

function SidebarContent({ onClose, breadcrumbs, ...rest }: SidebarProps) {
  const { projectId } = useParams();

  return (
    <Box
      mt={{ base: 0, md: 20 }}
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="4" justifyContent="space-between">
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
    </Box>
  );
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactText;
  originalPath: string;
  subpages?: Subpage[];
}

interface Subpage {
  icon: IconType;
}

function NavItem({ originalPath, icon, children, ...rest }: NavItemProps) {
  const path = usePath();
}
