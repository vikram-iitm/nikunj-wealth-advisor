import React from 'react';
import { ChatMessage } from '../../types';

interface UserMessageProps {
  message: ChatMessage;
}

const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex justify-end mb-4 animate-fade-in">
      <div className="max-w-[80%]">
        <div className="gradient-purple text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-lg shadow-purple-500/30">
          <p className="text-sm font-medium">{message.text}</p>
        </div>
        <p className="text-xs text-slate-400 text-right mt-1 mr-2">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default UserMessage;
