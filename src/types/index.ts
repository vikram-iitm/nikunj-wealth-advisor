// User Types
export interface User {
  name: string;
  clientId: string;
  pan: string;
  email: string;
  phone: string;
  dematId: string;
  accountStatus: 'active' | 'pending' | 'inactive';
  kycStatus: 'verified' | 'pending' | 'rejected';
  marginAvailable: number;
  marginUsed: number;
}

// Stock Types
export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  pe: number;
  week52High: number;
  week52Low: number;
  marketCap: string;
}

export interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Portfolio Types
export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
}

export interface Portfolio {
  holdings: Holding[];
  totalValue: number;
  totalInvestment: number;
  totalPnL: number;
  totalPnLPercent: number;
}

// Order Types
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'REJECTED';

export interface Order {
  orderId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  status: OrderStatus;
  timestamp: Date;
}

// Market Index Types
export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

// Chat Types
export type MessageSender = 'user' | 'ai';
export type ComponentType =
  | 'STOCK_CARD'
  | 'PORTFOLIO_TABLE'
  | 'PORTFOLIO_ANALYSIS'
  | 'ORDER_FORM'
  | 'ORDER_CONFIRMATION'
  | 'ACCOUNT_FORM'
  | 'SECTOR_CHART'
  | 'LOGIN_FORM'
  | 'KYC_FLOW'
  // Smart Action Components
  | 'STOP_LOSS_ALL'
  | 'BOOK_PROFITS'
  | 'PORTFOLIO_DEEP_ANALYSIS'
  | 'REDUCE_CONCENTRATION'
  | 'BUY_THE_DIP'
  | 'AVERAGE_DOWN'
  | 'TAX_LOSS_HARVEST'
  | 'COMPARE_NIFTY'
  | 'INVEST_IDLE_CASH'
  | 'WHY_DOWN_TODAY'
  | 'START_SIP'
  | 'PRICE_ALERTS'
  | 'TAX_LIABILITY'
  | 'AI_RECOMMENDATIONS'
  | 'QUICK_TRADE';

export interface EmbeddedComponent {
  type: ComponentType;
  data: any;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  component?: EmbeddedComponent;
}

// Account Opening Types
export interface AccountFormData {
  fullName: string;
  pan: string;
  mobile: string;
  email: string;
  dob: string;
  aadhaar: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  nomineeName: string;
  nomineeRelation: string;
  address: string;
}

export type AccountOpeningStep =
  | 'name'
  | 'pan'
  | 'mobile'
  | 'otp'
  | 'email'
  | 'dob'
  | 'aadhaar'
  | 'bank'
  | 'nominee'
  | 'address'
  | 'agreement'
  | 'complete';

// Intent Types
export type Intent =
  | 'GREETING'
  | 'ACCOUNT_OPENING'
  | 'LOGIN'
  | 'VIEW_PORTFOLIO'
  | 'STOCK_LOOKUP'
  | 'BUY_ORDER'
  | 'SELL_ORDER'
  | 'ANALYSIS'
  | 'SERVICES'
  | 'IPO'
  | 'MUTUAL_FUNDS'
  | 'HELP'
  // Smart Action Intents
  | 'STOP_LOSS_ALL'
  | 'BOOK_PROFITS'
  | 'BUY_THE_DIP'
  | 'WHY_DOWN_TODAY'
  | 'TAX_LIABILITY'
  | 'AI_RECOMMENDATIONS'
  | 'INVEST_IDLE_CASH'
  | 'COMPARE_NIFTY'
  | 'UNKNOWN';

export interface DetectedIntent {
  intent: Intent;
  entities: {
    stock?: string;
    quantity?: number;
    price?: number;
  };
}

// App State
export interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  portfolio: Portfolio;
  messages: ChatMessage[];
  isTyping: boolean;
  accountOpeningStep: AccountOpeningStep | null;
  accountFormData: Partial<AccountFormData>;
  pendingOrder: Partial<Order> | null;
}
