const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db'); // ← import connectDB

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;

// ✅ Connect to DB first, THEN start server
connectDB().then((pool) => {
    if (!pool) {
        console.error('❌ Could not connect to database. Server not started.');
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES ✅' : 'NO ❌');
    });
});