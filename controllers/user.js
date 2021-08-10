const bcrypt = require("bcrypt");
const maskdata = require("maskdata");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models").User;

/* CREATION DES ROUTES D'AUTHENTIFICATIONS UTILISATEURS */

// ROUTE > Inscription utilisateur :
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: maskdata.maskEmail12(req.body.email),
        password: hash,
      };
      User.create(user)
        .then(() =>
          res.status(201).json({ message: "Utilisateur créé avec succes !" })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ message: "L'utilisateur n'a pas pu être créé :" + error })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

//ROUTE > Connexion avec un compte existant en BDD :
exports.login = (req, res, next) => {
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
            // Fonction d'encodage d'un nouveau token
            token: jwt.sign(
              { userId: user.id },
              process.env.TOKEN, 
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//ROUTE > Pour afficher un Utilisateur présent dans la base de donnée :

exports.getOneUser = (req, res, next) => {
  const userId = req.body.id;

  User.findByPk(userId)
    .then(user => {
      if(user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({message : 'Utilisateur non trouvé !'});
      }
    })
    .catch(error => res.status(500).json({message: 'Impossible de trouver l\'utilisateur recherché !', error}));
};
