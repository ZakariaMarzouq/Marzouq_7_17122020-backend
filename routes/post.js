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
router.post('/:postId/comments',  multer, commentCtrl.createComment);
router.get('/:postId/comments',  commentCtrl.getAllComments);
router.get('/:postId/comments/:id',  commentCtrl.getOneComment);
router.put('/:postId/comments/:id',  commentCtrl.modifyComment);
router.delete('/:postId/comments/:id', commentCtrl.deleteComment);

module.exports = router;