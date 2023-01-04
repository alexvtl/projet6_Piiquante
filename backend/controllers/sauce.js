const fs = require('fs');

const Sauce = require('../models/Sauce');
const express = require("express");

exports.createThing = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 exports.getOneThing = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (thing) => {
        res.status(200).json(thing);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

 exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete thingObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

 exports.deleteThing = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

 exports.getAllStuff = (req, res, next) => {
    Sauce.find().then(
      (things) => {
        res.status(200).json(things);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.likeSauce = (req, res, next) => {
  console.log(req.body)
  console.log(req.params);

  //format de l'id pour pouvoir aller chercher l'objet correspondant à la base de données
  console.log("--> id en _id");
  console.log({ _id: req.params.id });

  //aller chercher l'objet dans la BD
  Sauce.findOne({ _id: req.params.id })
    .then((objet) => {
      console.log("-->CONTENU résultat promise : objet");
      console.log(objet);
      //like = 1 (likes = +1)
      //=>utilisation de la méthode js includes()
      //=>utilisation de l'opérateur $inc (mongoDB) => incrémentation du like/dislike
      //=>utilisation de l'opérateur $push (mongoDB) => rajout du user dans le tableau
      //=>utilisation de l'opérateur $pull (mongoDB) => suppression du user dans le tableau
      if (!objet.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
        //si l'utilisateur n'a pas encore liker
        console.log("userId pas ds userLiked BD et requête front like à 1");
        //mise à jour de l'objet ds la BD
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.auth.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce liked +1 !" }))
          .catch((error) => res.status(400).json(" error "));
      }

      //like = 0 (likes = 0 => pas de vote)
      if (objet.usersLiked.includes(req.auth.userId) && req.body.like === 0) {
        //si l'utilisateur relike(clic sur le like) => like = 0
        console.log("userId est ds userLiked BD et like = 0");

        //mise à jour de l'objet ds la BD
        Sauce.updateOne(
          {
            _id: req.params.id, //=>pr aller chercher l'objet ds la BD
          },
          {
            $inc: { likes: -1 }, //méthode qui incrémente dans le champ(tableau)
            $pull: { usersLiked: req.auth.userId }, //méthode pour supprimer la valeur du tableau
            // $push: { usersDisliked: req.body.userId}
          }
        )
          .then(() => res.status(201).json({ message: "Sauce liked = 0 !" }))
          .catch((error) => res.status(400).json(" error "));
      }
      // ***************** Dislikes :
      if (
        !objet.usersDisliked.includes(req.auth.userId) &&
        req.body.like === -1
      ) {
        //si l'utilisateur n'a pas encore disliker
        console.log(
          "userId est ds userDisliked BD et likes = -1/ ou dislikes = 1"
        );

        //mise à jour de l'objet ds la BD
        Sauce.updateOne(
          {
            _id: req.params.id, //=>pr aller chercher l'objet ds la BD
          },
          {
            $inc: { dislikes: 1 }, //méthode qui incrémente dans le champ(tableau)
            $push: { usersDisliked: req.auth.userId }, //méthode pour supprimer la valeur du tableau
            // $push: { usersDisliked: req.body.userId}
          }
        )
          .then(() =>
            res.status(201).json({ message: "Sauce disliked = +1  (like= -1) !" })
          )
          .catch((error) => res.status(400).json(" error "));
      }

      //Après un like = -1 on met un dislike à 0 (likes = 0 => dislikes = 1, on enlève le dislike)
      if (
        objet.usersDisliked.includes(req.auth.userId) && // => si l'utilisateur re-dislike => dislike = 0/like = 0
        req.body.like === 0
      ) {
        console.log("userId est ds userDisliked BD et like = 0");

        //mise à jour de l'objet ds la BD
        Sauce.updateOne(
          {
            _id: req.params.id, //=>pr aller chercher l'objet ds la BD
          },
          {
            $inc: { dislikes: -1 }, //méthode qui incrémente dans le champ(tableau)
            $pull: { usersDisliked: req.auth.userId }, //méthode pour supprimer la valeur du tableau(enlève l'userId du tableau)
          }
        )
          .then(() => res.status(201).json({ message: "Sauce disliked = 0 !" }))
          .catch((error) => res.status(400).json(" error "));
      }
    })
    .catch((error) => res.status(404).json(" error "));

  //like = -1 (dislikes = +1)

  //dislike = 0 (dislikes = 0, pas de vôte)
};