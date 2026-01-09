# Master Deployment Guide (Neon + Render + Vercel)

Follow these steps exactly to deploy your Task Manager application.

## ✅ Prerequisites
1.  **Push your latest code to GitHub**.
2.  Have your **Neon DB Connection String** ready (starts with `postgres://...`).

---

## 🚀 Step 1: Deploy Backend (Render)

1.  Log in to [dashboard.render.com](https://dashboard.render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Configure Service**:
    *   **Name**: `taskmanager-api` (example)
    *   **Root Directory**: `backend`  <-- **CRITICAL**
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Scroll down):
    *   `DATABASE_URL`: Paste your Neon DB connection string.
    *   `JWT_SECRET`: `some-secure-random-text`
    *   `JWT_REFRESH_SECRET`: `another-secure-random-text`
    *   `NODE_ENV`: `production`
    *   `FRONTEND_URL`: `https://your-frontend-project.vercel.app` (You can add this *after* Step 2).
6.  Click **Create Web Service**.
7.  **Wait** for deployment to finish.
8.  **Copy the Backend URL** (e.g., `https://taskmanager-api.onrender.com`).

---

## 🎨 Step 2: Deploy Frontend (Vercel)

1.  Log in to [vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit", select `frontend`. <-- **CRITICAL**
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste the **Backend URL** from Step 1 (e.g., `https://taskmanager-api.onrender.com`).
6.  Click **Deploy**.

---

## 🔗 Step 3: Final Connection (CORS)

1.  Once Vercel finishes, copy your **Frontend Domain** (e.g., `https://task-manager-xyz.vercel.app`).
2.  Go back to **Render Dashboard** -> Your Backend Service -> **Environment Variables**.
3.  Add/Edit `FRONTEND_URL` and paste your Vercel Frontend Domain.
4.  **Save Changes** (Render will auto-redeploy).

---

## 🩺 Troubleshooting

*   **"CORS Error"**: You skipped Step 3. The backend allowed list needs your *exact* Vercel URL.
*   **"Network Error" or "404"**: Your `NEXT_PUBLIC_API_URL` in Vercel is wrong or missing. It must match the Render Backend URL exactly.
*   **"Database Error"**: Your `DATABASE_URL` in Render is wrong.
