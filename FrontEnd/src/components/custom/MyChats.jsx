import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Toaster, toaster } from "../ui/toaster";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ onSelectChat,fetchAgain }) => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [groupChatModal, setGroupChatModal] = useState(false)
  const fetchChats = async () => {
    axios
      .get(`http://localhost:3000/api/v1/chat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("c_token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setChats(res.data);
      })
      .catch((e) => {
        console.log(e);
        toaster.create({
          title: `Faied To Load Chats Refresh`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div className="w-1/3 bg-white shadow-md p-4">
      <div className="flex justify-between items-start  ">
        <h2 className="text-lg font-bold mb-4">My Chats</h2>
        <button 
        onClick={()=>setGroupChatModal(!groupChatModal)}
        className=" flex justify-center items-center gap-2 text-sm bg-blue-400 text-white p-1 rounded">
          GroupChat <IoMdAdd />
        </button>
      </div>
      <ul>
        {chats?.map((chat, index) => (
          <li
            key={chat._id}
            className={` ${
              selectedChat === chat
                ? " bg-[#38b2ac] text-white"
                : " bg-gray-100 text-black"
            }  p-3 rounded mb-2 cursor-pointer`}
            onClick={() => onSelectChat(chat)}
          >
            {!chat.isGroup ? getSender(user, chat.users) : chat.chatName}
          </li>
        ))}
      </ul>

      {
        (groupChatModal) ? <GroupChatModal  closeModal={()=>setGroupChatModal(false)} /> : null
      }
    </div>
  );
};

export default MyChats;
