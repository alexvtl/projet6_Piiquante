
//besoin du package de criptage(npm install --save bcrypt)
const bcrypt = require('bcrypt')
//token(npm install --save jsonwebtoken) package qui créé des token et qui les vérifie
const jwt = require('jsonwebtoken');
//besoin du model User car on va enregistrer et lire des users
const User = require('../models/User')

// Fonction pour enregistrer un utilisateur :
//fonction pr hacher le mot de passe, asynchrone(qui prend du tps) donc un bloc ".then" et un bloc ".catch"
//on appelle la méthode "hash"
//on récupère le password envoyé par le front
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)//10( nbre de tour d'algorithme pour hasher)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash //=> on enregistre le cryptage pr ne pas stocker le mot de pass
        });
        user.save() //=> enregistrement ds la BD
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  //Fonction pour connecter un utilisateur existant (utilisateur enregistré) :
  exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})//sert de filtre, de sélecteur avec la valeur transmise par l'utilisateur
    .then(user => {
       if (user === null){
           res.status(401).json({message: 'paire identifiant/mot de passe incorrecte'})
       }else{
           bcrypt.compare(req.body.password, user.password)//méthode "compare" de bcrypt(on récup ce qui est transmit et on compare avec celui de la BD)
           .then( valid => {
               if(!valid){
                   res.status(401).json({message: 'paire identifiant/mot de passe incorrecte'})
               }else{
                   res.status(200).json({
                       userId: user._id,
                       token: jwt.sign(//appel de la fonction "sign" qui prend en arguments :
                           {userId: user._id},//user identifié par son id / => données que l'on veut encoder à l'intérieur du token(payload)
                           'RANDOM_TOKEN_SECRET',//ici la clé secrète pr l'encodage
                           {expiresIn: '24h'}
                       )
                   });
               }
           })
           .catch(error => res.status(500).json({ error}))
       }
   })
   .catch(error => res.status(500).json({ error}))   
   }