import { Flex } from "@chakra-ui/react";
import { ChatState } from "../../../context/ChatProvider";
import SingleChat from "../../SingleChat";

function ChatBox({ fetchAgain, setFetch }) {
  const { selectedChat } = ChatState();
  return (
    <Flex
      d={{ base: selectedChat ?? "none", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Flex>
    // <Box>
    //   {selectedChat &&
    //     selectedChat.messages.map((message) => (
    //       <Box key={message._id}>{message.text}</Box>
    //     ))}
    // </Box>
  );
}

export default ChatBox;
