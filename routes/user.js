const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');


// Routes des utilisateurs
router.post('/register', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/', userCtrl.getAllUsers)
router.get('/user/:id', userCtrl.getOneUser);
router.put('/user/:id', userCtrl.modifyUser);
router.delete('/user/:id', userCtrl.deleteUser);

// Routes des admins
router.get('/admin/users/:id', userCtrl.getAllUsersByAdmin);
router.put('/admin/users/:id', userCtrl.modifyUserRole);

module.exports = router;