// imporation du module express
const express = require('express');
const router = express.Router();

// définition des chemins sauces, autorisation, et multer qui serviront pour le router
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

// chaque router a sont CRUD(GET, POST, PUT, DELETE) avec son chemin et ses droits
router.get('/'+'',auth, saucesCtrl.getAllSauces );
router.post('/',auth, multer, saucesCtrl.createSauces );
router.get('/:id',auth, saucesCtrl.getOneSauces) ;
router.put('/:id',auth, multer, saucesCtrl.modifySauces);
router.delete('/:id',auth, saucesCtrl.deleteSauces);
router.post("/:id/like", auth, saucesCtrl.likeSauces);

module.exports = router;