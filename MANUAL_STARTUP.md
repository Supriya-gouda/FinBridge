# 🚀 FinBridge Application - Manual Startup Guide

## Quick Start Instructions

Since automated startup is having issues, please follow these manual steps to run the FinBridge application:

### Step 1: Start Backend Server

1. Open a new **PowerShell** or **Command Prompt** window
2. Navigate to the backend directory:
   ```powershell
   cd "d:\FinBridge\FinBridge\backend"
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the backend server:
   ```powershell
   npm start
   ```
   
   ✅ **Expected Output**: `FinBridge backend listening on port 4000`
   
   🌐 **Backend URL**: http://localhost:4000

### Step 2: Start Frontend Server

1. Open **another** PowerShell or Command Prompt window
2. Navigate to the frontend directory:
   ```powershell
   cd "d:\FinBridge\FinBridge\frontend"
   ```
3. Install dependencies (first time only):
   ```powershell
   npm install
   ```
4. Start the development server:
   ```powershell
   npm run dev
   ```
   
   ✅ **Expected Output**: `Local: http://localhost:8080` (or similar)
   
   🌐 **Frontend URL**: http://localhost:8080

### Step 3: Access the Application

1. Wait for both servers to start completely (about 30-60 seconds)
2. Open your web browser
3. Navigate to: **http://localhost:8080**
4. You should see the FinBridge homepage!

## 🎯 Testing the Crowd Wisdom Feature

Once the application is running:

1. Click **"Get Started"** or navigate to **Sign Up/Login**
2. Create an account or use demo mode
3. Go to the **Dashboard**
4. Click on the **"Crowd Wisdom"** card
5. Select a financial metric and enter your value
6. Click **"Compare with Community"** to see your ranking!

## 🔧 Troubleshooting

### Backend Issues
- **Port 4000 in use**: Kill the process or change the port in `backend/index.js`
- **Dependencies error**: Delete `node_modules` and run `npm install` again
- **CORS errors**: Make sure frontend URL matches the CORS origin in backend

### Frontend Issues  
- **Port 8080 in use**: Vite will automatically suggest another port (e.g., 8081)
- **Build errors**: Check if all dependencies installed correctly
- **API connection**: Verify backend is running on port 4000

### General Issues
- **Node.js not found**: Install Node.js from https://nodejs.org/
- **npm not found**: Node.js installation should include npm
- **Path issues**: Use absolute paths or adjust based on your directory structure

## 📁 Project Structure

```
d:\FinBridge\FinBridge\
├── backend/           # Express.js API server (Port 4000)
│   ├── index.js      # Main server file with Crowd Wisdom API
│   ├── package.json  # Dependencies: express, cors
│   └── ...
├── frontend/         # React + Vite app (Port 8080)
│   ├── src/
│   │   ├── pages/CrowdWisdom.tsx  # New feature page
│   │   ├── App.tsx   # Updated with /crowd-wisdom route
│   │   └── ...
│   ├── package.json  # Many React/UI dependencies
│   └── ...
└── README.md
```

## 🎉 Features Available

✅ **Personality Profiler** - Financial mindset assessment
✅ **Micro-Learning** - Bite-sized financial lessons  
✅ **Financial Simulator** - SIP, EMI, goal calculators
✅ **Mistake Mirror** - Learn from financial mistakes
✅ **Smart Alerts** - Personalized notifications
✅ **Investment Advisor** - AI-powered investment guidance
✅ **Goal Planner** - Financial goal tracking
✅ **Crowd Wisdom** - 🆕 Anonymous community benchmarking

Enjoy exploring FinBridge! 🎊