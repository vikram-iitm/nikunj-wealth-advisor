import { useState, useCallback } from 'react';
import { AccountOpeningStep, AccountFormData } from '../types';

const STEP_SEQUENCE: AccountOpeningStep[] = [
  'name',
  'pan',
  'mobile',
  'otp',
  'email',
  'dob',
  'aadhaar',
  'bank',
  'nominee',
  'address',
  'agreement',
  'complete',
];

export function useAccountOpening() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<AccountOpeningStep>('name');
  const [formData, setFormData] = useState<Partial<AccountFormData>>({});

  const startAccountOpening = useCallback(() => {
    setIsActive(true);
    setCurrentStep('name');
    setFormData({});
  }, []);

  const updateFormData = useCallback((field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
    if (currentIndex < STEP_SEQUENCE.length - 1) {
      setCurrentStep(STEP_SEQUENCE[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEP_SEQUENCE[currentIndex - 1]);
    }
  }, [currentStep]);

  const completeAccountOpening = useCallback(() => {
    setCurrentStep('complete');
  }, []);

  const resetAccountOpening = useCallback(() => {
    setIsActive(false);
    setCurrentStep('name');
    setFormData({});
  }, []);

  // Get AI message for current step
  const getStepMessage = useCallback((): string => {
    switch (currentStep) {
      case 'name':
        return `Great! Let's get your **Demat & Trading account** set up. I'll guide you through this step by step.\n\nFirst, what's your **full name** as it appears on your PAN card?`;
      case 'pan':
        return `Nice to meet you, **${formData.fullName}**! 👋\n\nNow, please share your **PAN number**. This is required for all securities transactions in India.`;
      case 'mobile':
        return `✓ **PAN verified!** I can see your name matches.\n\nNext, your **mobile number** for OTP verification. We'll send a 6-digit code.`;
      case 'otp':
        return `📱 I've sent a 6-digit OTP to **${formData.mobile?.slice(0, 2)}XXXXXX${formData.mobile?.slice(-2)}**.\n\nPlease enter the OTP to verify your mobile number.`;
      case 'email':
        return `✓ **Mobile verified!** Great.\n\nNow, please share your **email address**. We'll send important account updates here.`;
      case 'dob':
        return `Perfect! Now I need your **date of birth** for age verification. You must be 18+ to open a trading account.`;
      case 'aadhaar':
        return `✓ **Age verified!**\n\nPlease share your **12-digit Aadhaar number**. This helps us verify your identity and fetch your address.`;
      case 'bank':
        return `Almost there! 🎯\n\nPlease provide your **bank account details** for fund transfers. Enter your account number, IFSC code, and bank name.`;
      case 'nominee':
        return `For your safety, please add a **nominee** for your account. Enter the nominee's name and relationship.`;
      case 'address':
        return `Finally, please confirm your **address**. This will be used for communication and KYC purposes.`;
      case 'agreement':
        return `🎉 We're almost done!\n\nPlease review and accept the **Terms & Conditions** to complete your account opening.`;
      case 'complete':
        return `🎊 **Congratulations!** Your Demat & Trading account has been created successfully!\n\nYou can now start investing. Would you like to explore some stocks or view market trends?`;
      default:
        return '';
    }
  }, [currentStep, formData]);

  return {
    isActive,
    currentStep,
    formData,
    startAccountOpening,
    updateFormData,
    nextStep,
    previousStep,
    completeAccountOpening,
    resetAccountOpening,
    getStepMessage,
  };
}

export default useAccountOpening;
