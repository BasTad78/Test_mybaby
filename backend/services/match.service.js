const db = require('../db');

class MatchService {
    async getAllMatchs() {
        // Récupère les matchs avec les noms des joueurs
        const query = `
            SELECT m.*, 
                   u1.pseudo as joueur1_nom, u1.photo_profil as joueur1_avatar,
                   u2.pseudo as joueur2_nom, u2.photo_profil as joueur2_avatar,
                   b.nombre as baby_nom, l.nom_lieu, l.ville
            FROM Matchs m
            JOIN Utilisateurs u1 ON m.id_joueur1 = u1.id_utilisateur
            JOIN Utilisateurs u2 ON m.id_joueur2 = u2.id_utilisateur
            JOIN Babyfoots b ON m.id_babyfoot = b.id_babyfoot
            JOIN Lieux l ON b.id_lieu = l.id_lieu
            ORDER BY m.date_match DESC, m.heure_match DESC
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    async getMatchById(id) {
        const query = 'SELECT * FROM Matchs WHERE id_match = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    async createMatch(data) {
        // data: { id_joueur1, id_joueur2, id_babyfoot, date_match, heure_match }
        const j1 = parseInt(data.id_joueur1);
        const j2 = parseInt(data.id_joueur2);
        const baby = parseInt(data.id_babyfoot);

        if (isNaN(j1) || isNaN(j2) || isNaN(baby)) {
            throw new Error("IDs de joueurs ou de babyfoot invalides ou manquants.");
        }

        if (j1 === j2) {
            throw new Error("Vous ne pouvez pas vous défier vous-même ! Choisissez un adversaire différent.");
        }

        try {
            const query = `
                INSERT INTO Matchs (id_joueur1, id_joueur2, id_babyfoot, date_match, heure_match, statut_validation)
                VALUES ($1, $2, $3, $4, $5, 'En attente')
                RETURNING *
            `;
            const values = [j1, j2, baby, data.date_match, data.heure_match];
            const { rows } = await db.query(query, values);
            return rows[0];
        } catch (error) {
            console.error('Erreur SQL lors de la création du match:', error.message);
            throw new Error('Erreur base de données: ' + error.message);
        }
    }

    async validateMatch(id, data) {
        // Validation et mise à jour des scores
        const query = `
            UPDATE Matchs 
            SET statut_validation = 'Validé', 
                score_joueur1 = $2, 
                score_joueur2 = $3
            WHERE id_match = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [id, data.score_joueur1, data.score_joueur2]);
        // TODO: Mettre à jour les ELO des joueurs ici
        return rows[0];
    }

    async updateStatus(id, status) {
        const query = `
            UPDATE Matchs 
            SET statut_validation = $2
            WHERE id_match = $1
            RETURNING *
        `;
        const { rows } = await db.query(query, [id, status]);
        return rows[0];
    }
}

module.exports = new MatchService();
