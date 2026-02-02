const router = require('express').Router();
const masterController = require('../controllers/masterController');

// GET /api/master
router.get('/', masterController.getMasterData);

module.exports = router;