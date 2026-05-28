# ECOSA Frontend (React + TypeScript)

ECOSA Online — Equatorial College Old Students Association web app. Use this site to register, manage your alumni profile, pay membership, browse community posts, view jobs and access shared resources. The frontend stores data locally in your browser for quick demos.

Quick start:

```bash
cd "ECOSA ONLINE/ECOSA-frontend"
npm install
npm run dev
```

Notes for developers:
- The frontend currently uses local browser storage for demo data. To enable production features, point the frontend at an API and configure a payment gateway.
- The app uses Vite + React + TypeScript.

Backend (optional, recommended):

Start the lightweight Express backend to persist posts, votes, leaders and members:

```bash
cd "ECOSA ONLINE/ECOSA-backend"
npm install
npm start
```

When a backend server is available at `http://localhost:4000` the frontend will use it; otherwise the app will continue to operate using local browser storage.

Server features added:
- Session-based login endpoints: `POST /api/auth/login` and `POST /api/auth/logout` (uses server-side session cookie).
- Stripe Checkout support: `POST /api/create-checkout-session` — requires `STRIPE_SECRET_KEY` env var.

To enable Stripe (test):

```powershell
setx STRIPE_SECRET_KEY "sk_test_..."
setx SESSION_SECRET "a_secure_secret"
```

Restart the backend after setting env vars.
