//importation de mongoose (mongoose utilise des schémas pour modéliser les données - clé/valeur)
const mongoose = require('mongoose');
//Schéma de données
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0},
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: []},
  usersDisliked: { type: [String], default: []},
});
//exportation du module =>model(avec le nom du model et nom du schéma créé en arguments)
module.exports = mongoose.model('Sauce', sauceSchema);