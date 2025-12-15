import React from 'react';
import { X, Receipt, Lightbulb, Download, FileText } from 'lucide-react';
import { formatCurrency } from '../../services/mockData';

interface TaxLiabilityProps {
  realizedSTCG: number;
  realizedLTCG: number;
  unrealizedSTCG: number;
  unrealizedLTCG: number;
  availableLosses: number;
  onAction: (action: string) => void;
  onClose: () => void;
}

const TaxLiability: React.FC<TaxLiabilityProps> = ({
  realizedSTCG,
  realizedLTCG,
  unrealizedSTCG,
  unrealizedLTCG,
  availableLosses,
  onAction,
  onClose,
}) => {
  const stcgTax = Math.max(0, realizedSTCG) * 0.15;
  const ltcgTaxable = Math.max(0, realizedLTCG - 100000); // 1L exemption
  const ltcgTax = ltcgTaxable * 0.10;
  const totalTax = stcgTax + ltcgTax;
  const potentialSavings = Math.min(availableLosses, realizedSTCG) * 0.15;

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-white">Capital Gains Tax Summary</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-400">Financial Year: 2024-25</p>

        {/* Realized Gains */}
        <div className="bg-navy-900/50 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-medium text-white">Realized Gains (Sold Stocks)</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-400">Short Term (&lt;1 year)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Gains: {formatCurrency(realizedSTCG)}</span>
                <span className="text-sm text-amber-500">Tax @ 15%: {formatCurrency(stcgTax)}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-400">Long Term (&gt;1 year)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Gains: {formatCurrency(realizedLTCG)} (₹1L exempt)
                </span>
                <span className="text-sm text-amber-500">
                  Tax @ 10%: {formatCurrency(ltcgTax)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-navy-700/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Total Tax Liability</span>
                <span className="text-lg font-bold text-amber-500">{formatCurrency(totalTax)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unrealized Gains */}
        <div className="bg-navy-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-3">Unrealized Gains (Current Holdings)</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">STCG Stocks</span>
              <span className="text-sm text-slate-300">
                {formatCurrency(unrealizedSTCG)}
                <span className="text-xs text-slate-500 ml-1">
                  (if sold, tax: {formatCurrency(unrealizedSTCG * 0.15)})
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">LTCG Stocks</span>
              <span className="text-sm text-slate-300">
                {formatCurrency(unrealizedLTCG)}
                <span className="text-xs text-slate-500 ml-1">
                  (if sold, tax: {formatCurrency(Math.max(0, unrealizedLTCG - 100000) * 0.10)})
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Tax Optimization Tips */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="flex items-start gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <h4 className="text-sm font-medium text-emerald-400">Tax Optimization Tips</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {availableLosses > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">•</span>
                Harvest {formatCurrency(availableLosses)} in losses to save {formatCurrency(potentialSavings)}
              </li>
            )}
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              3 stocks turning LTCG next month - hold them for lower tax
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              Use remaining ₹{Math.max(0, (100000 - realizedLTCG) / 1000).toFixed(0)}K LTCG exemption this year
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {availableLosses > 0 && (
            <button
              onClick={() => onAction('HARVEST_LOSSES')}
              className="flex-1 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Harvest Losses
            </button>
          )}
          <button
            onClick={() => onAction('DOWNLOAD_REPORT')}
            className="flex-1 py-2.5 rounded-lg bg-navy-700/50 text-slate-300 text-sm font-medium border border-navy-600/30 hover:bg-navy-700 transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxLiability;
