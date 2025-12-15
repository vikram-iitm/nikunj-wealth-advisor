import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SectorChartProps {
  data: Record<string, number>;
}

const COLORS = [
  '#d4af37', // Gold
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

const SectorChart: React.FC<SectorChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy-800 border border-navy-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gold-500 font-mono">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 p-4">
      <h4 className="text-sm font-medium text-white mb-4">Sector Allocation</h4>
      <div className="flex items-center gap-4">
        {/* Pie Chart */}
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {chartData.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-slate-300">{entry.name}</span>
              </div>
              <span className="text-sm font-mono text-slate-400">{entry.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorChart;
