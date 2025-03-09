import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Toaster, toaster } from "../ui/toaster";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./GroupChatModal";
import { Spinner } from "@chakra-ui/react";

const MyChats = ({ onSelectChat, fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [groupChatModal, setGroupChatModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/v1/chat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("c_token")}`,
        },
      });
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toaster.create({
        title: "Failed to load chats. Please refresh.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="w-1/3 bg-white shadow-md p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold mb-4">My Chats</h2>
        <button
          onClick={() => setGroupChatModal(!groupChatModal)}
          className="flex justify-center items-center gap-2 text-sm bg-blue-400 text-white p-1 rounded"
        >
          GroupChat <IoMdAdd />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <Spinner size="lg" />
        </div>
      ) : (
        <ul>
          {chats?.map((chat) => (
            <li
              key={chat._id}
              className={`p-3 rounded mb-2 cursor-pointer ${
                selectedChat === chat ? "bg-[#38b2ac] text-white" : "bg-gray-100 text-black"
              }`}
              onClick={() => setSelectedChat(chat)} // Ensure selection updates correctly
            >
              {!chat.isGroup ? getSender(user, chat.users) : chat.chatName}
            </li>
          ))}
        </ul>
      )}

      {groupChatModal && <GroupChatModal closeModal={() => setGroupChatModal(false)} />}
    </div>
  );
};

export default MyChats;
