import React from 'react';
import {
  Home,
  TrendingUp,
  Briefcase,
  PieChart,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface SidebarProps {
  isLoggedIn: boolean;
  userName?: string;
  onQuickAction: (action: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isLoggedIn, userName, onQuickAction }) => {
  const marketIndices = [
    { name: 'NIFTY 50', value: '24,768.30', change: '+0.42%', isUp: true },
    { name: 'SENSEX', value: '81,523.16', change: '+0.38%', isUp: true },
  ];

  const quickActions = [
    { icon: TrendingUp, label: 'Explore Stocks', action: 'show reliance' },
    { icon: Briefcase, label: 'My Portfolio', action: 'show portfolio' },
    { icon: PieChart, label: 'Analysis', action: 'analyze portfolio' },
    { icon: Plus, label: 'Open Account', action: 'open account' },
  ];

  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: TrendingUp, label: 'Markets' },
    { icon: Briefcase, label: 'Portfolio' },
    { icon: Bell, label: 'Alerts' },
    { icon: HelpCircle, label: 'Support' },
  ];

  return (
    <div className="w-72 bg-navy-900/98 border-r border-purple-500/20 flex flex-col h-full backdrop-blur-xl">
      {/* Logo */}
      <div className="p-5 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400/30 overflow-hidden">
            <img src="/logo.png" alt="Nikunj" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">Nikunj</h1>
            <p className="text-xs text-purple-300">Wealth Advisor</p>
          </div>
        </div>
      </div>

      {/* User Profile (if logged in) */}
      {isLoggedIn && userName && (
        <div className="p-4 mx-3 mt-4 card-highlight rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-gold-400 flex items-center justify-center shadow-md">
              <span className="text-white font-bold">{userName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-gold-400">Premium Member</p>
            </div>
          </div>
        </div>
      )}

      {/* Market Overview */}
      <div className="p-4 mx-3 mt-4 card-premium rounded-xl">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Live Markets</h3>
        <div className="space-y-3">
          {marketIndices.map((index) => (
            <div key={index.name} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{index.name}</span>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{index.value}</p>
                <p className={`text-xs flex items-center gap-0.5 ${index.isUp ? 'text-green-500' : 'text-red-500'}`}>
                  {index.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {index.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 mx-3 mt-4">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={() => onQuickAction(item.action)}
              className="flex flex-col items-center gap-2 p-3 bg-navy-800/60 hover:bg-purple-500/15 rounded-xl transition-all group border border-purple-500/20 hover:border-purple-400/40 hover:shadow-card"
            >
              <item.icon className="w-5 h-5 text-slate-300 group-hover:text-purple-300 transition-colors" />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 mt-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-400/30'
                  : 'text-slate-300 hover:bg-navy-800/60 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-purple-500/20">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-navy-800/50 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button>
          {isLoggedIn && (
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
