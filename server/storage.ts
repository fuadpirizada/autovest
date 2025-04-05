import { 
  users, User, InsertUser, 
  packages, Package, InsertPackage,
  investments, Investment, InsertInvestment,
  transactions, Transaction, InsertTransaction 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, amount: number): Promise<void>;
  
  // Package methods
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<Package>): Promise<Package | undefined>;
  
  // Investment methods
  getInvestments(userId?: number): Promise<Investment[]>;
  getInvestment(id: number): Promise<Investment | undefined>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, investment: Partial<Investment>): Promise<Investment | undefined>;
  
  // Transaction methods
  getTransactions(userId?: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private investments: Map<number, Investment>;
  private transactions: Map<number, Transaction>;
  private userIdCounter: number;
  private packageIdCounter: number;
  private investmentIdCounter: number;
  private transactionIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.investments = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.packageIdCounter = 1;
    this.investmentIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with default packages
    this.initDefaultPackages();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now, 
      role: "user",
      balance: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.balance += amount;
      this.users.set(userId, user);
    }
  }

  // Package methods
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = this.packageIdCounter++;
    const newPackage: Package = { ...pkg, id, isActive: true };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async updatePackage(id: number, pkg: Partial<Package>): Promise<Package | undefined> {
    const existingPackage = await this.getPackage(id);
    if (!existingPackage) return undefined;

    const updatedPackage = { ...existingPackage, ...pkg };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  // Investment methods
  async getInvestments(userId?: number): Promise<Investment[]> {
    const allInvestments = Array.from(this.investments.values());
    return userId 
      ? allInvestments.filter(inv => inv.userId === userId)
      : allInvestments;
  }

  async getInvestment(id: number): Promise<Investment | undefined> {
    return this.investments.get(id);
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const id = this.investmentIdCounter++;
    const now = new Date();
    
    // Calculate end date based on duration in months
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + investment.durationMonths);
    
    const newInvestment: Investment = {
      ...investment,
      id,
      startDate: now,
      endDate,
      isActive: true,
      totalEarned: 0
    };
    
    this.investments.set(id, newInvestment);
    return newInvestment;
  }

  async updateInvestment(id: number, partialInvestment: Partial<Investment>): Promise<Investment | undefined> {
    const existingInvestment = await this.getInvestment(id);
    if (!existingInvestment) return undefined;

    const updatedInvestment = { ...existingInvestment, ...partialInvestment };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Transaction methods
  async getTransactions(userId?: number): Promise<Transaction[]> {
    const allTransactions = Array.from(this.transactions.values());
    return userId 
      ? allTransactions.filter(tx => tx.userId === userId)
      : allTransactions;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      date: now
    };
    
    this.transactions.set(id, newTransaction);
    
    // Update user balance
    if (transaction.type === 'deposit' || transaction.type === 'return') {
      await this.updateUserBalance(transaction.userId, transaction.amount);
    } else if (transaction.type === 'withdrawal') {
      await this.updateUserBalance(transaction.userId, -transaction.amount);
    }
    
    return newTransaction;
  }

  // Initialize default packages
  private async initDefaultPackages() {
    const packages = [
      {
        name: "Economy Tier",
        description: "Entry level investment with steady returns.",
        tier: "Economy",
        weeklyReturn: 1.2,
        minInvestment: 100,
        imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Premium Tier",
        description: "Mid-range portfolio with enhanced returns.",
        tier: "Premium",
        weeklyReturn: 1.5,
        minInvestment: 500,
        imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Luxury Tier",
        description: "High-end portfolio with premium returns.",
        tier: "Luxury",
        weeklyReturn: 2.0,
        minInvestment: 2000,
        imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Supercar Tier",
        description: "Elite portfolio with maximum returns.",
        tier: "Supercar",
        weeklyReturn: 2.5,
        minInvestment: 5000,
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      }
    ];

    for (const pkg of packages) {
      await this.createPackage(pkg);
    }
  }
}

export const storage = new MemStorage();
