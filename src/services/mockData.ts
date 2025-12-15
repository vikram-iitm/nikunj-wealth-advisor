import { User, Stock, Holding, Portfolio, MarketIndex, CandlestickData } from '../types';

// Demo User Account
export const DEMO_USER: User = {
  name: 'Rahul Sharma',
  clientId: 'NK847291',
  pan: 'ABCPS1234K',
  email: 'rahul.sharma@email.com',
  phone: '9876543210',
  dematId: '12345678901234',
  accountStatus: 'active',
  kycStatus: 'verified',
  marginAvailable: 375000,
  marginUsed: 125000,
};

// Stock Data
export const STOCKS: Record<string, Stock> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    sector: 'Energy',
    currentPrice: 2587.45,
    previousClose: 2572.30,
    open: 2575.00,
    high: 2598.90,
    low: 2568.15,
    volume: 8542365,
    pe: 25.8,
    week52High: 2856.15,
    week52Low: 2180.00,
    marketCap: '17.5L Cr',
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd',
    sector: 'IT',
    currentPrice: 4125.60,
    previousClose: 4098.75,
    open: 4100.00,
    high: 4145.00,
    low: 4085.50,
    volume: 2145632,
    pe: 32.4,
    week52High: 4592.25,
    week52Low: 3315.00,
    marketCap: '15.1L Cr',
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd',
    sector: 'Banking',
    currentPrice: 1696.80,
    previousClose: 1682.45,
    open: 1685.00,
    high: 1705.00,
    low: 1678.20,
    volume: 12563254,
    pe: 19.2,
    week52High: 1794.00,
    week52Low: 1363.55,
    marketCap: '12.8L Cr',
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd',
    sector: 'IT',
    currentPrice: 1524.35,
    previousClose: 1512.80,
    open: 1515.00,
    high: 1532.50,
    low: 1508.25,
    volume: 6523145,
    pe: 24.6,
    week52High: 1953.90,
    week52Low: 1215.45,
    marketCap: '6.3L Cr',
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd',
    sector: 'Banking',
    currentPrice: 1189.25,
    previousClose: 1175.40,
    open: 1178.00,
    high: 1198.50,
    low: 1172.30,
    volume: 9856324,
    pe: 17.8,
    week52High: 1362.35,
    week52Low: 898.20,
    marketCap: '8.3L Cr',
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    sector: 'Auto',
    currentPrice: 785.60,
    previousClose: 768.25,
    open: 770.00,
    high: 792.40,
    low: 765.80,
    volume: 15236547,
    pe: 8.5,
    week52High: 1024.00,
    week52Low: 595.15,
    marketCap: '2.9L Cr',
  },
  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking',
    currentPrice: 699.45,
    previousClose: 692.80,
    open: 694.00,
    high: 705.20,
    low: 690.50,
    volume: 18563254,
    pe: 11.2,
    week52High: 912.00,
    week52Low: 555.25,
    marketCap: '6.2L Cr',
  },
  BHARTIARTL: {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd',
    sector: 'Telecom',
    currentPrice: 1246.30,
    previousClose: 1238.15,
    open: 1240.00,
    high: 1258.45,
    low: 1232.60,
    volume: 4523654,
    pe: 38.2,
    week52High: 1778.00,
    week52Low: 928.35,
    marketCap: '7.5L Cr',
  },
  WIPRO: {
    symbol: 'WIPRO',
    name: 'Wipro Ltd',
    sector: 'IT',
    currentPrice: 298.45,
    previousClose: 295.80,
    open: 296.00,
    high: 301.20,
    low: 294.50,
    volume: 8965321,
    pe: 20.4,
    week52High: 528.00,
    week52Low: 265.85,
    marketCap: '3.1L Cr',
  },
  TATASTEEL: {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd',
    sector: 'Metal',
    currentPrice: 142.65,
    previousClose: 140.80,
    open: 141.00,
    high: 144.50,
    low: 139.80,
    volume: 25632145,
    pe: 6.8,
    week52High: 184.75,
    week52Low: 118.35,
    marketCap: '1.8L Cr',
  },
  MARUTI: {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd',
    sector: 'Auto',
    currentPrice: 11256.80,
    previousClose: 11185.45,
    open: 11200.00,
    high: 11320.00,
    low: 11150.30,
    volume: 856324,
    pe: 28.5,
    week52High: 13680.00,
    week52Low: 9738.50,
    marketCap: '3.5L Cr',
  },
  AXISBANK: {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd',
    sector: 'Banking',
    currentPrice: 1142.35,
    previousClose: 1135.60,
    open: 1138.00,
    high: 1152.80,
    low: 1130.45,
    volume: 7523654,
    pe: 14.2,
    week52High: 1339.65,
    week52Low: 995.80,
    marketCap: '3.5L Cr',
  },
  KOTAKBANK: {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Ltd',
    sector: 'Banking',
    currentPrice: 1856.45,
    previousClose: 1842.30,
    open: 1845.00,
    high: 1868.90,
    low: 1838.25,
    volume: 3256841,
    pe: 21.5,
    week52High: 2185.00,
    week52Low: 1543.85,
    marketCap: '3.7L Cr',
  },
  LT: {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    sector: 'Infrastructure',
    currentPrice: 3685.20,
    previousClose: 3658.45,
    open: 3662.00,
    high: 3705.50,
    low: 3648.80,
    volume: 1856324,
    pe: 35.8,
    week52High: 3925.00,
    week52Low: 2880.60,
    marketCap: '5.1L Cr',
  },
  SUNPHARMA: {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd',
    sector: 'Pharma',
    currentPrice: 1892.65,
    previousClose: 1878.40,
    open: 1882.00,
    high: 1905.80,
    low: 1872.35,
    volume: 2563214,
    pe: 42.1,
    week52High: 2158.00,
    week52Low: 1428.25,
    marketCap: '4.5L Cr',
  },
};

// Portfolio Holdings
export const DEFAULT_HOLDINGS: Holding[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 25, avgPrice: 2450, currentPrice: 2587.45, sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 15, avgPrice: 3890, currentPrice: 4125.60, sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', quantity: 40, avgPrice: 1620, currentPrice: 1696.80, sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd', quantity: 30, avgPrice: 1450, currentPrice: 1524.35, sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', quantity: 50, avgPrice: 1050, currentPrice: 1189.25, sector: 'Banking' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', quantity: 100, avgPrice: 680, currentPrice: 785.60, sector: 'Auto' },
  { symbol: 'SBIN', name: 'State Bank of India', quantity: 80, avgPrice: 625, currentPrice: 699.45, sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', quantity: 35, avgPrice: 1180, currentPrice: 1246.30, sector: 'Telecom' },
];

// Calculate Portfolio from Holdings
export function calculatePortfolio(holdings: Holding[]): Portfolio {
  let totalValue = 0;
  let totalInvestment = 0;

  holdings.forEach((h) => {
    totalValue += h.quantity * h.currentPrice;
    totalInvestment += h.quantity * h.avgPrice;
  });

  const totalPnL = totalValue - totalInvestment;
  const totalPnLPercent = (totalPnL / totalInvestment) * 100;

  return {
    holdings,
    totalValue,
    totalInvestment,
    totalPnL,
    totalPnLPercent,
  };
}

// Market Indices
export const MARKET_INDICES: MarketIndex[] = [
  { name: 'NIFTY 50', value: 24768.30, change: 103.75, changePercent: 0.42 },
  { name: 'SENSEX', value: 81523.16, change: 309.80, changePercent: 0.38 },
  { name: 'BANK NIFTY', value: 53842.75, change: -80.75, changePercent: -0.15 },
  { name: 'NIFTY IT', value: 42156.80, change: 516.45, changePercent: 1.24 },
];

// Generate Candlestick Data
export function generateCandlestickData(basePrice: number, days: number = 60): CandlestickData[] {
  const data: CandlestickData[] = [];
  let price = basePrice * 0.85; // Start 15% below current

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.48) * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * price * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * price * 0.5;

    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    price = close;
  }

  return data;
}

// Find Stock by Symbol or Name (fuzzy)
export function findStock(query: string): Stock | undefined {
  const upperQuery = query.toUpperCase().trim();

  // Direct symbol match
  if (STOCKS[upperQuery]) {
    return STOCKS[upperQuery];
  }

  // Search by name or partial symbol
  const stockList = Object.values(STOCKS);
  return stockList.find(
    (s) =>
      s.symbol.includes(upperQuery) ||
      s.name.toUpperCase().includes(upperQuery)
  );
}

// Stock symbol list for matching
export const STOCK_SYMBOLS = Object.keys(STOCKS);

// Generate unique order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Format percentage
export function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

// Calculate sector allocation from holdings
export function calculateSectorAllocation(holdings: Holding[]): Record<string, number> {
  const sectorValues: Record<string, number> = {};
  let totalValue = 0;

  holdings.forEach((h) => {
    const value = h.quantity * h.currentPrice;
    totalValue += value;
    sectorValues[h.sector] = (sectorValues[h.sector] || 0) + value;
  });

  const allocation: Record<string, number> = {};
  Object.keys(sectorValues).forEach((sector) => {
    allocation[sector] = parseFloat(((sectorValues[sector] / totalValue) * 100).toFixed(1));
  });

  return allocation;
}

// ============= SMART ACTION MOCK DATA =============

// Tax liability data for the user's portfolio
export const TAX_LIABILITY_DATA = {
  financialYear: '2024-25',
  stcg: {
    realized: 12500,
    unrealized: 8750,
    taxRate: 20,
    taxAmount: 2500,
  },
  ltcg: {
    realized: 45000,
    unrealized: 68500,
    taxRate: 12.5,
    exemptionLimit: 125000,
    taxableAmount: 0,
    taxAmount: 0,
  },
  totalTax: 2500,
  harvestingOpportunity: [
    { symbol: 'WIPRO', loss: -5200, recommendation: 'Sell to offset gains' },
    { symbol: 'TATASTEEL', loss: -2800, recommendation: 'Consider tax harvesting' },
  ],
};

// AI-powered stock recommendations
export const AI_RECOMMENDATIONS = [
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd',
    sector: 'NBFC',
    currentPrice: 6845.30,
    targetPrice: 7850,
    upside: 14.7,
    matchScore: 94,
    reasons: [
      'Strong quarterly results with 28% profit growth',
      'Underweight in NBFC sector in your portfolio',
      'Technical breakout above key resistance',
    ],
    riskLevel: 'Medium',
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd',
    sector: 'Consumer',
    currentPrice: 3245.80,
    targetPrice: 3680,
    upside: 13.4,
    matchScore: 89,
    reasons: [
      'Consumer sector missing from your portfolio',
      'Consistent 20%+ revenue growth',
      'Strong festive season outlook',
    ],
    riskLevel: 'Low',
  },
  {
    symbol: 'ADANIPORTS',
    name: 'Adani Ports & SEZ Ltd',
    sector: 'Infrastructure',
    currentPrice: 1385.60,
    targetPrice: 1620,
    upside: 16.9,
    matchScore: 85,
    reasons: [
      'Infrastructure sector diversification',
      'Record cargo volumes expected',
      'Attractive valuation vs peers',
    ],
    riskLevel: 'Medium-High',
  },
];

// Investment suggestions for idle cash
export const IDLE_CASH_SUGGESTIONS = [
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd',
    sector: 'IT',
    currentPrice: 1756.45,
    suggestedQty: 5,
    reason: 'IT sector underweight, strong deal pipeline',
  },
  {
    symbol: 'DRREDDY',
    name: "Dr. Reddy's Laboratories",
    sector: 'Pharma',
    currentPrice: 6425.80,
    suggestedQty: 2,
    reason: 'Pharma sector missing, defensive play',
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd',
    sector: 'Consumer',
    currentPrice: 2845.30,
    suggestedQty: 3,
    reason: 'Consumer sector gap, market leader',
  },
];

// NIFTY comparison chart data
export const NIFTY_COMPARISON_DATA = {
  portfolioReturns: 15.8,
  niftyReturns: 12.4,
  alpha: 3.4,
  timeframe: '1Y',
  chartData: [
    { month: 'Jan', portfolio: 0, nifty: 0 },
    { month: 'Feb', portfolio: 2.1, nifty: 1.8 },
    { month: 'Mar', portfolio: -1.2, nifty: -2.4 },
    { month: 'Apr', portfolio: 3.5, nifty: 2.8 },
    { month: 'May', portfolio: 5.2, nifty: 4.1 },
    { month: 'Jun', portfolio: 4.8, nifty: 5.2 },
    { month: 'Jul', portfolio: 8.2, nifty: 6.8 },
    { month: 'Aug', portfolio: 10.5, nifty: 8.2 },
    { month: 'Sep', portfolio: 9.8, nifty: 7.5 },
    { month: 'Oct', portfolio: 12.4, nifty: 10.1 },
    { month: 'Nov', portfolio: 14.2, nifty: 11.8 },
    { month: 'Dec', portfolio: 15.8, nifty: 12.4 },
  ],
};

// Market news for "Why Down Today" explanation
export const MARKET_NEWS = [
  {
    headline: 'FII selling continues for 5th straight session',
    impact: 'negative',
    time: '2 hours ago',
  },
  {
    headline: 'IT sector faces headwinds on weak US job data',
    impact: 'negative',
    time: '3 hours ago',
  },
  {
    headline: 'RBI keeps repo rate unchanged at 6.5%',
    impact: 'neutral',
    time: '5 hours ago',
  },
];

// Calculate portfolio stats for smart chips
export function calculatePortfolioStats(holdings: Holding[], marginAvailable: number) {
  const portfolio = calculatePortfolio(holdings);
  const sectorAllocation = calculateSectorAllocation(holdings);

  let todayChange = 0;
  let profitableStocks = 0;
  let losingStocks = 0;

  holdings.forEach(h => {
    const stock = STOCKS[h.symbol];
    if (stock) {
      const todayPnL = (stock.currentPrice - stock.previousClose) * h.quantity;
      todayChange += todayPnL;

      const overallPnL = (h.currentPrice - h.avgPrice) * h.quantity;
      if (overallPnL > 0) profitableStocks++;
      else if (overallPnL < 0) losingStocks++;
    }
  });

  // Find highest sector
  let highestSector = '';
  let highestSectorPercent = 0;
  Object.entries(sectorAllocation).forEach(([sector, percent]) => {
    if (percent > highestSectorPercent) {
      highestSector = sector;
      highestSectorPercent = percent;
    }
  });

  return {
    totalPnL: portfolio.totalPnL,
    todayChange,
    profitableStocks,
    losingStocks,
    cashAvailable: marginAvailable,
    highestSectorPercent,
    highestSector,
  };
}

// Get holdings that are down (for "Buy the Dip")
export function getDippedStocks(holdings: Holding[]) {
  return holdings
    .filter(h => {
      const stock = STOCKS[h.symbol];
      return stock && stock.currentPrice < stock.previousClose;
    })
    .map(h => {
      const stock = STOCKS[h.symbol];
      const dropPercent = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
      return {
        symbol: h.symbol,
        name: h.name,
        currentPrice: h.currentPrice,
        avgPrice: h.avgPrice,
        quantity: h.quantity,
        dropPercent,
        suggestedBuyQty: Math.ceil(h.quantity * 0.25), // Suggest 25% more
      };
    })
    .sort((a, b) => a.dropPercent - b.dropPercent); // Most dropped first
}

// Get profitable holdings (for "Book Profits")
export function getProfitableHoldings(holdings: Holding[]) {
  return holdings
    .filter(h => h.currentPrice > h.avgPrice)
    .map(h => {
      const profitPercent = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
      const totalProfit = (h.currentPrice - h.avgPrice) * h.quantity;
      return {
        symbol: h.symbol,
        name: h.name,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        currentPrice: h.currentPrice,
        profitPercent,
        totalProfit,
        suggestedSellPercent: profitPercent > 20 ? 50 : 25, // Sell more if big gains
      };
    })
    .sort((a, b) => b.profitPercent - a.profitPercent); // Most profitable first
}

// Get impact breakdown for "Why Down Today"
export function getImpactBreakdown(holdings: Holding[]) {
  return holdings
    .map(h => {
      const stock = STOCKS[h.symbol];
      if (!stock) return null;
      const impact = (stock.currentPrice - stock.previousClose) * h.quantity;
      const changePercent = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
      return {
        symbol: h.symbol,
        name: h.name,
        impact,
        changePercent,
        quantity: h.quantity,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a?.impact || 0) - (b?.impact || 0)); // Biggest losers first
}

// Calculate new sector allocation after suggested investments
export function getNewSectorAllocation(
  currentAllocation: Record<string, number>,
  suggestions: typeof IDLE_CASH_SUGGESTIONS,
  currentPortfolioValue: number
): Record<string, { before: number; after: number }> {
  const result: Record<string, { before: number; after: number }> = {};

  // Copy current allocation
  Object.entries(currentAllocation).forEach(([sector, percent]) => {
    result[sector] = { before: percent, after: percent };
  });

  // Calculate total new investment
  const newInvestment = suggestions.reduce(
    (sum, s) => sum + s.currentPrice * s.suggestedQty,
    0
  );
  const newTotal = currentPortfolioValue + newInvestment;

  // Adjust existing percentages
  Object.keys(result).forEach(sector => {
    result[sector].after = parseFloat(
      ((result[sector].before * currentPortfolioValue) / newTotal).toFixed(1)
    );
  });

  // Add new sector allocations
  suggestions.forEach(s => {
    const value = s.currentPrice * s.suggestedQty;
    const percent = parseFloat(((value / newTotal) * 100).toFixed(1));

    if (result[s.sector]) {
      result[s.sector].after = parseFloat((result[s.sector].after + percent).toFixed(1));
    } else {
      result[s.sector] = { before: 0, after: percent };
    }
  });

  return result;
}
