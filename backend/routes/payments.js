const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');
const auth = require('../middleware/authMiddleware');

// POST /api/payments — Create a payment for a booking
router.post('/', auth, async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;
        const passengerId = req.user.userId;

        const validMethods = ['Cash', 'Credit Card', 'Debit Card', 'JazzCash', 'EasyPaisa', 'In-App Wallet'];
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({ success: false, message: 'Invalid payment method' });
        }

        const pool = getPool();

        // Verify booking belongs to this user and is Confirmed
        const bookingResult = await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .input('PassengerID', sql.Int, passengerId)
            .query(`
                SELECT b.BookingID, b.TotalFare, b.Status, b.RideID
                FROM Bookings b
                WHERE b.BookingID = @BookingID AND b.PassengerID = @PassengerID
            `);

        if (bookingResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const booking = bookingResult.recordset[0];

        if (booking.Status === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled booking' });
        }

        // Check if already paid
        const existingPayment = await pool.request()
            .input('BookingID', sql.Int, bookingId)
            .query(`SELECT PaymentID, TransactionStatus FROM Payments WHERE BookingID = @BookingID`);

        if (existingPayment.recordset.length > 0 && 
            existingPayment.recordset[0].TransactionStatus === 'Completed') {
            return res.status(400).json({ success: false, message: 'This booking is already paid' });
        }

        // Generate a fake transaction ID
        const transactionId = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        // Simulate processing delay (in real life this is the gateway call)
        // Insert or update payment record
        if (existingPayment.recordset.length > 0) {
            // Update existing pending payment
            await pool.request()
                .input('BookingID', sql.Int, bookingId)
                .input('PaymentMethod', sql.VarChar, paymentMethod)
                .input('TransactionID', sql.VarChar, transactionId)
                .query(`
                    UPDATE Payments
                    SET PaymentMethod = @PaymentMethod,
                        TransactionStatus = 'Completed',
                        TransactionID = @TransactionID,
                        Timestamp = GETDATE()
                    WHERE BookingID = @BookingID
                `);
        } else {
            // Insert new payment
            await pool.request()
                .input('BookingID', sql.Int, bookingId)
                .input('Amount', sql.Decimal(10, 2), booking.TotalFare)
                .input('PaymentMethod', sql.VarChar, paymentMethod)
                .input('TransactionID', sql.VarChar, transactionId)
                .query(`
                    INSERT INTO Payments (BookingID, Amount, PaymentMethod, TransactionStatus, TransactionID)
                    VALUES (@BookingID, @Amount, @PaymentMethod, 'Completed', @TransactionID)
                `);
        }

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

// GET /api/payments/booking/:bookingId — Get payment status for a booking
router.get('/booking/:bookingId', auth, async (req, res) => {
    try {
        const pool = getPool();
        const result = await pool.request()
            .input('BookingID', sql.Int, req.params.bookingId)
            .query(`
                SELECT p.PaymentID, p.Amount, p.PaymentMethod, 
                       p.TransactionStatus, p.TransactionID, p.Timestamp
                FROM Payments p
                WHERE p.BookingID = @BookingID
            `);

        if (result.recordset.length === 0) {
            return res.json({ success: true, paid: false });
        }

        res.json({ success: true, paid: true, payment: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/payments/my — Get all payments made by logged in user
router.get('/my', auth, async (req, res) => {
    try {
        const passengerId = req.user.userId;
        const pool = getPool();

        const result = await pool.request()
            .input('PassengerID', sql.Int, passengerId)
            .query(`
                SELECT p.PaymentID, p.Amount, p.PaymentMethod,
                       p.TransactionStatus, p.TransactionID, p.Timestamp
                FROM Payments p
                JOIN Bookings b ON p.BookingID = b.BookingID
                WHERE b.PassengerID = @PassengerID
                ORDER BY p.Timestamp DESC
            `);

        res.json({ success: true, data: result.recordset });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;