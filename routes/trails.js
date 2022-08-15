const express = require('express');
const router = express.Router();
const trailController = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */
router.get('/', trailController.index);
router.get('/new', isLoggedIn, trailController.new);
router.get('/:id', trailController.show);
router.post('/', isLoggedIn, trailController.create);

module.exports = router;