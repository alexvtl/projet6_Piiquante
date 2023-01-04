const express = require('express');

const app = express();

 //helmet aide à protéger notre application de certaines des vulnérabilités du web, en configurant de manière appropriée les en-tête HTTP liés à la sécurité
const helmet = require("helmet");
app.use(helmet());

//importation de dotenv (variables d'environnement)
require("dotenv").config();

const stuffRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
const path = require('path');

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;

const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://${process.env.MONGODB_LOGIN}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log(process.env.MONGODB_LOGIN))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log('Connexion à MongoDB réussie !')