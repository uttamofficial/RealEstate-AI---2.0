# Quick Setup Guide

## 🚀 Get Your Real Estate AI Project Running

### Step 1: Install Dependencies ✅
```bash
npm install
```
*This step has been completed for you!*

### Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory with:

```bash
# Google AI API Key (get from https://makersuite.google.com/app/apikey)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Get Your Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and paste it in your `.env.local` file

### Step 4: Start the Development Server
```bash
npm run dev
```

### Step 5: Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 What You'll See

- **AI-Powered Deal Ranking**: Properties ranked by investment potential
- **Market Insights**: Real-time market trends and analysis
- **Interactive Maps**: Property locations and market data
- **Investment Scoring**: ROI, cap rates, and cash flow analysis
- **Deal Filters**: Search and filter properties by criteria

## 🔧 Troubleshooting

**If you get dependency errors:**
```bash
npm install --force
```

**If you get build errors:**
```bash
npm run build
```

**If the AI features don't work:**
- Make sure your Google AI API key is correct
- Check that `.env.local` is in the root directory
- Restart the development server after adding environment variables

## 📱 Features Available

- ✅ Deal ranking and analysis
- ✅ Market insights ticker
- ✅ Investment scoring rings
- ✅ Property maps
- ✅ Deal filters
- ✅ Market overview charts
- ✅ Investment reports

Your Real Estate AI project is ready to go! 🎉
