import React, { useState } from "react";
import { X } from "lucide-react";
import { Toaster, toaster } from "../ui/toaster";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const GroupChatModal = ({ closeModal }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]); // Selected members
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  // Handle modal close when clicking outside
  const handleBackgroundClick = (e) => {
    if (e.target.id === "modal-background") {
      closeModal();
    }
  };

  // Search Users
  const handleSearchUser = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      toaster.create({
        title: "Type something to find a user",
        type: "error",
      });
      return;
    }

    setLoading(true);

    // Perform search logic here (fetch users from the backend)
    axios
      .get(`http://localhost:3000/api/v1/user/search?search=${trimmedQuery}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("c_token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setSearchUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Adding a User to selectedUsers state
  const HandelSelectedUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User Already Added",
        type: "error",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  // Remove a member
  const removeMember = (member) => {
    setSelectedUsers(selectedUsers.filter((m) => m !== member));
  };

  //Creating Group
  const handelGroupCreation = () => {
    if (!groupName.trim()) {
      toaster.create({
        title: "Group name cannot be empty",
        type: "error",
      });
      return;
    }
  
    if (selectedUsers.length === 0) {
      toaster.create({
        title: "Add at least one member to create a group",
        type: "error",
      });
      return;
    }
  
    axios
      .post(
        `http://localhost:3000/api/v1/chat/group`,
        {
          chatName: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("c_token")}`,
          },
        }
      )
      .then((res) => {
        console.log("Group Created:", res.data);
  
        // Update chat state to include the new group
        setChats([res.data.groupChat, ...chats]);
  
        // Show success notification
        toaster.create({
          title: "Group created successfully!",
          type: "success",
        });
  
        // Close modal after successful creation
        closeModal();
      })
      .catch((err) => {
        console.error("Error creating group:", err);
  
        // Show error notification
        toaster.create({
          title: "Failed to create group",
          type: "error",
        });
      });
  };
  


  return (
    <div
      id="modal-background"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={closeModal}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Group Chat
        </h2>

        {/* Group Chat Name Input */}
        <input
          type="text"
          placeholder="Group Chat Name"
          className="w-full p-2 border text-white  border-gray-300 rounded mb-3"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Add Members Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search and Add Members"
            className="flex-1 p-2 border text-white border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-1  rounded"
            onClick={handleSearchUser}
          >
            Search
          </button>
        </div>

        {/* Show Selected Users */}
        {selectedUsers.length === 0 ? null : (
          <div className="flex flex-wrap gap-2 p-2 bg-rose-50 rounded-lg shadow-md min-h-[3rem]">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center bg-purple-600 text-white text-sm px-2 py-1 rounded-full shadow-md"
              >
                <span className="mr-2">{user.name}</span>
                <button
                  onClick={() => removeMember(user)}
                  className="p-1 rounded-full hover:bg-purple-800 transition"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Seearch Results Display  */}
        {loading ? (
          "Loading..."
        ) : (
          <div className="max-h-52 overflow-auto">
            {searchUsers.map((member) => (
              <div
                onClick={() => {
                  HandelSelectedUser(member);
                }}
                key={member._id}
                className="flex items-center bg-slate-100 text-black mt-1 hover:bg-teal-500 p-4 rounded-lg shadow-md w-full max-w-md"
              >
                {/* Profile Image */}
                <img
                  src={member.picture || "https://via.placeholder.com/40"} // Default avatar
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-gray-200 mr-3"
                />

                {/* User Info */}
                <div className="flex flex-col ">
                  <span className="font-semibold text-lg">{member.name}</span>
                  <span className="text-[0.6em]  ">
                    <strong>Email :</strong> {member.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Members List */}
        <div className="flex flex-wrap gap-2"></div>

        {/* Create Group Button */}
        <button
          className="w-full mt-4 bg-green-500 text-white py-2 rounded text-lg font-semibold"
          onClick={() => {
            handelGroupCreation();
          }}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
