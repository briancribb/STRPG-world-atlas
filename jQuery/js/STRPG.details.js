"use strict";

var STRPG = STRPG || {};

STRPG.details = {
	$container:				$('#wa-details'),
	systemID:				0,
	props : {
		$systemData:		$('#details-system-data'),
		$planetTabs:		$('#details-planets'),
		$selected:			$('#details-selected'),
		$desc:				$('#details-desc'),
		$planetData:		$('#details-planetary-data'),
		$techSocial:		$('#details-tech-social'),
		$tradeProfile:		$('#details-trade-profile'),
		$size:				$('#details-size'),
		$surface:			$('#details-surface'),
		$minerals:			$('#details-minerals')
	},
	init: function() {
		STRPG.details.props.$selected.typeahead(STRPG.data.typeaheadFormat);
		STRPG.data.current = STRPG.data.current || STRPG.data.location
		STRPG.search.update();
	},
	update: function() {
		STRPG.details.setDetails( STRPG.data.current.type, STRPG.data.current.id);
	},
	typeaheadHandler: function(event, datum) {
		STRPG.details.setDetails(datum.type, datum.id);
	},
	clickHandler: function(event) {
		if ( $(event.target).hasClass('panel-toggle') ) {
			STRPG.atlas.updateToggle( $(event.target) );

		} else if ( $(event.target).parent().hasClass('panel-toggle') ) {
			STRPG.atlas.updateToggle( $(event.target).parent() );

		} else if ( $(event.target).parent().hasClass('details-planet') ) {
			var targetPlanetID = Number( $(event.target).parent().data('planet-id') );
			STRPG.details.setDetails("planet", targetPlanetID);
		}
	},
	setDetails: function(type, id) {
		var systemID,
			planetID,
			systems = STRPG.data.systems,
			planets = STRPG.data.planets;
 
		if (type === "system") {
			systemID = id;
			planetID = STRPG.data.systems[id].planets[0].id;
		} else { // then it's a planet.
			planetID = id;
			systemID = STRPG.utils.getSystemFromPlanet( STRPG.data.planets[planetID] ).id;
		}
		var localPlanets = systems[systemID].planets;

		//STRPG.details.props.$desc.find('.panel-body').html( );
		STRPG.details.props.$planetTabs.html();
		var planetTabString = '';
		for (var i = 0; i < localPlanets.length; i++) {
			planetTabString += '<li id="planet' + localPlanets[i].id + '" data-planet-id="' + localPlanets[i].id + '" class="details-planet"><a href="#">' + localPlanets[i].value + '</a></li>';
		};
		STRPG.details.props.$planetTabs.html(planetTabString);
		$('.details-planet').removeClass('active');
		$('#planet' + planetID).addClass('active');

		STRPG.details.props.$systemData.find('.panel-heading').html('System: ' + systems[systemID].value );
		STRPG.details.props.$systemData.find('table').html(
			'<tbody>' + 
				'<tr><td>Coordinates</td><td>' + STRPG.utils.getDisplayCoords( systems[systemID].x, systems[systemID].y ).full + '</td></tr>' + 
				'<tr><td>Number of Class M</td><td>' + systems[systemID].numClassM + '</td></tr>' + 
			'</tbody>'
		);
		//STRPG.details.$container.find('#planet' + planetID + ' > a').html( planets[planetID].value );
		//STRPG.details.props.$desc.find('.panel-body').html( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer iaculis tempor nulla, eget suscipit quam ornare vel. Ut scelerisque cursus lorem, mattis laoreet libero varius quis.' );
		STRPG.details.props.$planetData.find('table').html( '<tbody><tr><td>Positions</td><td>' + planets[planetID].systemPosition + '</td></tr><tr><td>Satellites</td><td>' + planets[planetID].satellites + '</td></tr><tr><td>Gravity</td><td>' + planets[planetID].gravity + '</td></tr></tbody>' );

		STRPG.details.props.$techSocial.find('.panel-title').html('TechSocial Index: ' + planets[planetID].techSocIndex.rating );
		STRPG.details.props.$techSocial.find('table').html(
			'<tbody>' + 
			'<tr><td>Space Science Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.spaceScience.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.spaceScience.index, planets[planetID].techSocIndex.spaceScience.rating ) + '</div></td></tr>' + 
			'<tr><td>Engineering Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.engineering.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.engineering.index, planets[planetID].techSocIndex.engineering.rating ) + '</div></td></tr>' + 
			'<tr><td>Life/Medical Science Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.lifeMedScience.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.lifeMedScience.index, planets[planetID].techSocIndex.lifeMedScience.rating ) + '</div></td></tr>' + 
			'<tr><td>Physical Science Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.physicalScience.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.physicalScience.index, planets[planetID].techSocIndex.physicalScience.rating ) + '</div></td></tr>' + 
			'<tr><td>Planetary Science Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.planetaryScience.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.planetaryScience.index, planets[planetID].techSocIndex.planetaryScience.rating ) + '</div></td></tr>' + 
			'<tr><td>Psionics Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.psionics.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.psionics.index, planets[planetID].techSocIndex.psionics.rating ) + '</div></td></tr>' + 
			'<tr><td>Social Science Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.socialScience.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.socialScience.index, planets[planetID].techSocIndex.socialScience.rating ) + '</div></td></tr>' + 
			'<tr><td>Cultural Attitude Index</td><td><div class="details-index-rating">' + planets[planetID].techSocIndex.culturalAttitude.rating + ':</div><div class="details-index-desc">' + STRPG.utils.getTechSocialDetails( planets[planetID].techSocIndex.culturalAttitude.index, planets[planetID].techSocIndex.culturalAttitude.rating ) + '</div></td></tr>' + 
			'</tbody>'
		);
		STRPG.details.props.$tradeProfile.find('table').html(
			'<tbody>' + 
				//'<tr class="bg-info"><td>Agricultural</td><td>D</td></tr><tr><td></td><td>250SCU</td></tr><tr><td></td><td>700Cr</td></tr>'
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.agricultural + '</td><td>' + planets[planetID].tradeProfile.agricultural.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.agricultural.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.agricultural.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.rawMaterials + '</td><td>' + planets[planetID].tradeProfile.rawMaterials.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.rawMaterials.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.rawMaterials.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.radioSpecial + '</td><td>' + planets[planetID].tradeProfile.radioSpecial.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.radioSpecial.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.radioSpecial.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.drugMedicine + '</td><td>' + planets[planetID].tradeProfile.drugMedicine.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.drugMedicine.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.drugMedicine.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.lowTechMan + '</td><td>' + planets[planetID].tradeProfile.lowTechMan.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.lowTechMan.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.lowTechMan.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.mediumTechMan + '</td><td>' + planets[planetID].tradeProfile.mediumTechMan.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.mediumTechMan.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.mediumTechMan.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.highTechMan + '</td><td>' + planets[planetID].tradeProfile.highTechMan.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.highTechMan.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.highTechMan.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.luxuryGoods + '</td><td>' + planets[planetID].tradeProfile.luxuryGoods.rating + '</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.luxuryGoods.consumptionRate + ' SCU</td></tr><tr><td></td><td>' + planets[planetID].tradeProfile.luxuryGoods.price + ' CR</td></tr>' + 
				'<tr class="bg-info"><td>' + STRPG.data.tradeProfileNames.population + '</td><td>' + planets[planetID].tradeProfile.population.rating + '</td></tr><tr><td></td><td>' + STRPG.utils.getPopulationDesc(planets[planetID].tradeProfile.population.rating) + '</td></tr>' + 
			'</tbody>'
		);
		STRPG.details.props.$size.find('table').html(
			'<tbody>' + 
				'<tr><td>Diameter</td><td>' + STRPG.utils.getNumberWithCommas(planets[planetID].diameter) + 'km</td></tr>' +
				'<tr><td>Circumference</td><td>' + STRPG.utils.getNumberWithCommas(planets[planetID].circumference) + 'km</td></tr>' +
				'<tr><td>Surface Area</td><td>' + STRPG.utils.getNumberWithCommas(planets[planetID].surfaceArea) + 'sq.km</td></tr>' +
				'<tr><td>Percent Land</td><td>' + STRPG.utils.getNumberWithCommas(planets[planetID].percentLand) + '%</td></tr>' +
				'<tr><td>Total Land</td><td>' + STRPG.utils.getNumberWithCommas(planets[planetID].landArea) + 'sq.km</td></tr>' +
			'</tbody>'
		);
		STRPG.details.props.$surface.find('table').html(
			'<tbody>' + 
				'<tr><td>Length of Day</td><td>' + planets[planetID].dayLength + ' hours</td></tr>' +
				'<tr><td>Atmosphere</td><td>' + planets[planetID].atmosDensity + '</td></tr>' +
				'<tr><td>Climate</td><td>' + planets[planetID].climate + '</td></tr>' +
			'</tbody>'
		);
		STRPG.details.props.$minerals.find('table').html(
			'<tbody>' + 
				'<tr><td>Normal Metals</td><td>' + planets[planetID].minerals.normal + '%</td></tr>' +
				'<tr><td>Radioactives</td><td>' + planets[planetID].minerals.radioactives + '%</td></tr>' +
				'<tr><td>Gemstones</td><td>' + planets[planetID].minerals.gemstones + '%</td></tr>' +
				'<tr><td>Industrial Crystals</td><td>' + planets[planetID].minerals.crystals + '%</td></tr>' +
				'<tr><td>Special Minerals</td><td>' + planets[planetID].minerals.special + '%</td></tr>' +
			'</tbody>'
		);
	}
};



