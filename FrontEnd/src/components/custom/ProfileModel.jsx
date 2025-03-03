import React from "react";

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Profile</h2>
        
        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            src={user.image || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
          />
        </div>

        {/* User Info */}
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">{user.name}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
