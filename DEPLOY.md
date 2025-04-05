# AutoVest Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the AutoVest application to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [GitHub](https://github.com) account (recommended)
3. [Stripe](https://stripe.com) account for payment processing

## Deployment Steps

### 1. Push Your Code to GitHub (Recommended)

For the best deployment experience, first push your code to a GitHub repository:

1. Create a new repository on GitHub
2. Initialize git in your project if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Connect to your GitHub repository:
   ```bash
   git remote add origin https://github.com/yourusername/autovest.git
   git push -u origin main
   ```

### 2. Connect to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." then "Project"
3. Import your GitHub repository or upload your project files directly
4. Keep the default framework preset (or select Node.js if prompted)

### 3. Configure Build Settings

The vercel.json file in this project handles most of the configuration, but verify the following settings in the Vercel UI:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Set Environment Variables

Add the following environment variables in the Vercel project settings:

1. `SESSION_SECRET` - A random string for session encryption
2. `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with sk_)
3. `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key (starts with pk_)
4. Optional: `STRIPE_WEBHOOK_SECRET` - For production Stripe webhook verification

To generate a strong random session secret, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Deploy Your Application

1. Click "Deploy" in the Vercel UI
2. Wait for the build and deployment to complete
3. Your app will be available at `https://your-project-name.vercel.app`

### 6. Set Up Stripe Webhooks (Production)

For full payment functionality in production:

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new webhook endpoint with your Vercel URL:
   ```
   https://your-project-name.vercel.app/api/stripe-webhook
   ```
3. Add the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret
5. Add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Troubleshooting

### Session Issues

If users are being logged out between page refreshes:

1. Make sure `SESSION_SECRET` is properly set
2. Consider using a persistent session store for production

### API Errors

If API endpoints return 404 errors:

1. Check Vercel Function Logs in your Vercel Dashboard
2. Verify that your API routes are correctly configured in vercel.json
3. Make sure the Vercel serverless function is properly configured

### Stripe Integration Issues

If Stripe payments aren't working:

1. Verify your Stripe API keys are correctly set in environment variables
2. Check Stripe Dashboard logs for any payment attempt errors
3. Ensure webhook endpoints are correctly configured

## Maintenance

### Updating Your Deployment

Any push to your GitHub repository's main branch will trigger an automatic redeployment.

For manual updates:

1. Make changes to your local code
2. Push to GitHub, or
3. Use the Vercel CLI to deploy directly:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)