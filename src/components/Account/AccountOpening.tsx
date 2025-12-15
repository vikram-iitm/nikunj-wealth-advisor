import React from 'react';
import { CheckCircle, Shield, User, Phone, Mail, Calendar, CreditCard, Building, Users, MapPin, FileCheck } from 'lucide-react';
import { AccountOpeningStep, AccountFormData } from '../../types';

interface AccountOpeningProps {
  currentStep: AccountOpeningStep;
  formData: Partial<AccountFormData>;
  onInputChange: (field: keyof AccountFormData, value: string) => void;
  onSubmitStep: () => void;
  onVerifyOTP: (otp: string) => void;
}

const STEPS_CONFIG: Record<AccountOpeningStep, {
  icon: React.FC<{ className?: string }>;
  title: string;
  placeholder: string;
  type: string;
  validation?: RegExp;
  mask?: (value: string) => string;
}> = {
  name: {
    icon: User,
    title: 'Full Name (as per PAN)',
    placeholder: 'Enter your full name',
    type: 'text',
  },
  pan: {
    icon: CreditCard,
    title: 'PAN Number',
    placeholder: 'ABCDE1234F',
    type: 'text',
    validation: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    mask: (v) => v.toUpperCase().slice(0, 10),
  },
  mobile: {
    icon: Phone,
    title: 'Mobile Number',
    placeholder: '9876543210',
    type: 'tel',
    validation: /^[6-9]\d{9}$/,
    mask: (v) => v.replace(/\D/g, '').slice(0, 10),
  },
  otp: {
    icon: Shield,
    title: 'OTP Verification',
    placeholder: 'Enter 6-digit OTP',
    type: 'text',
    validation: /^\d{6}$/,
    mask: (v) => v.replace(/\D/g, '').slice(0, 6),
  },
  email: {
    icon: Mail,
    title: 'Email Address',
    placeholder: 'example@email.com',
    type: 'email',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  dob: {
    icon: Calendar,
    title: 'Date of Birth',
    placeholder: 'DD/MM/YYYY',
    type: 'date',
  },
  aadhaar: {
    icon: Shield,
    title: 'Aadhaar Number',
    placeholder: 'XXXX XXXX 1234',
    type: 'text',
    validation: /^\d{12}$/,
    mask: (v) => v.replace(/\D/g, '').slice(0, 12),
  },
  bank: {
    icon: Building,
    title: 'Bank Account Details',
    placeholder: 'Account Number',
    type: 'text',
  },
  nominee: {
    icon: Users,
    title: 'Nominee Details',
    placeholder: 'Nominee Name',
    type: 'text',
  },
  address: {
    icon: MapPin,
    title: 'Address',
    placeholder: 'Your complete address',
    type: 'text',
  },
  agreement: {
    icon: FileCheck,
    title: 'Agreement & e-Sign',
    placeholder: '',
    type: 'checkbox',
  },
  complete: {
    icon: CheckCircle,
    title: 'Account Created!',
    placeholder: '',
    type: 'none',
  },
};

const AccountOpening: React.FC<AccountOpeningProps> = ({
  currentStep,
  formData,
  onInputChange,
  onSubmitStep,
  onVerifyOTP,
}) => {
  const config = STEPS_CONFIG[currentStep];
  const Icon = config.icon;

  const [inputValue, setInputValue] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const handleInputChange = (value: string) => {
    const processed = config.mask ? config.mask(value) : value;
    setInputValue(processed);
    if (config.validation) {
      setIsValid(config.validation.test(processed) || processed === '');
    }
  };

  const handleSubmit = () => {
    if (currentStep === 'otp') {
      onVerifyOTP(inputValue);
    } else {
      const fieldMap: Partial<Record<AccountOpeningStep, keyof AccountFormData>> = {
        name: 'fullName',
        pan: 'pan',
        mobile: 'mobile',
        email: 'email',
        dob: 'dob',
        aadhaar: 'aadhaar',
        address: 'address',
      };
      const field = fieldMap[currentStep];
      if (field) {
        onInputChange(field, inputValue);
      }
      onSubmitStep();
    }
    setInputValue('');
  };

  // Progress calculation
  const steps: AccountOpeningStep[] = ['name', 'pan', 'mobile', 'otp', 'email', 'dob', 'aadhaar', 'bank', 'nominee', 'address', 'agreement', 'complete'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  if (currentStep === 'complete') {
    return (
      <div className="bg-navy-800/90 rounded-xl border border-green-500/30 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Account Created Successfully! 🎉</h3>
        <p className="text-slate-400 mb-4">
          Your Demat & Trading account has been set up. You can now start investing!
        </p>
        <div className="bg-navy-900/50 rounded-lg p-4 text-left">
          <p className="text-xs text-slate-500 mb-2">Account Details</p>
          <p className="text-sm text-slate-300">Client ID: <span className="font-mono text-gold-500">NK{Math.floor(100000 + Math.random() * 900000)}</span></p>
          <p className="text-sm text-slate-300">Name: <span className="text-white">{formData.fullName}</span></p>
          <p className="text-sm text-slate-300">PAN: <span className="font-mono">{formData.pan}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-1 bg-navy-700">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Step {currentIndex + 1} of {steps.length - 1}</p>
            <h4 className="font-medium text-white">{config.title}</h4>
          </div>
        </div>

        {/* Input Field */}
        {config.type !== 'checkbox' && config.type !== 'none' && (
          <div className="mb-4">
            <input
              type={config.type}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={config.placeholder}
              className={`w-full bg-navy-700/50 border rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none transition-colors ${
                isValid ? 'border-navy-600/30 focus:border-gold-500/50' : 'border-red-500/50'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && isValid && inputValue && handleSubmit()}
            />
            {!isValid && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid {config.title.toLowerCase()}</p>
            )}
          </div>
        )}

        {/* Agreement Checkbox */}
        {config.type === 'checkbox' && (
          <div className="mb-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500/20"
                onChange={(e) => setInputValue(e.target.checked ? 'agreed' : '')}
              />
              <span className="text-sm text-slate-300">
                I agree to the Terms & Conditions and authorize Nikunj Stock Brokers Limited to open a
                Demat and Trading account on my behalf.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500/20"
                onChange={(e) => {}}
              />
              <span className="text-sm text-slate-300">
                I consent to receiving communications via SMS, Email, and WhatsApp.
              </span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!inputValue && config.type !== 'none'}
          className="w-full py-3 rounded-lg gradient-gold text-navy-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold-500/20 transition-all"
        >
          {currentStep === 'otp' ? 'Verify OTP' : currentStep === 'agreement' ? 'Complete Registration' : 'Continue'}
        </button>

        {/* OTP Resend */}
        {currentStep === 'otp' && (
          <p className="text-center text-xs text-slate-500 mt-3">
            Didn't receive OTP? <button className="text-gold-500 hover:underline">Resend</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountOpening;
