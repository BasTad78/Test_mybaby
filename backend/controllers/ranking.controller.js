const userService = require('../services/user.service');

const rankingController = {
    /**
     * Récupère le classement global des joueurs
     */
    getRanking: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            // Le classement est généralement basé sur elo_score
            // Les services retournent déjà les utilisateurs sans mot de passe
            const sortedUsers = users.sort((a, b) => (b.elo_score || 0) - (a.elo_score || 0));
            res.status(200).json(sortedUsers);
        } catch (error) {
            console.error('Erreur récupération classement:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Récupère le classement d'un utilisateur spécifique
     */
    getUserRanking: async (req, res) => {
        try {
            const { id } = req.params;
            const users = await userService.getAllUsers();
            const sortedUsers = users.sort((a, b) => (b.elo_score || 0) - (a.elo_score || 0));

            const userIndex = sortedUsers.findIndex(u => u.id_utilisateur === parseInt(id));
            if (userIndex === -1) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            res.status(200).json({
                rank: userIndex + 1,
                user: sortedUsers[userIndex]
            });
        } catch (error) {
            console.error('Erreur récupération rang utilisateur:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = rankingController;
