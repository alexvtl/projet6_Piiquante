const mongoose = require('mongoose');
//installation du package : "npm install --save mongoose-unique-validator"(== impossible de s'inscrire plusieurs fois avec la mm adress mail)
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//on applique ce validateur au shéma(en tant que plugin) avant d'en faire un model : 
userSchema.plugin(uniqueValidator);//empêche d'utiliser la même adresse mail pour plusieurs inscriptions

module.exports = mongoose.model('User', userSchema);