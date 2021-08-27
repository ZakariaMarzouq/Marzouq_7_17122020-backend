const Comment = require('../models').Comment;
const User = require('../models').User;


/* ROUTES DES POST COMMENTAIRES */

// ROUTE > Ajouter un nouveau commentaire :
exports.createComment = (req, res, next) => {
    const comment = {
        comContent: req.body.comContent,
        postId: req.params.postId,
        userId: req.body.userId
    };

    Comment.create(comment)
        .then(() => res.status(201).json({ message: 'Commentaire créé avec succès !' }))
        .catch(error => res.status(400).json({ message: 'Impossible de créer ce commentaire !', error }));
};

// ROUTE > Afficher tous les commentaires :
exports.getAllComments = (req, res, next) => {
    const postId = req.params.postId;

    Comment.findAll({ order: [['createdAt', 'ASC']], where: { postId: postId }, include: { model: User } })
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(400).json({ message: 'Impossible d\'afficher tous les commentaires !', error }));
};

// ROUTE > Afficher un commentaire :
exports.getOneComment = (req, res, next) => {
    const id = req.params.id;
    const postId = req.params.postId;

    Comment.findOne({ where: { id: id, postId: postId }, include: { model: User } })
        .then(comment => {
            if(comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({ message: 'Commentaire non trouvé !' })
            }
        })
        .catch(error => res.status(400).json({ message: 'Impossible d\'afficher ce commentaire !', error }));
};

// ROUTE > Modifier un commentaire :
exports.modifyComment = (req, res, next) => {
    const id = req.params.id;
    const updatedComment = { comContent: req.body.comContent };
    const postId = req.params.postId;
    const userId = req.body.userId;

    Comment.update(updatedComment, { where: { id: id, postId: postId, userId: userId } })
        .then(() => res.status(200).json({ message: 'Commentaire modifié avec succès !' }))
        .catch(error => res.status(400).json({ message: 'Impossible de modifier ce commentaire !', error }));
};

// ROUTE > Supprimer un commentaire :
exports.deleteComment = (req, res, next) => {
    const id = req.params.id;
    const postId = req.params.postId;
    const userId = req.body.userId;

    Comment.destroy({ where: { id: id, postId: postId, userId: userId } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé avec succès !' }))
        .catch(error => res.status(400).json({ message: 'Impossible de supprimer ce commentaire !', error }))
};

// ROUTE > Supprimer un commentaire par l'admin
exports.deleteCommentByAdmin = (req, res) => {
    const id = req.params.id;
    const postId = req.params.postId;

    Comment.destroy({ where: { id: id, postId: postId } })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé avec succès' }))
        .catch(error => res.status(400).json({ message: 'Impossible de supprimer ce commentaire', error }))
};