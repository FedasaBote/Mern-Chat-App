import {
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  useToast,
  Flex,
  FormControl,
  Input,
} from "@chakra-ui/react";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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
      setSearchResults(data.users);
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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([...chats, data]);
      onClose();
      toast({
        title: "Chat created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };
  return (
    <div>
      {children}
      <>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Gruop chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection="column" alignItems="center">
                <FormControl>
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Input
                    placeholder="Add Users eg:Fedasa,John,James"
                    mb={3}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </FormControl>
                {/* selected usere */}
                <Flex w="100%" flexWrap="wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={user._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </Flex>
                {/* {render searched user here} */}
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  searchResults
                    .slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Create Chat
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  );
}

export default GroupChatModal;
