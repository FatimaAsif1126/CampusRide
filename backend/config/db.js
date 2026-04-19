const sql = require('mssql/msnodesqlv8');

const dbConfig = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=Fatima-Asif\\SQLEXPRESS;Database=CampusRide;Trusted_Connection=yes;'
};

let globalPool = null;

const connectDB = async () => {
    try {
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