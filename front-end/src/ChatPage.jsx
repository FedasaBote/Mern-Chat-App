// import { useEffect, useState } from "react";
import SideDrawer from "./components/authentication/miscellanous/SideDrawer";
import MyChats from "./components/authentication/miscellanous/MyChats";
import ChatBox from "./components/authentication/miscellanous/ChatBox";
// import axios from "axios";
import { ChatState } from "./context/ChatProvider";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
export default function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Flex>
    </div>
  );
}
