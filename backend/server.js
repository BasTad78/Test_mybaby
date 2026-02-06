console.log('Starting server.js...');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth.routes');
const babyfootRoutes = require('./routes/babyfoot.routes');
const eventRoutes = require('./routes/event.routes');
const matchRoutes = require('./routes/match.routes');
const userRoutes = require('./routes/user.routes');
const rankingRoutes = require('./routes/ranking.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/babyfoots', babyfootRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ranking', rankingRoutes);

// Route de base pour test
app.get('/', (req, res) => {
    res.send('API My BabyFoot is running');
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Démarrage du serveur et test DB
app.listen(PORT, async () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);

    try {
        const db = require('./db');
        const { rows } = await db.query('SELECT NOW()');
        console.log('✅ Database connection successful:', rows[0].now);

        // Seeding initial si base vide
        const userCheck = await db.query('SELECT COUNT(*) FROM Utilisateurs');
        if (parseInt(userCheck.rows[0].count) === 0) {
            console.log('📝 Database is empty. Seeding initial data...');

            // Seed Roles if missing (though init.sql should have them)
            await db.query(`INSERT INTO Roles (role) VALUES ('joueur'), ('organisateur'), ('admin'), ('visiteur') ON CONFLICT DO NOTHING`);

            // Seed Users
            await db.query(`
                INSERT INTO Utilisateurs (pseudo, email, mot_de_passe, role, elo_score) 
                VALUES 
                ('Alice', 'alice@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'joueur', 1550),
                ('Bob', 'bob@test.com', '$2b$10$abcdefghijklmnopqrstuv', 'joueur', 1450)
            `);

            // Seed Lieux
            await db.query(`
                INSERT INTO Lieux (nom_lieu, adresse, ville, xcoord, ycoord) 
                VALUES 
                ('Le Ballon d''Or', '15 Rue de la Paix', 'Paris', 2.33, 48.86),
                ('Cafe de la Gare', '2 Place de la Gare', 'Lyon', 4.86, 45.76)
            `);

            // Seed Babyfoots (linked to Lieux and Modeles - assuming model 1 exists)
            await db.query(`INSERT INTO Modeles (nom_modele, marque) VALUES ('B90', 'Bonzini') ON CONFLICT DO NOTHING`);
            const models = await db.query('SELECT id_modele FROM Modeles LIMIT 1');
            const lieux = await db.query('SELECT id_lieu FROM Lieux LIMIT 2');

            if (models.rows.length > 0 && lieux.rows.length > 0) {
                await db.query(`INSERT INTO Babyfoots (id_modele, id_lieu, prix, nombre) VALUES ($1, $2, 'Gratuit', 1)`, [models.rows[0].id_modele, lieux.rows[0].id_lieu]);
            }

            console.log('✅ Seeding completed.');
        } else {
            console.log(`📊 Database already contains ${userCheck.rows[0].count} users.`);
        }

    } catch (err) {
        console.error('❌ Database connection or seeding failed:', err.message);
        console.log('💡 TIP: Check if your PostgreSQL server is running and your .env credentials are correct.');
    }
});
