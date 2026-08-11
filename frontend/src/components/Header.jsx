export default function Header({ onClear, disabled }) {
  return <header className="chat-header"><div className="brand"><span className="brand-mark">✦</span><div><h1>RAG Assistant</h1><p><i className="status-dot" /> Ready to help</p></div></div><div className="header-actions"><span className="connected-badge">Connected</span><button className="clear-button" type="button" onClick={onClear} disabled={disabled}>Clear chat</button></div></header>;
}
