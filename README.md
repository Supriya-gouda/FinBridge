# 🌉 FinBridge - Financial Education Platform# 🌉 FinBridge - Financial Education Platform



A comprehensive financial education platform that bridges the gap between financial literacy and practical money management. Built with modern web technologies to provide users with personalized financial insights, smart alerts, and educational content.A comprehensive financial education platform that bridges the gap between financial literacy and practical money management. Built with modern web technologies to provide users with personalized financial insights, smart alerts, and educational content.



## 🚀 Quick Start## 🚀 Quick Start



### Prerequisites### Prerequisites

- Node.js (v18 or higher)- Node.js (v18 or higher)

- npm or yarn- npm or yarn

- Git- Git



### Installation & Setup### Installation & Setup



1. **Clone the repository**1. **Clone the repository**

```bash```bash

git clone https://github.com/Supriya-gouda/FinBridge.gitgit clone https://github.com/Supriya-gouda/FinBridge.git

cd FinBridgecd FinBridge

``````



2. **Install root dependencies**2. **Install root dependencies**

```bash```bash

npm installnpm install

``````



3. **Start both services simultaneously**3. **Start both services simultaneously**

```bash```bash

npm run devnpm run dev

``````



Or start them individually:Or start them individually:



4. **Backend Setup**4. **Backend Setup**

```bash```bash

cd backendcd backend

npm installnpm install

npm startnpm start

``````

The backend will start on `http://localhost:4000`The backend will start on `http://localhost:4000`



5. **Frontend Setup** (in a new terminal)5. **Frontend Setup** (in a new terminal)

```bash```bash

cd frontendcd frontend

npm installnpm install

npm run devnpm run dev

``````

The frontend will start on `http://localhost:8080`The frontend will start on `http://localhost:8080`



### Environment Configuration### Environment Configuration



The backend requires a `.env` file with Supabase credentials (already configured):The backend requires a `.env` file with Supabase credentials (already configured):

```env```env

SUPABASE_URL=your_supabase_urlSUPABASE_URL=your_supabase_url

SUPABASE_ANON_KEY=your_supabase_anon_keySUPABASE_ANON_KEY=your_supabase_anon_key

PORT=4000PORT=4000

``````



## 🎯 Features



### 📊 Financial Health Scoring## Technologies Used**Edit a file directly in GitHub**

- Comprehensive financial health assessment

- Real-time score calculation based on multiple factors

- Detailed breakdown and personalized recommendations

### Frontend- Navigate to the desired file(s).

### 🔔 Smart Alerts

- Bill reminders and payment notifications- Vite- Click the "Edit" button (pencil icon) at the top right of the file view.

- Investment opportunity alerts

- Goal progress tracking- TypeScript- Make your changes and commit the changes.

- Emergency fund warnings

- React

### 🧠 Personality Profiler

- Financial personality assessment- shadcn-ui**Use GitHub Codespaces**

- Personalized investment strategies  

- Behavioral insights and challenges- Tailwind CSS

- Custom financial coaching

- Supabase integration- Navigate to the main page of your repository.

### 📈 Investment Tools

- Smart investment advisor- Click on the "Code" button (green button) near the top right.

- Portfolio recommendations

- Risk assessment### Backend- Select the "Codespaces" tab.

- Market insights integration

- Express.js- Click on "New codespace" to launch a new Codespace environment.

### 🎯 Goal Planning

- Short and long-term financial goal setting- Node.js- Edit files directly within the Codespace and commit and push your changes once you're done.

- Progress tracking and milestones

- Achievement rewards and gamification



### 📚 Educational Content## Project Features## What technologies are used for this project?

- Micro-learning modules

- Financial literacy content

- Mistake Mirror (learn from common errors)

- Interactive financial simulationsFinBridge includes several key financial education modules:This project is built with:



### 👥 Community Features- Financial Simulator

- Crowd wisdom insights

- Peer comparisons (anonymous)- Goal Planner- Vite

- Community challenges

- Financial success stories- Smart Investment Advisor- TypeScript



## 🏗️ Architecture- Personality Profiler- React



### Frontend (`/frontend`)- Micro Learning- shadcn-ui

- **React 18** with TypeScript

- **Vite** for fast development and building- Smart Alerts- Tailwind CSS

- **Tailwind CSS** for styling

- **shadcn/ui** component library- Mistake Mirror (learning from financial mistakes)

- **React Router** for navigation

- **React Query** for data fetchingRepository layout (new)

- **Supabase** for authentication and data

## Next Steps

### Backend (`/backend`)

- **Express.js** REST API- `frontend/` — the React/Vite frontend app. Move the existing frontend files from the repository root into this folder.

- **Node.js** runtime

- **Supabase** database integration1. **Configure CORS**: Add CORS middleware to the backend to allow frontend API calls- `backend/` — Express-based backend scaffold (minimal).

- **CORS** enabled for frontend communication

- Modular route structure2. **Environment Variables**: Set up proper environment configuration for both frontend and backend



## 📱 API Endpoints3. **Database Integration**: Connect your preferred database to the backendMoving existing frontend files into `frontend/` (PowerShell)



### Health & Status4. **API Routes**: Implement actual API endpoints for the financial education features

- `GET /health` - Service health check

- `GET /api/health` - API health status5. **Authentication**: Integrate authentication service (Supabase Auth is already set up in frontend)Open PowerShell at the repository root and run the command below to move everything except the new `frontend` and `backend` folders themselves into `frontend/`:



### Smart Alerts```powershell

- `GET /api/alerts` - Get user alertsGet-ChildItem -Force | Where-Object { $_.Name -ne 'backend' -and $_.Name -ne 'frontend' } | Move-Item -Destination frontend -Force

- `POST /api/alerts` - Create new alert```

- `PATCH /api/alerts/:id/read` - Mark alert as read

- `GET /api/alerts/upcoming` - Get upcoming alertsAfter moving, switch to the `frontend/` folder to install and run the dev server:



### Financial Health```powershell

- `GET /api/health-score` - Get latest financial health scorecd frontend; npm install; npm run dev

- `POST /api/health-score/calculate` - Calculate new score```

- `GET /api/health-score/history` - Get score history

## How can I deploy this project?

### Personality Profiler

- `POST /api/personality-profiler/assessment` - Complete assessmentSimply open [Lovable](https://lovable.dev/projects/3d2b8dba-6070-4d9b-83fd-5eb51a82ca69) and click on Share -> Publish.

- `GET /api/personality-profiler/profile/:userId` - Get user profile

- `GET /api/personality-profiler/challenges/:userId` - Get challenges## Can I connect a custom domain to my Lovable project?



## 🚀 DevelopmentYes, you can!



### Project StructureTo connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

```

FinBridge/Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── services/      # API service layers
│   │   └── integrations/  # Third-party integrations
│   └── package.json
├── backend/           # Express.js backend API
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   └── package.json
└── package.json       # Root package.json for scripts
```

### Available Scripts

From the root directory:
- `npm run dev` - Start both frontend and backend
- `npm run backend` - Start only backend
- `npm run frontend` - Start only frontend
- `npm run install-all` - Install dependencies for both services

### Testing

The application includes comprehensive testing capabilities:
- Backend API endpoints can be tested using the health check endpoint
- Frontend components are built with accessibility and usability in mind
- Integration testing between frontend and backend services

## 🔧 Configuration

### Database Setup
The application uses Supabase as its database. The backend automatically attempts to create necessary tables on startup. Check the console output for SQL commands to run in your Supabase SQL editor.

### CORS Configuration
CORS is pre-configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Custom frontend port)
- `http://localhost:3000` (Alternative port)

## 🌐 Access Points

Once both services are running:
- **Frontend Application**: http://localhost:8080 (or next available port)
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- UI components from shadcn/ui
- Database and authentication by Supabase
- Icons from Lucide React

---

**FinBridge** - Bridging the gap between financial education and practical money management 🌉