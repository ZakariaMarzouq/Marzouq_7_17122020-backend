const express = require('express');

const authCtrl = require('../controllers/auth');



const router = express.Router();

//CRUD
router.post('/register', authCtrl.signup);
router.post('/login', authCtrl.login);
router.get("/logout", authCtrl.logout);

module.exports = router;