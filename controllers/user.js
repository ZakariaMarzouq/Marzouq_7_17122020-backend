const bcrypt = require("bcrypt");
const maskdata = require("maskdata");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const User = require("../models").User;

//inscription :

exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
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
        .catch(() =>
          res
            .status(400)
            .json({ message: "Impossible de créer cet Utilisateur !" })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion avec un compte existant en BDD :

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
                      // Génère un token grâce au package jsonwebtoken
                      token: jwt.sign(
                          { userId: user.id },
                          process.env.TOKEN,
                          { expiresIn: '24h' }
                      )
                  });
              })
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
