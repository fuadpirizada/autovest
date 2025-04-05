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
    // For demo purposes, return some sample investments
    // In production, this would check the user session and return their investments
    try {
      const sampleInvestments = [
        {
          id: 1,
          userId: 1,
          packageId: 1,
          amount: 1000,
          returnRate: 5,
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          status: "active",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          userId: 1,
          packageId: 3,
          amount: 10000,
          returnRate: 15,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // 150 days from now
          status: "active",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      ];
      
      return res.status(200).json(sampleInvestments);
    } catch (error) {
      console.error('Investments error:', error);
      return res.status(500).json({ message: 'Failed to retrieve investments', error: error.message });
    }
  } else if (req.method === 'POST') {
    // This would create a new investment in a production environment
    // For the demo, just return a success response
    try {
      const { packageId, amount } = req.body;
      
      if (!packageId || !amount) {
        return res.status(400).json({ message: 'Package ID and amount are required' });
      }
      
      // Create a sample investment response
      const newInvestment = {
        id: 3,
        userId: 1,
        packageId,
        amount,
        returnRate: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        status: "active",
        createdAt: new Date()
      };
      
      return res.status(201).json(newInvestment);
    } catch (error) {
      console.error('Investment creation error:', error);
      return res.status(500).json({ message: 'Failed to create investment', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}