# ECOSA Frontend (React + TypeScript)

This is a front-end scaffold for ECOSA — Equatorial College Old Students Association. It implements registration, login (mock), member dashboard/profile editing, mock payments UI, members directory, and a job board using localStorage for data persistence.

Quick start:

```bash
cd "ECOSA ONLINE/ECOSA-frontend"
npm install
npm run dev
```

Notes:
- This is a front-end demo only. Replace the mock services in `src/services/mockService.ts` with real API calls and integrate a payment gateway for production.
- The app uses Vite + React + TypeScript.

Backend (optional, recommended):

Start the lightweight Express backend to persist posts, votes, leaders and members:

```bash
cd "ECOSA ONLINE/ECOSA-backend"
npm install
npm start
```

When the backend is running it listens on `http://localhost:4000` and the frontend will use it automatically (with localStorage fallback).

Server features added:
- Session-based login endpoints: `POST /api/auth/login` and `POST /api/auth/logout` (uses server-side session cookie).
- Stripe Checkout support: `POST /api/create-checkout-session` — requires `STRIPE_SECRET_KEY` env var.

To enable Stripe (test):

```powershell
setx STRIPE_SECRET_KEY "sk_test_..."
setx SESSION_SECRET "a_secure_secret"
```

Restart the backend after setting env vars.
