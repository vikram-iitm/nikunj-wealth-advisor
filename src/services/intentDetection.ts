import { Intent, DetectedIntent } from '../types';
import { STOCK_SYMBOLS, findStock } from './mockData';

// Keywords for intent detection
const INTENT_KEYWORDS: Record<Intent, string[]> = {
  GREETING: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
  ACCOUNT_OPENING: ['open account', 'demat', 'new account', 'sign up', 'register', 'create account', 'open demat'],
  LOGIN: ['login', 'sign in', 'access account', 'log in'],
  VIEW_PORTFOLIO: ['portfolio', 'holdings', 'my stocks', 'show positions', 'my investment', 'my shares'],
  STOCK_LOOKUP: ['price of', 'tell me about', 'show me', 'what is', 'how is', 'stock'],
  BUY_ORDER: ['buy', 'purchase', 'invest in', 'get', 'acquire'],
  SELL_ORDER: ['sell', 'exit', 'book profit', 'liquidate', 'dispose'],
  ANALYSIS: ['analyze', 'analysis', 'review', 'risk', 'diversification', 'suggest', 'recommend'],
  SERVICES: ['services', 'what do you offer', 'help', 'features', 'what can you do'],
  IPO: ['ipo', 'upcoming ipo', 'apply ipo', 'initial public offering'],
  MUTUAL_FUNDS: ['mutual fund', 'sip', 'mf', 'funds'],
  HELP: ['help', 'assist', 'support', 'contact'],
  // Smart Action Intents
  STOP_LOSS_ALL: ['stop loss', 'stop-loss', 'stoploss', 'set stop loss for all', 'protect my holdings'],
  BOOK_PROFITS: ['book profit', 'take profit', 'book partial profit', 'book gains'],
  BUY_THE_DIP: ['buy the dip', 'buy dip', 'average down', 'stocks are down'],
  WHY_DOWN_TODAY: ['why am i down', 'why is my portfolio down', 'why down today', 'why losing', 'why portfolio red'],
  TAX_LIABILITY: ['tax liability', 'tax', 'capital gains', 'show my tax', 'tax report'],
  AI_RECOMMENDATIONS: ['what should i buy', 'what to buy', 'recommend', 'recommendation', 'suggest stocks'],
  INVEST_IDLE_CASH: ['invest cash', 'idle cash', 'invest my cash', 'deploy cash', 'unused cash'],
  COMPARE_NIFTY: ['compare nifty', 'vs nifty', 'compare with nifty', 'benchmark', 'beat nifty'],
  UNKNOWN: [],
};

// Extract stock symbol from message
function extractStockSymbol(message: string): string | undefined {
  const upperMessage = message.toUpperCase();

  // Check for exact symbol match
  for (const symbol of STOCK_SYMBOLS) {
    if (upperMessage.includes(symbol)) {
      return symbol;
    }
  }

  // Check for company names
  const stock = findStock(message);
  return stock?.symbol;
}

// Extract quantity from message
function extractQuantity(message: string): number | undefined {
  const patterns = [
    /(\d+)\s*(?:shares?|qty|quantity|units?)/i,
    /buy\s+(\d+)/i,
    /sell\s+(\d+)/i,
    /purchase\s+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  // Also try to find any number in the message
  const numberMatch = message.match(/\b(\d+)\b/);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }

  return undefined;
}

// Main intent detection function
export function detectIntent(message: string): DetectedIntent {
  const lowerMessage = message.toLowerCase().trim();

  // Check each intent
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [Intent, string[]][]) {
    if (intent === 'UNKNOWN') continue;

    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        // Special handling for BUY/SELL - need to have a stock
        if (intent === 'BUY_ORDER' || intent === 'SELL_ORDER') {
          const stock = extractStockSymbol(message);
          if (stock) {
            return {
              intent,
              entities: {
                stock,
                quantity: extractQuantity(message),
              },
            };
          }
          // If no stock found but buy/sell keyword exists, it might be a stock lookup
          continue;
        }

        // Stock lookup - extract the stock symbol
        if (intent === 'STOCK_LOOKUP') {
          const stock = extractStockSymbol(message);
          if (stock) {
            return {
              intent,
              entities: { stock },
            };
          }
        }

        return {
          intent,
          entities: {},
        };
      }
    }
  }

  // Check if message is just a stock symbol
  const stock = extractStockSymbol(message);
  if (stock) {
    return {
      intent: 'STOCK_LOOKUP',
      entities: { stock },
    };
  }

  return {
    intent: 'UNKNOWN',
    entities: {},
  };
}

// Generate AI response based on intent
export function generateAIResponse(intent: DetectedIntent, context: {
  isLoggedIn: boolean;
  userName?: string;
  hasPortfolio?: boolean;
}): string {
  switch (intent.intent) {
    case 'GREETING':
      if (context.isLoggedIn && context.userName) {
        return `Welcome back, **${context.userName}**! 👋\n\nHow can I help you today? You can:\n• Check your **portfolio**\n• Look up any **stock**\n• Place **buy/sell** orders\n• **Analyze** your investments`;
      }
      return `Namaste! 🙏 Welcome to **Nikunj Wealth Advisor**.\n\nI'm here to help you with all your investment needs. Are you an existing Nikunj customer, or would you like to **open a new account**?`;

    case 'ACCOUNT_OPENING':
      return `Excellent choice! 🎉 Let's get your **Demat & Trading account** set up with Nikunj Stock Brokers.\n\nThis will take about 5 minutes. I'll guide you through each step. First, please tell me your **full name** exactly as it appears on your PAN card.`;

    case 'LOGIN':
      return `Welcome back! 👋 I'm logging you in...\n\n✓ Account verified\n✓ Portfolio loaded\n\nHello, **Rahul Sharma**! You're now logged in. Your portfolio is performing well with a **+10.95%** overall return.\n\nWhat would you like to do?\n• View **portfolio**\n• Check a **stock**\n• Place an **order**`;

    case 'VIEW_PORTFOLIO':
      if (!context.isLoggedIn) {
        return `To view your portfolio, please **login** first or say "login" to access your account.`;
      }
      return `Here's your current portfolio. You're holding **8 stocks** across different sectors. Let me show you the details...`;

    case 'STOCK_LOOKUP':
      if (intent.entities.stock) {
        return `Let me pull up **${intent.entities.stock}** for you...`;
      }
      return `Which stock would you like to know about? You can say the stock symbol (like RELIANCE, TCS) or company name.`;

    case 'BUY_ORDER':
      if (!context.isLoggedIn) {
        return `To place orders, please **login** first. Say "login" to access your trading account.`;
      }
      return `Great choice! Let me set up your **buy order** for **${intent.entities.stock}**...\n\nI'll show you the current price and order form.`;

    case 'SELL_ORDER':
      if (!context.isLoggedIn) {
        return `To place orders, please **login** first. Say "login" to access your trading account.`;
      }
      return `I'll help you **sell ${intent.entities.stock}**. Let me check your holdings and current market price...`;

    case 'ANALYSIS':
      if (!context.isLoggedIn) {
        return `To analyze your portfolio, please **login** first. Say "login" to access your account.`;
      }
      return `I've analyzed your portfolio. Here's a comprehensive breakdown of your investments, sector allocation, and risk assessment...`;

    case 'SERVICES':
      return `**Nikunj Stock Brokers** offers a complete range of investment services:\n\n📈 **Trading** - NSE, BSE, MCX\n💼 **Demat Account** - NSDL Depository\n📊 **F&O Trading** - Futures & Options\n💱 **Currency Derivatives** - Forex trading\n🥇 **Commodities** - Gold, Silver, Crude\n📋 **Mutual Funds** - SIPs across fund houses\n🆕 **IPO Services** - Apply for new issues\n🌍 **NRI Services** - Full support for NRIs\n\nWould you like to know more about any of these services?`;

    case 'IPO':
      return `📋 **IPO Services at Nikunj**\n\nYou can apply for upcoming IPOs directly through your account. Currently available:\n\n• No active IPOs at the moment\n\nWould you like me to notify you when new IPOs are available?`;

    case 'MUTUAL_FUNDS':
      return `📊 **Mutual Fund Services**\n\nStart your SIP journey with Nikunj! We offer:\n\n• **Equity Funds** - Growth & Value\n• **Debt Funds** - Low risk options\n• **Hybrid Funds** - Balanced approach\n• **Tax Saving** - ELSS funds\n\nMinimum SIP: ₹500/month\n\nWould you like to start a SIP or explore fund options?`;

    case 'HELP':
      return `I'm here to help! 🤝\n\nYou can:\n• Ask about any **stock** (e.g., "Tell me about TCS")\n• **Buy or sell** shares (e.g., "Buy 10 Reliance")\n• View your **portfolio**\n• Get **analysis** of your investments\n• Learn about our **services**\n\nOr contact Nikunj directly:\n📞 011-47030000\n📧 info@nikunjonline.com`;

    default:
      return `I'm not sure I understood that. Could you please rephrase?\n\nYou can ask me about:\n• Stock prices and information\n• Buying or selling shares\n• Your portfolio\n• Our services\n\nOr just type a stock symbol like **RELIANCE** or **TCS** to get started!`;
  }
}
