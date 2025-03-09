import React, { useEffect, useState } from "react";
import SingleChat from "./SingleChat";
import { getSenderFull } from "../config/chatLogics";
import { FaEye, FaTimes, FaEdit } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { toaster } from "../ui/toaster";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsersforGroup, setSelectedUsersforGroup] = useState([]);

  console.log(selectedUsersforGroup);

  useEffect(() => {
    if (selectedChat?.isGroup) {
      setGroupName(selectedChat.chatName || "");
      setSelectedUsersforGroup(selectedChat.users || []);
    }
  }, [selectedChat]);

  let withChatUser = null;
  if (selectedChat && !selectedChat.isGroup) {
    withChatUser = getSenderFull(user, selectedChat.users);
  }

  const handleUpdateGroupName = async () => {
    if (!groupName.trim()) {
      toaster.create({ title: "Group name cannot be empty!", type: "error" });
      return;
    }

    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/v1/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      );

      toaster.create({
        title: "Group name updated successfully",
        type: "success",
      });
      setIsGroupModalOpen(false);
      setFetchAgain((prev) => !prev);
    } catch (error) {
      toaster.create({ title: "Error updating group name", type: "error" });
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== userToRemove._id &&
      user._id !== userToRemove._id
    ) {
      toaster.create({
        title: "Only Admin Can Remove Someone",
        type: "error",
      });
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      );

      // Update UI based on removal
      userToRemove._id === user._id
        ? setSelectedChat(null)
        : setSelectedChat(data.removed);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.error("Error removing user:", error);
      toaster.create({
        title: "Failed to remove user",
        type: "error",
      });
    }
  };

  const handleSearchUser = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toaster.create({ title: "Type something to find a user", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/user/search?search=${trimmedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      );
      setSearchUsers(data);
      console.log(searchUsers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectedUser = (userToAdd) => {
    if (selectedUsersforGroup.some((user) => user._id === userToAdd._id)) {
      toaster.create({ title: "User already added", type: "error" });
      return;
    }

    if (selectedChat.groupAdmin?._id === userToAdd._id) {
      toaster.create({ title: "Group admin already added", type: "error" });
      return;
    }
    axios
      .put(
        `http://localhost:3000/api/v1/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        toaster.create({ title: "User added to group", type: "success" });
        setSelectedChat(res.data.added);
      })
      .catch((err) => {
        console.log(err);
        toaster.create({
          title: "Error Could not add the user",
          type: "error",
        });
      });
  };

  const HandleLeaveGroup = async () => {
    // console.log(selectedChat);

    // let {user} = ChatState() 
    if (!selectedChat || !user) {
      toaster.create({ title: "Invalid action", type: "error" });
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/v1/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      );

      toaster.create({
        title: data.message || "Successfully left the group",
        type: "success",
      });

      // If the current user leaves, remove them from the selected chat
      if (user._id === selectedChat.groupAdmin?._id) {
        setSelectedChat(null);
      }

      setFetchAgain((prev) => !prev);
    } catch (error) {
      console.error("Error leaving group:", error);
      toaster.create({
        title: "Failed to leave the group",
        type: "error",
      });
    }
  };

  return (
    <div className="w-2/3 bg-gray-100 p-4 shadow-md flex flex-col">
      <div className="ChatArea h-[90%]">
        <h2
          className={`text-lg flex items-center justify-between font-bold mb-4 border border-3 py-2 px-2 ${
            selectedChat?.isGroup ? "text-blue-600" : ""
          }`}
        >
          {selectedChat
            ? selectedChat.isGroup
              ? `${selectedChat.chatName} Group`
              : withChatUser?.name || "Select Chat"
            : "Select a Chat"}
          {selectedChat && (
            <span
              className="text-black cursor-pointer hover:scale-110"
              onClick={() =>
                selectedChat.isGroup
                  ? setIsGroupModalOpen(true)
                  : setIsModalOpen(true)
              }
            >
              <FaEye />
            </span>
          )}
        </h2>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>

      {isModalOpen && withChatUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <img
              src={withChatUser.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold">{withChatUser.name}</h2>
            <p className="text-gray-600">{withChatUser.email}</p>
          </div>
        </div>
      )}

      {isGroupModalOpen && selectedChat?.isGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsGroupModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Group</h2>

            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                className="border p-2 flex-1 bg-white"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
              />
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center"
                onClick={handleUpdateGroupName}
              >
                <FaEdit className="mr-1" /> Update
              </button>
            </div>

            <h3 className="text-lg font-bold mb-2">Group Members</h3>
            <div className="flex flex-wrap gap-2">
              {selectedChat.users.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-2 text-sm bg-purple-200 text-gray-700 px-3 py-1 rounded-full"
                >
                  <span>{member.name}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveUser(member)}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="text"
                className="border p-2 flex-1 bg-white"
                placeholder="Find users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
                onClick={handleSearchUser}
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchUsers.length > 0 && (
              <ul className="max-h-60 overflow-auto mt-2 border p-2 rounded">
                {searchUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between border-b p-2"
                  >
                    <span className="text-gray-700">{user.name}</span>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleSelectedUser(user)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={HandleLeaveGroup}
              className="p-2 mt-2 bg-red-600 w-full rounded-md text-white hover:bg-red-700 transition"
            >
              Leave Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
