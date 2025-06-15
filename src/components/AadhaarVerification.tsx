
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { Shield, Phone } from 'lucide-react';

interface AadhaarVerificationProps {
  onVerificationComplete: (aadhaarData: any) => void;
  onCancel: () => void;
}

const AadhaarVerification = ({ onVerificationComplete, onCancel }: AadhaarVerificationProps) => {
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');

  const formatAadhaarNumber = (value: string) => {
    // Remove all non-digits and limit to 12 digits
    const digits = value.replace(/\D/g, '').slice(0, 12);
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, '');
    
    if (cleanAadhaar.length !== 12) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Mock API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response with masked phone number
      const mockMaskedPhone = "XXXXXX" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setMaskedPhone(mockMaskedPhone);
      
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${mockMaskedPhone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Mock API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification response
      const mockAadhaarData = {
        aadhaarNumber: aadhaarNumber.replace(/\s/g, ''),
        name: "John Doe", // This would come from actual verification
        phone: maskedPhone,
        verified: true
      };

      toast({
        title: "Verification Successful",
        description: "Your Aadhaar has been verified successfully",
      });

      onVerificationComplete(mockAadhaarData);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Aadhaar Verification</h1>
          <p className="text-gray-600">Secure identity verification for Indian citizens</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'aadhaar' ? 'Enter Aadhaar Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'aadhaar' 
                ? 'We\'ll send an OTP to your registered mobile number'
                : `Enter the 6-digit code sent to ${maskedPhone}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'aadhaar' ? (
              <form onSubmit={handleAadhaarSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(formatAadhaarNumber(e.target.value))}
                    maxLength={14} // 12 digits + 2 spaces
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <Phone className="h-4 w-4 mr-2" />
                  Code sent to {maskedPhone}
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('aadhaar')}
                  >
                    Back
                  </Button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => handleAadhaarSubmit(new Event('submit') as any)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AadhaarVerification;
