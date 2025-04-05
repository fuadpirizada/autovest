# AutoVest Deployment to Vercel

## What's Been Prepared

1. **vercel.json Configuration**: I've created a proper Vercel configuration file that:
   - Correctly directs all frontend requests to index.html
   - Routes API calls to the serverless functions
   - Sets up environment variables for your Stripe keys and session secret

2. **Serverless API Functions**: 
   - Created a self-contained API implementation in the `/api` directory
   - Incorporated all necessary routes: authentication, packages, investments, transactions
   - Added Stripe payment integration support with fallback for testing

## Deployment Steps

### 1. Push to GitHub (Recommended)

1. Create a new repository on GitHub
2. Initialize git in your project and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/autovest.git
   git push -u origin main
   ```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project" 
3. Import your GitHub repository (or use "Upload" if not using GitHub)
4. Keep the default framework preset (or select "Other" if prompted)

### 3. Configure Environment Variables

Add these environment variables in the Vercel project settings:

- `SESSION_SECRET`: A random string for session encryption (use a secure random string)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with sk_)
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key (starts with pk_)

You can generate a secure random string for SESSION_SECRET using:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy Your Application

Click "Deploy" in the Vercel UI to start the deployment process.

## Troubleshooting Common Issues

### If the app shows code instead of rendering:

This is likely due to incorrect routing configuration. Check:
1. Verify that `vercel.json` has the correct settings (I've already updated this)
2. Make sure the `outputDirectory` in vercel.json matches your build output directory

### API Routes Returning 404:

1. Check that API routes in `/api` directory are correctly structured
2. Verify that environment variables are properly set
3. Check Vercel deployment logs for errors

### Authentication Issues:

1. Ensure SESSION_SECRET is properly set in environment variables
2. Try clearing your browser cookies

## Monitoring & Maintaining

- View real-time logs in the Vercel dashboard
- Set up health checks to monitor uptime
- Use the "Preview Deployments" feature to test changes before they go live

## Connecting Stripe (When Ready)

1. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add them to your Vercel environment variables
3. Set up webhook endpoints for payment confirmations
