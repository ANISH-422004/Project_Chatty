import React, { useEffect, useState, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Button, Input } from "@chakra-ui/react";
import { Send } from "lucide-react";
import { toaster } from "../ui/toaster";
import axios from "axios";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:3000/";
const socket = io(ENDPOINT, { transports: ["websocket"] });
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const typingTimeoutRef = useRef(null);
  const { user, selectedChat , notifications , setNotifications} = ChatState();
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socket.emit("setUp", user);
    socket.on("connectedToSocket", () => setSocketConnected(true));
    socket.on("typing", (typingUserName) => setTypingUser(typingUserName));
    socket.on("stop typing", () => setTypingUser(null));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchAllMessages = async () => {
      try {
        const { data } = await axios.get(`${ENDPOINT}api/v1/message/${selectedChat._id}`, {
          headers: { Authorization: `bearer ${localStorage.getItem("c_token")}` },
        });
        setMessages(data.messages);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
        toaster.create({ title: "Failed to load messages", type: "error" });
      }
    };

    fetchAllMessages();
    selectedChatCompare = selectedChat;
    socket.emit("JoinChat", selectedChat._id);
    
    return () => {
      socket.emit("leaveChat", selectedChat._id);
    };
  }, [selectedChat]);

  console.log(notifications)
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chatId._id){
        //noifications
        if (!notifications.some((notif) => notif._id === newMessage._id)) {
          setNotifications((prev) => [...prev, newMessage]);
          setFetchAgain((prev) => !prev);
        }
        



      } 
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageRecived", handleNewMessage);

    return () => {
      socket.off("messageRecived", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    if (e && e.key && e.key !== "Enter") return;
    if (!message.trim().length) {
      toaster.create({ title: "Type something to send a message", type: "error" });
      return;
    }

    try {
      const { data } = await axios.post(
        `${ENDPOINT}api/v1/message`,
        { content: message, chatId: selectedChat._id },
        {
          headers: { Authorization: `bearer ${localStorage.getItem("c_token")}` },
        }
      );

      socket.emit("stop typing", selectedChat._id);
      socket.emit("newMessage", data.message);
      setMessages((prev) => [...prev, data.message]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toaster.create({ title: "Failed to send message", type: "error" });
    }
  };

  const typingHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("typing", { room: selectedChat._id, user: user.name });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
    }, 3000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {selectedChat ? (
        <div className="w-full h-full bg-gray-200">
          <div className="flex flex-col h-full w-full bg-gray-300 rounded-sm">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet...</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex items-start mb-3 ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                    {msg.sender._id !== user._id && (
                      <img src={msg.sender.picture} alt="Profile" className="w-8 h-8 rounded-full mr-3 shadow-lg" />
                    )}
                    <div className={`p-3 max-w-[75%] rounded-lg shadow-lg ${msg.sender._id === user._id ? "bg-blue-500 text-white rounded-br-none" : "bg-white text-gray-900 rounded-bl-none"}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center p-2 bg-white border-t">
              {typingUser && <div className="absolute">{typingUser} is typing...</div>}
              <Input placeholder="Enter a message..." value={message} onChange={typingHandler} onKeyDown={sendMessage} className="flex-1 mr-2 px-3" />
              <Button colorScheme="teal" onClick={sendMessage}>
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center text-2xl font-thin">
          <h1>Click on a user to start chatting</h1>
        </div>
      )}
    </>
  );
};

export default SingleChat;
