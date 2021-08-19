const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const multer = require('../middleware/multer-config');


/* DECLARATION DES ROUTES */

// Routes des posts :
router.post('/',  multer, postCtrl.createPost);
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.put('/:id', multer, postCtrl.modifyPost);
router.delete('/:id',  postCtrl.deletePost);

module.exports = router;