const bcrypt = require("bcrypt");
const maskdata = require("maskdata");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models").User;

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
                          { userId: user.id },
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
}