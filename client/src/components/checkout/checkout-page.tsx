import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import CheckoutForm from "./checkout-form";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";

// This is where we will initialize the Stripe instance
// The key will be read from environment variables when available
// For now, we'll conditionally show a message if not configured
let stripePromise: Promise<any> | null = null;
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
}

interface CheckoutPageProps {
  amount: number;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CheckoutPage({ 
  amount, 
  title = "Complete your payment",
  description = "Securely add funds to your account",
  onSuccess,
  onCancel
}: CheckoutPageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    async function createPaymentIntent() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest("POST", "/api/create-payment-intent", { amount });
        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.message || data.error || "Failed to create payment intent");
        }
      } catch (error: any) {
        console.error("Payment intent error:", error);
        setError(error.message || "Failed to connect to payment service");
      } finally {
        setIsLoading(false);
      }
    }

    createPaymentIntent();
  }, [user, amount, setLocation]);

  // Show appropriate messages based on stripe configuration and loading state
  if (!stripePromise) {
    return (
      <GlassCard className="p-6 max-w-md mx-auto">
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold mb-4">Payment Not Available</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Stripe payment integration is not configured. Please contact the administrator.
          </p>
        </div>
      </GlassCard>
    );
  }

  if (isLoading) {
    return (
      <GlassCard className="p-6 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Preparing payment form...</p>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-6 max-w-md mx-auto">
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Error</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          {onCancel && (
            <button 
              className="text-blue-600 hover:underline" 
              onClick={onCancel}
            >
              Go back
            </button>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {clientSecret && (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: { 
                theme: 'stripe',
                variables: {
                  colorPrimary: '#f59e0b', // amber-500
                }
              }
            }}
          >
            <CheckoutForm 
              amount={amount} 
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>
        )}
      </CardContent>
    </GlassCard>
  );
}