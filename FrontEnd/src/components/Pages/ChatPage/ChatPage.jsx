import React, { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import MyChats from "../../custom/MyChats";
import ChatBox from "../../custom/chatBox"
import NavBar from "../../custom/NavBar";

const ChatPage = () => {
  const {user , setUser} = ChatState()
  const [selectedChat, setSelectedChat] = useState(null);


  return (
    <div className="w-full h-screen">
      <NavBar />
      <div className="flex w-full h-[85vh] p-4">
        <MyChats onSelectChat={setSelectedChat} />
        <ChatBox selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default ChatPage;
