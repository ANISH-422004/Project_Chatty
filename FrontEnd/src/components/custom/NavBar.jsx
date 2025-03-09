import React, { useState } from "react";
import { Menu } from "lucide-react";
import { FaBell } from "react-icons/fa";
import SideDrawer from "./SideDrawer";
import ProfileModal from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import { Toaster, toaster } from "../ui/toaster";
import { ChatState } from "../../context/ChatProvider";

const NavBar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, notifications, setNotifications, setSelectedChat } =
    ChatState();

  const handleNotificationClick = (chat) => {
    setSelectedChat(chat);
    setNotifications((prev) =>
      prev.filter((notif) => notif.chatId._id !== chat._id)
    );
    setShowNotifications(false);
  };

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
          className="p-2 rounded-md hover:bg-gray-200 relative"
          title="Notifications"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FaBell />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {/* Profile Section */}
        <div className="relative">
          <div
            className="flex items-center gap-2 bg-teal-400 px-3 py-1 rounded-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-8 h-8 flex overflow-hidden items-center justify-center bg-white text-black font-bold rounded-full">
              <img src={user.picture} alt="Profile" />
            </div>
            <span className="text-white">&#9662;</span>
          </div>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-36 bg-white border rounded-lg shadow-md">
              <button
                onClick={() => {
                  toaster.create({
                    description: "Logged Out Successfully",
                    type: "info",
                  });
                  localStorage.setItem("c_token", "");
                  setTimeout(() => navigate("/"), 2000);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
              <button
                onClick={() => {
                  setShowProfile(true);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Show Profile
              </button>
            </div>
          )}
        </div>
      </div>

{/* Notifications Modal */}
{showNotifications && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center">
    <div className="bg-white w-96 rounded-lg shadow-lg p-5 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowNotifications(false)}
      >
        &times;
      </button>
      <h2 className="text-lg font-bold mb-3">Notifications</h2>
      <div className="max-h-72 overflow-y-auto space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className="p-3 border-b cursor-pointer flex items-center gap-3 rounded-lg transition duration-200 hover:bg-teal-100"
              onClick={() => handleNotificationClick(notif.chatId)}
            >
              {/* Chat Name */}
              <span className="font-semibold">
                {notif.chatId.chatName || "New Message"}
              </span>

              {/* Notification Badge */}
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                1
              </span>

              {/* Message Preview (Sliced) */}
              <span className="text-gray-600 text-sm truncate w-[180px]">
                {notif.content?.slice(0, 25) + "... more"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No notifications</p>
        )}
      </div>
    </div>
  </div>
)}

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
      <Toaster />
      {isDrawerOpen && <SideDrawer onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

export default NavBar;
