(function(){

    var fs = require('fs'),
        crunchData = require('./crunchData');
    
    var category_filename = process.argv[2],
        fileIndex = +category_filename.slice(-5)[0],
        apiKey = process.argv[3],
        NUM_THREADS = 3;

    crunchData = crunchData({api_key: apiKey});

    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    function safe_tags_replace(str) {
        return str.replace(/[&<>]/g, replaceTag);
    }
    var logger = (function(){
        
        function getTimeString(){
            var d = new Date();
            return d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds();
        }

        //filename = 'LOG-' + getTimeString() + '.txt';
        filename = 'LOG' + fileIndex +'.txt';
        return {
            log: function(msg){
                fs.appendFileSync( filename, '[' + getTimeString() + '] ' + msg  + '\n');
            },

            error: function(msg){
                fs.appendFileSync( filename, '!! [' + getTimeString() + '] ERROR: ' + msg  + '\n');
            }
        }
    })();    


    var categories, num_companies = 0;
    categories = fs.readFileSync( category_filename );
    try{
        categories = JSON.parse(categories);
        logger.log('Successfully parsed ' + category_filename);
        
        num_categories = 0;
        for(var cat in categories){
            num_companies += categories[cat].company_count;
        }
    }
    catch(e){
        logger.error('Unable to parse ' + category_filename + ': ' + e.message);
        process.exit(1);
    }


    var prune_props = ['permalink', 'blog_url', 'crunchbase_url', 'blog_feed_url', 'image', 'screenshots'];
    var cats = Object.keys(categories);

    var indexes = (function(chunk_size){
        var start,
            company_index,
            category_index,
            total_count, complete_count = 0;

        var stream = [],
            base = 0;

        try{
            start = '' + fs.readFileSync( 'data/ana_companies_data_indexes_' + fileIndex + '.txt' );
        }
        catch(e){
            logger.error( 'Unable to open index file: data/ana_companies_data_indexes_' + fileIndex + '.txt' );
            process.exit(1);
        }

        start = start.split(',');
        if(start.length < 3){
            logger.error( 'Invalid Index Data in: data/ana_companies_data_indexes_' + fileIndex + '.txt' );
            process.exit(1);
        }

        category_index = +start[0];
        company_index = +start[1];
        total_count = +start[2];
        base = complete_count = total_count;
        
        return{
            getNext: function(){
                
                var ret = [total_count, category_index, company_index];
                if(total_count % chunk_size == 0){
                    stream.push({id:total_count, count: 0, data:'', cat: -1, comp: -1});
                }

                if( company_index == categories[cats[category_index]].company_count - 1 ){
                    category_index++;
                    company_index = 0;
                }
                else{
                    company_index++;
                }

                if(total_count % chunk_size == chunk_size - 1){
                    var stream_index = Math.floor((total_count - base)/chunk_size);
                    stream[stream_index].cat = category_index;
                    stream[stream_index].comp = company_index;
                } 

                total_count++;

                return ret; 
            },

            count: function(){
                return complete_count;
            },

            save: function(id, data){
                var stream_index = Math.floor((id - base) / chunk_size);
                //console.log(id, base, stream_index);
                stream[stream_index].data += data;
                stream[stream_index].count++;
                complete_count++;

                if(stream[0].count == chunk_size){
                    while(stream.length && stream[0].count >= chunk_size){
                        var chunk = stream.shift();
                        fs.appendFileSync( 'data/ana_companies_data_' + fileIndex + '.txt', chunk.data );
                        logger.log('Saved chunk (' + chunk.id + ',' + chunk.cat + ',' + chunk.comp +')');
                        fs.writeFileSync( 'data/ana_companies_data_indexes_' + fileIndex + '.txt', chunk.cat + ',' + chunk.comp + ',' + (chunk.id + chunk_size) );
                        logger.log('Updated indexes (' + chunk.id + ',' + chunk.cat + ',' + chunk.comp +')');
                        //console.log('Saving chunk ' + chunk.id, chunk.cat, chunk.comp);
                    }
                    base = stream[0].id;
                }
            }
        }

    })(NUM_THREADS);


    var totTime = 0, rate = 0, eta = 0, c= 0, t = num_companies;
    console.log(t);
    var lastTime = process.hrtime();

    function nextCompany(id, cat_index, comp_index){

        if( cat_index == cats.length){
            return;
        }

        var company = categories[cats[cat_index]].companies[comp_index];
        crunchData.get('company/'+company.id, function(data){
            var company_data;
            try{
                company_data = JSON.parse(safe_tags_replace(data));
            }
            catch(e){ 
                logger.error('Failed to parse data (' + id + ',' + cat_index + ',' + comp_index +'): ' + e.message );

                fs.appendFileSync( 'data/ana_companies_data_fail_' + fileIndex + '.txt', cats[cat_index] + ',' + company.id + '\n');
                fs.appendFileSync( 'data/ana_companies_data_fail_' + fileIndex + '.txt', data + '\n');
                company_data = {};  
            }
            

            for(var j = 0; j < prune_props.length; j++){ delete company_data[prune_props[j]]; }

            var data_string = JSON.stringify(company_data);
            data_string = (data_string == '{}') ? '' : (',"'+ company.id + '":' + data_string);

            indexes.save( id, data_string );

            c++;

            var nextTime = process.hrtime();
            totTime += (nextTime[0] - lastTime[0]);
            lastTime = nextTime;

            rate = c/totTime;
            eta = Math.floor((t-indexes.count())/rate);

            var hours = Math.floor(eta / 3600),
                minutes = Math.floor((eta % 3600) / 60),
                seconds = (eta % 3600) % 60;

            var etaString = ((hours > 0) ? (hours + 'h ') : '') + ((minutes > 0) ? (minutes + 'm ') : '') + seconds + 's';

            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(((indexes.count()/t)*100).toFixed(2) + '% (' + indexes.count() + '/' + t + ') ' + rate.toFixed(3) + '/s [ETA: ' + etaString +']');
            //console.log(cat_index, comp_index, cats[cat_index], categories[cats[cat_index]].companies[comp_index].id);

            nextCompany.apply(null, indexes.getNext());
        });

    };

    
    for(var i = 0 ; i < NUM_THREADS; i++){
        nextCompany.apply(null, indexes.getNext());
    }

})();