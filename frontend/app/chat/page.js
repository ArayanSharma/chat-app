"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      getUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      loadMessages();
    }
  }, [selectedUser]);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`
      );

      const filtered = res.data.filter(
        (u) => u._id !== currentUser?._id
      );

      setUsers(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);

    socketRef.current.on("receiveMessage", (data) => {
      if (
        data.senderId === selectedUser?._id ||
        data.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser]);

  const loadMessages = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${currentUser._id}/${selectedUser._id}`
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const payload = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: message,
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
        payload
      );

      socketRef.current.emit("sendMessage", res.data);

      setMessages((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">

      {/* Sidebar */}
      <div
        className={`
          ${
            selectedUser
              ? "hidden md:flex"
              : "flex"
          }
          w-full md:w-80 bg-white border-r shadow-sm flex-col
        `}
      >
        <div className="p-5 border-b">
          <h1 className="text-xl md:text-2xl font-bold text-black">
            Chat Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Welcome, {currentUser.name}
          </p>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-black outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition border-b
                ${
                  selectedUser?._id === user._id
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
            >
              <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                {user.name?.charAt(0)}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-black truncate">
                  {user.name}
                </h3>

                <p className="text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`
          ${
            !selectedUser
              ? "hidden md:flex"
              : "flex"
          }
          flex-1 flex-col
        `}
      >
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white border-b px-4 md:px-6 py-4 shadow-sm flex items-center gap-3">

              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="md:hidden text-black text-xl font-bold"
              >
                ←
              </button>

              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                {selectedUser.name?.charAt(0)}
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-black truncate">
                  {selectedUser.name}
                </h2>

                <p className="text-sm text-gray-500 truncate">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-md break-words px-4 md:px-5 py-3 rounded-2xl shadow-sm
                      ${
                        msg.senderId === currentUser._id
                          ? "bg-black text-white"
                          : "bg-white text-black border"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="bg-white border-t p-3 md:p-4">
              <div className="flex gap-2 md:gap-3">
                <input
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                  placeholder="Type a message..."
                  className="flex-1 border rounded-xl px-4 py-3 text-black outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  onClick={sendMessage}
                  className="bg-black text-white px-4 md:px-8 rounded-xl hover:opacity-90 transition whitespace-nowrap"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
