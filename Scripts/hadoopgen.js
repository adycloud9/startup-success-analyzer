(function(){

	var fs = require('fs');

	var format = fs.readFileSync('hadoop/format');
	format = format.toString().split(/\s/);
	format.shift();

	var cats = fs.readdirSync('hadoop/categories');

	for(var i = 0; i<format.length; i++){
		if(!format[i*3]) continue;
		var attr = format[i*3];
		console.log(format);
		var output_acquired = [], output_unacquired = [];


		cats.forEach(function(cat, j){
			var catData = fs.readFileSync('hadoop/categories/' + cat + '/' + cat);
			catData = catData.toString().split('\n');	
			
			catData[0] = catData[0].split(/\s/);
			catData[1] = catData[1].split(/\s/);

			catData[0].shift();
			catData[1].shift();

			console.log(catData[0], catData[1]);

			output_acquired.push({
				cat: cat,
				mean: parseFloat(catData[0][i*3]),
				std: parseFloat(catData[0][i*3 + 1]),
				count: parseFloat(catData[0][i*3 + 2]),
			});	

			output_unacquired.push({
				cat: cat,
				mean: parseFloat(catData[1][i*3]),
				std: parseFloat(catData[1][i*3 + 1]),
				count: parseFloat(catData[1][i*3 + 2]),
			});	
		});

		output_acquired.sort(function(a, b){
			return b.mean - a.mean;
		});

		output_unacquired.sort(function(a, b){
			return b.mean - a.mean;
		});

		fs.writeFileSync('hadoop/json/'+attr+'_acquired.js', JSON.stringify(output_acquired) );
		fs.writeFileSync('hadoop/json/'+attr+'_unacquired.js', JSON.stringify(output_unacquired) );
	}


})();