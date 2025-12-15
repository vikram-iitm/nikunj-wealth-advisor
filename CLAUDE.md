# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nikunj AI Wealth Advisor is a conversational AI-powered investment platform for Nikunj Stock Brokers Limited. The application uses a single chat interface for all investment operations - no separate pages or navigation.

## Build Commands

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

## Architecture

### Core Concept: Conversation-First Interface
Everything happens through chat. Visual elements (charts, forms, tables) appear dynamically within the conversation flow. The AI responds with embedded interactive components.

### Technology Stack
- React 19.2.3 (TypeScript) - Uses patched version safe from CVE-2025-55182
- Tailwind CSS 3.x for styling
- Recharts for sector allocation pie charts
- Custom SVG for candlestick charts
- Lucide React for icons

### Component Structure
```
src/
├── components/
│   ├── Chat/          # ChatContainer, MessageList, UserMessage, AIMessage, InputBar
│   ├── Trading/       # StockCard, CandlestickChart, OrderForm, OrderConfirmation
│   ├── Portfolio/     # HoldingsTable, SectorChart, PortfolioAnalysis
│   └── Account/       # AccountOpening (conversational KYC flow)
├── hooks/             # useChat, usePortfolio, useAccountOpening
├── services/          # mockData.ts, intentDetection.ts
└── types/             # TypeScript interfaces
```

### State Management
- React Context + useReducer pattern
- Custom hooks for domain logic (chat, portfolio, account opening)
- Local state for UI interactions

### Intent Detection
The `intentDetection.ts` service maps user messages to actions:
- GREETING, ACCOUNT_OPENING, LOGIN, VIEW_PORTFOLIO
- STOCK_LOOKUP, BUY_ORDER, SELL_ORDER, ANALYSIS
- SERVICES, IPO, MUTUAL_FUNDS, HELP

### Design System
- Colors: Navy (#0a1628, #1a2942), Gold (#d4af37)
- Font: DM Sans (primary), JetBrains Mono (numbers)
- Dark theme with gold accents

## Key Files

- `src/App.tsx` - Main app with message handling and action dispatch
- `src/services/mockData.ts` - All demo data (stocks, portfolio, user)
- `src/services/intentDetection.ts` - NLP-lite intent parsing
- `src/types/index.ts` - TypeScript interfaces

## Demo Flow

1. User lands on chat → Welcome message
2. "login" → Loads demo user (Rahul Sharma) with portfolio
3. Stock queries → Shows StockCard with candlestick chart
4. "buy/sell [stock]" → OrderForm → OrderConfirmation
5. "portfolio" → HoldingsTable
6. "analyze" → PortfolioAnalysis with sector breakdown
