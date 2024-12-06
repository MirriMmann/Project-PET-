const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const auth = require('./middleware/auth'); 
const transactionRoutes = require('./routes/transactions');



dotenv.config();
connectDB();

const app = express();


app.use(cors());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);


mongoose.connection.on('error', (err) => {
    console.error('Ошибка подключения к MongoDB:', err);
});

mongoose.connection.once('open', () => {
    console.log('Соединение с MongoDB установлено');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

