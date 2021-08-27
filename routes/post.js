const express = require('express');
const router = express.Router();

//const auth = require('../middleware/auth');

const postCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const multer = require('../middleware/multer-config');



/* DECLARATION DES ROUTES */

// Routes des posts :
router.post('/', multer, postCtrl.createPost);
router.get('/', postCtrl.getAllPosts);
router.get('/:id', postCtrl.getOnePost);
router.put('/:id', multer, postCtrl.modifyPost);
router.delete('/:id',  postCtrl.deletePost);
router.delete('/admin/:id', postCtrl.deletePostByAdmin);

// Routes des commentaires :
router.post('/:postId/comments', commentCtrl.createComment);
router.get('/:postId/comments',  commentCtrl.getAllComments);
router.get('/:postId/comments/:id',  commentCtrl.getOneComment);
router.put('/:postId/comments/:id',  commentCtrl.modifyComment);
router.delete('/:postId/comments/:id', commentCtrl.deleteComment);
router.delete('/admin/:postId/comments/:id', commentCtrl.deleteCommentByAdmin);

module.exports = router;