const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  console.log('Database connected!');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('DB Error: ', err));
