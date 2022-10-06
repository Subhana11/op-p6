const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/'+'',auth, saucesCtrl.getAllThing );
router.post('/',auth, multer, saucesCtrl.createThing );
router.get('/:id',auth, saucesCtrl.getOneThing) ;
router.put('/:id',auth, saucesCtrl.modifyThing);
router.delete('/:id',auth, saucesCtrl.deleteThing);



module.exports = router;