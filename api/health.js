// Health check endpoint for Vercel
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'AutoVest API is running',
    timestamp: new Date().toISOString()
  });
}