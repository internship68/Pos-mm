const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        console.log('Connecting to:', process.env.DATABASE_URL.replace(/:.*@/, ':****@'));
        await client.connect();
        console.log('✅ Connection successful!');
        const res = await client.query('SELECT NOW()');
        console.log('Current Time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('❌ Connection failed!');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
