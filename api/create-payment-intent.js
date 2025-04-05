// This is a mock implementation for the demo
// In production, this would use the actual Stripe API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    
    // In production, this would create a real Stripe payment intent
    // For the demo, return a mock client secret
    const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(2, 15)}`;
    
    return res.status(200).json({ clientSecret: mockClientSecret });
  } catch (error) {
    console.error('Payment intent error:', error);
    return res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
}