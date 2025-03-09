import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import MyChats from "../../custom/MyChats";
import ChatBox from "../../custom/chatBox";
import NavBar from "../../custom/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, setUser , selectedChat , setSelectedChat } = ChatState();
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/user/loggedinuser`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("c_token")}`,
        },
      })
      .then((res) => {
        setUser(res.data.loggedInUser);
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
      });
  }, []);
  // console.log(user) // got the logged in User Details and Stored in Context 

  const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div className="w-full h-screen">
      <NavBar />
      <div className="flex w-full h-[84vh] p-4">
        <MyChats onSelectChat={setSelectedChat}  fetchAgain={fetchAgain}/>
        <ChatBox selectedChat={selectedChat}  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default ChatPage;
