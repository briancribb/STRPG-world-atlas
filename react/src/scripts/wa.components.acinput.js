/* ============== Autocomplete ================= */


WA.ACInput = class extends React.Component {


	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			planets: WA.methods.getPlanets()
		}
		console.log('**** ACInput: constructor() - ' + this.testProp);
	}


	componentDidMount() {
		console.log('ACInput: componentDidMount() - ' + this.testProp);

		this.autocomplete = new autoComplete({
			selector: 'input[name="planets"]',
			minChars: 2,
			source: function(term, suggest){
				term = term.toLowerCase();
				var choices = ['ActionScript', 'AppleScript', 'Asp'];
				var matches = [];
				for (var i=0; i<choices.length; i++)
					if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
				suggest(matches);
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





