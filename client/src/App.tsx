import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import MarketplacePage from "@/pages/marketplace-page";
import AdminPage from "@/pages/admin-page";
import DepositPage from "@/pages/deposit-page";
import InvestmentsPage from "@/pages/investments-page";
import PortfolioPage from "@/pages/portfolio-page";
import ReferralsPage from "@/pages/referrals-page";
import SupportPage from "@/pages/support-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/marketplace" component={MarketplacePage} />
      <ProtectedRoute path="/investments" component={InvestmentsPage} />
      <ProtectedRoute path="/portfolio" component={PortfolioPage} />
      <ProtectedRoute path="/referrals" component={ReferralsPage} />
      <Route path="/support" component={SupportPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <ProtectedRoute path="/deposit" component={DepositPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
