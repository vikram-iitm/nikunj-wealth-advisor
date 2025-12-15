import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onAction?: (action: string, data?: any) => void;
  isLoggedIn?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, onAction, isLoggedIn = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message) =>
        message.sender === 'user' ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AIMessage key={message.id} message={message} onAction={onAction} isLoggedIn={isLoggedIn} />
        )
      )}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
