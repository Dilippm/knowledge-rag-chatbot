import ChatWindow from './components/ChatWindow';
import { useChat } from './hooks/useChat';

export default function App() {
  return <ChatWindow {...useChat()} />;
}
