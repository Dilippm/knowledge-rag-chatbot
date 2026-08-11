import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL, timeout: 30000, headers: { 'Content-Type': 'application/json' } });

export async function sendChatMessage(message) {
  if (!baseURL) throw new Error('CONFIGURATION_ERROR');
  const { data } = await api.post('/chat', { question: message });
  const answer = data?.data?.data?.answer ?? data?.data?.answer ?? data?.answer ?? data?.message;
  if (typeof answer !== 'string' || !answer.trim()) throw new Error('INVALID_RESPONSE');
  return answer;
}
