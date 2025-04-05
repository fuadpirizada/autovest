import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Package } from "@shared/schema";
import GlassCard from "@/components/ui/glass-card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import InvestmentCard from "@/components/ui/investment-card";

const MarketplacePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [duration, setDuration] = useState<string>("6");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const investMutation = useMutation({
    mutationFn: async (data: { packageId: number; amount: number; durationMonths: number }) => {
      const res = await apiRequest("POST", "/api/investments", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Investment successful",
        description: `You have successfully invested in ${selectedPackage?.name}`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Investment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInvest = () => {
    if (!selectedPackage) return;
    
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount < selectedPackage.minInvestment) {
      toast({
        title: "Invalid amount",
        description: `Minimum investment for this package is $${selectedPackage.minInvestment}`,
        variant: "destructive",
      });
      return;
    }

    if (!user || user.balance < amount) {
      toast({
        title: "Insufficient balance",
        description: "Please deposit funds to your account first",
        variant: "destructive",
      });
      return;
    }

    investMutation.mutate({
      packageId: selectedPackage.id,
      amount,
      durationMonths: parseInt(duration),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Investment Marketplace</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our curated collection of luxury car investment packages
        </p>
      </div>

      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Your Balance</h2>
            <p className="text-3xl font-semibold">${user?.balance.toFixed(2)}</p>
          </div>
          <div>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-700">
              Add Funds
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages?.map((pkg) => (
          <InvestmentCard
            key={pkg.id}
            investmentPackage={pkg}
            onInvest={() => {
              setSelectedPackage(pkg);
              setInvestmentAmount(pkg.minInvestment.toString());
              setIsDialogOpen(true);
            }}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedPackage?.name}</DialogTitle>
            <DialogDescription>
              Minimum investment: ${selectedPackage?.minInvestment}
              <br />
              Weekly return: {selectedPackage?.weeklyReturn}%
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                min={selectedPackage?.minInvestment}
                step="100"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Select
                value={duration}
                onValueChange={setDuration}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted p-3 rounded-md mt-2">
              <div className="flex justify-between mb-1">
                <span>Weekly Return:</span>
                <span>${(parseFloat(investmentAmount || "0") * (selectedPackage?.weeklyReturn || 0) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Total Return (non-compound):</span>
                <span>
                  ${(parseFloat(investmentAmount || "0") * (selectedPackage?.weeklyReturn || 0) / 100 * parseInt(duration) * 4.33).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleInvest}
              disabled={investMutation.isPending}
              className="bg-gradient-to-r from-amber-500 to-amber-700"
            >
              {investMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketplacePage;
