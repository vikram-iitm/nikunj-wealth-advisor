import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  User,
  Building,
  Camera,
  Video,
  FileCheck,
  CheckCircle,
  ArrowRight,
  Loader2,
  Shield,
  Upload,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export type KYCStep =
  | 'pan'
  | 'aadhaar'
  | 'aadhaar-otp'
  | 'personal'
  | 'photo'
  | 'bank'
  | 'documents'
  | 'video-kyc'
  | 'esign'
  | 'success';

interface KYCFlowProps {
  currentStep: KYCStep;
  onStepComplete: (step: KYCStep, data: any) => void;
  onBack?: () => void;
  formData?: any;
  isCompleted?: boolean;
}

const KYCFlow: React.FC<KYCFlowProps> = ({ currentStep, onStepComplete, formData = {}, isCompleted = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Step configurations
  const steps: KYCStep[] = ['pan', 'aadhaar', 'aadhaar-otp', 'personal', 'photo', 'bank', 'documents', 'esign', 'success'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  // Show completed state for non-success steps when user is logged in
  if (isCompleted && currentStep !== 'success') {
    const stepLabels: Record<string, string> = {
      'pan': 'PAN Verified',
      'aadhaar': 'Aadhaar Linked',
      'aadhaar-otp': 'OTP Verified',
      'personal': 'Details Confirmed',
      'photo': 'Photo Captured',
      'bank': 'Bank Verified',
      'documents': 'Documents Uploaded',
      'esign': 'Agreement Signed',
    };
    return (
      <div className="bg-navy-800/90 rounded-xl border border-green-500/30 overflow-hidden shadow-xl w-full max-w-md">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-400">{stepLabels[currentStep] || 'Step Completed'}</p>
            <p className="text-xs text-slate-500">This step has been completed</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    onStepComplete(currentStep, data);
  };

  // PAN Verification Screen
  const PANScreen = () => {
    const [pan, setPan] = useState(formData.pan || '');
    const [name, setName] = useState(formData.name || '');

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">PAN Verification</h3>
            <p className="text-sm text-slate-400">Enter your PAN details</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">PAN Number</label>
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
            placeholder="ABCDE1234F"
            className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 uppercase tracking-wider font-mono text-lg"
            maxLength={10}
          />
          <p className="text-xs text-slate-500 mt-1">Format: 5 letters + 4 digits + 1 letter</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name (as per PAN)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <button
          onClick={() => handleSubmit({ pan, name })}
          disabled={pan.length !== 10 || !name || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify PAN <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Aadhaar Number Screen
  const AadhaarScreen = () => {
    const [aadhaar, setAadhaar] = useState('');

    const formatAadhaar = (value: string) => {
      const digits = value.replace(/\D/g, '').slice(0, 12);
      return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Aadhaar Verification</h3>
            <p className="text-sm text-slate-400">Link your Aadhaar for e-KYC</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            An OTP will be sent to your Aadhaar-linked mobile number
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Aadhaar Number</label>
          <input
            type="text"
            value={formatAadhaar(aadhaar)}
            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
            placeholder="XXXX XXXX XXXX"
            className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-4 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 text-center tracking-[0.3em] font-mono text-xl"
            maxLength={14}
          />
        </div>

        <button
          onClick={() => handleSubmit({ aadhaar: aadhaar.replace(/\s/g, '') })}
          disabled={aadhaar.length !== 12 || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <Smartphone className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Aadhaar OTP Screen
  const AadhaarOTPScreen = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(30);

    React.useEffect(() => {
      if (resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
      if (value.length <= 1 && /^\d*$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
          const nextInput = document.getElementById(`otp-${index + 1}`);
          nextInput?.focus();
        }
      }
    };

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Enter OTP</h3>
            <p className="text-sm text-slate-400">Sent to Aadhaar-linked mobile</p>
          </div>
        </div>

        <div className="bg-navy-900/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400">OTP sent to mobile ending with</p>
          <p className="text-lg font-mono text-white">XXXXXX7890</p>
        </div>

        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-14 bg-navy-900/50 border border-navy-600/50 rounded-lg text-white text-center text-xl font-mono focus:outline-none focus:border-gold-500/50"
              maxLength={1}
            />
          ))}
        </div>

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-slate-500">Resend OTP in {resendTimer}s</p>
          ) : (
            <button
              onClick={() => setResendTimer(30)}
              className="text-sm text-gold-500 flex items-center gap-1 mx-auto hover:text-gold-400"
            >
              <RefreshCw className="w-4 h-4" /> Resend OTP
            </button>
          )}
        </div>

        <button
          onClick={() => handleSubmit({ otp: otp.join('') })}
          disabled={otp.some(d => !d) || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify OTP <CheckCircle className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Personal Details Screen
  const PersonalScreen = () => {
    const [email, setEmail] = useState(formData.email || '');
    const [mobile, setMobile] = useState(formData.mobile || '');
    const [dob, setDob] = useState(formData.dob || '');
    const [gender, setGender] = useState(formData.gender || '');

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Personal Details</h3>
            <p className="text-sm text-slate-400">Fetched from Aadhaar</p>
          </div>
        </div>

        {/* Auto-filled from Aadhaar */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-xs text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Details verified from Aadhaar
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Full Name</label>
            <div className="bg-navy-900/30 border border-navy-700/50 rounded-lg py-2.5 px-3 text-white">
              {formData.name || 'Rahul Sharma'}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-gold-500/50"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Mobile Number</label>
            <div className="flex">
              <span className="bg-navy-700/50 border border-navy-600/50 rounded-l-lg py-2.5 px-3 text-slate-400">+91</span>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="flex-1 bg-navy-900/50 border border-navy-600/50 border-l-0 rounded-r-lg py-2.5 px-3 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSubmit({ email, mobile, dob, gender })}
          disabled={!email || !mobile || !dob || !gender || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Photo/Selfie Screen
  const PhotoScreen = () => {
    const [photoTaken, setPhotoTaken] = useState(false);

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <Camera className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Photo Verification</h3>
            <p className="text-sm text-slate-400">Take a selfie for verification</p>
          </div>
        </div>

        <div className="bg-navy-900/50 rounded-xl p-4 text-center">
          {!photoTaken ? (
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto bg-navy-700/50 rounded-full flex items-center justify-center border-4 border-dashed border-navy-600">
                <Camera className="w-16 h-16 text-slate-500" />
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <p>• Ensure good lighting</p>
                <p>• Face the camera directly</p>
                <p>• Remove glasses if wearing</p>
              </div>
              <button
                onClick={() => setPhotoTaken(true)}
                className="px-6 py-3 rounded-lg bg-gold-500/20 text-gold-500 font-medium flex items-center gap-2 mx-auto hover:bg-gold-500/30 transition-all"
              >
                <Camera className="w-5 h-5" /> Take Selfie
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-40 h-40 mx-auto bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-full flex items-center justify-center border-4 border-green-500">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <p className="text-green-400 font-medium">Photo captured successfully!</p>
              <button
                onClick={() => setPhotoTaken(false)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Retake Photo
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => handleSubmit({ photoTaken: true })}
          disabled={!photoTaken || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Bank Details Screen
  const BankScreen = () => {
    const [accountNo, setAccountNo] = useState('');
    const [confirmAccountNo, setConfirmAccountNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [bankName, setBankName] = useState('');

    const validateIFSC = (code: string) => {
      if (code.length >= 4) {
        // Simulate bank name fetch
        const banks: Record<string, string> = {
          'HDFC': 'HDFC Bank',
          'ICIC': 'ICICI Bank',
          'SBIN': 'State Bank of India',
          'AXIS': 'Axis Bank',
          'KOTK': 'Kotak Mahindra Bank',
        };
        setBankName(banks[code.slice(0, 4)] || '');
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <Building className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Bank Account Details</h3>
            <p className="text-sm text-slate-400">For fund transfers</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Account Number</label>
          <input
            type="password"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter account number"
            className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Confirm Account Number</label>
          <input
            type="text"
            value={confirmAccountNo}
            onChange={(e) => setConfirmAccountNo(e.target.value.replace(/\D/g, ''))}
            placeholder="Re-enter account number"
            className={`w-full bg-navy-900/50 border rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none font-mono ${
              confirmAccountNo && confirmAccountNo !== accountNo
                ? 'border-red-500/50'
                : 'border-navy-600/50 focus:border-gold-500/50'
            }`}
          />
          {confirmAccountNo && confirmAccountNo !== accountNo && (
            <p className="text-xs text-red-400 mt-1">Account numbers don't match</p>
          )}
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">IFSC Code</label>
          <input
            type="text"
            value={ifsc}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().slice(0, 11);
              setIfsc(val);
              validateIFSC(val);
            }}
            placeholder="HDFC0001234"
            className="w-full bg-navy-900/50 border border-navy-600/50 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 uppercase font-mono"
          />
        </div>

        {bankName && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">{bankName}</span>
          </div>
        )}

        <button
          onClick={() => handleSubmit({ accountNo, ifsc, bankName })}
          disabled={!accountNo || accountNo !== confirmAccountNo || ifsc.length !== 11 || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Bank <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Documents Upload Screen
  const DocumentsScreen = () => {
    const [panUploaded, setPanUploaded] = useState(false);
    const [signUploaded, setSignUploaded] = useState(false);

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Upload Documents</h3>
            <p className="text-sm text-slate-400">Required for verification</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* PAN Card */}
          <div
            onClick={() => setPanUploaded(true)}
            className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${
              panUploaded ? 'border-green-500 bg-green-500/10' : 'border-navy-600 hover:border-gold-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className={`w-8 h-8 ${panUploaded ? 'text-green-500' : 'text-slate-500'}`} />
                <div>
                  <p className="text-sm font-medium text-white">PAN Card</p>
                  <p className="text-xs text-slate-500">JPG, PNG (Max 2MB)</p>
                </div>
              </div>
              {panUploaded ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Upload className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>

          {/* Signature */}
          <div
            onClick={() => setSignUploaded(true)}
            className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${
              signUploaded ? 'border-green-500 bg-green-500/10' : 'border-navy-600 hover:border-gold-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className={`w-8 h-8 ${signUploaded ? 'text-green-500' : 'text-slate-500'}`} />
                <div>
                  <p className="text-sm font-medium text-white">Signature</p>
                  <p className="text-xs text-slate-500">Sign on white paper</p>
                </div>
              </div>
              {signUploaded ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Upload className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSubmit({ panUploaded, signUploaded })}
          disabled={!panUploaded || !signUploaded || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // e-Sign Screen
  const ESignScreen = () => {
    const [agreed, setAgreed] = useState(false);

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">e-Sign Agreement</h3>
            <p className="text-sm text-slate-400">Digitally sign your application</p>
          </div>
        </div>

        <div className="bg-navy-900/50 rounded-lg p-4 max-h-48 overflow-y-auto text-xs text-slate-400 space-y-2">
          <p className="font-medium text-slate-300">Terms & Conditions</p>
          <p>I hereby declare that the information provided is true and accurate. I authorize Nikunj Stock Brokers Limited to open a Demat and Trading account on my behalf.</p>
          <p>I understand and accept the risks involved in securities trading. I confirm that I am not a politically exposed person (PEP).</p>
          <p>I agree to the brokerage charges, terms of service, and privacy policy of Nikunj Stock Brokers Limited.</p>
          <p>SEBI Registration: INZ000169335 | NSE: 06913 | BSE: 6645</p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-navy-600 bg-navy-700 text-gold-500 focus:ring-gold-500/20"
          />
          <span className="text-sm text-slate-300">
            I have read and agree to the <span className="text-gold-500">Terms & Conditions</span> and authorize Aadhaar e-Sign
          </span>
        </label>

        <button
          onClick={() => handleSubmit({ agreed })}
          disabled={!agreed || isLoading}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Complete e-Sign <CheckCircle className="w-5 h-5" /></>}
        </button>
      </div>
    );
  };

  // Success Screen
  const SuccessScreen = () => {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">Account Created!</h3>
          <p className="text-slate-400 mt-1">Your Demat & Trading account is ready</p>
        </div>

        <div className="bg-navy-900/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Client ID</span>
            <span className="font-mono text-gold-500">NK{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Account Type</span>
            <span className="text-white">Demat + Trading</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Depository</span>
            <span className="text-white">NSDL</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">Login credentials sent to your registered email & mobile</p>

        <button
          onClick={() => handleSubmit({ complete: true })}
          className="w-full py-3.5 rounded-lg gradient-gold text-navy-900 font-semibold flex items-center justify-center gap-2 transition-all"
        >
          Start Trading <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'pan': return <PANScreen />;
      case 'aadhaar': return <AadhaarScreen />;
      case 'aadhaar-otp': return <AadhaarOTPScreen />;
      case 'personal': return <PersonalScreen />;
      case 'photo': return <PhotoScreen />;
      case 'bank': return <BankScreen />;
      case 'documents': return <DocumentsScreen />;
      case 'esign': return <ESignScreen />;
      case 'success': return <SuccessScreen />;
      default: return <PANScreen />;
    }
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-md">
      {/* Progress Bar */}
      {currentStep !== 'success' && (
        <div className="bg-navy-900/50 px-4 py-3 border-b border-navy-700/50">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Account Opening</span>
            <span>{currentIndex + 1} of {steps.length - 1}</span>
          </div>
          <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};

export default KYCFlow;
