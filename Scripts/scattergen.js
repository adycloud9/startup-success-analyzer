(function(){

	var fs = require('fs');

	var trainMap = {
		'employees': 0,
		'age': 1,
		'milestones': 2,
		'competitors': 3,
		'offices': 4,
		'products': 5,
		'providers': 6,
		'investments_by': 7,
		'acquisitions_by': 8,
		'funding_rounds': 9,
		'funding_per_round': 10,
		'success': 11
	};


	/*
	--------------------------------
	 	Config
	--------------------------------
	*/
	var trainUse = ['funding_rounds', 'funding_per_round'],
		category = 'computer';



	var train_data = fs.readFileSync('train/train_' + category);
	train_data = train_data.toString().split('\n');

	var comp_data = fs.readFileSync('train/comp_' + category);
	comp_data = comp_data.toString().split('\n');

	var p_data = fs.readFileSync('train/p_train_' + category);
	p_data = p_data.toString().split('\n');

	if(!(train_data.length == comp_data.length || comp_data.length == p_data.length)){
		console.log('Unequal Data size: ', train_data.length, comp_data.length, p_data.length);
		return;
	}


	var n = train_data.length;
	var out = '';
	
	// CSV Header
	fs.writeFileSync('scatter_' + category + '_' + trainUse.join('_') + '.csv', 'name,' + trainUse.join(',') + ',success,success_chance\n');

	for(var i = 0; i < n; i++){
		if(!comp_data[i]) continue;

		var output = [];
		var comp_params = train_data[i].split(',');

		output.push(comp_data[i]);
		trainUse.forEach(function(u){
			output.push(comp_params[trainMap[u]]);
		});
		output.push(comp_params[trainMap['success']]);
		output.push(p_data[i]);

		out += output.join(',') + '\n';
	}

	fs.appendFileSync('scatter_' + category + '_' + trainUse.join('_') + '.csv', out);

})();