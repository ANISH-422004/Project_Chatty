import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { Toaster, toaster } from "../ui/toaster";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../context/ChatProvider";
// import { accessChats } from "../../../../Backend/src/controller/chat.controller";

const SideDrawer = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const searchUsersHandeler = async () => {
    if (!search) {
      toaster.create({
        title: `Type Something to search an user`,
        type: "error",
      });
    }

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/v1/user/search?search=${search}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("c_token")}` },
      })
      .then((res) => {
        console.log(res);
        setsearchResult(res.data);
        if (res.data.length == 0) {
          toaster.create({
            title: `No User Found With ${search}`,
            type: "warning",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toaster.create({
          title: `${err.message}`,
          type: "error",
        });
      });
  };

  const accessChats = async (id) => {
    axios
      .post(
        `http://localhost:3000/api/v1/chat`,
        {
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("c_token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setSelectedChat(res.data);
        setLoading(false);
        toaster.create({
            description: "Fetching Chats",
            duration: 2000,
          })
          onClose()
        })
      .catch((err) => {
        toaster.create({
          title: `${err.message}`,
          type: "error",
        });
      });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 shadow-lg p-4 ">
        <button
          onClick={onClose}
          className="mb-4 px-2 py-1 bg-red-500 text-white rounded"
        >
          X
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full p-2 border rounded bg-white"
          />
          <Button
            onClick={searchUsersHandeler}
            className="bg-red-500 p-1 active:bg-red-600 text-white"
          >
            Search
          </Button>
        </div>
        <p className="mt-4">All Search Users</p>
        {loading ? (
          <ChatLoading />
        ) : (
          <ul>
            {searchResult?.map((user) => {
              return (
                <UserListItem
                  key={user._id}
                  user={user}
                  handelFunction={() => {
                    accessChats(user._id);
                  }}
                />
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default SideDrawer;
