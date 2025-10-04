# FinBridge - Financial Education Platform# Welcome to your Lovable project



A comprehensive financial education platform with separate frontend and backend services.## Project info



## Repository Structure**URL**: https://lovable.dev/projects/3d2b8dba-6070-4d9b-83fd-5eb51a82ca69



- `frontend/` — React/Vite frontend application with all UI components, pages, and configurations## How can I edit this code?

- `backend/` — Express.js backend API server (minimal scaffold ready for development)

There are several ways of editing your application.

## Development Setup

**Use Lovable**

### Frontend Development

```powershellSimply visit the [Lovable Project](https://lovable.dev/projects/3d2b8dba-6070-4d9b-83fd-5eb51a82ca69) and start prompting.

cd frontend

npm installChanges made via Lovable will be committed automatically to this repo.

npm run dev

```**Use your preferred IDE**

The frontend will start on `http://localhost:5173` (or the next available port).

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

### Backend Development

```powershellThe only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

cd backend

npm installFollow these steps:

npm run dev    # Uses nodemon for auto-reload

# or: npm start  # Direct node execution```sh

```# Step 1: Clone the repository using the project's Git URL.

The backend will start on `http://localhost:4000`.git clone <YOUR_GIT_URL>



### Health Check# Step 2: Navigate to the project directory.

Test the backend API:cd <YOUR_PROJECT_NAME>

```powershell

# PowerShell# Step 3: Install the necessary dependencies for the frontend (move files first - see below)

Invoke-WebRequest http://localhost:4000/api/health | Select-Object -ExpandProperty Contentcd frontend; npm i



# Or with curl (if available)# Step 4: Start the development server from the frontend folder with auto-reloading and an instant preview.

curl http://localhost:4000/api/healthcd frontend; npm run dev

``````



## Technologies Used**Edit a file directly in GitHub**



### Frontend- Navigate to the desired file(s).

- Vite- Click the "Edit" button (pencil icon) at the top right of the file view.

- TypeScript- Make your changes and commit the changes.

- React

- shadcn-ui**Use GitHub Codespaces**

- Tailwind CSS

- Supabase integration- Navigate to the main page of your repository.

- Click on the "Code" button (green button) near the top right.

### Backend- Select the "Codespaces" tab.

- Express.js- Click on "New codespace" to launch a new Codespace environment.

- Node.js- Edit files directly within the Codespace and commit and push your changes once you're done.



## Project Features## What technologies are used for this project?



FinBridge includes several key financial education modules:This project is built with:

- Financial Simulator

- Goal Planner- Vite

- Smart Investment Advisor- TypeScript

- Personality Profiler- React

- Micro Learning- shadcn-ui

- Smart Alerts- Tailwind CSS

- Mistake Mirror (learning from financial mistakes)

Repository layout (new)

## Next Steps

- `frontend/` — the React/Vite frontend app. Move the existing frontend files from the repository root into this folder.

1. **Configure CORS**: Add CORS middleware to the backend to allow frontend API calls- `backend/` — Express-based backend scaffold (minimal).

2. **Environment Variables**: Set up proper environment configuration for both frontend and backend

3. **Database Integration**: Connect your preferred database to the backendMoving existing frontend files into `frontend/` (PowerShell)

4. **API Routes**: Implement actual API endpoints for the financial education features

5. **Authentication**: Integrate authentication service (Supabase Auth is already set up in frontend)Open PowerShell at the repository root and run the command below to move everything except the new `frontend` and `backend` folders themselves into `frontend/`:

```powershell
Get-ChildItem -Force | Where-Object { $_.Name -ne 'backend' -and $_.Name -ne 'frontend' } | Move-Item -Destination frontend -Force
```

After moving, switch to the `frontend/` folder to install and run the dev server:

```powershell
cd frontend; npm install; npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3d2b8dba-6070-4d9b-83fd-5eb51a82ca69) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
