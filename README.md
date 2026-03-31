# Student Management System

A full-stack web application to manage student records — add, update, delete, and view students with a modern, responsive UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions + Vercel |

---

## Features

- Add, edit, delete, and view students
- Search by name, email, or course
- Filter by status (Active, Inactive, Graduated, Suspended)
- Dashboard stats (Total, Active, Inactive, Graduated)
- Pagination
- Animated, responsive UI
- REST API with error handling

---

## Project Structure

```
student-management-system/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Route logic
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   └── middleware/       # Error handler
│   ├── server.js             # Entry point
│   ├── vercel.json           # Vercel serverless config
│   └── Dockerfile
│
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json           # SPA routing config
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions pipeline
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/students` | Get all students (supports `?search=`, `?status=`, `?page=`, `?limit=`) |
| GET | `/api/students/stats` | Get dashboard stats |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

---

## Local Development

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/elite1122/student-management-system.git
cd student-management-system
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your MONGO_URI
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## Docker

### Prerequisites
- Docker Desktop installed and running

### Build and Run

```bash
# From project root — create .env file first
echo "MONGO_URI=your_mongo_uri_here" > .env

# Build images
docker compose build

# Start containers
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:80` |
| Backend | `http://localhost:5000` |

---

## CI/CD Pipeline (GitHub Actions)

Every push to `main` automatically:

1. **Deploy Backend** → Vercel serverless (Node.js)
2. **Deploy Frontend** → Vercel static site (after backend is ready)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Vercel team/org ID |
| `VERCEL_BACKEND_PROJECT_ID` | Vercel backend project ID |
| `VERCEL_FRONTEND_PROJECT_ID` | Vercel frontend project ID |
| `VITE_API_URL` | Backend URL (e.g. `https://edumanage-backend.vercel.app/api`) |
| `MONGO_URI` | MongoDB Atlas connection string |

### Pipeline Flow

```
git push → GitHub Actions
              ├── Job 1: Deploy Backend  → Vercel
              └── Job 2: Deploy Frontend → Vercel (after backend)
```

---

## Environment Variables

### Backend `.env`
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/student-management-system
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://student-management-system-rho-seven.vercel.app |
| Backend API | https://edumanage-backend.vercel.app/health |

---

## Student Data Fields

| Field | Type | Required |
|---|---|---|
| First Name | String | Yes |
| Last Name | String | Yes |
| Email | String (unique) | Yes |
| Phone | String | Yes |
| Age | Number (5–100) | Yes |
| Course | String | Yes |
| Grade | Enum (A/B/C/D/F/N/A) | No |
| Address | String | No |
| Enrollment Date | Date | No |
| Status | Enum (Active/Inactive/Graduated/Suspended) | No |
