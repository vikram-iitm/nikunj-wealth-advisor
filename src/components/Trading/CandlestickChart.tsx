import React, { useMemo } from 'react';
import { CandlestickData } from '../../types';

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 500,
  height = 200,
}) => {
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { minPrice, maxPrice, priceRange, candleWidth, candleSpacing } = useMemo(() => {
    const allPrices = data.flatMap((d) => [d.high, d.low]);
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const range = max - min;
    const cWidth = Math.max(2, (chartWidth / data.length) * 0.7);
    const cSpacing = chartWidth / data.length;

    return {
      minPrice: min - range * 0.05,
      maxPrice: max + range * 0.05,
      priceRange: (max - min) * 1.1,
      candleWidth: cWidth,
      candleSpacing: cSpacing,
    };
  }, [data, chartWidth]);

  const scaleY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  // Generate Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks = [];
    const step = priceRange / 5;
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + step * i;
      ticks.push(price);
    }
    return ticks;
  }, [minPrice, priceRange]);

  // Generate X-axis labels (every 10 days)
  const xLabels = useMemo(() => {
    return data.filter((_, i) => i % 10 === 0).map((d, i) => ({
      date: d.date,
      x: i * 10 * candleSpacing + candleSpacing / 2,
    }));
  }, [data, candleSpacing]);

  return (
    <svg
      width={width}
      height={height}
      className="bg-black/20 rounded-lg"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Grid lines */}
      <g className="grid-lines">
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={padding.top + scaleY(tick)}
            x2={width - padding.right}
            y2={padding.top + scaleY(tick)}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeDasharray="4,4"
          />
        ))}
      </g>

      {/* Y-axis labels */}
      <g className="y-axis">
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={padding.left - 8}
            y={padding.top + scaleY(tick)}
            textAnchor="end"
            alignmentBaseline="middle"
            className="text-xs fill-slate-500 font-mono"
            fontSize="10"
          >
            ₹{formatPrice(tick)}
          </text>
        ))}
      </g>

      {/* X-axis labels */}
      <g className="x-axis">
        {xLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left + label.x}
            y={height - 8}
            textAnchor="middle"
            className="text-xs fill-slate-500"
            fontSize="9"
          >
            {new Date(label.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            })}
          </text>
        ))}
      </g>

      {/* Candlesticks */}
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {data.map((candle, i) => {
          const x = i * candleSpacing + candleSpacing / 2;
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? '#22c55e' : '#ef4444';
          const bodyTop = scaleY(Math.max(candle.open, candle.close));
          const bodyBottom = scaleY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={scaleY(candle.high)}
                x2={x}
                y2={scaleY(candle.low)}
                stroke={color}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isGreen ? color : color}
                stroke={color}
                strokeWidth="0.5"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default CandlestickChart;
