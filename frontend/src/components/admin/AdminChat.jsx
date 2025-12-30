import React, { useEffect, useState, useRef } from "react";
import {
  fetchConversationsForAdmin,
  fetchChatHistoryForAdmin,
  adminSendMessage,
} from "../../api/chatApi";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const pollIntervalRef = useRef(null);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const data = await fetchConversationsForAdmin();
      setConversations(data);
      if (!selectedUserId && data.length > 0) {
        handleSelectUser(data[0]);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (userId) => {
    if (!userId) return;
    setLoadingMessages(true);
    try {
      const data = await fetchChatHistoryForAdmin(userId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages for admin", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Tự động cập nhật tin nhắn cho user đang chọn
  useEffect(() => {
    if (!selectedUserId) {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      return;
    }

    const poll = () => {
      loadMessages(selectedUserId);
      loadConversations();
    };

    poll();

    if (!pollIntervalRef.current) {
      pollIntervalRef.current = setInterval(poll, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [selectedUserId]);

  const handleSelectUser = (conv) => {
    setSelectedUserId(conv.userId);
    setSelectedUserInfo(conv);
    loadMessages(conv.userId);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);
    try {
      await adminSendMessage(selectedUserId, content);
      const data = await fetchChatHistoryForAdmin(selectedUserId);
      setMessages(data);
      loadConversations();
    } catch (err) {
      console.error("Failed to send admin message", err);
    } finally {
      setSending(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredConversations = conversations.filter((c) => {
    if (!normalizedSearch) return true;
    const target = (
      c.fullname ||
      c.username ||
      c.email ||
      ""
    )
      .toString()
      .toLowerCase();
    return target.includes(normalizedSearch);
  });

  return (
    <div className="flex h-full bg-white rounded-xl shadow overflow-hidden">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Khách hàng</h2>
            <button
              onClick={loadConversations}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
            >
              Làm mới
            </button>
          </div>
          <input
            type="text"
            className="w-full text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Tìm theo tên / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConversations && (
            <div className="p-4 text-sm text-gray-400">Đang tải hội thoại...</div>
          )}
          {filteredConversations.map((c) => (
            <button
              key={c.userId}
              onClick={() => handleSelectUser(c)}
              className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 text-sm ${
                c.userId === selectedUserId ? "bg-gray-100" : ""
              }`}
            >
              <div className="font-medium">
                {c.fullname || c.username || c.email || c.userId}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {c.lastRole === "user" ? "KH: " : "Admin: "}
                {c.lastMessage}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {c.lastAt ? new Date(c.lastAt).toLocaleString() : ""}
                {typeof c.unreadCount === "number" && c.unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
          {!loadingConversations && conversations.length === 0 && (
            <div className="p-4 text-sm text-gray-400">Chưa có hội thoại nào.</div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          {selectedUserInfo ? (
            <div>
              <div className="font-semibold text-sm">
                
                {selectedUserInfo.fullname || selectedUserInfo.username || selectedUserInfo.email || selectedUserInfo.userId}
              </div>
              <div className="text-xs text-gray-500">
                ID: {selectedUserInfo.userId}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400">Chọn một khách hàng để xem chat.</div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm bg-gray-50">
          {loadingMessages && (
            <div className="text-xs text-gray-400">Đang tải tin nhắn...</div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg whitespace-pre-wrap text-xs ${
                  m.role === "user"
                    ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    : "bg-sky-600 text-white rounded-br-none"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {!loadingMessages && messages.length === 0 && selectedUserId && (
            <div className="text-xs text-gray-400">Chưa có tin nhắn nào.</div>
          )}
        </div>

        <form onSubmit={handleSend} className="border-t p-3 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 text-xs px-3 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder={
                selectedUserId
                  ? "Nhập nội dung trả lời..."
                  : "Chọn một khách hàng để bắt đầu chat"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!selectedUserId || sending}
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-sky-600 text-white rounded-full disabled:opacity-60"
              disabled={!selectedUserId || sending || !input.trim()}
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
