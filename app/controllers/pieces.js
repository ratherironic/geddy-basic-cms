var formidable = require('formidable'),
	fs = require('fs'),
	path = require('path');

var strategies = require('../helpers/passport/strategies')
  , authTypes = geddy.mixin(strategies, {local: {name: 'local account'}});;

var Pieces = function() {
	this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
	//display all pieces
	this.index = function(req, resp, params) {
		var self = this,
			User = geddy.model.User;

		User.first({id: this.session.get('userId')}, function (err, data) {
      		params.user = null;
      		params.authType = null;
      		
      		if (data) {
    			params.user = data;
    			params.authType = authTypes[self.session.get('authType')].name;
    		}

	    	geddy.model.Piece.all(function(err, pieces) {
	    		self.respond({params: params, user: params.user,  pieces: pieces});
	    	});
	    });
	};

	//add a piece
	this.add = function (req, resp, params) {
    	this.respond({params: params});
	};

	//diplay a piece
	this.show = function(req, resp, params) {
		var self = this;
		geddy.model.Piece.load(params.id, function(err, piece) {
			self.respond({params: params, piece: piece});
		});
	};

	//create a piece[if logged in]
	this.create = function(req, resp, params) {

		var self = this,
			piece,
			pieceData = {},
			uploadedFile = params.picture,
			form = new formidable.IncomingForm(),
			uploadFile,
			savedFile;
		
		form.parse(req, function(err, fields, files) {
			if(!err) {
				pieceData.title = fields.title; 
				pieceData.description = fields.description;
				pieceData.link = fields.link;
			}
		});
		
		form.onPart = function (part) {
			if (!part.filename) {
				form.handlePart(part);
        		return;
			}

			pieceData.picture = part.filename;

			// Handle each data chunk as data streams in
		      part.addListener('data', function (data) {
		        // Initial chunk, set the filename and create the FS stream
		        if (!uploadedFile) {
		          uploadedFile = encodeURIComponent(part.filename);
		          savedFile = fs.createWriteStream(path.join('public', 'uploads', uploadedFile));
		        			        // Write each chunk to disk
		        	savedFile.write(data);
		        }
		      });
		      // The part is done
		      part.addListener('end', function () {
		        var err;
		        // If everything went well, close the FS stream
		        if (typeof uploadedFile !== 'undefined') {
		          savedFile.end();
		        } else {
		          err = new Error('Something went wrong in the upload.');
		          self.error(err);
		        }
		      });
		   };


		form.addListener('end', function () {
			piece = geddy.model.Piece.create(pieceData);
			piece.save(function(err, data) {
				if(err) {
					params.errors = err;
					self.transfer('add');
				} else {
					self.redirect({controller: this.name});
				}
			});
		});

		form.parse(req);
	};

	//edit a piece[if logged in]
	this.edit = function(req, resp, params) {
		var self = this;
		geddy.model.Piece.load(params.id, function(err, piece) {
			self.respond({params: params, piece: piece})
		})
	};

	//update piece[if logged in]
	this.update = function (req, resp, params) {
    	// Save the resource, then display the item page
    	var self = this;

    	geddy.model.Piece.load(params.id, function(err, piece) {
	      	var pieceData = {},
				uploadedFile = params.picture,
				form = new formidable.IncomingForm(),
				uploadFile,
				savedFile;
			
			form.parse(req, function(err, fields, files) {
				if(!err) {
					pieceData.title = fields.title; 
					pieceData.description = fields.description;
					pieceData.link = fields.link;
				}
			});
			
			form.onPart = function (part) {
				if (!part.filename) {
					form.handlePart(part);
	        		return;
				}

				pieceData.picture = part.filename;

				// Handle each data chunk as data streams in
			      part.addListener('data', function (data) {
			        // Initial chunk, set the filename and create the FS stream
			        if (!uploadedFile) {
			          uploadedFile = encodeURIComponent(part.filename);
			          savedFile = fs.createWriteStream(path.join('public', 'uploads', uploadedFile));
			        			        // Write each chunk to disk
			        	savedFile.write(data);
			        }
			      });
			      // The part is done
			      part.addListener('end', function () {
			        var err;
			        // If everything went well, close the FS stream
			        if (typeof uploadedFile !== 'undefined') {
			          savedFile.end();
			        } else {
			          err = new Error('Something went wrong in the upload.');
			          self.error(err);
			        }
			      });
			   };


			form.addListener('end', function () {
				piece.updateAttributes(pieceData);
				piece.save(function(err, data) {
					if(err) {
						params.errors = err;
						self.transfer('add');
					} else {
						self.redirect({controller: this.name});
					}
				});
			});

			form.parse(req);
    	});
  };

	//delete a piece[if logged in]
	this.destroy = function(req, resp, params) {
		var self = this;
	    geddy.model.Pice.remove(params.id, function(){
	      self.redirect({controller: self.name});
	    });
	};
}

exports.Pieces = Pieces;