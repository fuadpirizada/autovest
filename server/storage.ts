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
  getUsers(): Promise<User[]>;
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
  
  sessionStore: any; // Express session store
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
  sessionStore: any; // Express session store

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
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
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
      balance: 0,
      fullName: insertUser.fullName || null
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
    const newPackage: Package = { 
      id,
      name: pkg.name,
      description: pkg.description || null,
      tier: pkg.tier,
      weeklyReturn: pkg.weeklyReturn,
      minInvestment: pkg.minInvestment,
      imageUrl: pkg.imageUrl || null,
      isActive: true
    };
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
      id,
      date: now,
      type: transaction.type,
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description || null,
      status: transaction.status || "completed",
      investmentId: transaction.investmentId || null
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
        name: "Starter Package",
        description: "Begin your investment journey with just $1. Perfect for beginners.",
        tier: "Basic",
        weeklyReturn: 0.8,
        minInvestment: 1,
        imageUrl: "https://images.unsplash.com/photo-1582639510494-c80b5de9f148?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Economy Package",
        description: "Entry level investment with steady returns and low commitment.",
        tier: "Economy",
        weeklyReturn: 1.2,
        minInvestment: 100,
        imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Premium Package",
        description: "Mid-range portfolio with enhanced returns and balanced risk.",
        tier: "Premium",
        weeklyReturn: 1.5,
        minInvestment: 500,
        imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Luxury Package",
        description: "High-end portfolio with premium returns and exclusive benefits.",
        tier: "Luxury",
        weeklyReturn: 2.0,
        minInvestment: 2000,
        imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        isActive: true
      },
      {
        name: "Supercar Package",
        description: "Elite portfolio with maximum returns for serious investors.",
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
