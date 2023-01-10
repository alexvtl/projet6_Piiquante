//CREATION DE L'APPLICATION(avec Express)
//importation de express(framework de Node qui va aider à la création et à la gestion du server Node)
const express = require('express');

const app = express();

 //helmet aide à protéger notre application de certaines des vulnérabilités du web, en configurant de manière appropriée les en-tête HTTP liés à la sécurité
const helmet = require("helmet");
app.use(helmet());

//importation de dotenv (variables d'environnement)
require("dotenv").config();

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
const path = require('path');
//pour transformer le corps (le body) en json objet javascript utilisable
app.use(express.json());//=> permet d'acceder au corps de la requête(en réceptionnant les requêtes qui sont du json, un content-type json) et met à disposition ds req.body
//Accès à l'API avec des headers définis / Gérer les CORS avec des Headers spécifiques de contrôle d'accès définis
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
//chemin complet de l'image sur le disk (accéder aux images du dossier images)
//À l'aide du package path et de la méthode Express static , on peut servir des ressources statiques, telles que les images

module.exports = app;

const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://${process.env.MONGODB_LOGIN}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));