//besoin d'express pr créer un router
const express = require('express');
//création du router
const router = express.Router();
const userCtrl = require('../controllers/user');

//Création de 2 routes (Post) car le front va également envoyer des infos (adresse-mail & mot2pass):
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;