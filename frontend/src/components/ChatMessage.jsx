import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const copy = async () => { try { await navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); } };
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return <article className={`message-row ${isUser ? 'user' : 'assistant'}`}>
    {!isUser && <span className="avatar">✦</span>}
    <div className="message-content"><div className="message-bubble">{isUser ? <p>{message.content}</p> : <ReactMarkdown>{message.content}</ReactMarkdown>}</div><div className="message-meta"><time dateTime={message.timestamp}>{time}</time>{!isUser && <button className="copy-button" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>}</div></div>
  </article>;
}
