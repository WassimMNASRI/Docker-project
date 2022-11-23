	const express = require('express');
	const mongoose = require('mongoose');
	const path = require('path');
	
	const routesStuff = require('./routes/stuff');
	const routesUser = require('./routes/user');
	
	const app = express();
	
	const uri = 'mongodb+srv://LenovoUser:GodAideMe29@lenovocluster.w1z8uzl.mongodb.net/test?retryWrites=true&w=majority';
	
	mongoose.connect(uri, {
		useNewUrlParser : true,
		useUnifiedTopology : true
	}).then(	() => console.log('Connexion établie !'))
	.catch(	() => console.log('Connexion échouée !'));
	
	app.use((req, res, next) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
			next();
	});
	
	
	app.use(express.json());
	
	app.use('/api/stuff', routesStuff);
	app.use('/api/auth', routesUser);
	app.use('/images', express.static(path.join(__dirname,'images')));
	
	module.exports = app;