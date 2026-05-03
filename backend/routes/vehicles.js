const express = require('express');
const router = express.Router();
const { sql, getPool } = require('../config/db');
const auth = require('../middleware/authMiddleware');

// GET /api/vehicles/my — Get vehicles owned by logged in driver
router.get('/my', auth, async (req, res) => {
    try {
        const driverId = req.user.userId;
        const pool = getPool();
        const result = await pool.request()
            .input('OwnerID', sql.Int, driverId)
            .query(`SELECT VehicleID, Make, Model, Year, Color, LicensePlate, Capacity
                    FROM Vehicles WHERE OwnerID = @OwnerID`);
        res.json({ success: true, data: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/vehicles — Add a new vehicle
router.post('/', auth, async (req, res) => {
    try {
        const { make, model, year, color, licensePlate, capacity } = req.body;
        const ownerId = req.user.userId;
        const pool = getPool();

        const existing = await pool.request()
            .input('LicensePlate', sql.NVarChar, licensePlate)
            .query('SELECT VehicleID FROM Vehicles WHERE LicensePlate = @LicensePlate');

        if (existing.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'This license plate is already registered' });
        }

        await pool.request()
            .input('OwnerID', sql.Int, ownerId)
            .input('Make', sql.NVarChar, make)
            .input('Model', sql.NVarChar, model)
            .input('Year', sql.Int, parseInt(year))
            .input('Color', sql.NVarChar, color)
            .input('LicensePlate', sql.NVarChar, licensePlate)
            .input('Capacity', sql.Int, parseInt(capacity))
            .query(`INSERT INTO Vehicles (OwnerID, Make, Model, Year, Color, LicensePlate, Capacity, AC_Available, InsuranceExpiry)
                    VALUES (@OwnerID, @Make, @Model, @Year, @Color, @LicensePlate, @Capacity, 1, '2027-12-31')`);

        const newVehicle = await pool.request()
            .input('OwnerID', sql.Int, ownerId)
            .input('LicensePlate', sql.NVarChar, licensePlate)
            .query(`SELECT TOP 1 VehicleID, Make, Model, Year, Color, LicensePlate, Capacity 
                    FROM Vehicles WHERE OwnerID = @OwnerID AND LicensePlate = @LicensePlate`);

        res.status(201).json({ success: true, message: 'Vehicle added!', vehicle: newVehicle.recordset[0] });
    } catch (error) {
        console.error('Add vehicle error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;