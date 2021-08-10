const dotenv = require('dotenv');
const fs = require('fs');

const Post = require('../models').Post;
const User = require('../models').User;

dotenv.config();

//Route > Création d'un post :

exports.createPost = (req, res, next) => {
  const post = {
    userId: req.body.userId,
    title: req.body.title,
    content: req.body.content,
    imageUrl:  `${req.protocol}://${req.get("host")}/images/${
      req.file.filename}` 
    
  }
  Post.create(post)
        .then(() => res.status(201).json({ message: 'Post créé avec succès !' }))
        .catch(error => res.status(400).json({ message: 'Impossible de créer ce post !', error }));
}

