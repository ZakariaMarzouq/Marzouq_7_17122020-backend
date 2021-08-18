//const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models").User;

exports.getOneUser = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
  .then(result => {
      if(result) {
          res.status(200).json(result);
      } else {
          res.status(404).json({
              message: 'Utilisateur non trouvé !'
          })
      }
  })
  .catch(error => {
      res.status(500).json({
          message: " Un problème est survenu ! "
      })
  });
}

// Voir tous les Users
exports.getAllUsers = (req, res) => {
  User.findAll()
  .then(result => {
      res.status(200).json(result);
  })
  .catch(error => {
      res.status(500).json({
          message: " Un problème est survenu ! "
      });
  });
}

// Mise à jour d'un utilisateur
exports.modifyUser = (req, res) => {
  const userId = req.params.id;

  const updatedUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
  }

  // bcrypt.hash(req.body.password, 10)
  // .then (hashPassword => {
      // Add userUpdate
  // })
  // .catch(error => {
  //     res.status(500).json({
  //         message: 'Something went wrong',
  //         error: error
  //     });
  // })
  User.update(updatedUser, { where: { id: userId }})
  .then(result => {
      res.status(200).json({
          message: 'Utilisateur mis à jour avec succès !',
          User: userUpdate
      });
  })
  .catch(error => {
      res.status(500).json({
          message: 'Un problème est survenu lors de la modification ! ',
          error: error
      });
  });
}

// Supprimer d'un utilisateur
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.destroy({where: {id: userId}})
  .then(result => {
      res.status(200).json({
          message: 'Utilisateur supprimé avec succès !',
      });
  })
  .catch(error => {
      res.status(500).json({
          message: 'Un problème est survenu lors de la supression! ',
          error: error
      });
  })
}