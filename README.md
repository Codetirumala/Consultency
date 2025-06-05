# 🚀 Techspot Consultancy Dashboard

[![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN-blueviolet?style=for-the-badge&logo=stackshare)](https://stackshare.io/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, full-stack consultancy management platform featuring dedicated dashboards for CEOs, Employees, and Clients. Stylish, fast, and built for real-world operations.

---

## ✨ Features

### 🧑‍💼 CEO Dashboard
- 👥 Add, edit, or delete employees & clients  
- 🔒 Manage access (active/inactive)  
- 📊 Company-wide statistics overview  
- 🛡️ Secure JWT-based authentication  
- 🎨 Responsive UI with animated loaders  

### 👷 Employee Dashboard
- 📁 View assigned projects & details  
- ⏱ Submit timesheets easily  
- 🧾 Edit profile info (skills, department, etc.)  
- 🧡 Orange/white animated UI with Lottie  

### 🧑‍💻 Client Dashboard
- 📂 Track assigned projects and their statuses  
- 🏢 View company & assigned team member info  
- 🎬 Clean dashboard with smooth loaders  

---

## 🛠 Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React, Axios, React Router, Lottie, Framer Motion, Emotion, React Toastify |
| Backend     | Node.js, Express |
| Database    | MongoDB + Mongoose |
| Auth        | JWT (JSON Web Tokens) |

---

## ⚙️ Setup Instructions

### ✅ Prerequisites
- 📦 Node.js (v16+ recommended)  
- ☁️ MongoDB (local or Atlas)  
- 📁 npm or yarn  

---

### 🔽 1. Clone the Repo
```bash
git clone https://github.com/your-username/techspot-consultancy-dashboard.git
cd techspot-consultancy-dashboard
```

### 📦 2. Install Dependencies

**Backend**
```bash
cd server
npm install
```

**Frontend**
```bash
cd ../client
npm install
```

### 🧾 3. Configure Environment

In the `server/` folder, create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### ▶️ 4. Start the Application

**Backend**
```bash
cd server
npm start
```

**Frontend**
```bash
cd ../client
npm start
```

---

### 🔗 Open:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend:** [http://localhost:5000](http://localhost:5000)

---

## 🗂 Project Structure

Techspot-Consultancy/
├── client/           # React frontend
│   └── src/
│       ├── components/
│       ├── assets/animations/
│       ├── pages/
│       ├── utils/
│       └── ...
├── server/           # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── ...
└── README.md

🎨 Customization Tips
✏️ Lottie Animations: Replace .json files in client/src/assets/animations/

🎨 Color Theme: Customize orange/white palette in global CSS or Emotion theme provider

🔐 Security Notes
🔑 All sensitive operations are protected with JWT tokens

⚠️ Never share your .env file or API keys publicly

🧪 Validate user roles & permissions on every route

📄 License
This project is licensed for educational and internal use only.
📝 For commercial inquiries, please contact the author.

💡 Final Note
Building a smarter consultancy one dashboard at a time!
Techspot Consultancy — where operations meet elegance. 💼✨

---

## 🎨 Customization Tips

- ✏️ **Lottie Animations:** Replace `.json` files in `client/src/assets/animations/`
- 🎨 **Color Theme:** Customize orange/white palette in global CSS or Emotion theme provider

---

## 🔐 Security Notes

- 🔑 All sensitive operations are protected with JWT tokens
- ⚠️ **Never share your `.env` file or API keys publicly**
- 🧪 Validate user roles & permissions on every route

---

## 📄 License

This project is licensed for educational and internal use only.  
📝 For commercial inquiries, please contact the author.

---

## 💡 Final Note

_Building a smarter consultancy one dashboard at a time!_  
**Techspot Consultancy — where operations meet elegance.** 💼✨