import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Helpers
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Shared in-memory storage for the demo version
class MemStorage {
  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.investments = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.packageIdCounter = 1;
    this.investmentIdCounter = 1;
    this.transactionIdCounter = 1;
    
    // Initialize with default data
    this.initDefaultPackages();
    this.createDefaultAdmin();
  }
  
  async initDefaultPackages() {
    const defaultPackages = [
      {
        name: "Economy Vehicle",
        description: "Entry-level investment with low risk and steady returns",
        price: 1000,
        returnRate: 5, // 5% monthly return
        durationMonths: 1,
        type: "vehicle",
        vehicleType: "economy",
        imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop",
        active: true,
        features: ["Low risk", "1-month lock period", "5% monthly ROI"]
      },
      {
        name: "Mid-Range Vehicle",
        description: "Balanced investment with moderate risk and returns",
        price: 5000,
        returnRate: 10, // 10% monthly return
        durationMonths: 3,
        type: "vehicle",
        vehicleType: "midrange",
        imageUrl: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=800&auto=format&fit=crop",
        active: true,
        features: ["Medium risk", "3-month lock period", "10% monthly ROI"]
      },
      {
        name: "Luxury Vehicle",
        description: "Premium investment with higher risk and exceptional returns",
        price: 10000,
        returnRate: 15, // 15% monthly return
        durationMonths: 6,
        type: "vehicle",
        vehicleType: "luxury",
        imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop",
        active: true,
        features: ["Higher risk", "6-month lock period", "15% monthly ROI"]
      },
      {
        name: "Ultra Luxury Vehicle",
        description: "Exclusive investment with significant returns for serious investors",
        price: 25000,
        returnRate: 20, // 20% monthly return
        durationMonths: 12,
        type: "vehicle",
        vehicleType: "ultraluxury",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
        active: true,
        features: ["Premium risk", "12-month lock period", "20% monthly ROI"]
      },
      {
        name: "Budget Investment",
        description: "Small investment with minimal risk for beginners",
        price: 100,
        returnRate: 3, // 3% monthly return
        durationMonths: 1,
        type: "vehicle",
        vehicleType: "budget",
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
        active: true,
        features: ["Minimal risk", "1-month lock period", "3% monthly ROI"]
      }
    ];
    
    for (const pkg of defaultPackages) {
      await this.createPackage(pkg);
    }
  }
  
  async createDefaultAdmin() {
    const adminUser = {
      username: "admin",
      password: await hashPassword("admin123"),
      email: "admin@autovest.com",
      fullName: "Admin User",
      role: "admin",
      balance: 50000,
      createdAt: new Date()
    };
    
    await this.createUser(adminUser);
  }
  
  async getUsers() {
    return Array.from(this.users.values());
  }
  
  async getUser(id) {
    return this.users.get(id);
  }
  
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      user => user.username === username
    );
  }
  
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName || null,
      role: insertUser.role || "user",
      balance: insertUser.balance || 0,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUserBalance(userId, amount) {
    const user = await this.getUser(userId);
    if (!user) return;
    
    user.balance += amount;
    this.users.set(userId, user);
  }
  
  async getPackages() {
    return Array.from(this.packages.values());
  }
  
  async getPackage(id) {
    return this.packages.get(id);
  }
  
  async createPackage(pkg) {
    const id = this.packageIdCounter++;
    const now = new Date();
    
    const newPackage = {
      id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      returnRate: pkg.returnRate,
      durationMonths: pkg.durationMonths,
      type: pkg.type || "vehicle",
      vehicleType: pkg.vehicleType,
      imageUrl: pkg.imageUrl,
      active: pkg.active !== undefined ? pkg.active : true,
      features: pkg.features || [],
      createdAt: now
    };
    
    this.packages.set(id, newPackage);
    return newPackage;
  }
  
  async updatePackage(id, pkg) {
    const existingPkg = await this.getPackage(id);
    if (!existingPkg) return undefined;
    
    const updatedPkg = { ...existingPkg, ...pkg };
    this.packages.set(id, updatedPkg);
    return updatedPkg;
  }
  
  async getInvestments(userId) {
    const investments = Array.from(this.investments.values());
    return userId ? investments.filter(inv => inv.userId === userId) : investments;
  }
  
  async getInvestment(id) {
    return this.investments.get(id);
  }
  
  async createInvestment(investment) {
    const id = this.investmentIdCounter++;
    const now = new Date();
    
    // Calculate end date based on package duration
    const pkg = await this.getPackage(investment.packageId);
    if (!pkg) throw new Error("Package not found");
    
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + pkg.durationMonths);
    
    const newInvestment = {
      id,
      userId: investment.userId,
      packageId: investment.packageId,
      amount: investment.amount,
      returnRate: pkg.returnRate,
      startDate: now,
      endDate,
      status: "active",
      createdAt: now
    };
    
    this.investments.set(id, newInvestment);
    
    // Deduct the amount from user's balance
    await this.updateUserBalance(investment.userId, -investment.amount);
    
    // Create a transaction record
    await this.createTransaction({
      userId: investment.userId,
      type: "investment",
      amount: -investment.amount,
      description: `Investment in ${pkg.name}`,
      status: "completed"
    });
    
    return newInvestment;
  }
  
  async updateInvestment(id, partialInvestment) {
    const investment = await this.getInvestment(id);
    if (!investment) return undefined;
    
    const updatedInvestment = { ...investment, ...partialInvestment };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }
  
  async getTransactions(userId) {
    const transactions = Array.from(this.transactions.values());
    return userId ? transactions.filter(tx => tx.userId === userId) : transactions;
  }
  
  async getTransaction(id) {
    return this.transactions.get(id);
  }
  
  async createTransaction(transaction) {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const newTransaction = {
      id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status || "pending",
      createdAt: now
    };
    
    this.transactions.set(id, newTransaction);
    
    // If this is a deposit and it's completed, update user balance
    if (transaction.type === "deposit" && transaction.status === "completed") {
      await this.updateUserBalance(transaction.userId, transaction.amount);
    }
    
    return newTransaction;
  }
}

// Create and export the storage instance
export const storage = new MemStorage();

// Handler for API requests
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Route handler
  try {
    // Get the API path
    const { url } = req;
    const path = url.split('/api')[1] || '/';
    
    // Main API routes
    if (path === '/') {
      return res.status(200).json({ message: 'AutoVest API is running' });
    }
    
    // Handle packages endpoints
    if (path === '/packages') {
      if (req.method === 'GET') {
        const packages = await storage.getPackages();
        return res.status(200).json(packages);
      }
    }
    
    if (path.startsWith('/package/')) {
      const id = parseInt(path.split('/package/')[1]);
      if (req.method === 'GET') {
        const pkg = await storage.getPackage(id);
        if (!pkg) {
          return res.status(404).json({ message: 'Package not found' });
        }
        return res.status(200).json(pkg);
      }
    }
    
    // Handle user endpoints
    if (path === '/user') {
      if (req.method === 'GET') {
        // Mock for vercel demo - in production this would check session
        const demoUser = {
          id: 1,
          username: 'demo_user',
          email: 'demo@example.com',
          fullName: 'Demo User',
          role: 'user',
          balance: 10000,
          createdAt: new Date()
        };
        
        return res.status(200).json(demoUser);
      }
    }
    
    // Fallback
    return res.status(404).json({ message: `API endpoint ${path} not found` });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}