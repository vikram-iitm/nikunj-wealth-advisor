import React from 'react';
import { ChatMessage } from '../../types';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { Sparkles } from 'lucide-react';

interface PortfolioStats {
  totalPnL: number;
  todayChange: number;
  profitableStocks: number;
  losingStocks: number;
  cashAvailable: number;
  highestSectorPercent: number;
  highestSector: string;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isLoggedIn: boolean;
  userName?: string;
  portfolioStats?: PortfolioStats;
  onSendMessage: (message: string) => void;
  onAction: (action: string, data?: any) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isTyping,
  isLoggedIn,
  userName,
  portfolioStats,
  onSendMessage,
  onAction,
}) => {
  return (
    <div className="flex flex-col h-full bg-navy-950 bg-mesh">
      {/* Premium Header */}
      <div className="px-6 py-4 border-b border-purple-500/20 glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-purple-400/30 overflow-hidden shadow-lg shadow-purple-500/20">
              <img src="/logo.png" alt="Nikunj" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white flex items-center gap-2">
                Nikunj AI
                <Sparkles className="w-4 h-4 text-gold-400 animate-glow" />
              </h2>
              <p className="text-xs text-accent-emerald flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                Your Personal Wealth Advisor
              </p>
            </div>
          </div>
          {isLoggedIn && userName && (
            <div className="text-right card-highlight px-4 py-2 rounded-xl">
              <p className="text-xs text-slate-300">Welcome back</p>
              <p className="text-sm font-semibold text-gold-400">{userName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isTyping={isTyping} onAction={onAction} isLoggedIn={isLoggedIn} />

      {/* Input */}
      <InputBar
        onSend={onSendMessage}
        disabled={isTyping}
        placeholder={
          isLoggedIn
            ? "Ask about stocks, portfolio, or place orders..."
            : "Say hi to get started..."
        }
        isLoggedIn={isLoggedIn}
        portfolioStats={portfolioStats}
      />
    </div>
  );
};

export default ChatContainer;
