const bcrypt = require("bcrypt");
const maskdata = require("maskdata");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models").User;

// ROUTE > Inscription nouvelle utilisateur
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,        
        email: maskdata.maskEmail2(req.body.email),
        password: hash,
      };
      User.create(user)
        .then(() =>
          res.status(201).json({ message: "Utilisateur créé avec succès !" })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ message: "Impossible de créer cet utilisateur", error })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

// ROUTE > Connexion utilisateur existant en base de donnée
exports.login = (req, res) => {
  User.findOne({ where: { email: maskdata.maskEmail2(req.body.email) } })
    .then((user) => {
      // Si on ne trouve aucun utilisateur
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // Bcrypt compare le mot de passe avec le hash enregistré
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si les résultats sont différents
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user.id,
            // Génère un token grâce au package jsonwebtoken
            token: jwt.sign({ userId: user.id }, process.env.TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ROUTE > Afficher un utilisateur
exports.getOneUser = (req, res) => {
  const userId = req.params.id;
   User.findByPk(userId)
    .then((user) => {
      console.log(userId);
      if (user) {
        res.status(200).json({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
        });
        console.log(user);
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Impossible de trouver cet utilisateur", error })
    );
    console.log(user);

};


// ROUTE > Modifier un utilisateur
exports.modifyUser = (req, res) => {
  const userId = req.params.id;

  const updatedUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    
  };

  User.update(updatedUser, { where: { id: userId } })
    .then(() =>
      res.status(200).json({ message: "Utilisateur modifié avec succès" })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Impossible de modifier cet utilisateur", error })
    );
};

// ROUTE > Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  User.destroy({ where: { id: userId } })
    .then(() =>
      res.status(200).json({ message: "Utilisateur supprimé avec succès" })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "Impossible de supprimer cet utilisateur", error })
    );
};
