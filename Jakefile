var fs = require('fs');
var Mocha = require('mocha');

var t = new jake.TestTask('src', function () {
var options = {globals: ['rootTask', 'BaseRoute', 'models', 'helpers', 'dep', 'tunescape', 'locale', 'data', 'Module']};
	options.timeout = 5000;
	
	var mocha = new Mocha(options);
	mocha.reporter('nyan').ui('tdd');

	var files = fs.readdirSync('./test')

	for(var i=0, length = files.length; i < length; i++){
		if(files[i].split('.')[1] == 'js'){	
			mocha.addFile('./test/'+files[i]);
			console.log(files[i]);
		}
	}

	mocha.run(function(){
		console.log('finished');		
	});
});
