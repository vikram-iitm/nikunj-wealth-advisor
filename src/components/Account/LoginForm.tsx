import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (clientId: string, password: string) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  isCompleted?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, onRegister, isCompleted = false }) => {
  const [clientId, setClientId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If login is completed, show success state
  if (isCompleted) {
    return (
      <div className="bg-navy-800/90 rounded-xl border border-green-500/30 overflow-hidden shadow-xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Login Successful</h3>
          <p className="text-sm text-slate-400">You are now signed in to your account</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientId.trim()) {
      setError('Please enter your Client ID');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo credentials check (accept any for demo)
    onLogin(clientId, password);
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-md">
      {/* Header */}
      <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/10 px-6 py-4 border-b border-navy-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg">
            <span className="text-navy-900 font-bold text-xl">N</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Welcome Back</h2>
            <p className="text-sm text-slate-400">Sign in to your trading account</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Client ID */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Client ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value.toUpperCase())}
              placeholder="Enter Client ID (e.g., NK847291)"
              className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 pl-11 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-gold-500 hover:text-gold-400 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold-500/20 disabled:opacity-70 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-navy-700/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-navy-800 px-4 text-sm text-slate-500">or</span>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onRegister}
              className="text-gold-500 hover:text-gold-400 font-medium transition-colors"
            >
              Open Demat Account
            </button>
          </p>
        </div>
      </form>

      {/* Footer */}
      <div className="bg-navy-900/50 px-6 py-3 border-t border-navy-700/50">
        <p className="text-xs text-slate-500 text-center">
          🔒 Secured by 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
