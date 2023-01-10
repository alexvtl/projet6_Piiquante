//Pour Vérifier Les Informations d'Authentification envoyées par le user
//importation de "jsonwebtoken"
const jwt = require('jsonwebtoken');
require("dotenv").config();
 //on exporte notre middleware
module.exports = (req, res, next) => {
//récup du token ds le header et le spliter(c-a-d diviser la chaine de caracteres en 1 tableau)autour de l'espace qui se trouve entre le mot clé bearer et le token
   try {
       const token = req.headers.authorization.split(' ')[1];
//récup du token du header authorization de la req entrante(le token contiendra le mot clé Bearer)/split sert à tt récup apres l'espace ds le header(dc pas "bearer mais bien que le token")
       const decodedToken = jwt.verify(token, `${process.env.RANDOM_TOKEN_SECRET}`);
       //décodage du token/en arg : token récup et clé secrète
       const userId = decodedToken.userId;
       req.auth = {
         //rajout de l'id, récupéré du token,à l'objet request pr que les diff routes puissent l'exploiter
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};