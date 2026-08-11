import { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import Header from './Header';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ messages, input, loading, error, setInput, sendMessage, clearChat }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading, error]);
  return <main className="app-shell"><section className="chat-card" aria-label="RAG chatbot"><Header onClear={clearChat} disabled={loading || !messages.length} /><div className="chat-area" aria-live="polite">{!messages.length && !loading && <div className="empty-state"><span className="empty-icon">✦</span><h2>How can I help?</h2><p>Ask a question and I’ll search your connected knowledge base.</p></div>}{messages.map((message) => <ChatMessage key={message.id} message={message} />)}{loading && <TypingIndicator />}{error && <p className="error-message" role="alert">{error}</p>}<div ref={endRef} /></div><ChatInput input={input} onChange={setInput} onSend={sendMessage} loading={loading} /></section></main>;
}
