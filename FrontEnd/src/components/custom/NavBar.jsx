import React, { useState } from "react";
import { Menu } from "lucide-react";
import { FaBell } from "react-icons/fa";
import SideDrawer from "./SideDrawer";
import ProfileModal from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import { Toaster, toaster } from "../ui/toaster";
import { createToaster } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";

const NavBar = () => {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const {user}  = ChatState()

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="p-2 rounded-md hover:bg-gray-200"
      >
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-bold bg-[#BCD5EC] p-2 rounded">Chatty</h1>

      <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl shadow-md">
        {/* Notification Bell */}
        <button
          className="p-2 rounded-md hover:bg-gray-200"
          title="Search users to chat"
        >
          <FaBell />
        </button>

        {/* Profile Section */}
        <div className="relative">
          <div
            className="flex items-center gap-2 bg-teal-400 px-3 py-1 rounded-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Circular Profile */}
            <div className="w-8 h-8 flex overflow-hidden items-center justify-center bg-white text-black font-bold rounded-full">
              <img src={user.picture} alt="" />
            </div>

            {/* Dropdown Icon */}
            <span className="text-white">&#9662;</span>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white border rounded-lg shadow-md">
              <button
                onClick={() => {
                  toaster.create({
                    description: "Logged Out Successfully",
                    type: "info",
                  });
                  localStorage.setItem("c_token", "");
                  setTimeout(() => {
                    navigate("/");
                  }, 2000);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  setShowProfile(true);
                  setIsOpen(false); // Close dropdown when opening profile modal
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Show Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal (Moved outside dropdown) */}
      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
      <Toaster />
      {isDrawerOpen && <SideDrawer onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

export default NavBar;
