(function(){

	var fs = require('fs'),
		moment = require('moment');

	function isFunction(x) {
	  return Object.prototype.toString.call(x) == '[object Function]';
	}

	var map = {
		employees : 'number_of_employees',
		age: function(d){
			if(!d['founded_year']) return -1;

			var to_month = moment().month(), to_year = moment().year(), to_date = moment().date();
			if(d['ipo']){
				to_date = d['ipo']['pub_day'] || 1;
				to_month = d['ipo']['pub_month'] || 1;
				to_year = d['ipo']['pub_year'];
			}
			else if(d['acquisition']){
				to_date = d['acquisition']['acquired_day'] || 1;
				to_month = d['acquisition']['acquired_month'] || 1;
				to_year = d['acquisition']['acquired_year'];
			}

			return Math.round(moment( [ to_year, to_month, to_date ] ).diff( moment([d['founded_year'], (d['founded_month'] || 1), (d['founded_day'] || 1)]) , 'months', true ) );
		},

		milestones: function(d){
			return d['milestones'].length || 0;
		},
		competitors: function(d){
			return d['competitions'].length || 0;
		},

		offices: function(d){
			return d['offices'].length || 0;
		},
		products: function(d){
			return d['products'].length || 0;
		},
		providers: function(d){
			return d['providerships'].length || 0;
		},
		investments_by: function(d){
			return d['investments'].length || 0;
		},
		acquisitions_by: function(d){
			return d['acquisitions'].length || 0;
		},
		funding_rounds: function(d){
			return d['funding_rounds'].length || 0;
		},
		funding_per_round: function(d){
			var rounds = d['funding_rounds'],
				sum = 0, c = 0;

			rounds.forEach(function(r){
				if(r['raised_amount']){
					sum += r['raised_amount'];
					c++;
				}
			});
			return parseFloat((sum/c).toFixed(3)) || 0;
		}
	}

	var DATA_DIR = './d/', count = 0, vals = {};
	
	var files = fs.readdirSync(DATA_DIR);

	
	files.forEach(function(d){
		if(fs.statSync(DATA_DIR + d).isDirectory()){
			var dirFiles = fs.readdirSync(DATA_DIR + d);

			dirFiles.forEach(function(f){
				
				var data;
				try{
					data = JSON.parse(fs.readFileSync(DATA_DIR + d + '/' + f));
				}
				catch(err){
					return;
				}

				var features = [];

				for(var prop in map){
					if(typeof(map[prop]) == "function"){
						features.push(map[prop](data));
					}
					else{
						features.push(data[map[prop]] || 0);
					}

				}

				if(features[0] == 0 || features[1] < 0) return;
				if( (data['acquisition'] || data['ipo'])){
					features.push(1);
				}
				else{
					features.push(0);
				}		

				fs.appendFileSync('./train/train_'+d, features.join(',') + '\n');		
				fs.appendFileSync('./train/comp_'+d, f.slice(0,-3) + '\n');		
	            
					
			});
			console.log(d);
		}
	});

})();