const express = require('express');
const router = express.Router();
const trailController = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */
router.get('/', trailController.index);
router.get('/new', isLoggedIn, trailController.new);
router.get('/:id', trailController.show);
router.post('/', isLoggedIn, trailController.create);
router.get('/:id/details', trailController.edit);
// router.delete('/:id', trailController.delete);
// router.put('/:id', trailController.update);

module.exports = router;