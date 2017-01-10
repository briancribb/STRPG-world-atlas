"use strict";
var STRPG = STRPG || {};
STRPG.utils = STRPG.utils || {};


/*
STRPG.initData(): Pulls data from a Google spreadsheet and adds it to the STRPG object.
	STRPG.data.planets:	A list of planets and their individual data.
	STRPG.data.systems:	A list of star systems, including their coordinates and which planets they include.
					They systems are for mapping, and match up to the planets for more specific data.
*/
STRPG.utils = {
	getDisplayCoords: function(x,y) {
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
	getNumberWithCommas: function(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	},
	getSystemFromPlanet: function(planet) {
		for (var i = 0; i < STRPG.data.systems.length; i++) {
			if ( STRPG.data.systems[i].value === planet.system ) {
				return STRPG.data.systems[i];
			}
		}
	},
	getSystemFromName: function(systemName) {
		for (var i = 0; i < STRPG.data.systems.length; i++) {
			if ( STRPG.data.systems[i].value === systemName ) {
				return STRPG.data.systems[i];
			}
		}
	},
	getSystemFromCoords: function(testPointX, testPointY) {
		var systemX,
			systemY,
			system = {
				value:"Interstellar Space",
				type:"space"
			};

		for (var i = 0; i < STRPG.data.systems.length; i++) {

			systemX = parseFloat(STRPG.data.systems[i].x);
			systemY = parseFloat(STRPG.data.systems[i].y);

			if ( testPointX === systemX && testPointY === systemY ) {
				system = STRPG.data.systems[i];
				return system;
			}
		}
		return system;
	},
	getNearestFromPoint: function(testPointX, testPointY) {
		// Converting map pixels to coordinates.
		testPointX = (testPointX/100).toFixed(2);
		testPointY = (testPointY/(-100)).toFixed(2);
		
		// using underscore.js to sort by distance.
		var nearestArray = STRPG.utils.sortByDistance(testPointX, testPointY, STRPG.data.systems);

		// Converting distanceFrom to map pixels.
		nearestArray[0].distanceFrom = (nearestArray[0].distanceFrom*100).toFixed(0);
		return nearestArray[0];
	},
	getPointFromCoords: function(coordX, coordY) {
		// Converting coordinates to map pixels.
		return {
			x: parseFloat((coordX*100).toFixed(0)),
			y: parseFloat((coordY*(-100)).toFixed(0))
		}
	},
	sortByDistance: function(testPointX, testPointY, arrayToUse) {
		return (_.sortBy(arrayToUse, function(planet){
			var distance = Math.sqrt(Math.pow(planet.x - testPointX,2) + Math.pow(planet.y - testPointY,2));
			planet.distanceFrom = distance.toFixed(2);
			return distance;
		}));
	},
	sortByProperty: function(property, subprop1, subprop2) {
		var location = STRPG.data.location,
			keyList = [],
			resultSet = {};

		if ( !subprop1 && !subprop2 ) {
			// Just property.
			resultSet = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property] }) );
		} else if ( !subprop2 ) {
			// property and subprop1
			resultSet = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property][subprop1] }) );
		} else {
			// All three arguments
			resultSet = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property][subprop1][subprop2] }) );
		}
		/*
		switch(arguments.length) {
			case 2:
				myObject = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property][subprop1] }) );
				break;
			case 3:
				myObject = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property][subprop1][subprop2] }) );
				break;
			default:
				// If only one property is passed in.
				myObject = ( _.groupBy(STRPG.data.planets, function(planet){ return planet[property] }) );
		}
		*/
		for (var key in resultSet) {
			keyList.push(key);
			if (resultSet.hasOwnProperty(key)) {
				resultSet[key] = STRPG.utils.sortByDistance( location.x, location.y, resultSet[key] );
				//console.log(key + " -> " + myObject[key][0]);
			}
		}

		keyList = _.sortBy(keyList, function(key){ return key; });

		return { resultSet:resultSet, keyList:keyList };
	},
	setOrigin: function(point) {
		point.x = Number(point.x);
		point.y = Number(point.y);
		STRPG.data.origin = { x:point.x, y:point.y };
	},
	setDestination: function(point) {
		point.x = Number(point.x);
		point.y = Number(point.y);
		STRPG.data.destination = { x:point.x, y:point.y };
	},
	getTime: function(distance, rate) {
		// Warp factors are speed-of-light cubed, but that's too slow for the maps to make sense. Modifier corrects for this.
		var finalSpeed = ( Math.pow(rate,3) ) * STRPG.data.speedMod,
			finalDistance = distance * STRPG.data.parsec;				// Yields distance in light years
		return ( (finalDistance / finalSpeed) * 365.25 ).toFixed(2);	// Days of travel.
	},
	getDistance: function(x1, y1, x2, y2, exact) {
		exact = exact || false;

		if ( exact === true ) {
			return ( Math.sqrt( Math.pow( (x2 - x1) ,2) + Math.pow( (y2 - y1) ,2) ) );
		} else {
			// Coordinates are marked in parsecs, so this yields a distance in parsecs.
			return ( Math.sqrt( Math.pow( (x2 - x1) ,2) + Math.pow( (y2 - y1) ,2) ).toFixed(2) );
		}
	},
	getRate: function(distance, time) {
		// distance in parsecs, time in days.
		var finalDistance = distance * STRPG.data.parsec, // convert to light years.
			finalTime = time / 365.25; // convert to years.

		var rate = finalDistance / finalTime;

		// Reverse speed conversions.
		var finalRate = (Math.pow( (rate / STRPG.data.speedMod), 1/3 ) ).toFixed(2);
		return finalRate;
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
		var populationDesc = {
			A : 'Very heavily populated',
			B : 'Heavily populated',
			C : 'Moderately populated',
			D : 'Sparsely populated',
			E : 'Very sparsely populated',
			X : 'Small station or colony'
		};
		return populationDesc[rating];
	},
	getTechSocialDetails: function (index, rating) {
		var techSocialArray = [
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
		];
		return techSocialArray[index][rating];
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