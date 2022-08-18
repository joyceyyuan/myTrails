const express = require('express');
const router = express.Router();
const trailController = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */
router.get('/', trailController.index);
router.get('/new', isLoggedIn, trailController.new);
// router.get('/mytrails', isLoggedIn, trailController.myTrails);
router.get('/:id', trailController.show);
router.post('/', isLoggedIn, trailController.create);

router.get('/:id/edit', trailController.edit);
router.delete('/:id', trailController.delete);
router.put('/:id', trailController.update);

module.exports = router;