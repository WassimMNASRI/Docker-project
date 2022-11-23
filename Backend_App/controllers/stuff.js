	const fs = require('fs');
	
	const Thing = require ('../models/thing');
	
	
	exports.getALLObjects = (req, res, next) => {
		Thing.find()
		.then(	things => {res.status(200).json(things)}	)
		.catch(	error => {res.status(400).json({error})}	);
	};
	
	exports.getOneObject = (req, res, next) => {
		Thing.findOne({_id : req.params.id})
		.then (	thing => {res.status(200).json(thing)}	)
		.catch (	error => {res.status(404).json({error})}	);
	};
	
	exports.createObject = (req, res, next) => {
		
		const thingObject = req.file ? {
			...JSON.parse(req.body.thing),
			imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		}:{...req.body};
		
		//const thingObject = JSON.parse(req.body.thing);
			
		delete thingObject._id;
		delete thingObject._userId;
			   
		const thing = new Thing({
			...thingObject,
			userId: req.auth.userId
		});
			 
		thing.save()
		.then(() => { res.status(201).json({message: 'Objet créé !'})})
		.catch(error => { res.status(400).json( { error })})
			
	};
	
	exports.modifyObject = (req, res, next) => {
		
		const ThingObject = req.file ? {
			...JSON.parse(req.body.thing),
			imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		} : {...req.body};
		
		delete ThingObject.userId;
		
		Thing.findOne({_id : req.params.id})
		.then(
			thing => {
				if (thing.userId != req.auth.userId) { res.status(401).json({message : 'NOT AUTHORIZED !'})	}
				else {
					const oldfilename = thing.imageUrl.split('/images/')[1];
					const newfilename = ThingObject.imageUrl.split('/images/')[1];
					
					if (oldfilename != newfilename){
						fs.unlink(`images/${oldfilename}`, () => {
							Thing.updateOne({ _id: req.params.id}, { ...ThingObject, _id: req.params.id})
							.then(() => res.status(200).json({message : 'Objet modifié!'}))
							.catch(error => res.status(401).json({ error }));
						});
					} else {
						if (thing.title == ThingObject.title) {
							Thing.updateOne({ _id: req.params.id}, { ...ThingObject, _id: req.params.id})
							.then(() => res.status(200).json({message : 'Objet modifié!'}))
							.catch(error => res.status(401).json({ error }));
						} else {
							const bruttitle = ThingObject.title.split(' ').join('_');
							
							const splitedOldname = `${oldfilename}`.split('.');
							const splitednbr = (splitedOldname.length) - 1;
							const extension = `${oldfilename}`.split('.')[splitednbr];
							
							const newfilename = bruttitle + Date.now() + '.' + extension;
							
							ThingObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${newfilename}`;
							
							fs.rename(`images/${oldfilename}`,`images/${newfilename}`, () => {
								Thing.updateOne({ _id: req.params.id}, { ...ThingObject, _id: req.params.id})
								.then(() => res.status(200).json({message : 'Objet modifié!'}))
								.catch(error => res.status(401).json({ error }));
							});
						}
					}
				}
			}
		).catch(
			error => {	res.status(400).json({error})	}
		);
		
	};
	/*exports.modifyObject = (req, res, next) => {

		const thingObject = req.file ? {
			   ...JSON.parse(req.body.thing),
			   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
			} : { ...req.body };
		 
			delete thingObject._userId;
			Thing.findOne({_id: req.params.id})
			   .then((thing) => {
					   if (thing.userId != req.auth.userId) {
						   res.status(401).json({ message : 'Not authorized'});
						} else {
							const OldFile = thing.imageUrl.split('/images/')[1];
							const NewFile = thingObject.imageUrl.split('/images/')[1];
							if ( OldFile != NewFile ) {
								fs.unlink(`images/${OldFile}`, () => {
									Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
									.then(() => res.status(200).json({message : 'Objet modifié!'}))
									.catch(error => res.status(401).json({ error }));
								});
							} else {
								Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
								.then(() => res.status(200).json({message : 'Objet modifié!'}))
								.catch(error => res.status(401).json({ error }));
							}
						}
			   })
			   .catch((error) => {
				   res.status(400).json({ error });
			   });
	};
	*/
	
	exports.deleteObject = (req, res, next) => {
	
		Thing.findOne({ _id: req.params.id})
			   .then(thing => {
				   if (thing.userId != req.auth.userId) {
					   res.status(401).json({message: 'Not authorized'});
				   } else {
					   const filename = thing.imageUrl.split('/images/')[1];
					   fs.unlink(`images/${filename}`, () => {
						   Thing.deleteOne({_id: req.params.id})
							   .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
							   .catch(error => res.status(401).json({ error }));
					   });
				   }
			   })
			   .catch( error => {
				   res.status(500).json({ error });
			});
	};