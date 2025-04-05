import { storage } from './index.js';

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
  
  // Handle GET and POST requests
  if (req.method === 'GET') {
    // For demo purposes, return some sample transactions
    // In production, this would check the user session and return their transactions
    try {
      const sampleTransactions = [
        {
          id: 1,
          userId: 1,
          type: "deposit",
          amount: 5000,
          description: "Initial deposit",
          status: "completed",
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          userId: 1,
          type: "investment",
          amount: -1000,
          description: "Investment in Economy Vehicle",
          status: "completed",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          userId: 1,
          type: "investment",
          amount: -10000,
          description: "Investment in Luxury Vehicle",
          status: "completed",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: 4,
          userId: 1,
          type: "return",
          amount: 150,
          description: "Monthly return from Economy Vehicle",
          status: "completed",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ];
      
      return res.status(200).json(sampleTransactions);
    } catch (error) {
      console.error('Transactions error:', error);
      return res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
    }
  } else if (req.method === 'POST') {
    // This would create a new transaction in a production environment
    // For the demo, just return a success response
    try {
      const { type, amount, description } = req.body;
      
      if (!type || !amount) {
        return res.status(400).json({ message: 'Type and amount are required' });
      }
      
      // Create a sample transaction response
      const newTransaction = {
        id: 5,
        userId: 1,
        type,
        amount,
        description: description || `${type} transaction`,
        status: "completed",
        createdAt: new Date()
      };
      
      return res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Transaction creation error:', error);
      return res.status(500).json({ message: 'Failed to create transaction', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}