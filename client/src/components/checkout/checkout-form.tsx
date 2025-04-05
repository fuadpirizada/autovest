import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  amount: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        // This point is only reached if there is an immediate error when
        // confirming the payment. Show error in your UI.
        setErrorMessage(error.message);
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message,
        });
      } else {
        // Payment succeeded!
        toast({
          title: "Payment successful",
          description: `Your payment of $${amount.toFixed(2)} was successful.`,
        });
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setErrorMessage(error.message);
      toast({
        variant: "destructive",
        title: "Payment error",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
          className="bg-gradient-to-r from-amber-500 to-amber-700 min-w-[100px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <>Pay ${amount.toFixed(2)}</>
          )}
        </Button>
      </div>
    </form>
  );
}