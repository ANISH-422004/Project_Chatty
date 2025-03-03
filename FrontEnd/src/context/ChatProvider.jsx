import React, { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [Chats, setChats] = useState([]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, Chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
