import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, ArrowLeft } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import CheckoutPage from "@/components/checkout/checkout-page";

export default function DepositPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(500);
  const [showCheckout, setShowCheckout] = useState(false);

  // Predefined amount options
  const amountOptions = [100, 500, 1000, 5000, 10000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value);
  };

  const handleProceedToPayment = () => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
      });
      return;
    }
    
    setShowCheckout(true);
  };

  const handlePaymentCancel = () => {
    setShowCheckout(false);
  };

  const handlePaymentSuccess = () => {
    // Redirect to dashboard after successful payment
    toast({
      title: "Deposit successful",
      description: `$${amount.toFixed(2)} has been added to your account`,
    });
    setLocation("/dashboard");
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto py-16 px-4">
        <GlassCard className="max-w-md mx-auto p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Redirecting to login...</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Add Funds to Your Account</h1>

        {showCheckout ? (
          <CheckoutPage 
            amount={amount}
            title="Complete your deposit"
            description={`You're adding $${amount.toFixed(2)} to your account`}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <GlassCard className="p-6">
            <div className="mb-8">
              <Label htmlFor="deposit-amount" className="text-lg font-medium mb-3 block">
                Enter Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="deposit-amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  min={1}
                  step={1}
                  className="pl-8 text-lg py-6"
                />
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-lg font-medium mb-3 block">
                Quick Select
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {amountOptions.map((option) => (
                  <Button 
                    key={option}
                    variant={amount === option ? "default" : "outline"}
                    onClick={() => handlePredefinedAmount(option)}
                    className={amount === option ? "bg-gradient-to-r from-amber-500 to-amber-700" : ""}
                  >
                    ${option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleProceedToPayment}
                disabled={amount <= 0}
                className="bg-gradient-to-r from-amber-500 to-amber-700 px-8 py-6 text-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}