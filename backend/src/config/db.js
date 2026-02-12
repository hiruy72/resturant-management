const dotenv = require('dotenv');
dotenv.config();                                                     // load env

const { Pool } = require('pg');

console.log('Initializing PostgreSQL pool with:', process.env.DATABASE_URL ? 'Neon connection string' : 'No DATABASE_URL found');
// create and connnect pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//  Testing connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
