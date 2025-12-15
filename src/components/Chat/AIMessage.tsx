import React from 'react';
import { ChatMessage } from '../../types';
import StockCard from '../Trading/StockCard';
import HoldingsTable from '../Portfolio/HoldingsTable';
import PortfolioAnalysis from '../Portfolio/PortfolioAnalysis';
import OrderForm from '../Trading/OrderForm';
import OrderConfirmation from '../Trading/OrderConfirmation';
import LoginForm from '../Account/LoginForm';
import KYCFlow from '../Account/KYCFlow';
// Smart Action Components
import {
  StopLossAll,
  BookProfits,
  PortfolioDeepAnalysis,
  BuyTheDip,
  WhyDownToday,
  AIRecommendations,
  TaxLiability,
  CompareNifty,
  InvestIdleCash,
  QuickTrade,
} from '../SmartActions';

interface AIMessageProps {
  message: ChatMessage;
  onAction?: (action: string, data?: any) => void;
  isLoggedIn?: boolean;
}

const AIMessage: React.FC<AIMessageProps> = ({ message, onAction, isLoggedIn = false }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Parse markdown-like formatting
  const formatText = (text: string) => {
    // Handle bold text
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  const renderComponent = () => {
    if (!message.component) return null;

    switch (message.component.type) {
      case 'STOCK_CARD':
        return (
          <StockCard
            stock={message.component.data.stock}
            candlestickData={message.component.data.candlestickData}
            onBuy={() => onAction?.('BUY', message.component?.data.stock)}
            onSell={() => onAction?.('SELL', message.component?.data.stock)}
          />
        );
      case 'PORTFOLIO_TABLE':
        return (
          <HoldingsTable
            holdings={message.component.data.holdings}
            onStockClick={(symbol) => onAction?.('VIEW_STOCK', { symbol })}
          />
        );
      case 'PORTFOLIO_ANALYSIS':
        return (
          <PortfolioAnalysis
            portfolio={message.component.data.portfolio}
            sectorAllocation={message.component.data.sectorAllocation}
          />
        );
      case 'ORDER_FORM':
        return (
          <OrderForm
            stock={message.component.data.stock}
            side={message.component.data.side}
            suggestedQuantity={message.component.data.quantity}
            maxQuantity={message.component.data.maxQuantity}
            onSubmit={(order) => onAction?.('SUBMIT_ORDER', order)}
            onCancel={() => onAction?.('CANCEL_ORDER')}
          />
        );
      case 'ORDER_CONFIRMATION':
        return <OrderConfirmation order={message.component.data.order} />;
      case 'LOGIN_FORM':
        return (
          <LoginForm
            onLogin={(clientId, password) => onAction?.('LOGIN_SUBMIT', { clientId, password })}
            onForgotPassword={() => onAction?.('FORGOT_PASSWORD')}
            onRegister={() => onAction?.('START_KYC')}
            isCompleted={isLoggedIn}
          />
        );
      case 'KYC_FLOW':
        return (
          <KYCFlow
            currentStep={message.component.data.step}
            formData={message.component.data.formData}
            onStepComplete={(step, data) => onAction?.('KYC_STEP_COMPLETE', { step, data })}
            isCompleted={isLoggedIn}
          />
        );
      // Smart Action Components
      case 'STOP_LOSS_ALL':
        return (
          <StopLossAll
            holdings={message.component.data.holdings}
            onConfirm={(orders) => onAction?.('STOP_LOSS_CONFIRM', { orders })}
            onCancel={() => onAction?.('STOP_LOSS_CANCEL')}
          />
        );
      case 'BOOK_PROFITS':
        return (
          <BookProfits
            holdings={message.component.data.profitableHoldings}
            onConfirm={(orders) => onAction?.('BOOK_PROFITS_CONFIRM', { orders })}
            onCancel={() => onAction?.('BOOK_PROFITS_CANCEL')}
          />
        );
      case 'PORTFOLIO_DEEP_ANALYSIS':
        return (
          <PortfolioDeepAnalysis
            portfolio={message.component.data.portfolio}
            sectorAllocation={message.component.data.sectorAllocation}
            onAction={(action) => onAction?.(action)}
            onClose={() => onAction?.('ANALYSIS_CLOSE')}
          />
        );
      case 'BUY_THE_DIP':
        return (
          <BuyTheDip
            dipStocks={message.component.data.dipStocks}
            cashAvailable={message.component.data.cashAvailable}
            onConfirm={(orders) => onAction?.('BUY_DIP_CONFIRM', { orders })}
            onCancel={() => onAction?.('BUY_DIP_CANCEL')}
          />
        );
      case 'WHY_DOWN_TODAY':
        return (
          <WhyDownToday
            totalChange={message.component.data.totalChange}
            changePercent={message.component.data.changePercent}
            impactBreakdown={message.component.data.impactBreakdown}
            newsItems={message.component.data.newsItems}
            suggestion={message.component.data.suggestion}
            onAction={(action) => onAction?.(action)}
            onClose={() => onAction?.('WHY_DOWN_CLOSE')}
          />
        );
      case 'AI_RECOMMENDATIONS':
        return (
          <AIRecommendations
            recommendations={message.component.data.recommendations}
            onAddToWatchlist={(symbol) => onAction?.('ADD_TO_WATCHLIST', { symbol })}
            onClose={() => onAction?.('RECOMMENDATIONS_CLOSE')}
          />
        );
      case 'TAX_LIABILITY':
        return (
          <TaxLiability
            realizedSTCG={message.component.data.realizedSTCG}
            realizedLTCG={message.component.data.realizedLTCG}
            unrealizedSTCG={message.component.data.unrealizedSTCG}
            unrealizedLTCG={message.component.data.unrealizedLTCG}
            availableLosses={message.component.data.availableLosses}
            onAction={(action) => onAction?.(action)}
            onClose={() => onAction?.('TAX_CLOSE')}
          />
        );
      case 'COMPARE_NIFTY':
        return (
          <CompareNifty
            portfolioReturns={message.component.data.portfolioReturns}
            niftyReturns={message.component.data.niftyReturns}
            alphaGenerated={message.component.data.alphaGenerated}
            alphaValue={message.component.data.alphaValue}
            onClose={() => onAction?.('COMPARE_CLOSE')}
          />
        );
      case 'INVEST_IDLE_CASH':
        return (
          <InvestIdleCash
            cashAvailable={message.component.data.cashAvailable}
            suggestions={message.component.data.suggestions}
            newSectorAllocation={message.component.data.newSectorAllocation}
            onConfirm={(orders) => onAction?.('INVEST_CASH_CONFIRM', { orders })}
            onCancel={() => onAction?.('INVEST_CASH_CANCEL')}
          />
        );
      case 'QUICK_TRADE':
        return (
          <QuickTrade
            stock={message.component.data.stock}
            marginAvailable={message.component.data.marginAvailable}
            onSubmit={(order) => onAction?.('SUBMIT_ORDER', order)}
            onCancel={() => onAction?.('QUICK_TRADE_CANCEL')}
          />
        );
      default:
        return null;
    }
  };

  // Check if this is a component-only message (no text needed)
  const isComponentOnly = message.component && (
    message.component.type === 'LOGIN_FORM' ||
    message.component.type === 'KYC_FLOW' ||
    message.component.type === 'STOP_LOSS_ALL' ||
    message.component.type === 'BOOK_PROFITS' ||
    message.component.type === 'BUY_THE_DIP' ||
    message.component.type === 'INVEST_IDLE_CASH' ||
    message.component.type === 'QUICK_TRADE'
  );

  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[90%] w-full">
        {/* AI Avatar */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-gold-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div className="flex-1">
            {/* Message Bubble - Hide if component only with empty/minimal text */}
            {message.text && message.text.trim() && !isComponentOnly && (
              <div className="card-premium px-4 py-3 rounded-2xl rounded-tl-sm">
                <p
                  className="text-sm text-slate-100 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                />
              </div>
            )}

            {/* Short intro text for screens */}
            {isComponentOnly && message.text && (
              <p className="text-sm text-slate-400 mb-3">{message.text}</p>
            )}

            {/* Embedded Component */}
            {message.component && (
              <div className={`${!isComponentOnly ? 'mt-3' : ''} animate-slide-up`}>
                {renderComponent()}
              </div>
            )}

            {/* Timestamp */}
            <p className="text-xs text-slate-500 mt-2 ml-2">
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
