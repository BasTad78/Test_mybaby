const db = require('../db');

class UserModel {
    /**
     * Trouve un utilisateur par son email ou son pseudo.
     */
    async findByIdentifier(identifier) {
        const query = 'SELECT * FROM Utilisateurs WHERE email = $1 OR pseudo = $2';
        const { rows } = await db.query(query, [identifier, identifier]);
        return rows[0];
    }

    /**
     * Trouve un utilisateur par son email.
     */
    async findByEmail(email) {
        const query = 'SELECT * FROM Utilisateurs WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    /**
     * Trouve un utilisateur par son ID.
     */
    async findById(id) {
        const query = 'SELECT * FROM Utilisateurs WHERE id_utilisateur = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    /**
     * Crée un nouvel utilisateur.
     */
    async create(userData) {
        // Construction dynamique des colonnes pour INSERT
        const keys = Object.keys(userData);
        const values = Object.values(userData);

        const columns = keys.join(', ');
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

        const query = `
            INSERT INTO Utilisateurs (${columns})
            VALUES (${placeholders})
            RETURNING *
        `;

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    /**
     * Met à jour la date de dernière activité.
     */
    async updateLastActivity(userId) {
        const query = 'UPDATE Utilisateurs SET date_derniere_activite = NOW() WHERE id_utilisateur = $1';
        await db.query(query, [userId]);
    }

    /**
     * Récupère tous les utilisateurs.
     */
    async findAll() {
        const query = 'SELECT * FROM Utilisateurs ORDER BY pseudo ASC';
        const { rows } = await db.query(query);
        return rows;
    }

    /**
     * Met à jour les statistiques (ELO, etc.).
     */
    async updateStats(userId, stats) {
        const keys = Object.keys(stats);
        const values = Object.values(stats);

        // Ex: "elo_score = $2, nombre_parties = $3, ..."
        // Note: userId est le param $1
        const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');

        const query = `
            UPDATE Utilisateurs 
            SET ${setClause}
            WHERE id_utilisateur = $1
            RETURNING *
        `;

        const { rows } = await db.query(query, [userId, ...values]);
        return rows[0];
    }
}

module.exports = new UserModel();
