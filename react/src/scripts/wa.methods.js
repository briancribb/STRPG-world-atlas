var WA = WA || {};

WA.methods = (function () {
	//console.log(['getData()', dfd_init]);
	var smData = {};
	return {
		checkData: function() {
			return smData;
		},
		getPlanets: function() {
			return smData.planets;
		},
		getSortedPlanets: function(strOrderBy) {
			return _.sortBy(smData.planets, function(planet){ return planet[strOrderBy] } )
		},
		getSystems: function() {
			return smData.systems;
		},
		getPlace: function(item, type) {
			// Works with a string, number or point object.
			// If the type is undefined, then it will be set to 'planet'.
			type = (type && type.toLowerCase() === 'system') ? 'system' : 'planet';

			// Select the target array according to the type.
			var arrItems = (type === 'planet') ? smData.planets : smData.systems;


			switch (typeof item) {
				case "string":
					// If it's a string, then expect a name.
					return _.find(arrItems, function(place){ return place.name === item });
					break;
				case "number":
					// If it's a string, then expect a name.
					return _.find(arrItems, function(place){ return place.id === item });
					break;
				default:
					// If it's not a string, then expect a point with x and y values.
					return _.find(arrItems, function(place){ return (item.x === place.x && item.y === place.y) });
					break;
			}
		},
		getPopulationDesc: function (rating) {
			return smData.populationDesc[rating];
		},
		getTechSocialDetails: function (index, rating) {
			return smData.techSocialArray[index][rating];
		},
		getACDisplay: function(place) {
			if (!place) return '';

			let system, planet;

			if (place.type === 'system') {
				system = place;
				planet = this.getPlace( place.planets[0].id );
			} else {
				system = this.getPlace( place.systemID, 'system' );
				planet = place;
			}
			//console.log(['getACDisplay', place, (system.name + ', ' + planet.name) ]);
			return (system.name + ', ' + planet.name);
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

				// Call the transform function, which is written below.
				smData = transformData(objData);
				//console.log(["All of the ajax calls are complete. Length is ", data]);


				/*
				Once all of the data is finished and ready to go, the map needs to be built and the pan-zoom instance established. 
				Once that final bit of work is done, resolve the deferred that was passed into the getData function. This will kick off
				the React app.
				*/
				that.map.init( $.Deferred().done(function(data) {
					//console.log(['Map is initialized.', WA.methods.map.panZoomInstance]);
					// Resolve the primary initialization Deferred and pass in the final data.
					dfd_init.resolve(smData);
				}) );

			});

			function transformData(oldData) {
					var smData = {
						parsec : 3.26163344,
						speedMod : 3,
						systems : [],
						planets : [],
						locations : null,
						//current : { origin: null, destination: null },
						origin : null,
						destination : null,
						regionProps : {
							UFP		:	{
											color: "rgba(110, 200, 250, 1)", 
											fullName: "United Federation of Planets",
											pathData: "M440,906.5c0,0,11.8,11.5,23.3,12.2 c14.9,0.8,42.9-23.8,57.5-23.8c7.101,0,14.5,12.699,31.7,12.699c12.201,0,35.5-1.1,47.301,0.301c7.299,0.899,11.4,0.1,18.299-11.4 c4-6.7,9.5-12.4,10.801-21.3c2-13.8-5.5-14.4-5.301-24.4c0.201-9.3,11.701-19.7,27.5-25.2c15.602-5.399,25.102-3.6,31.801-5.6 c6.199-1.9,10.199-5.5,7.6-19.4c-1.5-8.1,1.701-20.399,1.701-20.399H440V906.5z"
										},
							KE		:	{
											color: "rgba(255, 0, 0, 1)",
											fullName: "Klingon Empire",
											pathData: "M440,932.7 c26.734-1.917,33.401,3.45,47.6,25.399c5.101,5.301,8.601,4.101,19.101,5c3.899,0.301,11.2,5.9,17.399,6.5 c4.2,0.4,14.9-4.1,22.9,3.101c7.3,6.5,4.599,9.6,7.599,15.8c2,4,5.201,8.7,8.102,15.8c1.699,4.101-1.701,10,1,15.7 c4,8.7,3.199,27.6,17,38.5c8.6,6.8,6.699,3.1,15.398,13.4c9.701,11.399,10.9,26.5,25.5,38.6c12.469,7.284,15.4,16.85,23.588,24.55 s17.513,13.15,22.412,19.05c8.801,10.601,12.201,12.9,19.201,16.2c8.5,4,11.7,13.819,15.601,16.819 c6.5,5.101,11.3,11.781,14.8,18.081c2.5,4.399,6.1,16.899,12.799,27.2c7.733,14.384,19.43,10.173,23.764,28.385 c1.5,9.5,0.162,29.215-32.764,29.215c-11.9,0-281.099,0-281.099,0S440,940,440,932.7z"
										},
							RSA		:	{
											color: "rgba(190, 20, 190, 1)", 
											fullName: "Romulan Star Empire",
											pathData: "M734,780c0,0-5.6,9-15.799,18.1 C709.9,805.6,707,814.2,707.701,819.7c0.799,6.7,2.6,6.8,4.1,10.8c1.799,4.6,1.5,6.7,2.699,9.3c1.4,2.9,3,3.5,2.6,8.101 c-1.1,13.1-6.699,26.3-9.6,38.3c-1.4,5.7-7.85,17.25-8.1,26.899c0,2.101-0.199,6.5-1.6,9.101c-3.4,6.2-8.1,7.5-13.1,13.6 c-5.301,6.5-6.9,20-4.201,28.3c3.5,10.7,8.5,18.4,18.1,24.601c11.102,7.1,18.5,11.199,20.9,17.399c6.201,16,2.1,28,0.201,42.801 c-1.4,10.5,1.5,16.3,0.699,21.899c-2.199,16.101-8.199,15.8-8.9,24.9c-0.6,8.2,16.701,39.1,17.201,55.5 c0.257,9.285-25.301,11.583-14,24.5c4.1,3.399,10.5,3.6,15.199,15.399c4.147,10.414,2.75,19.852,4.501,40.021 c0.304,7.691,21.899,10.479,23.099,20.38c0.801,7.1,5.6,8.1,7.701,15.6c1.799,3.5,1.299,23,4.799,23c2,0,14.801-0.1,14.801-0.1V780 H734z"
										},
							AOFW	:	{
											color: "rgba(200, 200, 0, 1)",
											fullName: "Affiliation of Outer Free Worlds",
											pathData: "M572.5,925.9c-2.4-5.101,0.9-13.5,8-13.5 c6.6,0,7.701,2.199,16.1,1.8c8.4-0.5,29.701-4.5,35.4-1.9c5.701,2.601,10.694,7.672,15.201,15.3 c7.197,12.182,3.768,32.516,11.199,53.801c0.006,9.92-4,8.399-13.1,9.8c-8,1.2-23-6.9-31.701-9.9 c-8.398-2.899-19-0.899-25.699-2.899c-4-1.2-6.6-3.301-8.199-7.101c-1.5-3.5,0.5-7.7,0-13.399c-0.602-7.2,0.398-8.601,0.398-12.2 C580.099,940,575.5,932.3,572.5,925.9z"
										},
							OFMA	:	{
											color: "rgba(0, 255, 0, 1)",
											fullName: "Orion Free Merchantile Association",
											pathData: "M481.9,920.9c0.1-2.7,2.566-5.65,5.167-6.95 c3.12-0.977,6.533-0.05,7.533,0.25c5.301,1.8,6.9,5.1,13.301,5.1c12.899,0.101,16.6-6.2,25.1-5.2c5.4,0.601,7.9,7.9,4.6,11.7 c-3.5,4.2-6.3,3.2-11,11.7c-2.8,5-5.8,9.5-9,16.5c-2,4.3-10.199,6.5-12.5,1.2c-1.699-3.9-1.399-6.8-9.1-17 C488.8,928.9,481.8,925.7,481.9,920.9z"
										},
							MCA		:	{
											color: "rgba(150, 150, 255, 1)", 
											fullName: "Mantiev Colonial Association",
											pathData: "M651.8,1082.2c-2.4-3,0.5-10.101,7.299-10.101 c6.801,0,41.5,15.7,46.4,24.5c1.201,2.2,1.6,6.101,0.801,7.301c-2.1,3.199-6.201,2.899-9.701,1.8c-6.699-2-14.5,2.1-20.799,4.399 c-5.588,1.726-8.701-0.399-10.9-1.6c-3.5-2-1.301-6.4-4.801-12.2S654.201,1085.3,651.8,1082.2z"
										},
							IKS		:	{
											color: "rgba(255, 150, 150, 1)", 
											fullName: "Independent Klingon States",
											pathData: "M647.775,897.825 C651.9,892.45,657,892.8,660.5,887c1.1-1.8,0.5-6.7,1.801-10c2-4.8,8.799-9.7,12.199-12.6c3.5-3,14.025-2.95,14.801,3.5 c0.799,4.5-0.801,8.399,1.299,12c2.102,3.6,4.301,2.675,7.801,7c3.5,4.175,1.427,10.8-4.1,11.6c-6.15,0.45-7.301-1.4-12,0.5 c-5.1,2.1-8.446,6.488-14.646,9.089c-5.1,2.1-14.63,4.236-18.505,1.771C643.4,904.825,647.775,897.825,647.775,897.825z"
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
							smData.systems.push(tempSystemObject);
							tempPlanetObject.systemID = tempSystemObject.id;
							systemLoopCounter ++;
						} else {
							var systemFound = false;
							for (var j = 0; j < smData.systems.length; j++) {
								if (smData.systems[j].name === tempPlanetObject.system) {
									tempPlanetObject.systemID = smData.systems[j].id;
									systemFound = true;
									smData.systems[j].planets.push( {name:tempPlanetObject.name, id:tempPlanetObject.id} );
									break;
								}
							}
							if (systemFound === false) {
								smData.systems.push(tempSystemObject);
								tempPlanetObject.systemID = tempSystemObject.id;
								systemLoopCounter ++;
							}
						}


						tempClimateTypes.push( tempPlanetObject.climate );
						tempDomRaces.push( tempPlanetObject.domRace );
						smData.planets.push(tempPlanetObject);
					}

					smData.climateTypes = _.chain(tempClimateTypes)
						.uniq()
						.sortBy( function(type){ return type; } )
						.value();

					smData.domRaces = _.chain(tempDomRaces)
						.uniq()
						.sortBy( function(race){ return race; } )
						.value();

					return smData;
			}
		},
		/*
		updateLocs: function(origin, destination) {
			This method is a placeholder for documenting purposes. The real method is created in the main React 
			component within wa.components.js and allows this methods module to update the origin and destination 
			in the component state. Only the map exists outside of the React app, so it needs a way to set the 
			origin and destination when the map is clicked. Once that happens, the app takes care of itself.
			This method is created upon componentDidMount.
		},
		*/
		setACValues : function(place, isDest){
			// Sets existing autocompletes according to the "current" object.

			// Used to target the proper autocomplete inputs.
			let system, 
				planet, 
				targetClass = (isDest === true) ? 'destination' : 'origin';


			if (place.type === 'system') {
				system = place;
				planet = WA.methods.getPlace( system.planets[0].id )
			} else {
				system = WA.methods.getPlace( place.systemID, 'system' )
				planet = place;
			}

			// Clears the value of all existing autocompletes. Used when the launch button is clicked from the map.
			$('input.form-control.ac').val('');

			// Sets the value for the map's autocomplete
			//$('#map-ac > input').val(system.name + ', ' + planet.name);
		},
		map: {
			currentPlace : null,
			startingPoint : {x:-440,y:-780},
			coordMod : {x: 100, y: -100},
			isClicked : false,		// Prevent click handlers from running after the conclusion of a pan.
			clickDistance : 15,		// Tolerance distance when the user tries to click on a star.
			selectedSystem: null,	// Currently selected and marked system. This variable will be used in the details view if it's available.
			selectHandler : function(evt){
				//console.log('selectHandler(' + evt.type + ')');
				switch(evt.type) {
					//case 'mousedown' || 'touchstart':
					//	this.handleDown(evt);
					//	break;
					//case 'mouseup' || 'touchend':
					//	this.handleUp(evt);
					//	break;
					case 'tap' || 'pinch':
						$('#map-ac > input').val(evt.type);
						//this.handleUp(evt);
						break;
					default:
						// default code block
				}
			},
			handleResize : function(evt){
				// The SVG takes up all available space, but there's navigation at the bottom which lays over it. This line of code uses 
				// jQuery to get the height of the nav, and then shorten the SVG by that amount. This prevents centered SVG elements from 
				// looking a little off due to that non-visible portion of the SVG being covered up.

				//$('#starmap').css('bottom', ( $('#map-nav').outerHeight() + 'px' ) );
				$('#starmap').css({
					'top'	: $('#map-ac').outerHeight() + 'px',
					'bottom'		: $('#map-nav').outerHeight() + 'px'
				});
			},
			handleDown : function(evt){
				this.isClicked = true;
				//console.log(['-- handleDown()', this]);
			},
			handleUp : function(evt){
				var that = this;

				if (that.isClicked) {
					that.isClicked = false;

					var dim = that.getSVGBox();
					var x = evt.clientX - dim.left,
						y = evt.clientY - dim.top;

					var newPoint = that.getMapPoint({x:x, y:y});
					var nearestSystem = that.sortByDistance( newPoint , WA.methods.getSystems() )[0];

					//var distance = WA.methods.map.getSVGDistance( nearestSystem.distanceFrom );
					//console.log( [nearestSystem.name, nearestSystem.distanceFrom, distance, newPoint, {x:nearestSystem.x, y:nearestSystem.y}] );

					if ( WA.methods.map.getSVGDistance(nearestSystem.distanceFrom) <= that.clickDistance ) {
						console.log(["Close enough on the SVG, so let's pick a system.", that.clickDistance]);
						that.selectedSystem = nearestSystem
						WA.methods.updateLoc({place: nearestSystem, type:'origin', source:'click'});
					} else {
						console.log(["Too far away, unmark things.", that.clickDistance]);
						WA.methods.updateLoc();
					}
				} else {
					//console.log("Panned or something, no click actions.");
				}
			},
			init: function(dfd_init) {
				var that = this,
					xMod = this.coordMod.x,
					yMod = this.coordMod.y;

				that.mapSVG		= SVG('starmap').size("100%", "100%").attr('id','svg-container').addClass('svg-container');
				that.grpAreas	= that.mapSVG.group().attr('id','grpAreas').addClass('grpAreas');
				that.grpStars	= that.mapSVG.group().attr('id','grpStars').addClass('grpStars');
				that.grpSelected	= that.mapSVG.group().attr('id','grpSelected').addClass('grpSelected');

				var arrSystems = WA.methods.getSystems();


				//var circle = mapSVG.circle(20).move(100,100);
				for (var i = 0; i < arrSystems.length; i++) {

					var tempStar = arrSystems[i];

					/*
					that.grpStars
						.use('star-symbol')
						.addClass( 'star' )
						.addClass( tempStar.affiliation )
						.move(
							tempStar.x*xMod,
							tempStar.y*yMod
						);
					*/

					that.grpStars.circle(4)
						.addClass( 'star' )
						.addClass( tempStar.affiliation )
						.move(
							tempStar.x*xMod-2,
							tempStar.y*yMod-2
						);

				};

				that.grpAreas.path(smData.regionProps.UFP.pathData).addClass('area UFP');
				that.grpAreas.path(smData.regionProps.KE.pathData).addClass('area KE');
				that.grpAreas.path(smData.regionProps.RSA.pathData).addClass('area RSA');
				that.grpAreas.path(smData.regionProps.AOFW.pathData).addClass('area AOFW');
				that.grpAreas.path(smData.regionProps.OFMA.pathData).addClass('area OFMA');
				that.grpAreas.path(smData.regionProps.MCA.pathData).addClass('area MCA');
				that.grpAreas.path(smData.regionProps.IKS.pathData).addClass('area IKS');


				that.grpSelected.circle(8).fill('none').stroke('#fff').move(-4, -4);
				that.grpSelected.circle(12).fill('none').stroke('#fff').move(-6, -6);
				that.grpSelected.circle(16).fill('none').stroke('#fff').move(-8, -8);


				that.panZoomInstance = svgPanZoom('#svg-container', {
					//zoomEnabled: true,
					//controlIconsEnabled: true,
					//fit: true,
					//center: true,
					//minZoom: 0.1
					
					//viewportSelector: '.svg-pan-zoom_viewport',
					//panEnabled: true,
					controlIconsEnabled: false,
					zoomEnabled: true,
					dblClickZoomEnabled: false,
					//mouseWheelZoomEnabled: true,
					//preventMouseEventsDefault: true,
					zoomScaleSensitivity: 0.2,
					minZoom: 1,
					maxZoom: 5,
					fit: false,
					contain: false,
					center: false,
					refreshRate: 'auto',
					//beforeZoom: function(){},
					onZoom: function(evt){
						that.isClicked = false;
					},
					//beforePan: function(){},
					//onPan: function(){},
					onPan: function(evt){
						that.isClicked = false;
					},
					customEventsHandler: WA.methods.map.eventsHandler(),
					eventsListenerElement: null	
				});

				// Put it in the right spot.
				WA.methods.map.reset();

				dfd_init.resolve();
			},
			eventsHandler: function() {
				// An object for the panzoom instance.
				console.log('eventsHandler()');
				return {
					haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
					init: function(options) {

						this.hammertime = new Hammer(
							options.svgElement,
							{}
						);
						this.hammertime.get('pinch').set({ enable: true });
						this.hammertime.on('tap pinch', function(evt) {
							console.log(['hammertime', evt]);
							//options.instance.zoomIn()
							WA.methods.map.selectHandler(evt);
						});

					},
					destroy: function() {
						this.hammer.destroy();
					}
				};
			},
			getSVGBox : function(evt){
				return document.getElementById('svg-container').getBoundingClientRect();
			},
			getPointFromCoords: function(coords) {
				//console.log(coords);
				// Converting coordinates to map pixels.
				var zoom = this.panZoomInstance.getZoom();

				return {
					x: Math.round( (coords.x * this.coordMod.x) * zoom ),
					y: Math.round( (coords.y * this.coordMod.y) * zoom )
				}
			},
			getCoordsFromPoint: function(point) {
				// Converting coordinates to map pixels.
				var zoom = this.panZoomInstance.getZoom();

				return {
					x: Number( ( Math.round(point.x / zoom) / this.coordMod.x ).toFixed(1) ),
					y: Number( ( Math.round(point.y / zoom) / this.coordMod.y ).toFixed(1) )
				}
			},
			getMapPoint : function(point) {
				// Accepts a clicked point on the SVG in the DOM, converts it to a position within the SVG map. When a spot on 
				// the SVG is clicked, this will return the numbers required to find the closest star, etc.
				var pan = this.panZoomInstance.getPan()

				return {
					x: parseInt(point.x - pan.x),
					y: parseInt(point.y - pan.y)
				};
			},
			reset : function() {
				WA.methods.map.panZoomInstance.zoom(2).pan({ x:(this.startingPoint.x*2), y:(this.startingPoint.y*2) });
			},
			getSVGDistance : function(distance) {
				// Converts a coordinate distance to a distance on the SVG at the current zoom factor.
				return distance * Math.abs(this.coordMod.x) * this.panZoomInstance.getZoom();
			},
			getCoordDistance : function(distance) {
				// Converts a distance in pixels on the SVG into a coordinate distance at the current zoom factor.
				return distance / this.panZoomInstance.getZoom() / Math.abs(this.coordMod.x);
			},
			panToCoords : function(coords) {
				var box = this.getSVGBox();

				// Get centerpoint of the SVG map.
				var systemPoint = this.getPointFromCoords({ x: coords.x, y:coords.y });



				var panPoint = {
					x: -(systemPoint.x) + (box.width/2),
					y: -(systemPoint.y) + (box.height/2)
				}
				//WA.methods.map.panZoomInstance.pan({ x: (-3223 + (box.width/2)), y:(-5274 + (box.height/2)) });

				console.log([box, systemPoint, panPoint]);
				this.panZoomInstance.pan(panPoint);

				return panPoint;
			},
			panToPlace : function(place) {
				// For brevity in other code, this funcion accepts a planet or system object and just passes its coordinates into another local method.
				this.panToCoords({
					x: place.x,
					y: place.y
				});
			},
			markSelected: function(place) {
				this.clearSelected();
				this.currentPlace = place;

				var coordMod = this.coordMod;

				var placePoint = {
					x: place.x * coordMod.x,
					y: place.y * coordMod.y
				};

				//this.grpSelected.circle(8).fill('none').stroke('#fff').move(-4,-4);
				this.grpSelected.move(placePoint.x, placePoint.y);
				this.grpSelected.addClass('on');
			},
			clearSelected: function(place) {
				this.grpSelected.removeClass('on');
				this.currentPlace = null;
			},
			sortByDistance: function(point, arrayToUse) {
				var zoom = this.panZoomInstance.getZoom();

				var newPoint = this.getCoordsFromPoint(point);

				return (_.sortBy(arrayToUse, function(place){
					var placePoint = {
						x: place.x,
						y: place.y
					}
					var distance = Math.sqrt(Math.pow(placePoint.x - newPoint.x,2) + Math.pow(placePoint.y - newPoint.y,2));
					place.distanceFrom = distance.toFixed(2);
					return distance;
				}));
			},
			getNearestFromPoint: function(point, arrayToUse) {
				return this.sortByDistance(point, arrayToUse)[0];
			}
		}
	}
})();