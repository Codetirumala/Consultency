const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const ceoRoutes = require('./routes/ceo');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const clientRoutes = require('./routes/client');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ceo', auth, ceoRoutes);
app.use('/api/employee', auth, employeeRoutes);
app.use('/api/client', auth, clientRoutes);

// TODO: Add routes for Employee and Client Manager

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 