import {
  Button,
  Tooltip,
  Text,
  Flex,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  // Box,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import axios from "axios";
import { useState } from "react";
import Profile from "./Profile";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
// import { useState } from "react";

function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const history = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Please enter something to search",
        status: "error",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            user.token ? user.token : localStorage.getItem("userInfo").token
          }`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setSearchResult(res.data.users);
      console.log(res.data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        position: "bottom-left",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const accessChat = async (id) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chats",
        { userId: id },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      console.log(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        position: "bottom-left",
        isClosable: true,
      });
      setLoadingChat(false);
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };
  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        bg="white"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }}>Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          Chat App
        </Text>
        <Menu>
          <MenuButton p={1}>
            <BellIcon m={1} fontSize="2xl" />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <Profile user={user}>
              <MenuItem>My Profiler</MenuItem>
            </Profile>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Flex pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Flex>
            {loading ? (
              <ChatLoading />
            ) : Array.isArray(searchResult) && searchResult.length > 0 ? (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            ) : (
              <p>No search results found.</p>
            )}

            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
