import React from "react";

const ChatBox = ({ selectedChat }) => {
  const messages = {
    Piyush: ["Hey!", "How are you?"],
    "Guest User": ["Hello", "What's up?"],
    "Roadside Coder": ["Yo!", "🔥🔥🔥"],
    "YouTube Demo": ["Hi!", "Testing chat"]
  };

  return (
    <div className="w-2/3 bg-gray-50 p-4 shadow-md">
      <h2 className="text-lg font-bold mb-4">{selectedChat || "Select a chat"}</h2>
      <div className="space-y-2">
        {selectedChat &&
          messages[selectedChat]?.map((msg, index) => (
            <div key={index} className="p-2 bg-white rounded shadow-md">
              {msg}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatBox;
