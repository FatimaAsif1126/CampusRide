const sql = require('mssql');

const dbConfig = {
    server: "localhost\\SQLEXPRESS",
    database: "CampusRide",
    user: "campusride_user",
    password: "campusride123",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

let globalPool = null;

const connectDB = async () => {
    try {
        console.log('Connecting to SQL Server...');
        globalPool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server');
        return globalPool;
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        return null;
    }
};

const getPool = () => {
    if (!globalPool) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return globalPool;
};

module.exports = { sql, getPool, connectDB };