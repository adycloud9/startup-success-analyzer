

var http = require('http'),
    fs = require('fs');


var crunchData = function(options){

    options = options || {};

    var DATA_DIR = options.dir || 'data/',
        API_KEY = options.api_key || 'ks4xuyqxktyrfd5fhgk33ycc';
    
    return {
        get: function(url, callback){

            http.get('http://api.crunchbase.com/v/1/' + url +'.js?api_key=' + API_KEY, function(res) {
                res.setEncoding('utf8');
                var data = '';

                res.on('data', function (chunk) {
                    data += chunk;
                });

                res.on('end', function(){
                    callback(data);
                });

            });              
        },

        save: function(url, filename){
            this.get(url, function(data){
                fs.writeFileSync( DATA_DIR + filename, data);
            });
        }  
    }
}
/*
    Company Listing Data

    crunchData().save('companies', 'companies_list.txt');
*/
module.exports = crunchData;