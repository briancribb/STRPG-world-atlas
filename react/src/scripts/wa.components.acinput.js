/* ============== Autocomplete ================= */


WA.ACInput = class extends React.Component {


	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		console.log('**** ACInput: constructor()');
	}


	componentDidMount() {
		console.log(['ACInput: componentDidMount() - ', this.props]);
		var that = this;

		that.autocomplete = new autoComplete({
			selector: 'input[name="' + that.props.name + '"]',
			minChars: 2,
			offsetTop:0,
			source: function(term, suggest){
				term = term.toLowerCase();

				// Initialize empty arrays.
				var arrPlanets	= [],
					arrSystems	= [],
					matches		= [];

				// Get matching results.
				arrPlanets		= _.filter(WA.methods.getPlanets(), function(planet){ return planet.name.toLowerCase().indexOf(term) !== -1 });
				arrSystems		= _.filter(WA.methods.getSystems(), function(planet){ return planet.name.toLowerCase().indexOf(term) !== -1 });

				// If we have planets, then add them to the matched results.
				if (arrPlanets.length > 0) {
					arrPlanets.unshift( { name:'|P|' } );
					matches = matches.concat( arrPlanets );
				}

				if (arrSystems.length > 0) {
					arrSystems.unshift( { name:'|S|' } );
					matches = matches.concat( arrSystems );
				}
				console.log([arrPlanets, arrSystems, matches]);
				suggest(matches);
			},
			renderItem: function (item, search){
				switch (item.name) {
					case '|P|':
						return '<div class="autocomplete-suggestion autocomplete-header bg-info text-white" data-val="">Planets</div>';
						break;
					case '|S|':
						return '<div class="autocomplete-suggestion autocomplete-header bg-info text-white" data-val="">Systems</div>';
						break;
					default:
						search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
						var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
						return '<div class="autocomplete-suggestion" data-type="' + item.type + '" data-id="' + item.id + '" data-val="' + item.name + '">' + item.name.replace(re, "<b>$1</b>") + '</div>';
						break;
				}
			},
			onSelect: function(evt, term, item){

				if (!item.getAttribute('data-val')) {
					console.log([evt, 'no name']);
					return;
				}


				console.log(
					[
						evt,

						('Item: "'+
							item.getAttribute('data-val')+
							', Type: "'+
							item.getAttribute('data-type')+
							', ID: "'+
							item.getAttribute('data-id')+
							'" selected by '+
							(evt.type == 'keydown' ? 'pressing enter' : 'mouse click')+
							'.'
						)
					]
				);
			}
		});
	}


	componentDidUpdate() {
		console.log('ACInput: componentDidUpdate()');
	}


	componentWillUnmount() {
		this.autocomplete.destroy();
		console.log('ACInput: componentWillUnmount()');
	}


	render() {
		return(
			<input className="form-control" autoFocus="" type="text" name={this.props.name} placeholder={this.props.placeholder} />
			);
	}
};


/* ============== End Autocomplete ================= */