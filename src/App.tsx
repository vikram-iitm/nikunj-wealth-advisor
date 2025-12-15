import React, { useEffect, useCallback, useState } from 'react';
import { ChatContainer } from './components/Chat';
import { Sidebar, RightPanel } from './components/Layout';
import { useChat, usePortfolio } from './hooks';
import { detectIntent } from './services/intentDetection';
import { generateAIResponseWithOpenAI, ChatContext } from './services/openai';
import {
  DEMO_USER,
  STOCKS,
  generateCandlestickData,
  formatCurrency,
  calculatePortfolioStats,
  getProfitableHoldings,
  getDippedStocks,
  getImpactBreakdown,
  getNewSectorAllocation,
  TAX_LIABILITY_DATA,
  AI_RECOMMENDATIONS,
  IDLE_CASH_SUGGESTIONS,
  NIFTY_COMPARISON_DATA,
  MARKET_NEWS,
} from './services/mockData';
import { EmbeddedComponent, User, OrderSide } from './types';
import { KYCStep } from './components/Account';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingOrder, setPendingOrder] = useState<{
    stock: typeof STOCKS.RELIANCE;
    side: OrderSide;
    quantity?: number;
  } | null>(null);

  // KYC Flow State
  const [kycStep, setKycStep] = useState<KYCStep>('pan');
  const [kycFormData, setKycFormData] = useState<any>({});

  const {
    messages,
    isTyping,
    addAIMessage,
    initializeChat,
    setIsTyping,
    addUserMessage,
  } = useChat();

  const {
    holdings,
    portfolio,
    sectorAllocation,
    buyStock,
    sellStock,
    getHolding,
  } = usePortfolio();

  // Initialize with welcome message
  useEffect(() => {
    initializeChat(
      `Namaste! 🙏 Welcome to **Nikunj Wealth Advisor**.\n\nI'm your AI-powered investment assistant, available 24/7 to help you manage your wealth.\n\nAre you an existing Nikunj customer? Say **"login"** to access your account, or **"open account"** to get started!`
    );
  }, [initializeChat]);

  // Build context for OpenAI
  const buildOpenAIContext = useCallback((): ChatContext => {
    return {
      isLoggedIn,
      userName: user?.name,
      hasPortfolio: holdings.length > 0,
      portfolioSummary: isLoggedIn
        ? `Total Value: ${formatCurrency(portfolio.totalValue)}, P&L: ${formatCurrency(portfolio.totalPnL)} (${portfolio.totalPnLPercent.toFixed(2)}%), Holdings: ${holdings.length} stocks`
        : undefined,
    };
  }, [isLoggedIn, user, holdings, portfolio]);

  // Handle user message
  const handleSendMessage = useCallback(
    async (text: string) => {
      addUserMessage(text);
      setIsTyping(true);

      // Detect intent
      const intent = detectIntent(text);
      let component: EmbeddedComponent | undefined;
      let responseText = '';

      // Build context for OpenAI
      const context = buildOpenAIContext();

      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 800));

      // Handle specific intents with screens
      switch (intent.intent) {
        case 'LOGIN':
          // Show login screen
          component = {
            type: 'LOGIN_FORM',
            data: {},
          };
          responseText = 'Please sign in to access your trading account';
          break;

        case 'ACCOUNT_OPENING':
          // Start KYC Flow
          setKycStep('pan');
          setKycFormData({});
          component = {
            type: 'KYC_FLOW',
            data: { step: 'pan', formData: {} },
          };
          responseText = 'Let\'s set up your Demat & Trading account';
          break;

        case 'VIEW_PORTFOLIO':
          if (isLoggedIn) {
            component = {
              type: 'PORTFOLIO_TABLE',
              data: { holdings },
            };
            responseText = await generateAIResponseWithOpenAI(
              `User wants to see their portfolio. They have ${holdings.length} stocks. Briefly introduce the portfolio view.`,
              { ...context, action: 'view portfolio' }
            );
          } else {
            // Show login screen instead
            component = {
              type: 'LOGIN_FORM',
              data: {},
            };
            responseText = 'Please login first to view your portfolio';
          }
          break;

        case 'STOCK_LOOKUP':
          if (intent.entities.stock) {
            const stock = STOCKS[intent.entities.stock];
            if (stock) {
              const candlestickData = generateCandlestickData(stock.currentPrice);
              component = {
                type: 'STOCK_CARD',
                data: { stock, candlestickData },
              };
              responseText = await generateAIResponseWithOpenAI(
                `User is looking at ${stock.symbol} (${stock.name}). Current price is ₹${stock.currentPrice}. Previous close was ₹${stock.previousClose}. Give a brief educational insight about viewing this stock, without recommending to buy or sell.`,
                { ...context, currentStock: stock.symbol }
              );
            }
          } else {
            responseText = await generateAIResponseWithOpenAI(text, context);
          }
          break;

        case 'BUY_ORDER':
          if (!isLoggedIn) {
            component = {
              type: 'LOGIN_FORM',
              data: {},
            };
            responseText = 'Please login first to place orders';
          } else if (intent.entities.stock) {
            const stock = STOCKS[intent.entities.stock];
            if (stock) {
              setPendingOrder({
                stock,
                side: 'BUY',
                quantity: intent.entities.quantity,
              });
              const candlestickData = generateCandlestickData(stock.currentPrice);
              component = {
                type: 'STOCK_CARD',
                data: { stock, candlestickData },
              };
              const qty = intent.entities.quantity;
              responseText = await generateAIResponseWithOpenAI(
                `User wants to buy ${qty || 'some'} shares of ${stock.symbol} at ₹${stock.currentPrice}. ${qty ? `Total would be approximately ₹${(qty * stock.currentPrice).toLocaleString()}.` : ''} Guide them to use the BUY button below.`,
                { ...context, currentStock: stock.symbol, action: 'buy' }
              );
            }
          } else {
            responseText = await generateAIResponseWithOpenAI(text, context);
          }
          break;

        case 'SELL_ORDER':
          if (!isLoggedIn) {
            component = {
              type: 'LOGIN_FORM',
              data: {},
            };
            responseText = 'Please login first to place orders';
          } else if (intent.entities.stock) {
            const stock = STOCKS[intent.entities.stock];
            const holding = getHolding(intent.entities.stock);
            if (stock && holding) {
              setPendingOrder({
                stock,
                side: 'SELL',
                quantity: intent.entities.quantity || holding.quantity,
              });
              const candlestickData = generateCandlestickData(stock.currentPrice);
              component = {
                type: 'STOCK_CARD',
                data: { stock, candlestickData },
              };
              const pnlPercent = ((stock.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
              responseText = await generateAIResponseWithOpenAI(
                `User wants to sell ${stock.symbol}. They hold ${holding.quantity} shares at avg price ₹${holding.avgPrice}. Current price is ₹${stock.currentPrice}. P&L is ${pnlPercent.toFixed(2)}%. Guide them to use the SELL button.`,
                { ...context, currentStock: stock.symbol, action: 'sell' }
              );
            } else if (stock) {
              responseText = await generateAIResponseWithOpenAI(
                `User wants to sell ${stock.symbol} but doesn't own any shares of it.`,
                context
              );
            }
          } else {
            responseText = await generateAIResponseWithOpenAI(text, context);
          }
          break;

        case 'ANALYSIS':
          if (!isLoggedIn) {
            component = {
              type: 'LOGIN_FORM',
              data: {},
            };
            responseText = 'Please login first to analyze your portfolio';
          } else {
            component = {
              type: 'PORTFOLIO_ANALYSIS',
              data: { portfolio, sectorAllocation },
            };
            responseText = await generateAIResponseWithOpenAI(
              `User wants portfolio analysis. Their portfolio value is ₹${portfolio.totalValue.toLocaleString()} with overall P&L of ${portfolio.totalPnLPercent.toFixed(2)}%. Top sectors: ${Object.entries(sectorAllocation).slice(0, 3).map(([s, p]) => `${s}: ${p}%`).join(', ')}. Provide brief analytical insights.`,
              { ...context, action: 'analyze portfolio' }
            );
          }
          break;

        // Smart Action Handlers
        case 'STOP_LOSS_ALL':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to set stop-loss orders';
          } else {
            component = {
              type: 'STOP_LOSS_ALL',
              data: { holdings },
            };
            responseText = 'Here are your holdings. Select which ones to protect with stop-loss orders:';
          }
          break;

        case 'BOOK_PROFITS':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to book profits';
          } else {
            const profitableHoldings = getProfitableHoldings(holdings);
            if (profitableHoldings.length === 0) {
              responseText = "You don't have any profitable holdings right now to book profits from.";
            } else {
              component = {
                type: 'BOOK_PROFITS',
                data: { profitableHoldings },
              };
              responseText = `You have ${profitableHoldings.length} profitable holdings. Select which ones to book partial profits:`;
            }
          }
          break;

        case 'BUY_THE_DIP':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to see your holdings';
          } else {
            const dippedStocks = getDippedStocks(holdings);
            if (dippedStocks.length === 0) {
              responseText = 'None of your holdings are down today. Markets are in the green!';
            } else {
              // Transform dipped stocks to match BuyTheDip component interface
              const dipStocks = dippedStocks.map(s => ({
                symbol: s.symbol,
                name: s.name,
                currentPrice: s.currentPrice,
                change: s.currentPrice - (STOCKS[s.symbol]?.previousClose || s.currentPrice),
                changePercent: s.dropPercent,
                support: s.currentPrice * 0.95, // Estimate support at 5% below current
                avgPrice: s.avgPrice,
                quantity: s.quantity,
              }));
              component = {
                type: 'BUY_THE_DIP',
                data: {
                  dipStocks,
                  cashAvailable: user?.marginAvailable || DEMO_USER.marginAvailable
                },
              };
              responseText = `${dippedStocks.length} of your stocks are down today. Consider averaging down:`;
            }
          }
          break;

        case 'WHY_DOWN_TODAY':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to see your portfolio';
          } else {
            const stats = calculatePortfolioStats(holdings, user?.marginAvailable || DEMO_USER.marginAvailable);
            const rawImpactBreakdown = getImpactBreakdown(holdings);
            const totalChange = stats.todayChange;
            const changePercent = (stats.todayChange / portfolio.totalValue) * 100;

            // Transform impact breakdown to match component interface
            const totalLoss = Math.abs(totalChange);
            const impactBreakdown = rawImpactBreakdown.map((s: any) => ({
              symbol: s.symbol,
              change: s.changePercent,
              impact: s.impact,
              contribution: totalLoss > 0 ? Math.round((Math.abs(s.impact) / totalLoss) * 100) : 0,
            }));

            // Transform market news to string array
            const newsItems = MARKET_NEWS.map(n => n.headline);

            component = {
              type: 'WHY_DOWN_TODAY',
              data: {
                totalChange,
                changePercent,
                impactBreakdown,
                newsItems,
                suggestion: 'Consider setting stop-losses or averaging down on quality stocks.',
              },
            };
            responseText = "Here's why your portfolio moved today:";
          }
          break;

        case 'TAX_LIABILITY':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to see your tax liability';
          } else {
            component = {
              type: 'TAX_LIABILITY',
              data: {
                realizedSTCG: TAX_LIABILITY_DATA.stcg.realized,
                realizedLTCG: TAX_LIABILITY_DATA.ltcg.realized,
                unrealizedSTCG: TAX_LIABILITY_DATA.stcg.unrealized,
                unrealizedLTCG: TAX_LIABILITY_DATA.ltcg.unrealized,
                availableLosses: TAX_LIABILITY_DATA.harvestingOpportunity.reduce((sum, h) => sum + Math.abs(h.loss), 0),
              },
            };
            responseText = 'Here\'s your capital gains tax summary for FY 2024-25:';
          }
          break;

        case 'AI_RECOMMENDATIONS':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to get personalized recommendations';
          } else {
            // Transform recommendations to include 'change' property
            const recommendations = AI_RECOMMENDATIONS.map(r => ({
              symbol: r.symbol,
              name: r.name,
              sector: r.sector,
              currentPrice: r.currentPrice,
              change: r.upside, // Using upside as change percentage
              matchScore: r.matchScore,
              reasons: r.reasons,
            }));
            component = {
              type: 'AI_RECOMMENDATIONS',
              data: { recommendations },
            };
            responseText = 'Based on your portfolio and market analysis, here are my top picks for you:';
          }
          break;

        case 'INVEST_IDLE_CASH':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to invest your idle cash';
          } else {
            const newSectorAllocation = getNewSectorAllocation(
              sectorAllocation,
              IDLE_CASH_SUGGESTIONS,
              portfolio.totalValue
            );
            component = {
              type: 'INVEST_IDLE_CASH',
              data: {
                cashAvailable: user?.marginAvailable || DEMO_USER.marginAvailable,
                suggestions: IDLE_CASH_SUGGESTIONS,
                newSectorAllocation,
              },
            };
            responseText = `You have ${formatCurrency(user?.marginAvailable || DEMO_USER.marginAvailable)} idle. Here's how to put it to work:`;
          }
          break;

        case 'COMPARE_NIFTY':
          if (!isLoggedIn) {
            component = { type: 'LOGIN_FORM', data: {} };
            responseText = 'Please login first to compare your portfolio';
          } else {
            // Transform data to match CompareNifty component interface
            const portfolioReturns = [
              { period: '1 Month', return: 2.5 },
              { period: '3 Months', return: 8.2 },
              { period: '6 Months', return: 12.4 },
              { period: '1 Year', return: NIFTY_COMPARISON_DATA.portfolioReturns },
            ];
            const niftyReturns = [
              { period: '1 Month', return: 1.8 },
              { period: '3 Months', return: 6.5 },
              { period: '6 Months', return: 9.8 },
              { period: '1 Year', return: NIFTY_COMPARISON_DATA.niftyReturns },
            ];
            component = {
              type: 'COMPARE_NIFTY',
              data: {
                portfolioReturns,
                niftyReturns,
                alphaGenerated: NIFTY_COMPARISON_DATA.alpha,
                alphaValue: portfolio.totalValue * (NIFTY_COMPARISON_DATA.alpha / 100),
              },
            };
            responseText = "Here's how your portfolio stacks up against NIFTY 50:";
          }
          break;

        case 'SERVICES':
          responseText = await generateAIResponseWithOpenAI(
            `User is asking about Nikunj's services. List: Online Trading (NSE/BSE), Demat Account (NSDL), F&O Trading, Currency Derivatives, Commodities (MCX), Mutual Funds, IPO Services, NRI Services. Be helpful and concise.`,
            context
          );
          break;

        case 'GREETING':
          responseText = await generateAIResponseWithOpenAI(
            `User is greeting. ${isLoggedIn ? `They are logged in as ${user?.name}.` : 'They are not logged in yet.'} Respond warmly.`,
            context
          );
          break;

        default:
          // For any other message, let OpenAI handle it naturally
          responseText = await generateAIResponseWithOpenAI(text, context);
          break;
      }

      setIsTyping(false);
      addAIMessage(responseText, component);
    },
    [
      addUserMessage,
      setIsTyping,
      isLoggedIn,
      user,
      holdings,
      portfolio,
      sectorAllocation,
      getHolding,
      addAIMessage,
      buildOpenAIContext,
    ]
  );

  // Handle actions from embedded components
  const handleAction = useCallback(
    async (action: string, data?: any) => {
      setIsTyping(true);
      const context = buildOpenAIContext();

      switch (action) {
        case 'LOGIN_SUBMIT':
          // Simulate login process
          await new Promise(resolve => setTimeout(resolve, 1500));
          setIsLoggedIn(true);
          setUser(DEMO_USER);
          setIsTyping(false);

          const loginResponse = await generateAIResponseWithOpenAI(
            `User successfully logged in. Their name is ${DEMO_USER.name}. Welcome them and tell them their portfolio is ready. Be warm and helpful.`,
            { ...context, isLoggedIn: true, userName: DEMO_USER.name }
          );
          addAIMessage(loginResponse);
          break;

        case 'FORGOT_PASSWORD':
          setIsTyping(false);
          addAIMessage(
            `No worries! To reset your password:\n\n1. Visit **nikunjonline.com/reset**\n2. Enter your registered email/mobile\n3. Follow the OTP verification\n\nOr call us at **011-47030000** for assistance.`
          );
          break;

        case 'START_KYC':
          setKycStep('pan');
          setKycFormData({});
          const component: EmbeddedComponent = {
            type: 'KYC_FLOW',
            data: { step: 'pan', formData: {} },
          };
          setIsTyping(false);
          addAIMessage('Let\'s set up your new Demat & Trading account', component);
          break;

        case 'KYC_STEP_COMPLETE':
          const { step, data: stepData } = data;
          const updatedFormData = { ...kycFormData, ...stepData };
          setKycFormData(updatedFormData);

          // If user clicked "Start Trading" from success screen, just welcome them
          if (step === 'success') {
            setIsTyping(false);
            const welcomeResponse = await generateAIResponseWithOpenAI(
              `User just completed account opening and clicked Start Trading. Their name is ${updatedFormData.name || DEMO_USER.name}. Welcome them warmly and tell them they can now explore stocks, view their portfolio, or place their first trade. Be enthusiastic but professional.`,
              { ...buildOpenAIContext(), isLoggedIn: true, userName: updatedFormData.name || DEMO_USER.name }
            );
            addAIMessage(welcomeResponse);
            break;
          }

          // Determine next step
          const stepOrder: KYCStep[] = ['pan', 'aadhaar', 'aadhaar-otp', 'personal', 'photo', 'bank', 'documents', 'esign', 'success'];
          const currentIndex = stepOrder.indexOf(step);
          const nextStep = stepOrder[currentIndex + 1] || 'success';
          setKycStep(nextStep);

          if (nextStep === 'success') {
            // KYC Complete - auto login
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoggedIn(true);
            setUser({ ...DEMO_USER, name: updatedFormData.name || DEMO_USER.name });
          }

          // Show next step
          const nextComponent: EmbeddedComponent = {
            type: 'KYC_FLOW',
            data: { step: nextStep, formData: updatedFormData },
          };

          // Get contextual message for the step
          const stepMessages: Record<KYCStep, string> = {
            'pan': 'Let\'s verify your PAN',
            'aadhaar': 'Now let\'s link your Aadhaar for e-KYC',
            'aadhaar-otp': 'Verify the OTP sent to your Aadhaar-linked mobile',
            'personal': 'Confirm your personal details',
            'photo': 'Take a quick selfie for verification',
            'bank': 'Add your bank account for fund transfers',
            'documents': 'Upload required documents',
            'video-kyc': 'Complete video verification',
            'esign': 'Final step - digitally sign your application',
            'success': 'Congratulations! Your account is ready',
          };

          setIsTyping(false);
          addAIMessage(stepMessages[nextStep] || '', nextComponent);
          break;

        case 'BUY':
          if (data) {
            const stock = data as typeof STOCKS.RELIANCE;
            setPendingOrder({ stock, side: 'BUY' });
            const orderComponent: EmbeddedComponent = {
              type: 'ORDER_FORM',
              data: {
                stock,
                side: 'BUY',
                quantity: pendingOrder?.quantity || 1,
              },
            };
            const responseText = await generateAIResponseWithOpenAI(
              `User clicked BUY button for ${stock.symbol}. Show them the order form and guide them to select quantity and order type.`,
              { ...context, currentStock: stock.symbol, action: 'placing buy order' }
            );
            setIsTyping(false);
            addAIMessage(responseText, orderComponent);
          }
          break;

        case 'SELL':
          if (data) {
            const stock = data as typeof STOCKS.RELIANCE;
            const holding = getHolding(stock.symbol);
            if (holding) {
              setPendingOrder({ stock, side: 'SELL', quantity: holding.quantity });
              const sellComponent: EmbeddedComponent = {
                type: 'ORDER_FORM',
                data: {
                  stock,
                  side: 'SELL',
                  quantity: 1,
                  maxQuantity: holding.quantity,
                },
              };
              const responseText = await generateAIResponseWithOpenAI(
                `User clicked SELL button for ${stock.symbol}. They own ${holding.quantity} shares. Guide them through the sell order form.`,
                { ...context, currentStock: stock.symbol, action: 'placing sell order' }
              );
              setIsTyping(false);
              addAIMessage(responseText, sellComponent);
            } else {
              const responseText = await generateAIResponseWithOpenAI(
                `User tried to sell ${stock.symbol} but doesn't own any shares.`,
                context
              );
              setIsTyping(false);
              addAIMessage(responseText);
            }
          }
          break;

        case 'SUBMIT_ORDER':
          if (data) {
            const { symbol, side, quantity, price } = data;
            let order;

            if (side === 'BUY') {
              order = buyStock(symbol, quantity, price);
            } else {
              order = sellStock(symbol, quantity, price);
            }

            if (order) {
              const confirmComponent: EmbeddedComponent = {
                type: 'ORDER_CONFIRMATION',
                data: { order },
              };
              const totalValue = quantity * price;
              const responseText = await generateAIResponseWithOpenAI(
                `Order executed successfully! ${side} ${quantity} shares of ${symbol} at ₹${price} each. Total value: ₹${totalValue.toLocaleString()}. Order ID: ${order.orderId}. Congratulate the user and ask if they want to see their updated portfolio.`,
                { ...context, action: 'order completed' }
              );
              setIsTyping(false);
              addAIMessage(responseText, confirmComponent);
            } else {
              const responseText = await generateAIResponseWithOpenAI(
                `Order failed for ${symbol}. There might be insufficient holdings.`,
                context
              );
              setIsTyping(false);
              addAIMessage(responseText);
            }
            setPendingOrder(null);
          }
          break;

        case 'CANCEL_ORDER':
          setPendingOrder(null);
          const cancelResponse = await generateAIResponseWithOpenAI(
            `User cancelled their order. Acknowledge and offer other options.`,
            context
          );
          setIsTyping(false);
          addAIMessage(cancelResponse);
          break;

        case 'VIEW_STOCK':
          if (data?.symbol) {
            const stock = STOCKS[data.symbol];
            if (stock) {
              const candlestickData = generateCandlestickData(stock.currentPrice);
              const stockComponent: EmbeddedComponent = {
                type: 'STOCK_CARD',
                data: { stock, candlestickData },
              };
              const responseText = await generateAIResponseWithOpenAI(
                `User clicked to view ${stock.symbol} from their portfolio. Show the stock details.`,
                { ...context, currentStock: stock.symbol }
              );
              setIsTyping(false);
              addAIMessage(responseText, stockComponent);
            }
          }
          break;

        // Smart Action Component Callbacks
        case 'STOP_LOSS_CONFIRM':
          await new Promise(resolve => setTimeout(resolve, 1000));
          const stopLossCount = data?.orders?.length || 0;
          setIsTyping(false);
          addAIMessage(
            `Stop-loss orders placed for ${stopLossCount} stocks. Your holdings are now protected. I'll notify you if any stop-loss gets triggered.`
          );
          break;

        case 'STOP_LOSS_CANCEL':
          setIsTyping(false);
          addAIMessage('No problem! Let me know if you want to set stop-losses later.');
          break;

        case 'BOOK_PROFITS_CONFIRM':
          await new Promise(resolve => setTimeout(resolve, 1000));
          const profitOrders = data?.orders || [];
          const totalBooked = profitOrders.reduce((sum: number, o: any) => sum + (o.value || 0), 0);
          setIsTyping(false);
          addAIMessage(
            `Profit booking orders placed! You've booked approximately ${formatCurrency(totalBooked)} in profits. The remaining positions continue to ride the trend.`
          );
          break;

        case 'BOOK_PROFITS_CANCEL':
          setIsTyping(false);
          addAIMessage('Alright, keeping your profitable positions intact. Let me know when you want to book profits.');
          break;

        case 'BUY_DIP_CONFIRM':
          await new Promise(resolve => setTimeout(resolve, 1000));
          const dipOrders = data?.orders || [];
          setIsTyping(false);
          addAIMessage(
            `Buy orders placed for ${dipOrders.length} stocks to average down. Smart move buying the dip! Your average cost will reduce once orders execute.`
          );
          break;

        case 'BUY_DIP_CANCEL':
          setIsTyping(false);
          addAIMessage('No worries! The dip opportunity will still be there if you change your mind.');
          break;

        case 'INVEST_CASH_CONFIRM':
          await new Promise(resolve => setTimeout(resolve, 1000));
          const investOrders = data?.orders || [];
          const totalInvested = investOrders.reduce((sum: number, o: any) => sum + (o.quantity * o.price), 0);
          setIsTyping(false);
          addAIMessage(
            `Investment orders placed! ${formatCurrency(totalInvested)} will be deployed into ${investOrders.length} stocks. This will improve your portfolio diversification.`
          );
          break;

        case 'INVEST_CASH_CANCEL':
          setIsTyping(false);
          addAIMessage('Got it! Your cash remains available for other opportunities.');
          break;

        case 'BUY_RECOMMENDATION':
          if (data) {
            const { symbol, qty, price } = data;
            await new Promise(resolve => setTimeout(resolve, 800));
            buyStock(symbol, qty, price);
            setIsTyping(false);
            addAIMessage(
              `Buy order placed for ${qty} shares of ${symbol} at ${formatCurrency(price)}. Great choice adding this to your portfolio!`
            );
          }
          break;

        case 'RECOMMENDATIONS_CANCEL':
          setIsTyping(false);
          addAIMessage('No problem! Let me know when you want fresh recommendations.');
          break;

        case 'QUICK_TRADE_CANCEL':
          setIsTyping(false);
          addAIMessage('Trade cancelled. Let me know if you want to trade something else.');
          break;

        default:
          setIsTyping(false);
      }
    },
    [addAIMessage, setIsTyping, buyStock, sellStock, getHolding, pendingOrder, buildOpenAIContext, kycFormData]
  );

  // Handle quick action from sidebar
  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  // Handle stock click from right panel
  const handleStockClick = useCallback((symbol: string) => {
    handleSendMessage(`show ${symbol}`);
  }, [handleSendMessage]);

  return (
    <div className="h-screen bg-navy-950 bg-mesh flex overflow-hidden">
      {/* Left Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar
          isLoggedIn={isLoggedIn}
          userName={user?.name}
          onQuickAction={handleQuickAction}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0">
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
          isLoggedIn={isLoggedIn}
          userName={user?.name}
          portfolioStats={isLoggedIn ? calculatePortfolioStats(holdings, user?.marginAvailable || DEMO_USER.marginAvailable) : undefined}
          onSendMessage={handleSendMessage}
          onAction={handleAction}
        />
      </div>

      {/* Right Panel - Hidden on mobile and tablet */}
      <div className="hidden xl:block">
        <RightPanel onStockClick={handleStockClick} />
      </div>
    </div>
  );
}

export default App;
