import express from 'express';
import session from 'express-session';
import passport from 'passport';
import MemoryStore from 'memorystore';
import { Strategy as LocalStrategy } from 'passport-local';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Create Express app
const app = express();
app.use(express.json());

// Production mode
process.env.NODE_ENV = 'production';

// In-memory storage implementation
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
    this.sessionStore = new (MemoryStore(session))({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with default data
    this.initDefaultPackages();
    this.createDefaultAdmin();
  }
  
  // Add implementation methods here (getUsers, createUser, etc.)
  // ...
  
  // Initialize with default packages
  async initDefaultPackages() {
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
      // Other packages...
    ];
    
    for (const pkg of packages) {
      this.createPackage(pkg);
    }
  }
  
  async createDefaultAdmin() {
    // Create default admin user if needed
    const adminExists = await this.getUserByUsername('admin');
    if (!adminExists) {
      const hashedPassword = await hashPassword('admin123');
      await this.createUser({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@autovest.com',
        fullName: 'Admin User',
        role: 'admin'
      });
    }
  }
  
  // Implement all required methods for the storage
  async getUsers() {
    return Array.from(this.users.values());
  }
  
  async getUser(id) {
    return this.users.get(id);
  }
  
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = new Date();
    const user = {
      ...insertUser,
      id,
      createdAt: now,
      role: insertUser.role || 'user',
      balance: 0,
      fullName: insertUser.fullName || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserBalance(userId, amount) {
    const user = await this.getUser(userId);
    if (user) {
      user.balance += amount;
      this.users.set(userId, user);
    }
  }
  
  async getPackages() {
    return Array.from(this.packages.values());
  }
  
  async getPackage(id) {
    return this.packages.get(id);
  }
  
  async createPackage(pkg) {
    const id = this.packageIdCounter++;
    const newPackage = {
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
  
  async updatePackage(id, pkg) {
    const existingPackage = await this.getPackage(id);
    if (!existingPackage) return undefined;
    const updatedPackage = { ...existingPackage, ...pkg };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }
  
  async getInvestments(userId) {
    const allInvestments = Array.from(this.investments.values());
    return userId ? allInvestments.filter((inv) => inv.userId === userId) : allInvestments;
  }
  
  async getInvestment(id) {
    return this.investments.get(id);
  }
  
  async createInvestment(investment) {
    const id = this.investmentIdCounter++;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + investment.durationMonths);
    const newInvestment = {
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
  
  async updateInvestment(id, partialInvestment) {
    const existingInvestment = await this.getInvestment(id);
    if (!existingInvestment) return undefined;
    const updatedInvestment = { ...existingInvestment, ...partialInvestment };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }
  
  async getTransactions(userId) {
    const allTransactions = Array.from(this.transactions.values());
    return userId ? allTransactions.filter((tx) => tx.userId === userId) : allTransactions;
  }
  
  async getTransaction(id) {
    return this.transactions.get(id);
  }
  
  async createTransaction(transaction) {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const newTransaction = {
      id,
      date: now,
      type: transaction.type,
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description || null,
      status: transaction.status || 'completed',
      investmentId: transaction.investmentId || null
    };
    this.transactions.set(id, newTransaction);
    
    // Update user balance based on transaction type
    if (transaction.type === 'deposit' || transaction.type === 'return') {
      await this.updateUserBalance(transaction.userId, transaction.amount);
    } else if (transaction.type === 'withdrawal') {
      await this.updateUserBalance(transaction.userId, -transaction.amount);
    }
    
    return newTransaction;
  }
}

// Initialize storage
const storage = new MemStorage();

// Auth helpers
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

// Setup session
const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'autovest-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    secure: process.env.NODE_ENV === 'production'
  },
  store: storage.sessionStore
};

app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Setup Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Basic route for testing
app.get('/api', (req, res) => {
  res.json({
    message: 'AutoVest API is running',
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null
  });
});

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }
    
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = await hashPassword(password);
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      email,
      fullName
    });
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed after registration' });
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(500).json({ message: 'Authentication error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login failed' });
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.status(200).json({ message: 'Successfully logged out' });
  });
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

// Package routes
app.get('/api/packages', async (req, res) => {
  try {
    const packages = await storage.getPackages();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid package ID' });
    }

    const pkg = await storage.getPackage(id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch package' });
  }
});

// Investment routes
app.get('/api/investments', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const investments = await storage.getInvestments(req.user?.id);
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch investments' });
  }
});

app.post('/api/investments', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { packageId, amount, durationMonths } = req.body;
    
    if (!packageId || !amount || !durationMonths) {
      return res.status(400).json({ 
        message: 'Package ID, amount, and duration are required' 
      });
    }

    // Verify package exists
    const pkg = await storage.getPackage(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Verify investment amount meets minimum
    if (amount < pkg.minInvestment) {
      return res.status(400).json({ 
        message: `Minimum investment for this package is $${pkg.minInvestment}` 
      });
    }

    // Check if user has enough balance
    if (req.user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create investment
    const investment = await storage.createInvestment({
      userId: req.user.id,
      packageId,
      amount,
      durationMonths
    });

    // Create transaction record for the investment
    await storage.createTransaction({
      userId: req.user.id,
      investmentId: investment.id,
      type: 'deposit',
      amount: -amount,
      status: 'completed',
      description: `Investment in ${pkg.name}`
    });

    res.status(201).json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create investment' });
  }
});

// Transaction routes
app.get('/api/transactions', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const transactions = await storage.getTransactions(req.user?.id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Stripe routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // For testing without Stripe configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Mock response for testing
      return res.status(200).json({
        clientSecret: 'mock_client_secret_' + Date.now(),
        message: 'Test mode: Stripe is not configured. This is a mock response.'
      });
    }

    // If we had Stripe configured:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({...});
    // res.status(200).json({ clientSecret: paymentIntent.client_secret });
    
    // For now, just return a simulation response
    res.status(200).json({ 
      clientSecret: 'mock_client_secret_' + Date.now(),
      note: 'Add your Stripe API keys to use real payment processing'
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Export the Express app as a serverless function
export default app;