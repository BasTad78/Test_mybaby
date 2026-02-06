const express = require('express');
const router = express.Router();
const babyfootController = require('../controllers/babyfoot.controller');

// Récupérer tous les lieux (pour la carte par exemple)
router.get('/lieux', babyfootController.getAllLieux);

// Récupérer tous les babyfoots (avec jointures lieux/modeles)
router.get('/', babyfootController.getAllBabyfoots);

// Récupérer les modèles
router.get('/modeles', babyfootController.getAllModeles);

// Créer un babyfoot
router.post('/', babyfootController.createBabyfoot);

module.exports = router;
