// http://angular-ui.github.io/bootstrap/#/typeahead

angular.module("WorldAtlas")
.directive("waTypeahead", ['$rootScope', 'STRPG', function($rootScope, STRPG){
	return {
		restrict:"E",
		templateUrl: 'templates/directives/wa-typeahead.html',
		scope:{
			inputid:"@",
			name:"@",
			type:"@"
		},
		link: function(scope, element, attrs) {
			STRPG.getData().then(function(data){

				// https://twitter.github.io/typeahead.js/examples/

				// Inspired by an example on this Stack Overflow page:
				// http://stackoverflow.com/questions/12389948/twitter-bootstrap-typeahead-id-label

				var typeaheadSelect = function(e, datum, dataset) {					
					$rootScope.$apply(function(){
						STRPG.setCurrent( datum.id, (datum.type === 'system'), (scope.type === 'destination') );
					});
				}

				var filter = function(suggestions) {
					return $.grep(suggestions, function(suggestion) {
						return $.inArray(suggestion.val) === -1;
					});
				}

				var dataPlanets = new Bloodhound({
					name: 'Planets',
					local: STRPG.getPlanets(),
					datumTokenizer: function(d) {
					  return Bloodhound.tokenizers.whitespace(d.name);
					},
					queryTokenizer: Bloodhound.tokenizers.whitespace
				});

				var dataSystems = new Bloodhound({
					name: 'Systems',
					local: STRPG.getSystems(),
					datumTokenizer: function(d) {
					  return Bloodhound.tokenizers.whitespace(d.name);
					},
					queryTokenizer: Bloodhound.tokenizers.whitespace
				});

				dataPlanets.initialize();
				dataSystems.initialize();

				element.find('input').typeahead(
					null,
					{
						name: 'planets',
						displayKey: 'name',
						// don't use
						// source: data.ttAdapter(),
						source: function(query, cb) {
							dataPlanets.get(query, function(suggestions) {
								cb(suggestions);
							});
						},
						templates: {
							header:"<h3>Planets</h3>",
							//empty: '<div class="empty-message">No matches.</div>'
						}
					},
					{
						name: 'systems',
						displayKey: 'name',
						// don't use
						// source: data.ttAdapter(),
						source: function(query, cb) {
							dataSystems.get(query, function(suggestions) {
								cb(filter(suggestions));
							});
						},
						templates: {
							header:"<h3>Systems</h3>",
							//empty: '<div class="empty-message">No matches.</div>'
						}
					}
				).on({'typeahead:selected': typeaheadSelect });


			}); // end of then()
		}
	};
}]);