import { useCallback, useState } from 'react';
import { sendChatMessage } from '../services/api';

const makeMessage = (role, content) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content, timestamp: new Date().toISOString() });

function friendlyError(error) {
  if (error.message === 'CONFIGURATION_ERROR') return 'The chatbot is not configured. Set VITE_API_URL and restart the app.';
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.';
  if (error.message === 'INVALID_RESPONSE') return 'The server returned an unexpected response. Please try again.';
  if (!error.response) return 'Unable to reach the server. Check that the backend is running and try again.';
  return error.response?.data?.message || 'Something went wrong. Please try again.';
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || loading) return;
    setMessages((current) => [...current, makeMessage('user', content)]);
    setInput(''); setError(''); setLoading(true);
    try {
      const answer = await sendChatMessage(content);
      setMessages((current) => [...current, makeMessage('assistant', answer)]);
    }
    catch (requestError) { setError(friendlyError(requestError)); }
    finally { setLoading(false); }
  }, [input, loading]);

  const clearChat = useCallback(() => { if (!loading) { setMessages([]); setError(''); } }, [loading]);
  return { messages, input, loading, error, setInput, sendMessage, clearChat };
}
