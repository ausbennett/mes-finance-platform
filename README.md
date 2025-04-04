# McMaster Engineering Society Custom Finance Platform

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#) 
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#) 
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#) 
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

[<img src="https://github.com/user-attachments/assets/f3bb5adc-39fa-4e38-a2b8-f687447c07de" width="400">](https://youtu.be/KIvfVeriECg)

Developer Names:

- Adam Podolak
- Austin Bennett
- Christian Petricca
- Evan Sturmey
- Jacob Kish

Date of project start: September 16th, 2024

A custom financial expense reporting platform for the McMaster Engineering Society (MES). This platform streamlines the reimbursement process for 60+ student groups and individuals, offering features like payment requests, intramural funding applications, custom approval workflows, audit tracking, and automated notifications.

The folders and files for this project are as follows:
- docs - Documentation for the project
- refs - Reference material used for the project, including papers
- src - Source code
- test - Test cases

## 🚀 Installation and Development Setup

This project uses:

- **React / Next.js** for the frontend
- **MongoDB** for the database
- **Tailwind CSS** for styling
- **TypeScript** for type safety in both frontend and backend

---

### 🛠️ Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/) (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or via remote cluster)

---

### 📦 Installing Dependencies

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```

2. **Install dependencies for both backend and frontend:**

   - **Backend:**

     ```bash
     cd src/backend
     npm install
     ```

   - **Frontend:**

     ```bash
     cd src/frontend
     npm install
     ```

   > ✅ All dependencies including **Next.js**, **Tailwind CSS**, and **TypeScript** are declared in each `package.json`, so just running `npm install` takes care of everything.

---

### ⚙️ Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following content. **Be sure to replace the placeholder values with your actual credentials and API keys** (do not commit these secrets to version control):

```env
# Application Port
ORT=3001

# Plaid API Credentials
PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID
PLAID_SECRET=YOUR_PLAID_SECRET
PLAID_ENV=sandbox

# Email Service Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=YOUR_EMAIL_ADDRESS
EMAIL_PASS="YOUR_EMAIL_PASSWORD"

# MongoDB Connection URI
MONGODB_URI=YOUR_MONGODB_CONNECTION_URI
```
---

### 💻 Running the Development Environment

To run the full development environment, start both the backend and frontend servers in separate terminals:

1. **Start the Backend:**

   ```bash
   cd src/backend
   npm run dev
   ```

2. **Start the Frontend:**

   ```bash
   cd src/frontend
   npm run dev
   ```

The frontend (Next.js app) will typically be available at:

```
http://localhost:3000
```

The backend (API server) will run on its configured port, such as:

```
http://localhost:5000
```

### 📚 Helpful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
