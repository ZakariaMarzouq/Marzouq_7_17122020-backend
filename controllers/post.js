const dotenv = require('dotenv');
const fs = require('fs');

const Post = require('../models').Post;
const User = require('../models').User;

dotenv.config();


/* CREATTION DES ROUTES POST */

//Route > Création d'un post :
exports.createPost = (req, res) => {
    console.log(req.body);
  const post = {

      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
      //imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null,
  };
  Post.create(post)
        .then(() => res.status(201).json({ message: 'Post créé avec succès !' }))
        .catch(error => res.status(400).json({ message: 'Impossible de créer ce post !', error }));
};

//Route > Afficher tous les posts :
exports.getAllPosts = (req, res) => {
  Post.findAll({ order: [['createdAt', 'DESC']], include: { model: User } })
  .then(posts => res.status(200).json(posts))
  .catch(error => res.status(400).json({ message: 'Impossible d\'afficher tous les posts !', error }));
};


//Route > Afficher un post unique :
exports.getOnePost = (req, res) => {
  const id = req.params.id;

  Post.findOne({ where: { id: id }, include: { model: User }})
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({ message: 'Impossible d\'afficher ce post !', error }));
};

//Route > Modifier un post : 
exports.modifyPost = (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId

  const updatedPost = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
  }

  Post.update(updatedPost, { where: { id: id, userId: userId }})
      .then(() => res.status(200).json({ message: 'Post modifié avec succès !' }))
      .catch(error => res.status(400).json({ message: 'Impossible de modifier ce post !', error }));
};

//Route > Suppression d'un post : 

exports.deletePost = (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;

  Post.findOne({ where: { id: id } })
      .then(post => {
          // Si le post a une image, supprimer l'image du dossier '/images' et supprimer le post
          // Sinon supprimer le post uniquement
          if (post.imageUrl) {
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Post.destroy({ where: { id: id, userId: userId }})
                      .then(() => res.status(200).json({ message: 'Post supprimé avec succès !' }))
                      .catch(error => res.status(400).json({ message: 'Impossible de supprimer ce post !', error }));
              })
          } else {
              Post.destroy({ where: { id: id, userId: userId }})
                  .then(() => res.status(200).json({ message: 'Post supprimé avec succès !' }))
                  .catch(error => res.status(400).json({ message: 'Impossible de supprimer ce post !', error }));
          }
      })
      .catch(error => res.status(500).json({ error }))
};

