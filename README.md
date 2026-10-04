# 🎓 LearnOS — Online Learning Management System

<div align="center">

![LearnOS Banner](https://img.shields.io/badge/LearnOS-LMS-4F46E5?style=for-the-badge&logo=bookstack&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-22C55E?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)

**A modern, full-stack Learning Management System built for students, instructors, and admins — all in one platform.**

[🌐 Live Frontend](https://learnos.vercel.app) · [🔗 Backend API](https://learnos-api.railway.app) · [📖 API Docs](#-api-overview) · [🐛 Report Bug](https://github.com/yourusername/learnos/issues)

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [Author](#-author)

---

## 📖 About the Project

**LearnOS** is a production-ready, full-stack Learning Management System that empowers educators to create and manage courses while giving students an engaging, progress-driven learning experience.

Built with a **Node.js + Express** backend, **React.js** frontend, and **MongoDB** as the database, LearnOS supports real-time notifications via **Socket.io**, role-based access control, file uploads, and rich analytics — making it a complete solution for modern online education.

> 💡 Designed with a clean separation of concerns, scalable architecture, and developer-friendly setup — ideal for both learning and production deployment.

---

## 🚀 Live Demo

| Service    | URL                                              |
|------------|--------------------------------------------------|
| 🌐 Frontend | [https://learnos-yateesh.vercel.app/](https://learnos-yateesh.vercel.app/) |
| 🔗 Backend  | [https://learnos-api.railway.app](https://learnos-api.railway.app) |

> ⚠️ The backend may take a few seconds to respond on first load (cold start on Railway free tier).

---

## 🛠️ Tech Stack

### 🎨 Frontend
| Technology      | Purpose                            |
|-----------------|------------------------------------|
| React.js (CRA)  | Component-based UI framework       |
| Tailwind CSS    | Utility-first CSS styling          |
| React Router v6 | Client-side routing                |
| Axios           | HTTP requests to backend API       |
| Socket.io Client| Real-time event handling           |
| Context API     | Global state management            |

### ⚙️ Backend
| Technology      | Purpose                            |
|-----------------|------------------------------------|
| Node.js         | JavaScript runtime                 |
| Express.js      | REST API framework                 |
| MongoDB         | NoSQL database                     |
| Mongoose        | MongoDB object modeling (ODM)      |
| JWT             | Authentication & authorization     |
| Socket.io       | Real-time bidirectional events     |
| Multer          | File upload handling               |
| Bcrypt.js       | Password hashing                   |

### ☁️ Deployment
| Service   | Usage                  |
|-----------|------------------------|
| Vercel    | Frontend hosting       |
| Railway   | Backend + DB hosting   |
| MongoDB Atlas | Cloud database     |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure login and signup
- Role-based access control — **Student**, **Instructor**, **Admin**
- Protected routes on both frontend and backend
- Persistent sessions with token refresh support

### 📚 Course Management
- Instructors can create, edit, and delete courses
- Upload course thumbnails and media files
- Organize courses into structured lectures and modules
- Assign assessments and assignments per lecture

### 📊 Progress Tracking
- Students can track lecture completion progress
- Visual progress bars per course
- Auto-mark lectures as completed on viewing

### 🏆 Leaderboard & Analytics
- Student leaderboard based on course completions and scores
- Instructor dashboard with enrollment analytics
- Admin panel for platform-wide stats and user management

### 🔔 Real-time Notifications
- Instant notifications via Socket.io
- Alerts for new assignments, announcements, and course updates
- Live activity feed on dashboards

### 📂 File Uploads
- Support for PDF, video, and image uploads
- Multer-based file handling with size and type validation
- Organized file storage per course/lecture

### 🖥️ Dashboards
- **Student Dashboard** — enrolled courses, progress, upcoming deadlines
- **Instructor Dashboard** — course stats, student enrollments, revenue
- **Admin Dashboard** — user management, platform analytics

---

## 📁 Folder Structure

```
learnos/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login, signup, token logic
│   │   │   ├── courseController.js   # Course CRUD operations
│   │   │   ├── lectureController.js  # Lecture management
│   │   │   ├── userController.js     # User profile & admin ops
│   │   │   └── progressController.js # Progress tracking logic
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Lecture.js
│   │   │   ├── Assignment.js
│   │   │   └── Progress.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── lectureRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   ├── roleMiddleware.js     # Role-based guard
│   │   │   └── uploadMiddleware.js   # Multer config
│   │   └── utils/
│   │       ├── generateToken.js
│   │       └── sendResponse.js
│   ├── server.js                     # Entry point + Socket.io setup
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       │   ├── axiosInstance.js      # Axios base config
│       │   └── endpoints.js          # API endpoint constants
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── CourseCard.jsx
│       │   ├── ProgressBar.jsx
│       │   └── Notification.jsx
│       ├── context/
│       │   ├── AuthContext.jsx       # Auth state provider
│       │   └── SocketContext.jsx     # Socket.io provider
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── CoursePage.jsx
│       │   ├── Leaderboard.jsx
│       │   └── Admin.jsx
│       ├── socket/
│       │   └── socket.js             # Socket.io client init
│       ├── App.jsx
│       └── index.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚡ Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- [Git](https://git-scm.com/)

---

### 📥 Clone the Repository

```bash
git clone https://github.com/yourusername/learnos.git
cd learnos
```

---

### 🔧 Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# → Fill in your values in .env (see Environment Variables section)

# Start the development server
npm run dev
```

> The backend will run at `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
# → Set REACT_APP_API_URL to your backend URL

# Start the React development server
npm start
```

> The frontend will run at `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learnos

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads

# CORS
CLIENT_URL=http://localhost:3000
```

### Frontend — `frontend/.env`

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000/api

# Socket.io Server
REACT_APP_SOCKET_URL=http://localhost:5000
```

> ⚠️ Never commit your `.env` files. They are listed in `.gitignore` by default.

---

## 📡 API Overview

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint           | Description              | Access  |
|--------|--------------------|--------------------------|---------|
| POST   | `/register`        | Register a new user      | Public  |
| POST   | `/login`           | Login and receive JWT    | Public  |
| GET    | `/me`              | Get logged-in user info  | Private |
| POST   | `/logout`          | Invalidate session       | Private |

### 📚 Course Routes — `/api/courses`

| Method | Endpoint           | Description              | Access         |
|--------|--------------------|--------------------------|----------------|
| GET    | `/`                | Get all courses          | Public         |
| GET    | `/:id`             | Get single course        | Public         |
| POST   | `/`                | Create a new course      | Instructor     |
| PUT    | `/:id`             | Update course details    | Instructor     |
| DELETE | `/:id`             | Delete a course          | Instructor/Admin |
| POST   | `/:id/enroll`      | Enroll in a course       | Student        |

### 📝 Lecture Routes — `/api/lectures`

| Method | Endpoint               | Description              | Access     |
|--------|------------------------|--------------------------|------------|
| POST   | `/`                    | Create a lecture         | Instructor |
| GET    | `/course/:courseId`    | Get lectures by course   | Enrolled   |
| PUT    | `/:id`                 | Update a lecture         | Instructor |
| DELETE | `/:id`                 | Delete a lecture         | Instructor |

### 📈 Progress Routes — `/api/progress`

| Method | Endpoint               | Description              | Access  |
|--------|------------------------|--------------------------|---------|
| GET    | `/`                    | Get user's progress      | Student |
| POST   | `/mark`                | Mark lecture complete    | Student |

### 👥 User Routes — `/api/users`

| Method | Endpoint               | Description              | Access  |
|--------|------------------------|--------------------------|---------|
| GET    | `/`                    | Get all users            | Admin   |
| GET    | `/:id`                 | Get user by ID           | Admin   |
| PUT    | `/:id/role`            | Update user role         | Admin   |
| DELETE | `/:id`                 | Delete user              | Admin   |

---

## 📸 Screenshots

> 🖼️ Screenshots will be added after the first stable release.

| Page                  | Preview                                      |
|-----------------------|----------------------------------------------|
| 🏠 Home Page           | `screenshots/home.png` *(coming soon)*       |
| 🔐 Login Page          | `screenshots/login.png` *(coming soon)*      |
| 📊 Student Dashboard   | `screenshots/student-dashboard.png` *(coming soon)* |
| 📚 Course Page         | `screenshots/course-page.png` *(coming soon)* |
| 🏆 Leaderboard         | `screenshots/leaderboard.png` *(coming soon)* |
| 🛠️ Admin Panel         | `screenshots/admin.png` *(coming soon)*      |

---

## 🔮 Future Improvements

- [ ] 💳 Payment integration (Razorpay / Stripe) for premium courses
- [ ] 📹 Video streaming with adaptive bitrate (HLS)
- [ ] 🤖 AI-powered course recommendations
- [ ] 📱 React Native mobile app
- [ ] 🌍 Multi-language (i18n) support
- [ ] 🧪 Unit & integration tests (Jest + Supertest)
- [ ] 🐳 Docker + Docker Compose setup
- [ ] 📧 Email notifications (Nodemailer / SendGrid)
- [ ] 🔍 Full-text course search with Elasticsearch
- [ ] 📜 Certificate generation on course completion

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request 🚀
```

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) style for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Yateesh Gangwar**

> *"Built with curiosity, shipped with caffeine."* ☕

</div>

---

<div align="center">

⭐ If you found this project helpful, please consider giving it a **star** on GitHub — it helps a lot!

Made with ❤️

</div>
