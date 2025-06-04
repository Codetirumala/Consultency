# Techspot Consultancy Dashboard

A modern, full-stack web application for managing consultancy operations, featuring dedicated dashboards for CEO, Employees, and Clients. Built with React, Node.js, Express, and MongoDB, the platform offers a beautiful, responsive UI with Lottie animations and a clean orange/white theme.

## Features

### CEO Dashboard
- View, add, update, and delete employees and clients
- Manage user access (active/inactive)
- View company-wide stats
- Secure authentication and session management
- Modern, responsive UI with animated loaders

### Employee Dashboard
- View assigned projects and project details
- Submit and view timesheets
- Edit personal profile (name, contact, department, skills, etc.)
- Animated, visually appealing dashboard with orange/white theme

### Client Dashboard
- View assigned projects and their status
- View company information
- See assigned team members for each project
- Animated loader and clean, professional UI

## Tech Stack
- **Frontend:** React, React Router, Axios, Lottie, Framer Motion, Emotion, React Toastify
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT-based authentication

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the Repository
```bash
https://github.com/your-username/techspot-consultancy-dashboard.git
cd techspot-consultancy-dashboard
```

### 2. Install Dependencies
#### Backend
```bash
cd server
npm install
```
#### Frontend
```bash
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server` directory with the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Start the Application
#### Start Backend
```bash
cd server
npm start
```
#### Start Frontend
```bash
cd ../client
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000).

## Project Structure
```
Techspot-Consultancy/
├── client/           # React frontend
│   └── src/
│       └── components/
│       └── assets/animations/
│       └── ...
├── server/           # Node.js/Express backend
│   └── models/
│   └── routes/
│   └── middleware/
│   └── ...
└── README.md
```

## Customization
- **Lottie Animations:** Replace the JSON files in `client/src/assets/animations/` with your preferred Lottie files for a unique look.
- **Theme:** Easily adjust the orange/white color scheme in the CSS variables for your brand.

## Security
- All sensitive operations are protected by JWT authentication.
- Do **not** share or commit any credentials or secrets.

## License
This project is for educational and internal use. For commercial use, please contact the author.