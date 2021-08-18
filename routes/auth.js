const express = require('express');

const authCtrl = require('../controllers/auth');
//const auth = require('../middleware/auth');

const router = express.Router();

//CRUD
router.post('/register', authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;