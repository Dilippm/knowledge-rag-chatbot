import { useEffect, useRef } from 'react';

export default function ChatInput({ input, onChange, onSend, loading }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) { ref.current.style.height = 'auto'; ref.current.style.height = `${Math.min(ref.current.scrollHeight, 150)}px`; } }, [input]);
  const keyDown = (event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); onSend(); } };
  return <form className="input-area" onSubmit={(event) => { event.preventDefault(); onSend(); }}><textarea ref={ref} value={input} onChange={(event) => onChange(event.target.value)} onKeyDown={keyDown} rows="1" disabled={loading} aria-label="Chat message" placeholder="Ask a question about your documents…" /><button className="send-button" type="submit" disabled={loading || !input.trim()} aria-label="Send message">{loading ? <i className="button-spinner" /> : 'Send'}</button><p className="input-hint"><kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for a new line</p></form>;
}
