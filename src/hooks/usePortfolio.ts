import { useState, useCallback, useMemo } from 'react';
import { Holding, Order } from '../types';
import {
  DEFAULT_HOLDINGS,
  calculatePortfolio,
  calculateSectorAllocation,
  STOCKS,
  generateOrderId,
} from '../services/mockData';

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  const portfolio = useMemo(() => calculatePortfolio(holdings), [holdings]);
  const sectorAllocation = useMemo(() => calculateSectorAllocation(holdings), [holdings]);

  const buyStock = useCallback((symbol: string, quantity: number, price: number): Order => {
    const order: Order = {
      orderId: generateOrderId(),
      symbol,
      side: 'BUY',
      type: 'MARKET',
      quantity,
      price,
      status: 'EXECUTED',
      timestamp: new Date(),
    };

    // Update holdings
    setHoldings((prev) => {
      const existingHolding = prev.find((h) => h.symbol === symbol);
      const stock = STOCKS[symbol];

      if (existingHolding) {
        // Update existing holding with new average price
        const totalQty = existingHolding.quantity + quantity;
        const totalCost =
          existingHolding.quantity * existingHolding.avgPrice + quantity * price;
        const newAvgPrice = totalCost / totalQty;

        return prev.map((h) =>
          h.symbol === symbol
            ? { ...h, quantity: totalQty, avgPrice: newAvgPrice, currentPrice: price }
            : h
        );
      } else {
        // Add new holding
        return [
          ...prev,
          {
            symbol,
            name: stock?.name || symbol,
            quantity,
            avgPrice: price,
            currentPrice: price,
            sector: stock?.sector || 'Unknown',
          },
        ];
      }
    });

    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const sellStock = useCallback((symbol: string, quantity: number, price: number): Order | null => {
    const existingHolding = holdings.find((h) => h.symbol === symbol);

    if (!existingHolding || existingHolding.quantity < quantity) {
      return null; // Insufficient holdings
    }

    const order: Order = {
      orderId: generateOrderId(),
      symbol,
      side: 'SELL',
      type: 'MARKET',
      quantity,
      price,
      status: 'EXECUTED',
      timestamp: new Date(),
    };

    // Update holdings
    setHoldings((prev) => {
      return prev
        .map((h) => {
          if (h.symbol === symbol) {
            const newQty = h.quantity - quantity;
            if (newQty <= 0) {
              return null; // Remove holding
            }
            return { ...h, quantity: newQty, currentPrice: price };
          }
          return h;
        })
        .filter((h): h is Holding => h !== null);
    });

    setOrders((prev) => [order, ...prev]);
    return order;
  }, [holdings]);

  const getHolding = useCallback((symbol: string): Holding | undefined => {
    return holdings.find((h) => h.symbol === symbol);
  }, [holdings]);

  const updatePrices = useCallback(() => {
    // Simulate price updates
    setHoldings((prev) =>
      prev.map((h) => {
        const stock = STOCKS[h.symbol];
        if (stock) {
          // Add small random price change
          const change = (Math.random() - 0.5) * 0.02 * stock.currentPrice;
          return {
            ...h,
            currentPrice: parseFloat((stock.currentPrice + change).toFixed(2)),
          };
        }
        return h;
      })
    );
  }, []);

  return {
    holdings,
    portfolio,
    sectorAllocation,
    orders,
    buyStock,
    sellStock,
    getHolding,
    updatePrices,
  };
}

export default usePortfolio;
