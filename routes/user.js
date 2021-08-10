const express = require('express');
const router = express.Router();

//Routes pour les utilisateurs
router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router;