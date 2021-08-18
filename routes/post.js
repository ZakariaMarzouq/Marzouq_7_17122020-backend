const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

//const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


/* DECLARATION DES ROUTES */

// Routes des posts :
router.post('/',  multer, postCtrl.createPost);
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.put('/:id', multer, postCtrl.modifyPost);
router.delete('/:id',  postCtrl.deletePost);



// Routes des commentaires :
router.post('/',  multer, commentCtrl.createComment);
router.get('/',  commentCtrl.getAllComments);
router.get('/:id',  commentCtrl.getOneComment);
router.put('/:id',  commentCtrl.modifyComment);
router.delete('/:id', commentCtrl.deleteComment);

module.exports = router;