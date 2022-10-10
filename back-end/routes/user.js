// imporation du module express
const express = require('express');
const router = express.Router();

// création du chemin user dans controllers
const userCtrl = require('../controllers/user');

// les routes signup et login sont en methode POST
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// export du router
module.exports = router;