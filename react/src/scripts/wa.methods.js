var WA = WA || {};

WA.methods = (function () {
	//console.log(['getData()', dfd_init]);
	var data = {};
	return {
		checkData: function() {
			return data;
		},
		getPlanets: function() {
			return data.planets;
		},
		getSystems: function() {
			return data.systems;
		},
		getOrigin: function() {
			return data.origin;
		},
		getDestination: function() {
			return data.destination;
		},
		getPopulationDesc: function (rating) {
			return data.populationDesc[rating];
		},
		getTechSocialDetails: function (index, rating) {
			return data.techSocialArray[index][rating];
		},
		getData : function (dfd_init) {
			//console.log(['getData()', dfd_init]);
			// Accepts a jQuery Deferred object which will be resolved when the data is ready.

			var that = this,
				dfd_array = [],
				dfd_sources = [
					{ id : 'planets',		path : 'src/json/planets.json' },
					{ id : 'desc',			path : 'src/json/descriptions.json' }
				],
				objData = {};


			$.each( dfd_sources, function( index, value ) {
				var myIndex = index,
					myValue = value;

				var dfd_temp = $.Deferred();
				dfd_array.push(dfd_temp);

				/*
				If I wanted to do something when each individual thingy resolves, then I would do that here. This done() 
				function will fire whenever this deferred object is resolved.
				dfd_temp.done(function() {
					// Do stuff.
					console.log('-- Done with dfd ' + myIndex);
				});
				*/

				$.ajax({
					url: myValue.path,
					dataType: "json"
				}).done(function(data) {

					/* The data structure is straight from Google, so we still need to drill down into it to get our array. */
					//data[key] = data.feed.entry;

					//console.log(['++ Inside the done function of dfd ' + myIndex, data]);

					objData[myValue.id] = data;

					/* All done with this JSON file, so we'll resolve its Deferred object. */
					dfd_temp.resolve();
				});
			});


			/* http://stackoverflow.com/questions/5627284/pass-in-an-array-of-deferreds-to-when */
			/* 
			Sort the entries by their sortkey, which is basically a date. We're not picky about events with the same sortkey value. 
			Once that's done, we set the 'initialized' property to true for objData. We then pass this object into the app state. The 
			initialized property is used elsewhere to see if the app has data. If that property is true, then we have our sorted 
			entries, sources, etc.
			*/
			$.when.apply(null, dfd_array).done(function() {
				//console.log( transformData(objData) );

				// Call the transform function, which is written below.
				data = transformData(objData);
				//console.log(["All of the ajax calls are complete. Length is ", data]);
				dfd_init.resolve(data);
				WA.methods.map.init();
			});



			function transformData(oldData) {
					var finalData = {
						parsec : 3.26163344,
						speedMod : 3,
						systems : [],
						planets : [],
						locations : null,
						current : { origin: null, destination: null, code: null },
						origin : null,
						destination : null,
						regionProps : {
							UFP		:	{
											color: "rgba(110, 200, 250, 1)", 
											fullName: "United Federation of Planets",
											pathData: "M440,917.5c0,0,11.8,11.5,23.3,12.2 c14.9,0.8,43.9-21.8,58.5-21.8c7.1,0,14.5,12.7,31.7,12.7c12.2,0,35.5-1.1,47.3,0.3c7.3,0.9,11.4,0.1,18.3-11.4 c4-6.7,9.5-12.4,10.8-21.3c2-13.8-6.5-16.4-6.3-26.4c0.2-9.3,11.7-19.7,27.5-25.2c15.6-5.4,25.1-3.6,31.8-5.6 c6.2-1.9,10.2-5.5,7.6-19.4c-1.5-8.1,1.7-31.4,1.7-31.4H440V917.5z"
										},
							KE		:	{
											color: "rgba(255, 0, 0, 1)",
											fullName: "Klingon Empire",
											pathData: "M440,938.7c29.4,1.5,28.1,5.1,47.6,25.4 c5.1,5.3,11.6,7.1,22.1,8c3.9,0.3,5.2,3.9,11.4,4.5c4.2,0.4,12.9-2.1,20.9,5.1c7.3,6.5,4.6,9.6,7.6,15.8c2,4,4.2,6.7,7.1,13.8 c1.7,4.1-1.7,10,1,15.7c4,8.7,6.2,27.6,20,38.5c8.6,6.8,6.7,3.1,15.4,13.4c9.7,11.4,10.9,26.5,25.5,38.6 c16.7,13.8,36.2,33.8,46,45.6c8.8,10.6,12.2,12.9,19.2,16.2c8.5,4,10.1,11.5,14,14.5c6.5,5.1,15.9,11.1,19.4,17.4 c2.5,4.4,2.1,12.9,8.8,23.2c7.2,11.2,17.8,18.8,19.6,30.7c1.5,9.5,0.9,14.8-24.6,14.8c-11.9,0-281.1,0-281.1,0S440,946,440,938.7z"
										},
							RSA		:	{
											color: "rgba(190, 20, 190, 1)", 
											fullName: "Romulan Star Empire",
											pathData: "M734,780c0,0-7.6,17-17.8,26.1 c-8.3,7.5-9.2,16.1-8.5,21.6c0.8,6.7,2.6,6.8,4.1,10.8c1.8,4.6,1.5,6.7,2.7,9.3c1.4,2.9,3,3.5,2.6,8.1 c-1.1,13.1-7.7,26.3-10.6,38.3c-1.4,5.7-8.2,21.8-8.1,26.9c0,2.1-0.2,6.5-1.6,9.1c-3.4,6.2-7.1,4.5-12.1,10.6 c-5.3,6.5-8.9,20-6.2,28.3c3.5,10.7,10.5,21.4,20.1,27.6c11.1,7.1,16.5,11.2,18.9,17.4c6.2,16,2.1,28,0.2,42.8 c-1.4,10.5,1.5,16.3,0.7,21.9c-2.2,16.1-8.2,15.8-8.9,24.9c-0.6,8.2,16.7,39.1,17.2,55.5c0.2,7.2-22.5,17.5-14,24.5 c4.1,3.4,10.5,3.6,15.2,15.4c4.7,11.8,6.5,31.4,5.9,35.9c-0.9,7,12.5,14.6,13.7,24.5c0.8,7.1,5.6,8.1,7.7,15.6c1.8,3.5,3.3,5,6.8,5 c2,0,22.8,0,22.8,0V780H734z"
										},
							AOFW	:	{
											color: "rgba(200, 200, 0, 1)",
											fullName: "Affiliation of Outer Free Worlds",
											pathData: "M573.5,935.9c-2.4-5.1,0.9-11.5,8-11.5 c6.6,0,3.7,0.2,12.1-0.2c8.4-0.5,28.7-2.5,34.4,0.1c5.7,2.6,12,5.5,16.2,13.3c4.2,7.8,12.9,40.5,12.2,51.8c-0.4,5.6-7,8.4-16.1,9.8 c-8,1.2-21-6.9-29.7-9.9c-8.4-2.9-19-0.9-25.7-2.9c-4-1.2-6.6-3.3-8.2-7.1c-1.5-3.5,0.5-7.7,0-13.4c-0.6-7.2,0.4-8.6,0.4-12.2 C577.1,948,576.5,942.3,573.5,935.9z"
										},
							OFMA	:	{
											color: "rgba(0, 255, 0, 1)",
											fullName: "Orion Free Merchantile Association",
											pathData: "M481.9,928.9c0.1-2.7,3.2-2.9,5.8-4.2 c3-1.6,5.9-1.8,6.9-1.5c5.3,1.8,6.9,4.1,13.3,4.1c12.9,0.1,16.6-6.2,25.1-5.2c5.4,0.6,7.9,7.9,4.6,11.7c-3.5,4.2-6.3,3.2-11,11.7 c-2.8,5-5.8,9.5-9,16.5c-2,4.3-8.2,6.5-10.5,1.2c-1.7-3.9-2.4-6.8-10.1-17C489.8,936.9,481.8,933.7,481.9,928.9z"
										},
							MCA		:	{
											color: "rgba(150, 150, 255, 1)", 
											fullName: "Mantiev Colonial Association",
											pathData: "M653.8,1095.2c-2.4-3,0.5-10.1,7.3-10.1 s38.5,12.7,43.4,21.5c1.2,2.2,1.6,6.1,0.8,7.3c-2.1,3.2-6.2,2.9-9.7,1.8c-6.7-2-13.5-1.9-19.8,0.4c-3.3,1.2-5.7,1.6-7.9,0.4 c-3.5-2-1.3-6.4-4.8-12.2C659.6,1098.5,656.2,1098.3,653.8,1095.2z"
										},
							IKS		:	{
											color: "rgba(255, 150, 150, 1)", 
											fullName: "Independent Klingon States",
											pathData: "M651.3,905.6c2.8-3.9,8.7-4.8,12.2-10.6 c1.1-1.8,0.5-4.7,1.8-8c2-4.8,7.8-8.7,11.2-11.6c3.5-3,8-1.9,8.8,2.5c0.8,4.5,0.2,6.4,2.3,10c2.1,3.6,2.1,3.6,5.8,7 c3,2.8,3.1,8.7-2.1,9.6c-4.6,0.8-7.3-1.4-12,0.5c-5.1,2.1-4.7,4.8-10.9,7.4c-5.1,2.1-9,3.1-14,1.2 C649.3,911.6,651.3,905.6,651.3,905.6z"
										},
							I		:	{
											color: "rgba(0, 255, 0, 1)",
											fullName: "Independent",
											pathData: ""
										},
							U		:	{
											color: "rgba(150, 150, 150, 1)", 
											fullName: "Unexplored",
											pathData: ""
										}
						},
						mineralNames : {
							normal			: 'Normal Minerals',
							radioactives	: 'Radioactives',
							gemstones		: 'Gemstones',
							crystals		: 'Industrial Crystals',
							special			: 'Special Minerals'
						},
						tradeProfileTypes	: [
							{prop:'agricultural',  name:'Food and Agricultural Goods'},
							{prop:'rawMaterials',  name:'Normal Minerals, Raw Materials'},
							{prop:'radioSpecial',  name:'Radioactives, Special Minerals'},
							{prop:'drugMedicine',  name:'Drugs and Medicine'},
							{prop:'lowTechMan',    name:'Low Tech Manufactured Goods'},
							{prop:'mediumTechMan', name:'Medium Tech Manufactured Goods'},
							{prop:'highTechMan',   name:'High Tech Manufactured Goods'},
							{prop:'luxuryGoods',   name:'Luxury Goods'},
							{prop:'population',    name:'Population Rating'}
						],
						climateTypes : null, // Defined in init();
						domRaces : null,
						populationDesc : {
							A : 'Very heavily populated',
							B : 'Heavily populated',
							C : 'Moderately populated',
							D : 'Sparsely populated',
							E : 'Very sparsely populated',
							X : 'Small station or colony'
						},
						techSocialArray : [
							[// Space Science Index
								"No accomplishment",
								"Star recognition; constellations; basic astronomy and navigation",
								"Recognition of other planetary bodies",
								"Solar system mechanics. Planetary motion",
								"Relativity; celestial mechanics; stellar evolution",
								"Basic astronautics; unmanned space probes; radion astronomy",
								"Manned spaceflight; interplanetary piloting; environmental suits",
								"Manned interstellar probes",
								"Impulse drive; sublight-speed vehicles",
								"Warp drive; FTL vehicles; advanced astrogation",
							],
							[// Engineering Index
								"No accomplishment",
								"Rudimentary toolmaking; shelter building",
								"Basic metallurgy; pulleys; complex levers; windmills and water wheels",
								"Basic mechanics; steam power; flood control and hydroelectric power",
								"Reciprocating engines",
								"Heating and cooling systems; heavy machinery",
								"Transistors and basic electronics, including computers",
								"Advanced microcircuits and computer technology",
								"Micromolecular circuitry",
								"Atomic-level circuitry; gravity control technology"
							],
							[// Life/Medical Science Index
								"No accomplishment",
								"Basic herbal medicine; cultivation of plants",
								"Basic anatomy; animal husbandry; basic microscopy, cell theory",
								"Basic physiology; detailed anatomy; blood and tissue typing",
								"Basic genetics; microbiology; nitrogen cycle; routine surgery",
								"Bacteriology and immunology; hybridization; basic hydroponics",
								"Basic DNA and gene research; basic artificial limbs and organs",
								"Gene surgery; advanced bionics and organ transplants; food synthesis",
								"Portable medical scanners; cloning",
								"Protoplaser surgery; major nerve regeneration"
							],
							[// Physical Science Index
								"No accomplishment",
								"Control of fire; recognition of solid, liquid, gaseous states",
								"Complex optics; rudimentary chemistry",
								"Laws of motion; classification of compounds",
								"Basic electricity; discovery of chemical elements",
								"Radio communication; x-ray theory; atomic theory; organic chemistry",
								"Atomic fission; microwave theory; electron microscopy",
								"Controlled fusion; laser technology; heavy element chemistry",
								"Subspace radio theory; advanced catalyst chemistry",
								"Transporter theory; phaser technology; transmutation of elements"
							],
							[// Planetary Science Index
								"No accomplishment",
								"Recognition of weather cycles and seasons",
								"Empirical weather prediction; mineral and ore recognition",
								"Classification of basic minerals and fossils; basic geologic history",
								"Basic scientific meteorology; hydrologic cycle; water wave motion",
								"Basic earthquake prediction and weather modification",
								"Harnessed geothermal energy",
								"Gravity control; ecological control and enforced ecological balance",
								"Planetary weather and climate control; crustal stress relief",
								"Terraforming"
							],
							[// Psionics Index
								"No accomplishment",
								"Psi activity largely unrecognized or unknown",
								"Psi activity recognized, but only rare cases; no understanding",
								"Psi activity documented in selected individuals; no understanding",
								"Psi activity widely recognized; rudimentary understanding of use",
								"Psionics measured in many; basic psionic theory understood",
								"Psionics seen as a conservable resource; widespread psionic research",
								"Rudimentary training provided to psionically-gifted individuals",
								"Psionics cultivated in all; widespread basic training provided",
								"Widespread acceptance and use; extensive psionic training provided"
							],
							[// Social Science Index
								"No accomplishment",
								"Recognition of formal leadership",
								"Development of religion; specialization in professions",
								"Development of social classes; symbolic economics",
								"Basic socioeconomic theory",
								"Basic psychology of own race",
								"Psychoanalysis; behavior modification",
								"Large-scale social planning",
								"Elimination of racial, cultural or sexual prejudice",
								"Psychological theories and principles about alien races"
							],
							[// Cultural Attitude Index
								"Anarchy",
								"Pre-Tribal",
								"Early Tribal",
								"Advanced Tribal",
								"Feudal",
								"Monarchy",
								"Controlled Monarchy",
								"Representative Structure",
								"Participatory Structure",
								"Unity"
							]
						]
					};

					var jsonPlanetData		= oldData.planets.feed.entry,
						jsonDescriptions	= oldData.desc.feed.entry,
						tempClimateTypes	= [],
						tempDomRaces		= [],
						systemLoopCounter	= 0; // There will be fewer systems than planets, and we don't want gaps in their id numbers.

					var setTradeDetails = function(index, catRating, populationRating, luxPriceMod, luxConMod) {
						var demandLevelKey = {
								A : 0.25,
								B : 0.5,
								C : 0.75,
								D : 1,
								E : 1.25,
								F : 1.5,
								G : 1.75,
								H : 2
							},
							luxuryModKey = {
								A : 2,		// Especially interested
								B : 1.5,	// Moderately interested
								C : 1,		// Neutral
								D : 0.5		// Disinterested
							},
							populationModKey = {
								A : 4,		// Very heavily populated
								B : 2,		// Heavily populated
								C : 1,		// Moderately populated
								D : 0.5,	// Sparsely populated
								E : 0.25,	// Very sparsely populated
								X : 0.1		// Small station or colony
							},
							properties = {};
							
						switch (index) {
							case 0: // agricultural
								properties = { rating: catRating, price:700 * demandLevelKey[catRating], consumptionRate:1000 * populationModKey[populationRating] };
								break;
							case 1: // rawMaterials
								properties = { rating: catRating, price:1000 * demandLevelKey[catRating], consumptionRate:700 * populationModKey[populationRating] };
								break;
							case 2: // radioSpecial	
								properties = { rating: catRating, price:1500 * demandLevelKey[catRating], consumptionRate:300 * populationModKey[populationRating] };
								break;
							case 3: // drugMedicine
								properties = { rating: catRating, price:2000 * demandLevelKey[catRating], consumptionRate:500 * populationModKey[populationRating] };
								break;
							case 4: // lowTechMan
								properties = { rating: catRating, price:1200 * demandLevelKey[catRating], consumptionRate:900 * populationModKey[populationRating] };
								break;
							case 5: // mediumTechMan
								properties = { rating: catRating, price:2000 * demandLevelKey[catRating], consumptionRate:700 * populationModKey[populationRating] };
								break;
							case 6: // highTechMan
								properties = { rating: catRating, price:2200 * demandLevelKey[catRating], consumptionRate:500 * populationModKey[populationRating] };
								break;
							case 7: // luxuryGoods
								properties = { rating: catRating, price:250 * luxPriceMod * demandLevelKey[catRating], consumptionRate:100 * luxConMod * populationModKey[populationRating] };
								break;
							default: 
								properties = { rating: 'REPLACEME', price:0, consumptionRate:0 };
						}
						return properties;
					};


					for (var i = 0; i < jsonPlanetData.length; i++) {
						var tempPlanetObject = {
							//entry					: jsonPlanetData[i],
							name					: jsonPlanetData[i].gsx$world.$t,
							type					: 'planet',
							system					: jsonPlanetData[i].gsx$system.$t,
							id						: i,
							numClassM				: jsonPlanetData[i].gsx$numclassm.$t,
							x						: Number(jsonPlanetData[i].gsx$x.$t),
							y						: Number(jsonPlanetData[i].gsx$y.$t),
							systemPosition			: jsonPlanetData[i].gsx$systemposition.$t,
							satellites				: jsonPlanetData[i].gsx$satellites.$t,
							gravity					: jsonPlanetData[i].gsx$gravity.$t,
							diameter				: jsonPlanetData[i].gsx$diameter.$t,
							circumference			: jsonPlanetData[i].gsx$circumference.$t,
							surfaceArea				: jsonPlanetData[i].gsx$surfacearea.$t,
							percentLand				: jsonPlanetData[i].gsx$percentland.$t,
							landArea				: jsonPlanetData[i].gsx$landarea.$t,
							dayLength				: jsonPlanetData[i].gsx$daylength.$t,
							atmosDensity			: jsonPlanetData[i].gsx$atmosdensity.$t,
							climate					: jsonPlanetData[i].gsx$climate.$t,
							minerals				: {
								normal					: jsonPlanetData[i].gsx$mineralnormal.$t,
								radioactives			: jsonPlanetData[i].gsx$mineralrad.$t,
								gemstones				: jsonPlanetData[i].gsx$mineralgem.$t,
								crystals				: jsonPlanetData[i].gsx$mineralcrystal.$t,
								special					: jsonPlanetData[i].gsx$mineralspecial.$t
							},
							domRace					: jsonPlanetData[i].gsx$domrace.$t,
							//techSocIndex			: jsonPlanetData[i].gsx$techsocindex.$t,
							techSocIndex			: {
								rating					: jsonPlanetData[i].gsx$techsocindex.$t.substr(0, 6) + '-' + jsonPlanetData[i].gsx$techsocindex.$t.substr(6),
								spaceScience			: { index:0,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(0,1) ) },
								engineering				: { index:1,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(1,2) ) },
								lifeMedScience			: { index:2,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(2,3) ) },
								physicalScience			: { index:3,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(3,4) ) },
								planetaryScience		: { index:4,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(4,5) ) },
								psionics				: { index:5,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(5,6) ) },
								socialScience			: { index:6,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(6,7) ) },
								culturalAttitude		: { index:7,rating: parseInt( jsonPlanetData[i].gsx$techsocindex.$t.substring(7,8) ) }
							},
							tradeProfile			: {
								/* These property names must be the same as the tradeProfiles object above. I'll sort out a better way later. */
								rating					: jsonPlanetData[i].gsx$tradeprofile.$t.substr(0, 6) + ' ' + jsonPlanetData[i].gsx$tradeprofile.$t.substr(7,1) + ' (' + jsonPlanetData[i].gsx$tradeprofile.$t.substr(8) + ')',
								agricultural			: setTradeDetails( 0, jsonPlanetData[i].gsx$tradeprofile.$t.substring(0,1), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								rawMaterials			: setTradeDetails( 1, jsonPlanetData[i].gsx$tradeprofile.$t.substring(1,2), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								radioSpecial			: setTradeDetails( 2, jsonPlanetData[i].gsx$tradeprofile.$t.substring(2,3), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								drugMedicine			: setTradeDetails( 3, jsonPlanetData[i].gsx$tradeprofile.$t.substring(3,4), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								lowTechMan				: setTradeDetails( 4, jsonPlanetData[i].gsx$tradeprofile.$t.substring(4,5), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								mediumTechMan			: setTradeDetails( 5, jsonPlanetData[i].gsx$tradeprofile.$t.substring(5,6), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								highTechMan				: setTradeDetails( 6, jsonPlanetData[i].gsx$tradeprofile.$t.substring(6,7), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								luxuryGoods				: setTradeDetails( 7, jsonPlanetData[i].gsx$tradeprofile.$t.substring(7,8), jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9), jsonPlanetData[i].gsx$luxpricemod.$t, jsonPlanetData[i].gsx$luxconmod.$t ),
								population				: { rating: jsonPlanetData[i].gsx$tradeprofile.$t.substring(8,9) }
							},	
							affiliation				: jsonPlanetData[i].gsx$affiliation.$t,
							region					: jsonPlanetData[i].gsx$region.$t
						};


						/* Get the description for this world from the descriptions array. */
						var tempDesc = _.find( jsonDescriptions, function(item){
							return item.gsx$world.$t === tempPlanetObject.name;
						});

						var descArray = tempDesc.gsx$description.$t.split("^");
						tempPlanetObject.desc = descArray;




						/* Creating another array for systems, because some planets might be in the same system. */
						var tempSystemObject		= {
							name						: tempPlanetObject.system,
							type						: 'system',
							id							: systemLoopCounter,
							numClassM					: tempPlanetObject.numClassM,
							planets						: [{name:tempPlanetObject.name, id:tempPlanetObject.id}],
							affiliation					: tempPlanetObject.affiliation,
							region						: tempPlanetObject.region,
							x							: tempPlanetObject.x,
							y							: tempPlanetObject.y
						};
						if (i === 0) {
							finalData.systems.push(tempSystemObject);
							tempPlanetObject.systemID = tempSystemObject.id;
							systemLoopCounter ++;
						} else {
							var systemFound = false;
							for (var j = 0; j < finalData.systems.length; j++) {
								if (finalData.systems[j].name === tempPlanetObject.system) {
									tempPlanetObject.systemID = finalData.systems[j].id;
									systemFound = true;
									finalData.systems[j].planets.push( {name:tempPlanetObject.name, id:tempPlanetObject.id} );
									break;
								}
							}
							if (systemFound === false) {
								finalData.systems.push(tempSystemObject);
								tempPlanetObject.systemID = tempSystemObject.id;
								systemLoopCounter ++;
							}
						}

						tempClimateTypes.push( tempPlanetObject.climate );
						tempDomRaces.push( tempPlanetObject.domRace );
						finalData.planets.push(tempPlanetObject);
					}

					finalData.climateTypes = _.chain(tempClimateTypes)
						.uniq()
						.sortBy( function(type){ return type; } )
						.value();

					finalData.domRaces = _.chain(tempDomRaces)
						.uniq()
						.sortBy( function(race){ return race; } )
						.value();

					return finalData;
			}
		},
		map: {
			startingPoint : {x:-440,y:-780},
			init: function() {
				console.log('map.init()');
				var startingY = 200,
					xMod = 100,
					yMod = -100,
					mapSVG = SVG('starmap').size("100%", "100%").attr('id','svg-container').addClass('svg-container'),
					starGroup = mapSVG.group().attr('id','grpDots'),
					arrSystems = WA.methods.getSystems();

				//console.log('mapSVG');
				//console.log(mapSVG);
				//console.log(' --- ');



				//var circle = mapSVG.circle(20).move(100,100);
				for (var i = 0; i < arrSystems.length; i++) {

					var tempStar =		arrSystems[i];
					tempStar.svg =		starGroup
											.circle(4)
											.attr('fill', '#ffffff')
											//.addClass('circle-color')
											.move(
												tempStar.x*xMod,
												tempStar.y*yMod
											);
				};


				WA.methods.map.panZoomInstance = svgPanZoom('#svg-container', {
					//zoomEnabled: true,
					//controlIconsEnabled: true,
					//fit: true,
					//center: true,
					//minZoom: 0.1
					
					//viewportSelector: '.svg-pan-zoom_viewport',
					panEnabled: true,
					controlIconsEnabled: false,
					zoomEnabled: true,
					dblClickZoomEnabled: true,
					mouseWheelZoomEnabled: true,
					preventMouseEventsDefault: true,
					zoomScaleSensitivity: 0.2,
					minZoom: 1,
					maxZoom: 5,
					fit: false,
					contain: false,
					center: false,
					refreshRate: 'auto',
					//beforeZoom: function(){},
					onZoom: function(evt){
						console.log(['onZoom', evt]);
					},
					//beforePan: function(){},
					//onPan: function(){},
					onPan: function(evt){
						console.log(['onPan', evt]);
						//console.log(starGroup.node.transform.baseVal[0].matrix.e);
						//console.log(' ----------------- ');
					},
					//customEventsHandler: eventsHandler,
					eventsListenerElement: null	
				});





				//var mapLines = SVG.get('map-lines');
				//var mapLines = SVG.adopt( document.createElement('map-lines') );
				//console.log(['mapLines', mapLines]);


				// Put it in the right spot.
				WA.methods.map.reset();
				WA.methods.map.addListeners();
			},
			addListeners() {
				var panZoomInstance = this.panZoomInstance;


				// We're loading jQUery, so we should use it.
				$( "#map-nav" ).on( "click", function(event) {
					console.log( ['clicked', event] );
					switch ( $(event.target).closest('a').attr('id') ) {
						case 'map-nav-launch':
							console.log('launch: ' + event.target.id);
							$('#appModal').modal('show');
							break;
						case 'map-nav-reset':
							console.log('reset: ' + event.target.id);
							WA.methods.map.reset();
							break;

						case 'map-nav-zoom-out':
							console.log('zoom out: ' + event.target.id);
							panZoomInstance.zoomOut();
							break;

						case 'nav-zoom-in':
							console.log('zoom in: ' + event.target.id);
							panZoomInstance.zoomIn();
							break;
						default:
							console.log('default: ' + event.target.id);
							break;
					}
				});


			},
			reset : function() {
				//var panZoomInstance = WA.methods.map.panZoomInstance;
				WA.methods.map.panZoomInstance.zoom(2).pan({x:-880, y:-1560})
				//panZoomInstance.zoom(-440, -780, 1)
			},
			pan : function(point) {
				var panZoomInstance = WA.methods.map.panZoomInstance;
				var currentZoom = panZoomInstance.getZoom();
				//console.log(zoom);
				panZoomInstance.pan({x: point.x*currentZoom, y: point.y*currentZoom});
			}
		}
	}
})();