// This is a simplified API for the demo version
// In production, this would verify the user's session

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // For the demo, return a mock user
  // In production, this would validate the session/token and return the actual user
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