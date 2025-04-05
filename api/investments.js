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
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          name: "Economy Vehicle"
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
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          name: "Luxury Vehicle"
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
      
      // Get package name based on packageId
      let packageName = "Vehicle Investment";
      if (packageId === 1) packageName = "Economy Vehicle";
      else if (packageId === 2) packageName = "Mid-Range Vehicle";
      else if (packageId === 3) packageName = "Luxury Vehicle";
      else if (packageId === 4) packageName = "Ultra Luxury Vehicle";
      else if (packageId === 5) packageName = "Budget Investment";
      
      // Create a sample investment response
      const newInvestment = {
        id: 3,
        userId: 1,
        packageId,
        amount,
        returnRate: packageId === 1 ? 5 : 
                   packageId === 2 ? 10 : 
                   packageId === 3 ? 15 : 
                   packageId === 4 ? 20 : 3,
        startDate: new Date(),
        endDate: new Date(Date.now() + (packageId === 1 ? 30 : 
                                        packageId === 2 ? 90 : 
                                        packageId === 3 ? 180 : 
                                        packageId === 4 ? 365 : 30) * 24 * 60 * 60 * 1000),
        status: "active",
        createdAt: new Date(),
        name: packageName
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