const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('../config/db');
const router = express.Router();

// ==================== SIGNUP ====================
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, phone, role, gender } = req.body;

        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const pool = getPool();

        // Check if email already exists
        const checkUser = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT UserID FROM Users WHERE Email = @Email');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.request()
            .input('Name', sql.VarChar, name)
            .input('Email', sql.VarChar, email)
            .input('PasswordHash', sql.VarChar, hashedPassword)
            .input('Phone', sql.VarChar, phone)
            .input('Role', sql.VarChar, role)
            .input('Gender', sql.Char, gender || null)  // ← ADD THIS
            .query(`
        INSERT INTO Users (Name, Email, PasswordHash, Phone, Role, Gender, CreatedAt)
        VALUES (@Name, @Email, @PasswordHash, @Phone, @Role, @Gender, GETDATE())
    `);
        // Get the new user
        const newUser = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT UserID, Name, Email, Role, Phone, Gender FROM Users WHERE Email = @Email');
        const user = newUser.recordset[0];

        // Generate token
        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, role: user.Role },
            process.env.JWT_SECRET || 'mysecretkey',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                phone: user.Phone,
                gender: user.Gender || null
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const pool = getPool();

        // Find user
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT UserID, Name, Email, PasswordHash, Role, Phone, Gender FROM Users WHERE Email = @Email');
        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.recordset[0];

        // Check password
        const isValid = await bcrypt.compare(password, user.PasswordHash);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.UserID, email: user.Email, role: user.Role },
            process.env.JWT_SECRET || 'mysecretkey',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                role: user.Role,
                phone: user.Phone,
                gender: user.Gender || null  
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;