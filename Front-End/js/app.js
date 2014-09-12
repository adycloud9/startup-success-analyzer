(function(){

	var Slides = (function(){

	    var slides = [
	      {note: '<h3 class="titlePiece">Startup Acquisition and Investment Prediction<a id="startButton"></a> </h3> <div class="small"> Aditya Inamdar, Arnab Sarkar, Jugal Manjeshwar</div> '},
	      {note: '<h3>Background</h3> <p>Some of the best establishments today that have defined the modern age business model such as Google, Apple, Facebook, etc began as startups which built products that seek to make an impact on the global scale.</p> \
	  				<br/><p>Identifying such firms, which show a promising future, facilitates investment opportunities that can generate funds to fuel growth.</p> \
	  				<br/><p>Using data from Crunchbase and TechCrunch, we aim to identify specific features of successful startups who outdid their competition, using a machine learning algorithm.</p>'},
	      {note: '<h3>Background</h3> <p>A bunch of relevant features were chosen from each company. The training data marked every company that was acquired or went public as successful.</p> \
	      		 </br><p>Using logistic regression, the weights of the respective features that contribute towards a higher probability of success were determined.</p> \
 				 </br><p>The new startups were analyzed based on the extracted features to determine the ones which are most likely to succeed.</p>'},
	      {note: '<h3>Motivation</h3><p>To use Big Data Technologies to leverage cross-organizational data to support investment and acquisition decisions.</p> \
	      		</br><p>To create a model which shows the relationship between the various features of a startup with acquisition maturity and a pragmatic investment plan for investors.</p> \
	      		<br/><p>It is a challenging task to identify startups with high success potential  as data about them is limited with figures of revenue, growth rate etc. not being available.</p> \
	      		<br/><p>Investors have the possibility of seeing small investments grow exponentially if the prediction is correct.</p> \
				<br/><p>The analysis can generate funds to fuel the growth of startups with good potential.</p> '},

	      {note: '<h3>Data</h3> <p>The data corpus of company profiles obtained from Crunchbase comprised of <b class="large">137K+</b> records. \
	  				<br/> <p>Accounting for inconsistencies and incomplete values in the data, using MapReduce and Pig, we were able to filter out about <b class="large">85K</b> workable records.</p> <p>Company profiles are divided by <b>category</b>.</p>'},
	  				//<ul><li>Number of Employees</li><li>Age towards Acquisition</li><li>Number of Milestones</li><li>Funding Rounds</li></ul>' },
	  	  
	  	  {note: '<h3>Design Overview</h3><img src = "img/design.png"/>'},

	      { note: '<p>The amout of money flowing into <b>biotech</b> has doubled since last year.</p>', 
	        data: 'data/data_investments_by_cat.js',
	        info: { text: 'Sum of <b>Investments</b> by <b>Category</b> in billions of $', labels:[], pos: [0, 0] },
	        render: 'triangles',
	        renderOptions: {
	        	x : 'count',
	        	y: 'inv',
	        	label: 'cat',
	        	rows: [5, 10]
	        } 
	      },
	      {
	      	note: '',
	      	data: 'data/data_investments_timeline.js',
	      	info: { text: 'Sum of <b>Investments</b> in billions of $ by <b>year</b>', pos: [0, 0] },
	        render: 'timeLine',
	        renderOptions: {
	        	selectprop: 'cat',
	        	select: ['biotech', 'software', 'mobile', 'cleantech', 'enterprise']
	        } 
	      },
	      {
	      	note: '',
	      	data: 'data/age_avg_acquired.js',
	      	info: { text: 'Average <b>Age</b> towards acquisition by <b>Category</b> in months', labels:[], pos: [0, 0] },
	        render: 'meanBars',
	        renderOptions: {
	        	mean : 'mean',
	        	std: 'std',
	        	label: 'cat',
	        	count: 41
	        } 
	      },

	      {
	      	note: '<h3>Category-wise Evaluation</h3> \
	      		  <p>Each company typically offers products in certain domains, such as web, mobile, and has its own specialty marketing strategy and life cycle, which lends legitimacy to our methodology of investigating companies by categories.</p> \
				  <p>Moreover, some categories are similar in nature, and so we analyze our data after combining them. </p> \
				  <p>Specifically, we created a <span class="large">computer</span> category, which includes <b>ecommerce<b>, <b>mobile</b>, <b>software</b>, <b>web</b>, etc.</p>'	
	      },

	  	  {note: '	<h3>Factual Features</h3><p> A set of relevant features were identified and extracted from each company profile, to be a part of the training data: </p> \
	  				<table><tr><th>Basic Features</th><th>Financial Features</th><th> </th><th>Target Feature - Success</th></tr> \
	  				<tr><td>Number of Employees</td><td>Investments By the Company</td><td> </td><td><span class="large">True</span> If Acquired or went Public</td></tr> \
	  				<tr><td>Age towards Acquisition</td><td>Acquisitions By the Company</td><td> </td><td><span class="large">False</span> Otherwise</td></tr> \
	  				<tr><td>Number of Competitors</td><td>Number of funding Rounds</td></tr> \
	  				<tr><td>Number of Offices</td><td>Funding per Round</td></tr> \
	  				<tr><td>Number of Products</td><td></td></tr> \
	  				<tr><td>Number of Providers</td><td></td></tr> \
	  				<tr><td>Number of Posts (on Techcrunch)</td><td></td></tr> \
	  				</table>'},

	      {note: '<h3>Results</h3><p>From our analysis, the most prominent features that attributed to <span class="large">success</span> were:</p> <div >Funding per Round</div><div style="opacity: 0.8">Number of Funding Rounds</div><div style="opacity: 0.7">Number of Competitors</div> \
	       		 <br/><p>Our model achieved a high <b>True positive</b> rate of between <span class="large">87%</span> and <span class="large">93%</span> <br/>with a <b>False positive</b> rate of between <span class="large">0%</span> and <span class="large">6.9%</span> across various categories.'},

	      {
	      	note: '',
	      	data: 'data/scatter_computer_funding_rounds_funding_per_round.csv',
	      	info: { text: 'Number of <b>Funding Rounds</b> by <b>Funds per Round</b> in billions of $'},
	      	render: 'scatter',
	      	renderOptions: {
	      		x: 'funding_rounds',
	      		y: 'funding_per_round',
	      		r: 'success_chance'
	      	}
	      },

	      {
	      	note: '<h3>Results</h3> \
	      		<p>Chance of Success determined by the model by category</p> \
	      		<div style="float:left"> \
	      		<p class="strong">Computer</p> \
	      		<table> \
				<tr><td>Cisco</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Microsoft</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Google</td><td><span class="label success">0.99997</span></td></tr> \
				<tr><td>Virtual Graffiti</td><td><span class="label potential">0.99916</span></td></tr> \
				<tr><td>Betaworks</td><td><span class="label potential">0.99314</span></td></tr> \
				<tr><td>Hootsuite</td><td><span class="label potential">0.92616</span></td></tr> \
				</table></div> \
				<div style="float:left; margin-left:20px"> \
				<p class="strong">Hardware</p> \
				<table> \
				<tr><td>Intel</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Xerox</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Apple</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Gopro</td><td><span class="label potential">0.77715</span></td></tr> \
				<tr><td>Ipevo</td><td><span class="label potential">0.77545</span></td></tr> \
				</table></div> \
				<div style="float:left; margin-left:20px"> \
				<p class="strong">Hardware</p> \
				<table> \
				<tr><td>Baxter International</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Medtronic</td><td><span class="label success">1</span></td></tr> \
				<tr><td>agilent</td><td><span class="label success">1</span></td></tr> \
				<tr><td>Prime View International</td><td><span class="label potential">0.90933</span></td></tr> \
				<tr><td>PPD</td><td><span class="label potential">0.89669</span></td></tr> \
				<tr><td>Sygnis Pharma</td><td><span class="label potential">0.54659</span></td></tr> \
				</table></div>'
	      },
	      {note: '<h3>Obstacles</h3><p>Unavailability of a comprehensive data dump on crunchbase or techcrunch. Manually scraping the data took fairly long due to the API rate limits.</p> \
	      		<p>Financial Data about startups is sparse.</p>'},

	      {note: '<h3 class="titlePiece">Thank You</h3>'}
	    ];

		var curSlide = 0;

	    return {

	    	all: function(){
	    		return slides;
	    	},

	    	get: function(index){
	    		return slides[index];
	    	},

	    	next: function(){
				if(curSlide < slides.length - 1){
					curSlide++;
				}
				
				return curSlide;    		
	    	},

	    	prev: function(){
				if(curSlide > 0){
					curSlide--;
				}

				return curSlide;
	    	},

	    	jump: function(index){
	    		curSlide = index;
	    	}
	    };

	})();

	// 	this.init = function(){
	// 		this.$notepad = $('#notepad');
	// 		this.$slideList = $('#slideList');
	// 		this.$info = $('#chartInfo');

	// 		for(var i = 1; i<slides.length; i++){
	// 			this.$slideList.append('<li data-slide = "'+ i +'"></li>');
	// 		}
	// 		this.$slideList.children()[0].className = "selected";

	// 		this.$note = this.$notepad.find('.note');
	// 		this.$note.animate({opacity:1}, 1000);

	// 		var that = this;
	// 		this.$nextButton = $('#nextButton').on("click", function(){
	// 			that.loadSlide(that.next());
	// 		});
	// 		this.$prevButton = $('#prevButton').on("click", function(){
	// 			that.loadSlide(that.prev());
	// 		});
	// 	}

	// 	this.loadSlide = function(slide){
	// 		var that = this;
	// 		this.$note.animate({
	// 			opacity:0
	// 		}, 500, function(){
	// 			if(slide == 1){
	// 				that.$notepad.parent().removeClass('title');
	// 			}
	// 			else if(slide == 0){
	// 				that.$notepad.parent().addClass('title');
	// 			}

	// 			if(slide > 0 && slide < slides.length ){
	// 				that.$slideList.find('.selected')[0].className= '';
	// 				that.$slideList.children()[slide-1].className = 'selected';					
	// 			}

	// 			that.$note.html(slides[slide].note);
	// 			that.$note.animate({opacity:1}, 500);
	// 		});

			
	// 		this.$info.animate({opacity:0}, 500, function(){
	// 			that.$info.find('.title').html((slides[slide].info) ? slides[slide].info.text : '');
	// 			that.$info.animate({opacity:1}, 500);
	// 		});
			
	// 	}

	// 	this.next = function(){
	// 		if(cur < slides.length - 1)
	// 			cur++;
			
	// 		return cur;
	// 	}

	// 	this.prev = function(){
	// 			if(cur > 0)
	// 				cur--;

	// 			return cur;
	// 	}

	// })();


	var App = (function(){

		return {
			init: function(){

				this.w = 800;
				this.h = 600;
				this.minW = 800;
				this.minH = 600;
				this.margins = {
					top: 0,
					left: 86,
					bottom: 60,
					right: 10
				};

				this.colors = {
					turquoise: '#1abc9c',
					green_sea: '#2ecc71',
					emerald: '#2ecc71',
					nephritis: '#27ae60',
					peter_river: '#3498db',
					belize_hole: '#2980b9',
					wisteria: '#8e44ad',
					sun_flower: '#f1c40f',
					carrot: '#e67e22',
					alizarin: '#e74c3c',
					pomegrante: '#c0392b',
					clouds: '#ecf0f1',
					silver: '#bdc3c7',
					concrete: '#95a5a6',
					asbestos: '#7f8c8d',
					wet_asphalt: '#34495e',
					midnight_blue: '#2c3e50'
				}

				this.renderMap = {
					'triangles' : this.drawTriangles,
					'meanBars': this.drawMeanBars,
					'timeLine' : this.drawTimeLine,
					'scatter': this.drawScatter
				}

				this.dataSets = {};
				this.container = $("#visualization");
				this.notepad = $('#notepad');
				this.slideList = $('#slideList');
				this.chartInfo = $('#chartInfo');

				window.onresize = this.resize.bind(this);
				this.size();

				this.initSlides();
				this.initEvents();

				this.stLine = d3.svg.line()
			    	.x(function(d) { return d.x; })
			    	.y(function(d) { return d.y; });


				this.xScale = d3.scale.linear().range([ this.margins.left,  this.w - this.margins.left - this.margins.right ]);
				this.yScale = d3.scale.linear().range([ 40,  this.h - this.margins.top - this.margins.bottom ]);
				this.xAxis = d3.svg.axis().scale(this.xScale).orient('bottom');
				this.yAxis = d3.svg.axis().scale(this.yScale).orient('right');

			    this.initSVG();
				
			},

			initSlides: function(){
				var len = Slides.all().length, _this = this;
				for(var i = 1; i < len; i++){
					var li = this.slideList.append('<li data-slide = "'+ i +'"></li>');
				}
				this.slideList.children()[0].className = "selected";
				this.slideList.on('click', function(e){
					var index = $(e.target).data('slide');
					if(index){
						Slides.jump(index);
						_this.loadSlide(index);						
					}

				});
				this.loadSlide(0);
			},
			
			initEvents: function(){
				var _this = this;
				
				this.notepad.on("click", "#startButton", function(){
					_this.loadSlide(Slides.next());
				});	

				$('#nextButton').on("click", function(){
					_this.loadSlide(Slides.next());
				});
				$('#prevButton').on("click", function(){
					_this.loadSlide(Slides.prev());
				});

				$(window).on('keydown', function(e){
					if(e.keyCode === 39){
						_this.loadSlide(Slides.next());
					}
					else if (e.keyCode === 37){
						_this.loadSlide(Slides.prev());
					}
				});
			},

			loadSlide: function(slideId){

				var _this = this,
					note = this.notepad.children('.note'),
					slide = Slides.get(slideId);

				var notes = note.children(),
					curNote = 0;

				note.animate({
						opacity:0
					}, 500, function(){

						_this.chartInfo.animate({opacity:0}, 500, function(){
							_this.chartInfo.children('.labels').html('');
						});

						_this.render(slide, function(){
							if(slideId == 1){
								_this.notepad.parent().removeClass('title');
							}
							else if(slideId == 0){
								_this.notepad.parent().addClass('title');
							}

							if(slideId > 0 && slideId < Slides.all().length ){
								_this.slideList.children('.selected')[0].className= '';
								_this.slideList.children()[slideId-1].className = 'selected';					
							}

							note.html(slide.note);
							note.animate({ opacity:1 }, 500);

							_this.chartInfo.children('.title').html((slide.info) ? slide.info.text : '');
							_this.chartInfo.animate({opacity:1}, 500);
						});
					}
				);

			},

			initSVG: function(){
				this.SVG = d3.select("#svg").attr("width", this.w).attr("height", this.h - (this.margins.top));
				this.axes = this.SVG.append("g").attr('id', 'axes');
      			this.chart = this.SVG.append("g").attr('id', 'chart');
      			this.initChart();
			},

			setDataDomains: function(){
				this.xScale.domain([]);
				this.yScale.domain([1000, 0]);
			},

			initChart: function(){
				this.xScale.domain([0, 1]);
				this.yScale.domain([1, 0]);
				this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom");
				this.x_axis = this.axes.append("g").attr("class", "x_axis axis").attr("transform", "translate(0," + (this.h - (this.margins.bottom + this.margins.top)) + ")");
				this.yAxis = d3.svg.axis().scale(this.yScale).orient("right");
				this.y_axis = this.axes.append("g").attr("class", "y_axis axis").attr("transform", "translate(" + (this.w - (this.margins.right + this.margins.left)) + ", 0)");

			},

			chartWidth: function(){
				return this.w - (this.margins.left + this.margins.right);
			},

			chartHeight: function(){
				return this.h - (this.margins.top + this.margins.bottom);
			},

			size: function(){
			    x = Math.max(this.minW, window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth);
			    y = Math.max(this.minH, window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight);

			    this.container.css("width", x).css("height", y);

			    this.w = x;
			    this.h = y;					
			},

			resize: function(){
				this.size();			
			},

			getData: function(file, callback){
				var ext = file.split('.');
				ext = ext[ext.length - 1];

				if(ext == 'js' || ext == 'json'){
					$.getJSON(file, function(data) {
						callback(data);
					});					
				}
				else if(ext == 'csv'){
					d3.csv(file, callback);
				}

			},

			render: function(slide, callback){
				var _this = this;

				$(this.SVG[0]).animate({opacity: 0}, 500, function(){
					_this.chart.html('');
					if(slide.data){
						$(this).animate({opacity: 1}, 100);
						_this.getData(slide.data, function(data){
							_this.renderMap[slide.render].call(_this, data, (slide.renderOptions || {}), callback);
						});							
					}
					else{
						callback();
					}

				});

			},

			drawScatter: function(data, options, callback){

				var xprop = options.x || 'x',
					yprop = options.y || 'y',
					rprop = options.r || 'r';

				var tmpData = [], c = 0;
				for(var i = 0; i<data.length; i++){

					data[i][xprop] = +data[i][xprop];
					data[i][yprop] = +data[i][yprop]/1000000;
					data[i][rprop] = parseFloat(data[i][rprop]);	

					if(data[i][xprop] == 0 || data[i][yprop] == 0) continue;
					if(+data[i].success == 0 && data[i][rprop] < 0.5 && data[i][yprop] > 50) continue;
					if(+data[i].success == 1 && data[i][yprop] < 50) continue;

					tmpData.push(data[i]);
					c++;			
				}

				var classes = [{ l: 'success', t: 'Successful'}, {l: 'potential', t: 'Potentially Successful'}, {l: 'fail', t: 'Unsuccessful'}], curClass = null;
				for(var i =0; i<classes.length; i++){
					var lbl = $('<div class="label '+ classes[i].l +'">' + classes[i].t+ '</div>');
					this.chartInfo.children('.labels').append(lbl);
				}
				// this.chartInfo.children('.labels').html('<div class="label success">Successful</div><div class="label potential">Potentially Successful</div><div class="label fail">Unsuccessful</dic>')


				// console.log(data[0]);
				// console.log(d3.extent(data, function(d) { return +d[xprop]; }));
				// console.log(d3.extent(data, function(d) { return +d[yprop]; }));

				this.xScale = d3.scale.linear().range([ this.margins.left,  this.w - this.margins.left - this.margins.right ]);
				this.xScale.domain((d3.extent(data, function(d) { return d[xprop]; }).reverse()));
				this.yScale.domain((d3.extent(data, function(d) { return d[yprop]; }).reverse()));
				this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(10);
				this.yAxis = d3.svg.axis().scale(this.yScale).orient("right").ticks(8);
				this.x_axis.call(this.xAxis);
				this.y_axis.call(this.yAxis);

				data = tmpData;
				


				var _this = this;
				this.chart.selectAll('circle')
					.data(data)
					.enter().append('circle')
					.attr('cx', function(d){ return _this.xScale(d[xprop]); })
					.attr('cy', function(d){ return _this.yScale(d[yprop]); })
					.attr('class', function(d){
						if(+d.success){
							return 'success';
						}
						else{
							if(d[rprop] >= 0.5){
								return 'potential';
							}
							else{
								return 'fail';
							}
						} 						
					})
					.attr('r', function(d) { 
						if(d[rprop] > 0.5)
							return 10 * d[rprop]; 
						else
							return 10 * (1 - d[rprop]); 
					})
					.attr('opacity', function(d) { 
						if(d[rprop] > 0.5)
							return 0.9 * d[rprop]; 
						else
							return 0.9 * (1- d[rprop]); 
					})
					//.attr('opacity', function(d){ return 0.9*parseFloat(d[rprop]); })


				callback();
			},

			drawTimeLine: function(data, options, callback){

				var parseDate = d3.time.format("%Y").parse;
				var tmpData = [];

				data.forEach(function(d){
					if(options.select.indexOf(d.cat) !== -1){
						d.funds.forEach(function(f){
							f.d = parseDate(f.d);
						})

						d.funds.sort(function(a,b){
							return a.d - b.d;
						});
						tmpData.push(d);
					}
				});
				data = tmpData;
				var n = data.length;


				var xMax = d3.max(data, function(d){ return d3.max(d.funds, function(f) { return f.d; })});
					xMin = d3.min(data, function(d){ return d3.min(d.funds, function(f) { return f.d; })});

				var yMax = d3.max(data, function(d){ return d3.max(d.funds, function(f) { return f.s; })});
					yMin = d3.min(data, function(d){ return d3.min(d.funds, function(f) { return f.s; })});


				this.xScale = d3.time.scale().range([this.margins.left,  this.w - this.margins.left - this.margins.right]);
				this.xScale.domain([(new Date(2004, 1, 1)), (new Date(2013, 1, 1))]);
				this.yScale.domain([yMax*1.2, yMin]);
				this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(10);
				this.yAxis = d3.svg.axis().scale(this.yScale).orient("right").ticks(5);

				this.x_axis.call(this.xAxis);
				this.y_axis.call(this.yAxis);

				var _this = this;

				var startLine = d3.svg.line()
				    .x(function(d) { return _this.xScale((new Date(1999, 1, 1))); })
				    .y(function(d) { return _this.yScale(0); });

				var line = d3.svg.line()
				    .x(function(d) { return _this.xScale(d.d); })
				    .y(function(d) { return _this.yScale(d.s); });

				for(var i = 0; i < n; i++){
					var cat_data = data[i];
					var color =  _this.colors[ Object.keys(_this.colors)[(i*4)%20] ];

					this.chartInfo.children('.labels').append('<div class="label" style="background-color:' + color + '" >' + cat_data.cat + '</div>');

					this.chart.append("path")
					  .datum(cat_data.funds)
					  .attr("class", "line")
					  .attr('d', startLine)
					  .style('stroke', color)
					  .transition()
					  .duration(1500)
					  .attr('d', line);
				}

				callback();

			},

			drawMeanBars: function(data, options, callback){
				var count = options.count || 5,
					meanprop = options.mean || 'mean',
					stdprop = options.std || 'std',
					label = options.label || 'label';


				data = data.slice(0, count);

				var maxY = d3.max(data, function(d) {  
					return d[meanprop] + d[stdprop]/2; 
				});


				this.xScale.domain([0, this.chartWidth()]);
				this.yScale.domain([maxY * 1.2 , 0]);

				this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(0);
				this.x_axis.call(this.xAxis);
				this.yAxis = d3.svg.axis().scale(this.yScale).orient("right");
				this.y_axis.call(this.yAxis);

				var _this = this;
				var boxes = this.chart.selectAll('g')
							.data(data)
							.enter().append('g')
								.attr('transform', function(d, i){
									return 'translate(' + _this.xScale(i*_this.chartWidth()/data.length) + ',' + _this.yScale(d[meanprop]) +')';
								});
				var rect = boxes.append('rect')
					.attr('x', 0)
					.attr('height', 0)
					.attr('y', _this.yScale(0))
					.attr('width', _this.chartWidth()/data.length - 10)
					.attr('fill', function(d,i){ 
						if(d[label] == 'all'){
							return '#e74c3c';
						}
						else{
							return 'rgb(' + 0 + ',' + (102 + i*2) + ',' + (165 + (i*2)) + ')'; 
						}
					})
					.transition().delay(function (d,i){ return i * 50;})
					.duration(500)
					.attr('y', 0)
					.attr('height', function(d){ return _this.chartHeight() - _this.yScale(d[meanprop]); })
					.each('end', function(d,i){
						d3.select(this.parentNode).append('path')
							.attr('opacity', 0)
							.attr('d', function(d,i){
								var w = _this.chartWidth()/data.length - 10;
									x = w/2,
									y =  _this.yScale(d[stdprop]) - _this.yScale(d[meanprop]);

								return 'M ' + (x - 5) + ' ' + (-y) +  ' L ' + (x + 5) + ' ' + (-y) + ' M ' + x + ' ' + (-y) + ' L ' + x + ' ' + y + ' M ' + (x - 5) + ' ' + y + ' L ' + (x + 5) + ' ' + y;
							})
							.attr('stroke-width', '1')
							.attr('stroke', '#2c3e50')
							.attr('fill', 'none')
							.transition()
							.duration(500)
							.attr('opacity', 0.8);

						d3.select(this.parentNode).append('text')
							.attr('class', 'strong')
							.attr('opacity', 0)
							.text(function(d) { return d[label]; })
							.style('text-anchor', 'start')
							.attr('dy', '0.2em')
							.attr('transform', function(d){ return 'translate('+(_this.chartWidth()/data.length - 10)/2 + ',' + (-Math.abs(_this.yScale(d[stdprop]) - _this.yScale(d[meanprop])) - 20) + ')rotate(-90)'; })
							.transition()
							.duration(500)
							.attr('opacity', 1);
					});

				callback();
			},

			drawTriangles: function(data, options, callback){

				var rows = options.rows || [],
					xprop = options.x || 'x',
					yprop = options.y || 'y',
					label = options.label || 'label';

				var countFwd = 0, countBack = data.length - 1, rowMax = [], tmpData = [];
				for(var i = 0; i < rows.length; i++){
					var max = Number.MIN_VALUE;
					var row = [];
					if(rows[i] > 0){
						for(var j = 0; j < rows[i]; j++){
							row.push(data[countFwd]);
							if(max < data[countFwd][xprop])
								max = data[countFwd][xprop];

							countFwd++;
						}						
					}
					else if(rows[i] < 0){
						for(var j = 0; j < Math.abs(rows[i]); j++){
							row.push(data[countBack]);
							if(max < data[countBack][xprop])
								max = data[countBack][xprop];

							countBack--;
						}							
					}

					if(i % 2 !== 0 && rows[i] > 0) row.reverse();
					tmpData.push(row);
					rowMax.push(max);
				}

				data = tmpData;

				//console.log(data);

				var maxY = d3.max(data, function(d) {  
					return d3.max(d, function(dd) { 
						return dd[yprop]; 
					}); 
				});

				this.xScale.domain([0, this.chartWidth()]);
				this.yScale.domain([maxY * 1.2 , 0]);

				this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").ticks(0);
				this.x_axis.call(this.xAxis);
				this.yAxis = d3.svg.axis().scale(this.yScale).orient("right");
				this.y_axis.call(this.yAxis);

				var _this = this;

				var rows = this.chart.selectAll('g')
					.data(data)
					.enter().append('g');

				var boxes = rows.selectAll('g')
							.data(function(d, i) { console.log(d); return d; })
							.enter().append('g')
								.attr('transform', function(d, i, j){
									return 'translate(' + _this.xScale(i*_this.chartWidth()/data[j].length) + ',' + (_this.yScale(d[yprop])) +')';
								});

				var colorcount = 0;
				boxes.append('path')
					.attr('class', 'triangle')
					.attr('fill', function(d, i, j) { return _this.colors[ Object.keys(_this.colors)[((colorcount++)*3)%20] ]; } )
					.attr('opacity', 0)
					.attr('d', function(d, i, j) { 
							var mw = _this.chartWidth()/data[j].length,
							w = mw*(d[xprop]/rowMax[j]) - 10,
							dx = (mw - w)/2;
							y = _this.chartHeight() - _this.yScale(d[yprop]) - (data.length - j)*50;
						return 'M ' + dx + ' ' + y + ' L ' + (dx + w/2) + ' ' + y + 'L ' + (dx+w) + ' ' + y + ' z';
					})
					.transition()
					.duration(1500)
					.attr('d', function(d, i, j) {
						var mw = _this.chartWidth()/data[j].length,
							w = mw*(d[xprop]/rowMax[j]) - 10,
							dx = (mw - w)/2;
							y = _this.chartHeight() - _this.yScale(d[yprop]) - (data.length - j)*50;

						return 'M ' + dx + ' ' + y + ' L ' + (dx + w/2) + ' 0 L ' + (dx+w) + ' ' + y + ' z';
					})
					.attr('opacity', function(d, i, j) { return j*0.15 + 0.6; })
					.each(function(d, i, j){
						d3.select(this.parentNode).append('text')
							.text(function(d) { return d[label]; })
							.attr('opacity', 0)
							.transition()
							.duration(1500)
							.attr('opacity', 1)
							.attr('fill', 'black')
							.style('text-anchor', 'middle')
							.attr('x', function(d) { 
								var mw = _this.chartWidth()/data[j].length,
									w = mw*(d[xprop]/rowMax[j]) - 10,
									dx = (mw - w)/2;
								return w/2 + dx;
							})
							.attr('y', function(d){
								if(j == data.length - 1){
									return _this.chartHeight() - _this.yScale(d[yprop]) + 10;
								}
								return 0;
							})
							.attr('dx', '0')
							.attr('dy','-2em');

					});
				callback();
			}

		}

	})();


	$( document ).ready(function(){
		App.init();
	});


})();