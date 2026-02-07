const matchService = require('../services/match.service');

const matchController = {

    /**
     * Récupérer la liste des matchs
     */
    getAllMatchs: async (req, res) => {
        try {
            const filters = req.query;
            const matchs = await matchService.getAllMatchs(filters);
            res.status(200).json(matchs);
        } catch (error) {
            console.error('Erreur récupération matchs:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Récupérer un match par ID
     */
    getMatchById: async (req, res) => {
        try {
            const { id } = req.params;
            const match = await matchService.getMatchById(id);
            if (!match) {
                return res.status(404).json({ message: 'Match non trouvé' });
            }
            res.status(200).json(match);
        } catch (error) {
            console.error('Erreur récupération match:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Créer un nouveau match
     */
    createMatch: async (req, res) => {
        try {
            const matchData = req.body;
            console.log('--- Incoming Create Match Request ---');
            console.log('Data:', JSON.stringify(matchData, null, 2));

            const newMatch = await matchService.createMatch(matchData);
            console.log('✅ Match created:', newMatch.id_match);
            res.status(201).json(newMatch);
        } catch (error) {
            console.error('❌ Erreur création match:', error.message);
            res.status(400).json({
                message: error.message,
                details: "Veuillez vérifier que tous les champs sont valides (Joueurs, Lieu, Date/Heure)."
            });
        }
    },

    /**
     * Valider un match
     */
    validateMatch: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await matchService.validateMatch(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur validation match:', error);
            res.status(400).json({ message: error.message });
        }
    },
    /**
     * Mettre à jour le statut d'un match (Accepté/Refusé/Annulé)
     */
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await matchService.updateStatus(id, status);
            res.status(200).json(result);
        } catch (error) {
            console.error('Erreur mise à jour statut match:', error);
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = matchController;
