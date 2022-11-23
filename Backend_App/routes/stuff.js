	const express = require('express');
	
	const stuffCtrl = require('../controllers/stuff');
	const auth = require('../middelwares/auth');
	const multer = require('../middelwares/multer-config');
	
	const router = express.Router();
	
	router.get('/', stuffCtrl.getALLObjects);
	router.get('/:id', stuffCtrl.getOneObject);
	router.post('/', auth, multer, stuffCtrl.createObject);
	router.put('/:id', auth,multer, stuffCtrl.modifyObject);
	router.delete('/:id', auth, stuffCtrl.deleteObject);
	
	module.exports = router;