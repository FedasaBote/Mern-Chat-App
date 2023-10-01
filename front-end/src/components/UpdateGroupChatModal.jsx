import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  Button,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  IconButton,
  Flex,
  useToast,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "./authentication/userAvatar/UserBadgeItem";
import UserListItem from "./authentication/userAvatar/UserListItem";
function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessage }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "User is not admin",
        description: "User is not admin",
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chats/groupremove",
        { chatId: selectedChat._id, userId: user._id },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessage();
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.messate,
        status: "error",
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleAddUser = async (user) => {
    if (selectedChat.users.includes(user)) {
      toast({
        title: "User already in group",
        description: "User already in group",
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "User is not admin",
        description: "User is not admin",
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chats/groupadd",
        { chatId: selectedChat._id, userId: user._id },
        config
      );
      setLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.messate,
        status: "error",
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chats/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setRenameLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: "Error occured",
        description: "Failed to rename chat",
        duration: 3000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      console.log(data);
      setSearchResult(data.users);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "An error occurred.",
        description: "Unable to search users",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <IconButton
        d={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      ></IconButton>

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered={true}>
        {/* <ModalOverlay /> */}
        <ModalContent>
          <Flex>
            <ModalHeader
              fontFamily="Work sans"
              fontSize="35px"
              justifyContent="center"
            >
              {selectedChat.chatName}
            </ModalHeader>
          </Flex>
          <ModalCloseButton />
          <Flex w="100%" d="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((user) => (
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={() => handleRemove(user)}
              />
            ))}
          </Flex>

          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <ModalBody>
              <FormControl>
                <Flex>
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    mb={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </Flex>
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add User to group"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </ModalBody>
          </Flex>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
