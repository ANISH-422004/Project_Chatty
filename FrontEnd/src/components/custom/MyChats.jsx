import React, { useState } from "react";

const MyChats = ({ onSelectChat }) => {
  const chats = ["Piyush", "Guest User", "Roadside Coder", "YouTube Demo"];
  
  return (
    <div className="w-1/3 bg-white shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">My Chats</h2>
      <ul>
        {chats.map((chat, index) => (
          <li
            key={index}
            className="p-3 bg-gray-100 rounded mb-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onSelectChat(chat)}
          >
            {chat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyChats;
