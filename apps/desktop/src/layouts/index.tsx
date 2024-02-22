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
  Icon,
  IconButton,
  HStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  useColorMode,
  BreadcrumbLink,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Avatar,
  Text,
  MenuDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { IconType } from "react-icons";
import Logo from "../components/logo";
import { FiMenu, FiActivity, FiBarChart2, FiBarChart } from "react-icons/fi";
import {
  Link as RouterLink,
  useLocation,
  useParams,
  Outlet,
} from "react-router-dom";
import {
  useHomePage,
  usePath,
  useProfilePage,
  useSettingsPage,
} from "../lib/hooks";
import { Breadcrumbs } from "../types";
import { UserContext } from "../lib/providers/user";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Monitor", icon: FiActivity, path: "/monitor" },
  { name: "Analytics", icon: FiBarChart2, path: "/analytics" },
];

export default function RootLayout() {
  const isHomePage = useHomePage();
  const isSettingsPage = useSettingsPage();
  const isProfilePage = useProfilePage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumbs>([
    { path: "/", label: "porjects" },
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
        <MobileNav breadcrumbs={breadcrumbs} onOpen={onOpen} />
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
      <NavItem originalPath={""} icon={FiBarChart}>
        Overview
      </NavItem>
      {LinkItems.map((link) => {
        const lastItemPath = breadcrumbs.slice(-1)[0].path;
        return (
          <NavItem originalPath={link.path} key={link.name} icon={link.icon}>
            {link.name}
          </NavItem>
        );
      })}
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
  const location = usePath();
  const { projectId, id } = useParams();
  const path = `#/projects/${projectId ?? ""}${originalPath}/${id ?? ""}`;
  const currentPath = location === path;

  return (
    <RouterLink to={`/projects/${projectId}${originalPath}/`}>
      <Flex
        bgGradient={
          currentPath ? "linear(to-r, red.400,pink.400)" : "transparent"
        }
        align="center"
        p="4"
        mx="4"
        mt={2}
        borderRadius="lg"
        color={currentPath ? "white" : "gray.400"}
        role="group"
        cursor="pointer"
        fontWeight={currentPath ? "semibold" : "normal"}
        _hover={{
          bgGradient: "linear(to-r, red.400,pink.400)",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </RouterLink>
  );
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
  breadcrumbs: Breadcrumbs;
}

function MobileNav({ onOpen, breadcrumbs, ...rest }: MobileProps) {
  const { user } = useContext(UserContext);
  const [hoverUserBanner, setHoverUserBanner] = useState<boolean>(false);
  const toast = useToast();
  const isHomePage = useHomePage();
  const isProfilePage = useProfilePage();
  const isSettingsPage = useSettingsPage();

  const path = usePath();
  const mapPath = () => {
    return path.split("/");
  };

  const logout = () => {};

  const color = useColorModeValue("gray.900", "gray.50");
  const textGradientColor = useColorModeValue(
    "linear(to-l, gray.900, gray.900)",
    "linear(to-l, white, white)",
  );
  return (
    <Flex
      w="100%"
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "space-between" }}
      {...rest}
      pos={{ base: "relative", md: "fixed" }}
      zIndex={1000}
    >
      <IconButton
        display={{ base: isHomePage ? "none" : "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack spacing={8}>
        <Logo />
        {!isSettingsPage && !isProfilePage && breadcrumbs.length > 0 && (
          <Breadcrumb
            alignSelf={"center"}
            display={{ base: "none", md: "flex" }}
          >
            {breadcrumbs.map((breadcrumb, index: number) => (
              <BreadcrumbItem
                key={index}
                isCurrentPage={index === breadcrumbs.length - 1}
              >
                {index === 0 && <BreadcrumbSeparator color={color} />}
                <BreadcrumbLink
                  color={breadcrumb.color ? breadcrumb.color : color}
                  fontWeight={"semibold"}
                  href={breadcrumb.path}
                >
                  {breadcrumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
      </HStack>
      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
              onMouseLeave={() => setHoverUserBanner(false)}
              onMouseEnter={() => setHoverUserBanner(true)}
            >
              <HStack>
                {/* <Avatar size='sm'  /> */}
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text
                    bgGradient={
                      hoverUserBanner
                        ? "linear(to-l, red.400, pink.400)"
                        : textGradientColor
                    }
                    bgClip="text"
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    {user.name}
                  </Text>
                </VStack>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem as={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <MenuItem as={RouterLink} to="/settings">
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}
