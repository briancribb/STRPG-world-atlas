/* ============== Autocomplete ================= */


WA.ACInput = class extends React.Component {


	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			planets: WA.methods.getPlanets(),
			systems: WA.methods.getSystems()
		}
		console.log('**** ACInput: constructor() - ' + this.testProp);
	}


	componentDidMount() {
		console.log('ACInput: componentDidMount() - ' + this.testProp);
		var that = this;

		that.autocomplete = new autoComplete({
			selector: 'input[name="planets"]',
			minChars: 2,
			offsetTop:0,
			source: function(term, suggest){
				term = term.toLowerCase();
				var choices = ['ActionScript', 'AppleScript', 'Asp', 'ActingStuff'];
				//var matches = [];
				//for (var i=0; i<choices.length; i++)
				//	if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);


				var matches = _.filter(that.state.planets, function(planet){ return planet.name.toLowerCase().indexOf(term) !== -1 });
				//console.log(['matches2', matches2]);

				//matches = ['Planet1', 'Planet2', '-', 'System1', 'System2'];
				suggest(matches);
			},
			renderItem: function (item, search){

				search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
				return '<div class="autocomplete-suggestion" data-val="' + item.name + '">' + item.name.replace(re, "<b>$1</b>") + '</div>';

			}
		});
	}


	componentDidUpdate() {
		console.log('ACInput: componentDidUpdate() - ' + this.testProp);
	}

	componentWillUnmount() {
		this.testProp = null;
		this.autocomplete.destroy();
		console.log('ACInput: componentWillUnmount() - ' + this.testProp);
	}



	render() {
		return(
			<input className="form-control" autoFocus="" type="text" name="planets" placeholder={this.props.placeholder} />
			);
	}
};


/* ============== End Autocomplete ================= */





