const bcrypt = require("bcrypt");
const maskdata = require("maskdata");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models").User;
const Op = require('sequelize').Op;
dotenv.config();

// ROUTE > Inscription nouvelle utilisateur
exports.signup = (req, res) => {
  // Si l'email éxiste dans la bd
  User.findOne({ where: { email: maskdata.maskEmail2(req.body.email) } })
    .then((result) => {
      if (result) {
        res.status(400).json({
          message: "Adresse existante !",
        });
      } else {
        // Hashage et Salage du MDP
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hashPassword) {
            const newUser = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: maskdata.maskEmail2(req.body.email),
              password: hashPassword,
              isAdmin: req.body.isAdmin
            };

            // Création de l'user
            User.create(newUser)
              .then((result) => {
                res.status(201).json({
                  message: "Utilisateur créé avec succès !",
                  user: newUser,
                });
              })
              .catch((error) => {
                res.status(400).json({
                  message: 'Impossible de créer cet utilisateur', error
                });
              });
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Connexion d'un user
exports.login = (req, res) => {
  User.findOne({ where: { email: maskdata.maskEmail2(req.body.email) } })
      .then(user => {
          // Si on ne trouve aucun utilisateur
          if (!user) {
              return res.status(401).json({ error: 'Utilisateur non trouvé !' })
          }
          // Bcrypt compare le mot de passe avec le hash enregistré
          bcrypt.compare(req.body.password, user.password)
              .then(valid => {
                  // Si les résultats sont différents
                  if (!valid) {
                      return res.status(401).json({ error: 'Mot de passe incorrect !' })
                  }
                  res.status(200).json({
                      userId: user.id,
                      userName: user.firstName,
                      // Génère un token grâce au package jsonwebtoken
                      token: jwt.sign(
                        { userId: user.id, isAdmin: user.isAdmin },
                          process.env.TOKEN_KEY_SECRET,
                          { expiresIn: '24h' }
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};


exports.getOneUser = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "Utilisateur non trouvé !",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: " Un problème est survenu ! ",
      });
    });
};

// Voir tous les Users
exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: " Un problème est survenu ! ",
      });
    });
};

// Mise à jour d'un utilisateur
exports.modifyUser = (req, res) => {
  const userId = req.params.id;

  const updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };


  User.update(updatedUser, { where: { id: userId } })
    .then((result) => {
      res.status(200).json({
        message: "Utilisateur mis à jour avec succès !",
        User: userUpdate,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Un problème est survenu lors de la modification ! ",
        error: error,
      });
    });
};

// Supprimer d'un utilisateur
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.destroy({ where: { id: userId } })
    .then((result) => {
      res.status(200).json({
        message: "Utilisateur supprimé avec succès !",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Un problème est survenu lors de la supression! ",
        error: error,
      });
    });
};

// Afficher tous les utilisateurs sauf l'admin
exports.getAllUsersByAdmin = (req, res) => {
    const userId = req.params.id;
    
    User.findAll({
        where: {
            id: {
                [Op.not]: userId
            }
        }
    }).then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ message: 'Impossible d\'afficher les utilisateurs', error }));

}

// Modifier le rôle d'un utilisateur
exports.modifyUserRole = (req, res) => {
    const id = req.params.id;

    let updatedRole = {
        isAdmin: req.body.isAdmin
    }

    User.update(updatedRole, { where: { id: id }})
        .then(() => res.status(200).json({ message: 'Rôle de l\'utilisateur modifié avec succès' }))
        .catch(error => res.status(400).json({ message: 'Impossible de modifier le rôle de cet utilisateur', error }));
}
