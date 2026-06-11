# Valuexpert Consulting Platform

A comprehensive business consulting and registration platform connecting Indian businesses with verified CAs and legal professionals. Built with a modern tech stack to provide fast, smart, and transparent services.

## Architecture

This project is structured as a monorepo containing two main parts:
- `/client`: The Next.js React frontend application.
- `/server`: The Node.js Express backend API.

## Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or higher)
- **npm** (or yarn)
- **Git**

---

## 🚀 Full Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/veaglespace-Tech/valuexpert.git
cd valuexpert
```

### 2. Backend Setup (`/server`)

The backend handles the API requests, user authentication, and database interactions.

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `server` directory and configure the following required variables:
   ```env
   # Server Port
   PORT=5003

   # Database Connection String (MySQL / Prisma)
   DATABASE_URL="mysql://root:password@localhost:3306/valuexpert"

   # JWT Secret for Authentication
   JWT_SECRET="your_super_secret_jwt_key_here"
   
   # Frontend URL for CORS
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   Apply Prisma migrations to setup your database schema.
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start the Backend Development Server:**
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5003`*

---

### 3. Frontend Setup (`/client`)

The frontend is built with Next.js and Tailwind CSS.

1. **Open a new terminal and navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `client` directory:
   ```env
   # API URL pointing to the local backend
   NEXT_PUBLIC_API_URL=http://localhost:5003

   # Environment
   NODE_ENV=development

   # Firebase Configuration (Required for specific integrations)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *The frontend should now be running on `http://localhost:3000`*

---

## 🛠️ Production Deployment

### Building for Production

**Frontend:**
```bash
cd client
npm run build
npm run start
```

**Backend:**
```bash
cd server
npm run build
npm run start
```

For VPS deployments, the project includes an ecosystem configuration for PM2, GitHub Actions for CI/CD, and Docker configuration if containerization is preferred.

## 🤝 Contribution
Ensure that you create a feature branch before making any changes. Commits should follow standard conventional commit messages (e.g., `feat:`, `fix:`, `style:`).