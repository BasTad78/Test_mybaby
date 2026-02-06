const babyfootService = require('../services/babyfoot.service');

const babyfootController = {
    /**
     * Récupère tous les babyfoots avec filtres
     */
    getAllBabyfoots: async (req, res) => {
        try {
            const filters = req.query;
            const babyfoots = await babyfootService.getAllBabyfoots(filters);
            res.status(200).json(babyfoots);
        } catch (error) {
            console.error('Erreur récupération babyfoots:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Récupère tous les modèles
     */
    getAllModeles: async (req, res) => {
        try {
            const modeles = await babyfootService.getAllModeles();
            res.status(200).json(modeles);
        } catch (error) {
            console.error('Erreur récupération modèles:', error);
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * Crée un nouveau babyfoot (et éventuellement le lieu)
     */
    createBabyfoot: async (req, res) => {
        try {
            const data = req.body;
            // Si le lieu n'existe pas encore (id_lieu absent du payload), on peut le créer?
            // Pour l'instant, supposons que le frontend envoie les IDs corrects ou les infos de création.
            const newBabyfoot = await babyfootService.createBabyfoot(data);
            res.status(201).json(newBabyfoot);
        } catch (error) {
            console.error('Erreur création babyfoot:', error);
            res.status(400).json({ message: error.message });
        }
    },

    /**
     * Récupère tous les lieux
     */
    getAllLieux: async (req, res) => {
        try {
            const filters = req.query;
            const lieux = await babyfootService.getAllLieux(filters);
            res.status(200).json(lieux);
        } catch (error) {
            console.error('Erreur récupération lieux:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = babyfootController;
