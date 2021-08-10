const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


/* DECLARATION DES ROUTES */

// Routes des post :
router.post('/', auth, multer, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);



// Routes des commentaires :
router.post('/', auth, multer, commentCtrl.createComment);
router.get('/', auth, commentCtrl.getAllComments);
router.get('/:id', auth, commentCtrl.getOneComment);
router.put('/:id', auth, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;