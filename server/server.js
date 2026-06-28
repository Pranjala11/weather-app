const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('MongoDB error:', err));

// Routes
const weatherRoutes = require('./routes/weather');
const historyRoutes = require('./routes/history');

app.use('/api/weather', weatherRoutes);
app.use('/api/history', historyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Weather API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});