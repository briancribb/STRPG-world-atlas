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
			init: function() {
				console.log('map.init()');
				var startingY = 200,
					xMod = 100,
					yMod = -100,
					mapSVG = SVG('starmap').size("100%", "100%").attr('id','svg-container').addClass('svg-container'),
					starGroup = mapSVG.group().attr('id','grpDots'),
					arrSystems = WA.methods.getSystems();

				console.log('mapSVG');
				console.log(mapSVG);
				console.log(' --- ');


				var arrCircles = [
					{ x: 50,  y: 120, diameter: 20, color: '#ff0000' },
					{ x: 100, y: 175, diameter: 20, color: '#00ff00' },
					{ x: 175, y: 115, diameter: 20, color: '#0000ff' },
					{ x: 210, y: 225, diameter: 20, color: '#BADA55' },
					{ x: 230, y: 100, diameter: 20, color: '#55DABA' },
					{ x: 250, y: 50,  diameter: 20, color: '#456789' },
					{ x: 300, y: 130, diameter: 20, color: '#abcdef' },
					{ x: 345, y: 72,  diameter: 20, color: '#ddaabb' },
					{ x: 375, y: 20,  diameter: 20, color: '#11aacc' },
					{ x: 423, y: 175, diameter: 20, color: '#ffaaff' }
				];

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
					minZoom: 2,
					maxZoom: 5,
					fit: false,
					contain: false,
					center: false,
					refreshRate: 'auto',
					//beforeZoom: function(){},
					//onZoom: function(){},
					//beforePan: function(){},
					//onPan: function(){},
					//onPan: function(evt){
					//	console.log(evt);
						//console.log(starGroup.node.transform.baseVal[0].matrix.e);
						//console.log(' ----------------- ');
					//},
					customEventsHandler: WA.methods.map.eventsHandler,
					eventsListenerElement: null	
				});


				var eventsHandler = {
					haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
					init: function(options) {
						console.log(['eventsHandler.init().options', options]);
						var instance = options.instance, 
							initialScale = 1, 
							pannedX = 0, 
							pannedY = 0;

						// Init Hammer
						// Listen only for pointer and touch events
						this.hammer = Hammer(options.svgElement, {
							inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
						});

						// Enable pinch
						this.hammer.get('pinch').set({enable: true});

						// Handle double tap
						this.hammer.on('doubletap', function(ev){
							console.log(['hammer doubletap', ev]);
							instance.zoomIn()
						});

						// Handle pan
						this.hammer.on('panstart panmove', function(ev){
							console.log(['hammer pan', ev]);
							// On pan start reset panned variables
							if (ev.type === 'panstart') {
								pannedX = 0
								pannedY = 0
							}

							// Pan only the difference
							instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
							pannedX = ev.deltaX
							pannedY = ev.deltaY
						});

						// Handle pinch
						this.hammer.on('pinchstart pinchmove', function(ev){
							console.log(['hammer pinch', ev]);

							// On pinch start remember initial zoom
							if (ev.type === 'pinchstart') {
								initialScale = instance.getZoom()
								instance.zoom(initialScale * ev.scale)
							}

							instance.zoom(initialScale * ev.scale)
						})

						// Prevent moving the page on some devices when panning over SVG
						options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
					},
					destroy: function() {
						this.hammer.destroy()
					}
				}


				var mapLines = SVG.get('map-lines');
				//var mapLines = SVG.adopt( document.createElement('map-lines') );
				console.log(['mapLines', mapLines]);


				// Put it in the right spot.
				WA.methods.map.reset();

			},
			startingPoint : {x:-440,y:-780},
			reset : function() {
				var panZoomInstance = WA.methods.map.panZoomInstance;
				panZoomInstance.zoom(2).pan({x:-880, y:-1560})
				//panZoomInstance.zoom(-440, -780, 1)
			},
			pan : function(point) {
				//var panZoomInstance = WA.methods.map.panZoomInstance;
				//var currentZoom = panZoomInstance.getZoom();
				//console.log(zoom);
				//panZoomInstance.pan({x: point.x*currentZoom, point.y: y*currentZoom});
			}
		}
	}
})();