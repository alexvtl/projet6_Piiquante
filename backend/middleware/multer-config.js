//configuration de multer (npm install --save multer)
//MULTER permet de gérer les fichiers entrants dans les requêtes HTTP
//Création du middleware avec multer pour capturer les fichiers et les enregistrer sur le serveur
const multer = require('multer');// => multer est un package de gestion de fichiers


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
//=> méthode pr configurer le chemin et le nom(fichiers entrants)
  destination: (req, file, callback) => {
    callback(null, 'images'); //null=pas d'erreur ici, et nom du fichier de stockage, soit "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //on génère le nom(on récup le nom d'origine, parcours le nom, supprime les espaces par des "_")
    const extension = MIME_TYPES[file.mimetype];//extension du dico qui correspond au mimetype du fichier envoyé par le front
    callback(null, name + Date.now() + '.' + extension);
  }
});

//on exporte le middleware de multer configuré
//=> on enregistre un simple fichier qui est une image dans le storage
module.exports = multer({storage: storage}).single('image');