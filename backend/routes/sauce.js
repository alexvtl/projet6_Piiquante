
const express = require('express');
const router = express.Router();
//Création d'un routeur (avec Express)
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.getAllStuff);
router.post('/', auth, multer, sauceCtrl.createThing);
router.get('/:id', auth, sauceCtrl.getOneThing);
router.put('/:id', auth, multer, sauceCtrl.modifyThing);
router.delete('/:id', auth, sauceCtrl.deleteThing);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
module.exports = router;