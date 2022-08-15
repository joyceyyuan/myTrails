var express = require('express');
var router = express.Router();
const trailController = require('../controllers/trails');
const isLoggedIn = require('../config/auth')
/* GET users listing. */
router.get('/', trailController.index);
router.get('/new', isLoggedIn, trailController.new);
// /trails
router.get('/:id', trailController.show);
router.post('/', isLoggedIn, trailController.create);

module.exports = router;