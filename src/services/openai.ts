// OpenAI Integration for Nikunj AI Wealth Advisor

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Nikunj AI, the intelligent wealth advisor for Nikunj Stock Brokers Limited.

COMPANY CONTEXT:
- 25+ year old SEBI registered broker (INZ000169335)
- Members: NSE (06913), BSE (6645), MCX (16505)
- NSDL Depository Participant since 2005
- Non-advisory model (guide, don't advise specific stocks)
- Contact: 011-47030000, info@nikunjonline.com
- Head Office: A-92, G.F., Left Portion, Kamla Nagar, Delhi-110007

YOUR PERSONALITY:
- Warm, professional, and knowledgeable
- Use Indian financial terminology naturally
- Address users respectfully, use "Namaste" for greetings
- Be concise but helpful - this is a chat interface
- Use **bold** for important terms and numbers
- Use emojis sparingly but appropriately (✓, 📈, 💰, etc.)

YOUR CAPABILITIES:
- Help users understand stocks, markets, and investments
- Guide through account opening process
- Explain portfolio performance and analysis
- Assist with buy/sell order understanding
- Explain services: Demat, Trading, F&O, Commodities, MF, IPO, NRI services

CRITICAL RULES:
- NEVER give specific investment advice or stock recommendations
- NEVER say "buy this stock" or "sell that stock"
- Always clarify you guide and educate, not advise
- For complex queries, suggest contacting Nikunj team
- Keep responses under 150 words for chat flow
- When user mentions a stock symbol, acknowledge it and provide educational context

RESPONSE FORMAT:
- Use markdown: **bold** for emphasis
- Keep paragraphs short (2-3 sentences max)
- Use bullet points for lists
- End with a question or call-to-action when appropriate`;

export interface ChatContext {
  isLoggedIn: boolean;
  userName?: string;
  hasPortfolio: boolean;
  currentStock?: string;
  action?: string;
  portfolioSummary?: string;
}

export async function generateAIResponseWithOpenAI(
  userMessage: string,
  context: ChatContext
): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback response');
    return getFallbackResponse(userMessage, context);
  }

  const contextMessage = buildContextMessage(context);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: contextMessage },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getFallbackResponse(userMessage, context);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getFallbackResponse(userMessage, context);
  }
}

function buildContextMessage(context: ChatContext): string {
  let msg = 'CURRENT SESSION CONTEXT:\n';

  if (context.isLoggedIn && context.userName) {
    msg += `- User is logged in as: ${context.userName}\n`;
    msg += `- User has an active portfolio\n`;
  } else {
    msg += `- User is NOT logged in yet\n`;
  }

  if (context.currentStock) {
    msg += `- User is viewing/interested in: ${context.currentStock}\n`;
  }

  if (context.action) {
    msg += `- User wants to: ${context.action}\n`;
  }

  if (context.portfolioSummary) {
    msg += `- Portfolio Summary: ${context.portfolioSummary}\n`;
  }

  return msg;
}

function getFallbackResponse(userMessage: string, context: ChatContext): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('hi') || lower.includes('hello') || lower.includes('namaste')) {
    if (context.isLoggedIn) {
      return `Welcome back, **${context.userName}**! 👋\n\nHow can I assist you today? You can:\n• Check your **portfolio**\n• Look up any **stock**\n• Place **buy/sell** orders\n• Get **analysis** of your investments`;
    }
    return `Namaste! 🙏 Welcome to **Nikunj Wealth Advisor**.\n\nI'm here to help you with all your investment needs. Are you an existing Nikunj customer? Say **"login"** to access your account!`;
  }

  if (lower.includes('portfolio') || lower.includes('holdings')) {
    if (!context.isLoggedIn) {
      return `To view your portfolio, please **login** first. Just say "login" to access your account.`;
    }
    return `Here's your portfolio overview. You're doing well with a diversified mix of stocks! 📊\n\nWould you like me to **analyze** your holdings or check any specific stock?`;
  }

  if (lower.includes('analyze') || lower.includes('analysis')) {
    if (!context.isLoggedIn) {
      return `To analyze your portfolio, please **login** first.`;
    }
    return `I've prepared a detailed analysis of your portfolio including **sector allocation**, **risk assessment**, and **performance metrics**.\n\nYour portfolio shows good diversification. Would you like specific recommendations for rebalancing?`;
  }

  if (lower.includes('buy')) {
    if (!context.isLoggedIn) {
      return `To place orders, please **login** first. Say "login" to access your trading account.`;
    }
    return `I'll help you with your buy order. I've pulled up the stock details with current pricing.\n\nReview the chart and click **BUY** when you're ready to proceed!`;
  }

  if (lower.includes('sell')) {
    if (!context.isLoggedIn) {
      return `To place orders, please **login** first.`;
    }
    return `I'll help you with your sell order. I've shown your current holdings for this stock.\n\nClick **SELL** to proceed with the order!`;
  }

  // Default response
  return `I understand you're asking about "${userMessage}". \n\nI can help you with:\n• **Stock information** - just type any symbol\n• **Portfolio** management\n• **Trading** - buy or sell shares\n• **Analysis** of your investments\n\nWhat would you like to explore?`;
}
