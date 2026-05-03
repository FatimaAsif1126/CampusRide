const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Helper: insert notification
const insertNotification = async (userId, type, message) => {
    try {
        const pool = getPool();
        await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Type', sql.NVarChar, type)
            .input('Message', sql.NVarChar, message)
            .query(`INSERT INTO Notifications (UserID, Type, Message, IsRead, CreatedAt)
                    VALUES (@UserID, @Type, @Message, 0, GETDATE())`);
    } catch (err) {
        console.error('Notification failed:', err.message);
    }
};

// POST /api/payments
router.post('/', auth, async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;
        const passengerId = req.user.userId;

        const validMethods = ['Cash', 'Credit Card', 'Debit Card', 'JazzCash', 'EasyPaisa', 'In-App Wallet'];
        if (!validMethods.includes(paymentMethod))
            return res.status(400).json({ success: false, message: 'Invalid payment method' });

        const pool = getPool();

        const bookingResult = await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .input('PassengerID', sql.Int, passengerId)
            .query(`SELECT b.BookingID, b.TotalFare, b.Status, b.RideID
                    FROM Bookings b
                    WHERE b.BookingID = @BookingID AND b.PassengerID = @PassengerID`);

        if (bookingResult.recordset.length === 0)
            return res.status(404).json({ success: false, message: 'Booking not found' });

        const booking = bookingResult.recordset[0];

        if (booking.Status === 'Cancelled')
            return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled booking' });

        const existingPayment = await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .query(`SELECT PaymentID, TransactionStatus FROM Payments WHERE BookingID = @BookingID`);

        if (existingPayment.recordset.length > 0 &&
            existingPayment.recordset[0].TransactionStatus === 'Completed')
            return res.status(400).json({ success: false, message: 'This booking is already paid' });

        // Get ride info for notification
        const rideInfo = await pool.request()
            .input('RideID', sql.Int, booking.RideID)
            .query('SELECT Source, Destination, DriverID FROM Rides WHERE RideID = @RideID');
        const ride = rideInfo.recordset[0];

        const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        if (existingPayment.recordset.length > 0) {
            await pool.request()
                .input('BookingID', sql.Int, bookingId)
                .input('PaymentMethod', sql.VarChar, paymentMethod)
                .input('TransactionID', sql.VarChar, transactionId)
                .query(`UPDATE Payments
                        SET PaymentMethod = @PaymentMethod,
                            TransactionStatus = 'Completed',
                            TransactionID = @TransactionID,
                            Timestamp = GETDATE()
                        WHERE BookingID = @BookingID`);
        } else {
            await pool.request()
                .input('BookingID', sql.Int, bookingId)
                .input('Amount', sql.Decimal(10, 2), booking.TotalFare)
                .input('PaymentMethod', sql.VarChar, paymentMethod)
                .input('TransactionID', sql.VarChar, transactionId)
                .query(`INSERT INTO Payments (BookingID, Amount, PaymentMethod, TransactionStatus, TransactionID)
                        VALUES (@BookingID, @Amount, @PaymentMethod, 'Completed', @TransactionID)`);
        }

        // Notifications — passenger + driver
        await insertNotification(passengerId, 'Payment',
            `Payment of Rs. ${booking.TotalFare} completed via ${paymentMethod} for ride from ${ride.Source} to ${ride.Destination}. TXN: ${transactionId}`);
        await insertNotification(ride.DriverID, 'Payment',
            `A passenger completed payment of Rs. ${booking.TotalFare} via ${paymentMethod} for your ride from ${ride.Source} to ${ride.Destination}.`);

        res.status(201).json({
            success: true,
            message: 'Payment successful!',
            transactionId,
            amount: booking.TotalFare,
            method: paymentMethod
        });

    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/payments/booking/:bookingId
router.get('/booking/:bookingId', auth, async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('BookingID', sql.Int, req.params.bookingId)
            .query(`SELECT p.PaymentID, p.Amount, p.PaymentMethod,
                           p.TransactionStatus, p.TransactionID, p.Timestamp
                    FROM Payments p WHERE p.BookingID = @BookingID`);

        if (result.recordset.length === 0)
            return res.json({ success: true, paid: false });

        res.json({ success: true, paid: true, payment: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/payments/my
router.get('/my', auth, async (req, res) => {
    try {
        const passengerId = req.user.userId;
        const pool = getPool();

        const result = await pool.request()
            .input('PassengerID', sql.Int, passengerId)
            .query(`SELECT p.PaymentID, p.Amount, p.PaymentMethod,
                           p.TransactionStatus, p.TransactionID, p.Timestamp
                    FROM Payments p
                    JOIN Bookings b ON p.BookingID = b.BookingID
                    WHERE b.PassengerID = @PassengerID
                    ORDER BY p.Timestamp DESC`);

        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/payments/wallet — Get wallet balance
router.get('/wallet', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const pool = getPool();

        // Get balance from Users table (preferred method)
        // First ensure column exists
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM sys.columns 
                           WHERE object_id = OBJECT_ID('Users') AND name = 'WalletBalance')
            BEGIN
                ALTER TABLE Users ADD WalletBalance DECIMAL(10,2) DEFAULT 0.00;
            END
        `);

        const result = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT ISNULL(WalletBalance, 0) AS Balance FROM Users WHERE UserID = @UserID');

        res.json({ success: true, balance: result.recordset[0]?.Balance || 0 });
    } catch (error) {
        console.error('Get wallet error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/payments/wallet/topup — Add money to wallet
router.post('/wallet/topup', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.userId;

        if (!amount || amount < 100) {
            return res.status(400).json({ success: false, message: 'Minimum top-up is Rs. 100' });
        }

        const pool = getPool();
        const transactionId = 'TOP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        // Ensure WalletBalance column exists
        await pool.request().query(`
            IF NOT EXISTS (SELECT 1 FROM sys.columns 
                           WHERE object_id = OBJECT_ID('Users') AND name = 'WalletBalance')
            BEGIN
                ALTER TABLE Users ADD WalletBalance DECIMAL(10,2) DEFAULT 0.00;
            END
        `);

        // Update wallet balance
        const updateResult = await pool.request()
            .input('UserID', sql.Int, userId)
            .input('Amount', sql.Decimal(10, 2), amount)
            .query(`UPDATE Users SET WalletBalance = ISNULL(WalletBalance, 0) + @Amount
                    WHERE UserID = @UserID`);

        // Insert a top-up record (using a separate table or skip if Payments table requires BookingID)
        // For wallet top-ups, we're just updating Users table balance
        // No need to insert into Payments since that requires BookingID

        await insertNotification(userId, 'Payment',
            `Rs. ${amount} added to your In-App Wallet. Transaction ID: ${transactionId}`);

        // Get new balance
        const balResult = await pool.request()
            .input('UserID', sql.Int, userId)
            .query('SELECT ISNULL(WalletBalance, 0) AS Balance FROM Users WHERE UserID = @UserID');

        res.json({
            success: true,
            message: `Rs. ${amount} added to wallet!`,
            transactionId,
            newBalance: balResult.recordset[0].Balance
        });

    } catch (error) {
        console.error('Wallet topup error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
});

module.exports = router;