import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { storage } from './index.js';

// Helpers
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only handle POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password, email, fullName } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }
    
    // Check if username exists
    const existingUser = await storage.getUserByUsername(username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Create user
    const hashedPassword = await hashPassword(password);
    
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      email,
      fullName: fullName || null,
      role: 'user',
      balance: 1000 // Starting balance for demo purposes
    });
    
    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}