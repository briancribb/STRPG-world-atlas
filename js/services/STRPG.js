angular.module('WorldAtlas')
.factory('STRPG', ['$location', '$http', '$q', function STRPGFactory($location, $http, $q) {
	/* Assumes that Underscore is loaded on app index page. */

	// Inspirations: 
	// http://stackoverflow.com/questions/21444100/angularjs-how-to-http-get-data-and-store-it-in-service
	// http://stackoverflow.com/questions/17160771/angularjs-a-service-that-serves-multiple-resource-urls-data-sources
	// http://stackoverflow.com/questions/24531351/retrieve-google-spreadsheet-worksheet-json

	return {
		data:null,
		selectPage: function(setPage) {
			$location.path(setPage);
			//console.log('WorldAtlasController: Path changed to: "' + $location.path() + '"');
		},
		getData: function() {

			//var dataURL1 = "https://spreadsheets.google.com/feeds/list/0AmArFrvAS2V7dFdVMXRBbmJoLXZTam9FNDVYcVhDanc/od8/public/values?alt=json",
			//	dataURL2 = "https://spreadsheets.google.com/feeds/list/0AmArFrvAS2V7dFdVMXRBbmJoLXZTam9FNDVYcVhDanc/od5/public/values?alt=json",
			//	dataURL3 = "https://spreadsheets.google.com/feeds/list/0AmArFrvAS2V7dFdVMXRBbmJoLXZTam9FNDVYcVhDanc/o6qpv3y/public/values?alt=json",
			var dataURL1 = "js/general/data_planets.json",
				dataURL2 = "js/general/data_locations.json",
				dataURL3 = "js/general/data_descriptions.json",
				that = this,
				defer = $q.defer(); // http://stackoverflow.com/questions/21444100/angularjs-how-to-http-get-data-and-store-it-in-service


			/*
			The $http service will cach its result, but the transformData() function will reset 
			some things that we want to keep. But have no fear! We're using a deferred object, so 
			we can resolve it inside a success function for the web call or just by passing the 
			data that we already have.
			*/
			if (that.data !== null) {
				defer.resolve(that.data);
			} else {
				var PlanetList		= $http.get(dataURL1, { cache: 'true'});
				var ShipLocation	= $http.get(dataURL2, { cache: 'true'});
				var Descriptions	= $http.get(dataURL3, { cache: 'true'});

				$q.when( $q.all([PlanetList, ShipLocation, Descriptions]) ).then(function(data) {
					that.data = transformData(data[0].data.feed.entry, data[2].data.feed.entry);
					that.data.locations = setupLocation(data[1].data.feed.entry);

					var tempLoc = that.getLocation();
					var tempPlace = that.getPlaceFromCoords(tempLoc.x, tempLoc.y);


					var tempID = ( tempPlace.id === -1 ) ? 3 : tempPlace.id;

					that.setCurrent( tempID, false, false );  /* Origin */
					that.setCurrent( tempID, false, true );   /* Destination */


					that.setOrigin(tempLoc.x,tempLoc.y);
					that.setDestination(tempLoc.destx,tempLoc.desty);

					defer.resolve(that.data);
				});
			}
			return defer.promise;

			
			/* Functions */
			function transformData(data, desc) {
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
						UFP		: { color: "rgba(110, 200, 250, 1)", 	fullName: "United Federation of Planets" },
						KE		: { color: "rgba(255, 0, 0, 1)", 		fullName: "Klingon Empire" },
						RSA		: { color: "rgba(190, 20, 190, 1)", 	fullName: "Romulan Star Empire" },
						AOFW	: { color: "rgba(200, 200, 0, 1)", 		fullName: "Affiliation of Outer Free Worlds" },
						OFMA	: { color: "rgba(0, 255, 0, 1)", 		fullName: "Orion Free Merchantile Association" },
						MCA		: { color: "rgba(150, 150, 255, 1)", 	fullName: "Mantiev Colonial Association" },
						IKS		: { color: "rgba(255, 150, 150, 1)", 	fullName: "Independent Klingon States" },
						I		: { color: "rgba(0, 255, 0, 1)", 		fullName: "Independent" },
						U		: { color: "rgba(150, 150, 150, 1)", 	fullName: "Unexplored" }
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


				var jsonPlanetData = data,
					tempClimateTypes = [],
					tempDomRaces = [],
					systemLoopCounter = 0; // There will be fewer systems than planets, and we don't want gaps in their id numbers.

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

					/* Add the descriptions. */
					for (var j = 0; j < desc.length; j++) {
						var string = desc[j].gsx$description.$t;
						if ( desc[j].gsx$world.$t === tempPlanetObject.name) {
							var descArray = desc[j].gsx$description.$t.split("^");
							tempPlanetObject.desc = descArray;
							break;
						}
					};

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
			function setupLocation(data) {
				var locations = [];
				for (var i = 0; i < data.length; i++) {

					/* If there's no destination listed for this location, make it the same as the location. */
					if (!data[i].gsx$destinationx.$t || !data[i].gsx$destinationy.$t ) {
						data[i].gsx$destinationx.$t = data[i].gsx$locationx.$t;
						data[i].gsx$destinationy.$t = data[i].gsx$locationy.$t;
					}
					locations.push({
						x:			Number(data[i].gsx$locationx.$t),
						y:			Number(data[i].gsx$locationy.$t),
						destx:		Number(data[i].gsx$destinationx.$t),
						desty:		Number(data[i].gsx$destinationy.$t),
						stardate:	data[i].gsx$stardate.$t
					});
				}
				return locations;
			}
		},
		getNumberWithCommas: function(x) {
			var parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		},
		getLocation: function() {
			return this.data.locations[ (this.data.locations.length - 1) ];
		},
		getCurrent: function() {
			return this.data.current;
		},
		getOrigin: function() {
			return this.data.origin;
		},
		getDestination: function() {
			return this.data.destination;
		},
		getAllLocations: function() {
			return this.data.locations;
		},
		getPlanets: function() {
			return this.data.planets;
		},
		getTradeProfileTypes: function() {
			return this.data.tradeProfileTypes;
		},
		getSystems: function() {
			return this.data.systems;
		},
		getPlace: function(place, isSystem) {
			//var planetsArray = this.data.planets;
			var placeArray = (isSystem === true) ? this.data.systems : this.data.planets;

			/* Number is assumed to be place ID, string is assumed to be place name. */
			if ( _.isNumber(place) ) {
				return placeArray[place];
			} else if ( _.isString(place) ) {
				for (var i = 0; i < placeArray.length; i++) {
					if ( placeArray[i].name === place ) {
						return placeArray[i];
					}
				}
			}
		},
		getPlaceFromCoords: function(pointX, pointY) {
			var systems = this.data.systems,
				system = {
					name:"Interstellar Space",
					type:"space",
					id:-1,
					x:pointX,
					y:pointY
				};
			for (var i = 0; i < systems.length; i++) {
				if ( pointX === systems[i].x && pointY === systems[i].y ) {
					system = systems[i];
					break;
				}
			}
			return system;
		},
		getDisplayCoords: function(x, y) {
			var displayX = x > 0 ? ( Math.abs(x) +'E') : ( Math.abs(x)+'W'),
				displayY = y > 0 ? ( Math.abs(y) +'N') : ( Math.abs(y)+'S');

			// Drop Letter if it's actually zero.
			displayX = (x === 0) ? 0 : displayX;
			displayY = (y === 0) ? 0 : displayY;

			return {
				full: (displayX + ', ' + displayY),
				x: displayX,
				y: displayY
			};
		},
		setCurrent: function(id, isSystem, isDestination) {
			var currentPlace = { system:{},planet:{},code:''},
				that = this;

			if (isSystem) {
				currentPlace.system = that.data.systems[id];
				currentPlace.planet = that.data.planets[ that.data.systems[id].planets[0].id ];
			} else {
				currentPlace.system = that.data.systems[ that.data.planets[id].systemID ];
				currentPlace.planet = that.data.planets[id];
			}
			if(!isDestination) {
				this.data.current.origin = currentPlace;
			} else {
				this.data.current.destination = currentPlace;
			}

			/* The current star gets set often by lots of things. We're only going to call that function from here so the map and app will always be in sync. */
			if (Starmap.initiated) {
				Starmap.setCurrentStar(id);
			}

			/* Update code that is watched by some controllers. */
			this.data.current.code = (
				( (isDestination === true) ? 'd' : 'o' ) +
				( (isSystem === true) ? 's' : 'p' ) +
				id
			).toString();
			return this.data.current;
		},
		setOrigin: function(x,y) {
			x = Number(x);
			y = Number(y);
			this.data.origin = { x:x, y:y };
			if (Starmap.initiated) {
				Starmap.setOrigin(x,y); /* Set on map with map coordinates. */
			}
		},
		setDestination: function(x,y) {
			x = Number(x);
			y = Number(y);
			this.data.destination = { x:x, y:y };
			if (Starmap.initiated) {
				Starmap.setDestination(x,y); /* Set on map with map coordinates. */
			}
		},
		getTime: function(distance, rate) {
			// Warp factors are speed-of-light cubed, but that's too slow for the maps to make sense. Modifier corrects for this.
			var finalSpeed = ( Math.pow(rate,3) ) * this.data.speedMod,
				finalDistance = distance * this.data.parsec;				// Yields distance in light years
			return Number( ( (finalDistance / finalSpeed) * 365.25 ).toFixed(2) );	// Days of travel.
		},
		getDistance: function(x1, y1, x2, y2, exact) {
			exact = exact || false;

			if ( exact === true ) {
				return ( Math.sqrt( Math.pow( (x2 - x1) ,2) + Math.pow( (y2 - y1) ,2) ) );
			} else {
				// Coordinates are marked in parsecs, so this yields a distance in parsecs.
				return Number( ( Math.sqrt( Math.pow( (x2 - x1) ,2) + Math.pow( (y2 - y1) ,2) ).toFixed(2) ) );
			}
		},
		getRate: function(distance, time) {
			// distance in parsecs, time in days.
			var finalDistance = distance * this.data.parsec, // convert to light years.
				finalTime = time / 365.25; // convert to years.

			var rate = finalDistance / finalTime;

			// Reverse speed conversions.
			var finalRate = (Math.pow( (rate / this.data.speedMod), 1/3 ) ).toFixed(2);
			return finalRate;
		},
		sortByDistance: function(testPointX, testPointY, arrayToUse) {
			var resultSet = (_.sortBy(arrayToUse, function(place){
				var distance = Math.sqrt(Math.pow(place.x - testPointX,2) + Math.pow(place.y - testPointY,2));
				place.distanceFrom = distance.toFixed(2);
				return distance;
			}));
			return resultSet;
		},
		sortByProperty: function(testPointX, testPointY, property, subprop1, subprop2) {
			var keyList = [],
				resultObj = {},
				resultSet = [];

			if ( !subprop1 && !subprop2 ) {
				// Just property.
				if (property === 'distance') {
					resultObj = {distance: this.getPlanets()};
				} else {
					resultObj = ( _.groupBy(this.getPlanets(), function(planet){ return planet[property] }) );
				}
			} else if ( !subprop2 ) {
				// property and subprop1
				resultObj = ( _.groupBy(this.data.planets, function(planet){ return planet[property][subprop1] }) );
			} else {
				// All three arguments
				resultObj = ( _.groupBy(this.data.planets, function(planet){ return planet[property][subprop1][subprop2] }) );
			}
			
			for (var key in resultObj) {
				keyList.push(key);
				if (resultObj.hasOwnProperty(key)) {
					resultObj[key] = this.sortByDistance( testPointX, testPointY, resultObj[key] );
				}
			}

			keyList = _.sortBy(keyList, function(key){ return key; });

			for (var i = 0; i < keyList.length; i++) {
				//resultSet.push( resultObj[ keyList[i] ] );
				resultSet.push( {keyName: keyList[i], places: resultObj[ keyList[i] ] } );
			};


			return resultSet;
		},
		getSortedKeys: function(myObject) {
			var keyList = [];
			for (var key in myObject) {
				keyList.push(key);
			}
			keyList = _.sortBy(keyList, function(key){ return key; });
			return keyList;
		},
		getTripProgress: function(settings) {
			// STRPG.utils.getTripProgress({ rate:3, partialTime:120, distance:11 });
			// STRPG.utils.getTripProgress({ x1:0, y1:0, x2:1, y2:1, rate:3, partialTime:120 });
			// STRPG.utils.getTripProgress({ x1:0, y1:0, x2:1, y2:1, rate:3, partialTime:3 });

			// Rate is warp speed and partialTime is in days.
			var rate = settings.rate,
				originalDistance = null,
				partialTime = Number(settings.partialTime),
				returnObject = {};

			if (settings.distance) {
				originalDistance = settings.distance;
			} else {
				originalDistance = STRPG.utils.getDistance(settings.x1, settings.y1, settings.x2, settings.y2);
			}

			var originalTime = this.getTime(originalDistance, rate);

			if( partialTime > originalTime ) { partialTime = originalTime; }

			var distancePerDay = originalDistance / originalTime; // This app measures in days and parsecs.
			var partialDistance = distancePerDay * partialTime; // How far you go in the reduced number of days.

			if (settings.distance) {
				// Exact distance given, so there are no coordinates.
				returnObject =  {
					distance: partialDistance.toFixed(2),
					rate: rate,
					time: partialTime
				};
			} else {
				
				// Coordinates were given, so compute new location.
				var x1 = Number(settings.x1),
					y1 = Number(settings.x1),
					x2 = Number(settings.x1),
					y2 = Number(settings.x1);

				var dy = y2 - y1,
					dx = x2 - x1;
				var courseAngle = Math.atan2(dy, dx);
				//courseAngle *= 180/Math.PI // rads to degs

				// End point of partial trip.
				var x3 = (Math.round( (x1 + Math.cos(courseAngle) * partialDistance)*10 ) )/10,
					y3 = (Math.round( (y1 + Math.sin(courseAngle) * partialDistance)*10 ) )/10;
				returnObject =  {
					distance: partialDistance.toFixed(2),
					rate: rate,
					time: partialTime,
					x: x3,
					y: y3
				};
			}
			return returnObject;
		},
		getPopulationDesc: function (rating) {
			return this.data.populationDesc[rating];
		},
		getTechSocialDetails: function (index, rating) {
			return this.data.techSocialArray[index][rating];
		},
		checkIfEmpty: function($target) {
			var hasValue = true;
			if ( !$target.val()) {
				$target.addClass('error');
				hasValue = false;
			}
			return hasValue;
		}
	};
}]);