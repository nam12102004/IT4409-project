import axios from "axios";

const API_BASE_URL = "https://it4409-deploy-backend.onrender.com/api";

export async function fetchChatHistory() {
  const res = await axios.get(`${API_BASE_URL}/chat/history`);
  return Array.isArray(res.data?.messages) ? res.data.messages : [];
}

export async function sendChatMessage(message) {
  const res = await axios.post(`${API_BASE_URL}/chat`, { message });
  return res.data?.message || null;
}

// Admin APIs
export async function fetchConversationsForAdmin() {
  const res = await axios.get(`${API_BASE_URL}/admin/chat/conversations`);
  return Array.isArray(res.data?.conversations) ? res.data.conversations : [];
}

export async function fetchChatHistoryForAdmin(userId) {
  const res = await axios.get(`${API_BASE_URL}/admin/chat/${userId}`);
  return Array.isArray(res.data?.messages) ? res.data.messages : [];
}

export async function adminSendMessage(userId, message) {
  const res = await axios.post(`${API_BASE_URL}/admin/chat/${userId}`, { message });
  return res.data?.message || null;
}
