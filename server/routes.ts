import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertInvestmentSchema, insertTransactionSchema } from "@shared/schema";
import Stripe from "stripe";

// Initialize Stripe with a fallback for development without keys
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Get all packages
  app.get("/api/packages", async (req, res) => {
    const packages = await storage.getPackages();
    res.json(packages);
  });

  // Get package by ID
  app.get("/api/packages/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    const pkg = await storage.getPackage(id);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(pkg);
  });

  // Admin: Create package (admin only)
  app.post("/api/packages", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      const pkg = await storage.createPackage(req.body);
      res.status(201).json(pkg);
    } catch (error) {
      res.status(400).json({ message: "Invalid package data" });
    }
  });

  // Admin: Update package (admin only)
  app.put("/api/packages/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid package ID" });
    }

    try {
      const updatedPackage = await storage.updatePackage(id, req.body);
      if (!updatedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      res.json(updatedPackage);
    } catch (error) {
      res.status(400).json({ message: "Invalid package data" });
    }
  });

  // Get user investments
  app.get("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const investments = await storage.getInvestments(req.user?.id);
    res.json(investments);
  });

  // Admin: Get all investments (admin only)
  app.get("/api/admin/investments", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const investments = await storage.getInvestments();
    res.json(investments);
  });

  // Create a new investment
  app.post("/api/investments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const data = insertInvestmentSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // Verify package exists
      const pkg = await storage.getPackage(data.packageId);
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }

      // Verify investment amount meets minimum
      if (data.amount < pkg.minInvestment) {
        return res.status(400).json({ 
          message: `Minimum investment for this package is $${pkg.minInvestment}` 
        });
      }

      // Check if user has enough balance
      if (req.user.balance < data.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create investment
      const investment = await storage.createInvestment(data);

      // Create transaction record for the investment
      await storage.createTransaction({
        userId: req.user.id,
        investmentId: investment.id,
        type: "deposit",
        amount: -data.amount,
        status: "completed",
        description: `Investment in ${pkg.name}`
      });

      res.status(201).json(investment);
    } catch (error) {
      res.status(400).json({ message: "Invalid investment data" });
    }
  });

  // Get user transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const transactions = await storage.getTransactions(req.user?.id);
    res.json(transactions);
  });

  // Admin: Get all transactions (admin only)
  app.get("/api/admin/transactions", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const transactions = await storage.getTransactions();
    res.json(transactions);
  });

  // Create a new transaction (deposit or withdrawal)
  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const data = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      // For withdrawals, verify user has enough balance
      if (data.type === "withdrawal" && req.user.balance < data.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const transaction = await storage.createTransaction(data);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Get list of all users (admin only)
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Get all users
    const users = await storage.getUsers();
    res.json(users);
  });

  // Stripe payment intent creation endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }

      if (!stripe) {
        // For development without Stripe keys
        return res.status(503).json({ 
          error: "Stripe integration not available", 
          message: "Stripe API keys not configured. Please add your Stripe API keys to use this feature." 
        });
      }

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id.toString(),
          userEmail: req.user.email
        }
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe webhook for handling payment events
  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Stripe integration not available" });
    }

    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (!endpointSecret) {
        // For development without webhook secret
        event = req.body;
      } else {
        // Verify webhook signature and extract event
        event = stripe.webhooks.constructEvent(
          req.body, 
          sig, 
          endpointSecret
        );
      }

      // Handle successful payment
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const userId = parseInt(paymentIntent.metadata.userId);
        const amount = paymentIntent.amount / 100; // Convert from cents

        // Add funds to user account
        await storage.updateUserBalance(userId, amount);
        
        // Create transaction record
        await storage.createTransaction({
          userId,
          type: "deposit",
          amount,
          status: "completed",
          description: "Payment via Stripe"
        });
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
