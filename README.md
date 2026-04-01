# TaskFlow — MERN Stack Task Manager

A full-stack Task Manager web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

live demo:- https://expensetaskflow.netlify.app

---

## 📋 Features

- ✅ **User Authentication** — Register, Login, JWT-based sessions
- ✅ **CRUD Operations** — Create, Read, Update, Delete tasks
- ✅ **Database** — MongoDB with Mongoose ODM
- ✅ **Client–Server** — REST API with Axios
- ✅ **Filtering & Search** — Filter by status, priority, and search by title
- ✅ **Task Status Toggle** — Mark tasks complete/pending with one click
- ✅ **Dashboard** — Stats overview + progress bars
- ✅ **Responsive UI** — Clean dark theme with custom CSS

---

## 🏗️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose ODM             |
| Auth       | JWT (jsonwebtoken), bcryptjs      |
| Styling    | Custom CSS (CSS Variables, Flexbox, Grid) |

---

## 📁 Project Structure

```
mern-taskmanager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── models/
│   │   ├── User.js          # User schema + bcrypt
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── auth.js          # /register, /login, /me
│   │   └── tasks.js         # Full CRUD + stats
│   ├── server.js            # Express app entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js     # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Layout.js    # Sidebar + nav
│   │   │   ├── TaskModal.js # Create/Edit modal
│   │   │   └── ConfirmModal.js
│   │   ├── context/
│   │   │   └── AuthContext.js # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Tasks.js
│   │   ├── App.js           # Routes
│   │   ├── index.js
│   │   └── index.css        # All styles
│   └── package.json
├── package.json             # Root (dev + deploy scripts)
├── Procfile                 # Heroku/Railway deploy
└── README.md
```

---

## ⚡ API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint         | Description        | Auth |
|--------|------------------|--------------------|------|
| POST   | /register        | Register new user  | No   |
| POST   | /login           | Login user         | No   |
| GET    | /me              | Get current user   | Yes  |

### Task Routes (`/api/tasks`)
| Method | Endpoint         | Description        | Auth |
|--------|------------------|--------------------|------|
| GET    | /                | Get all user tasks | Yes  |
| POST   | /                | Create a task      | Yes  |
| GET    | /:id             | Get single task    | Yes  |
| PUT    | /:id             | Update task        | Yes  |
| DELETE | /:id             | Delete task        | Yes  |
| GET    | /stats/summary   | Get task counts    | Yes  |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free) or local MongoDB

### 1. Clone / Extract the project
```bash
cd mern-taskmanager
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Configure environment variables
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/taskmanager
JWT_SECRET=choose_a_long_random_string_here
NODE_ENV=development
```

### 4. Run in development mode
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## ☁️ Deployment Guide

### Option A: Render.com (Recommended — Free)

1. Push code to GitHub
2. Go to https://render.com → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `node backend/server.js`
   - **Environment Variables:**
     - `MONGO_URI` = your MongoDB Atlas URI
     - `JWT_SECRET` = your secret key
     - `NODE_ENV` = production
5. Click **Deploy** — done!

### Option B: Railway.app (Free tier)

1. Push to GitHub
2. Go to https://railway.app → **New Project** → **Deploy from GitHub**
3. Add environment variables in the Railway dashboard
4. Railway auto-detects the Procfile and deploys

### Option C: Heroku

```bash
heroku create your-app-name
heroku config:set MONGO_URI="your_uri" JWT_SECRET="your_secret" NODE_ENV=production
git push heroku main
```

### MongoDB Atlas Setup (Required for deployment)
1. Go to https://cloud.mongodb.com → Create free cluster
2. Create a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (allow all — for deployment)
4. Click **Connect** → **Drivers** → copy the connection string
5. Replace `<password>` with your user password in the URI

---

## 📸 Pages Overview

| Page       | Route        | Description                            |
|------------|--------------|----------------------------------------|
| Login      | /login       | Email + password login                 |
| Register   | /register    | Name, email, password signup           |
| Dashboard  | /dashboard   | Stats cards + recent tasks + progress  |
| Tasks      | /tasks       | Full task list with CRUD + filters     |

---

## 🔐 Security Features
- Passwords hashed with **bcryptjs** (salt rounds: 12)
- JWT tokens expire in **7 days**
- All task routes protected by auth middleware
- Users can only access **their own tasks** (user-scoped queries)
- Input validation on both frontend and backend

---

## 👨‍💻 Author
Built as a MERN Stack academic project demonstrating:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication
- MongoDB with Mongoose ODM
- React functional components + Context API
- Client-server architecture
