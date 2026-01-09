# Task Manager Application

A modern, full-stack Task Management application built with **Next.js**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

## 🚀 Features

-   **Authentication**: Secure User Login & Registration (JWT-based).
-   **Session Persistence**: Users stay logged in across page reloads using secure HttpOnly cookies and refresh tokens.
-   **Task Management**:
    -   Create, Read, Update, and Delete (CRUD) tasks.
    -   Toggle task completion status.
    -   Real-time UI updates (optimistic UI).
-   **Search & Filter**: Filter tasks by status (Open/Done) and search by title/description.
-   **Modern UI/UX**:
    -   Responsive design using **Tailwind CSS**.
    -   Beautiful gradients and glassmorphism effects.
    -   **Toast Notifications** (Success/Error feedback).
    -   **Loading States** (Spinners for async actions).
    -   **User Menu** with click-outside closure functionality.

## 🛠 Tech Stack

### Frontend
-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: React Context (AuthContext)
-   **Icons**: Lucide React
-   **Notifications**: React Hot Toast
-   **HTTP Client**: Axios

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **ORM**: Prisma
-   **Database**: PostgreSQL
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt (Password Hashing)
-   **Validation**: Zod

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   **PostgreSQL** (Local instance or a cloud database URL)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TaskManager
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
NODE_ENV="development"
```
*Note: Replace `DATABASE_URL` with your actual PostgreSQL connection string.*

**Database Migration:**
Push the schema to your database:
```bash
npx prisma db push
```

**Start the Server:**
```bash
npm run dev
```
The backend should now be running on `http://localhost:4000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Environment Variables:**
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Start the Application:**
```bash
npm run dev
```
The frontend should now be accessible at `http://localhost:3000`.

---

## 🚀 Deployment Guide

### Database (PostgreSQL)
You need a hosted PostgreSQL database. Recommended providers:
-   **Neon** (Free tier suitable for development)
-   **Supabase**
-   **Render** (Managed PostgreSQL)

### Backend (Render/Railway)
1.  Push your code to GitHub.
2.  Create a new Web Service on Render/Railway.
3.  Connect your repository and select the `backend` root directory.
4.  **Build Command**: `npm install && npx prisma generate && npm run build`
5.  **Start Command**: `npm start`
6.  **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, etc., from your local `.env`.

### Frontend (Vercel)
1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Select the `frontend` root directory.
4.  **Environment Variables**: Add `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL (e.g., `https://my-backend.onrender.com`).
5.  Deploy!

---

## 📂 Project Structure

```
TaskManager/
├── backend/
│   ├── prisma/            # Database schema
│   ├── src/
│   │   ├── controllers/   # Route logic
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/        # API routes definitions
│   │   ├── utils/         # Helpers (auth, validation)
│   │   └── server.ts      # Entry point
│   └── ...
└── frontend/
    ├── src/
    │   ├── app/           # Next.js App Router pages
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Auth state context
    │   ├── lib/           # API client configuration
    │   └── types/         # TypeScript definitions
    └── ...
```

## 🔐 API Endpoints

### Auth
-   `POST /auth/register`: Create a new account.
-   `POST /auth/login`: Authenticate user.
-   `POST /auth/logout`: clear session.
-   `GET /auth/refresh`: Refresh access token.

### Tasks
-   `GET /tasks`: Fetch all tasks (supports pagination `?page=1` and filters).
-   `POST /tasks`: Create a new task.
-   `PATCH /tasks/:id`: Update a task.
-   `PATCH /tasks/:id/toggle`: Toggle task status.
-   `DELETE /tasks/:id`: Delete a task.
