require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
});

// Force l'utilisation du schéma mybaby pour chaque nouvelle connexion
pool.on('connect', (client) => {
    console.log('Connected to DB');
    client.query('SET search_path TO mybaby, public', (err) => {
        if (err) console.error('Error setting search_path', err);
    });
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool, // Expose pool if needed closer management
};
