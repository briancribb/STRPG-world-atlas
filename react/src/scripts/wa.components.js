var WA = WA || {};

WA.WorldAtlas = class extends React.Component {
	// In case we need initial states, which we will because we're waiting for data.
	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			initialized: false
		}
		this._getData();
	}

	/*
	The app has some basic code that runs when there's no data. Once this stuff comes in, the timeline events will render.
	*/
	_getData() {
		var that = this;

		WA.getData( $.Deferred().done(function(data) {
			console.log(['data has arrived: ', data]);
			data.initialized = true;
			that.setState(data);
		}) );

	}// End of _getData()

	_updateTopState(obj) {
		this.setState(obj);
	}







	/*
	componentDidMount() {
		console.log('componentDidMount()');
	}å
	*/

	/*
	componentDidUpdate() {
		console.log('componentDidUpdate()');
	}
	*/





	render() {

		let markup = null;

		if (this.state.initialized) {
			markup = 
			<div id="stuff-and-things">
				<WA.PlanetNav />
				<WA.PlanetTable planets={this.state.planets} />
			</div>
			;
		} else {
			markup = 
				<div className="text-center">
					<div id="page-load-spinner" className="page-load-spinner display-1 mb-3"><i className="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i></div>
					<h3>Loading Data...</h3>
				</div>
			;
		}
		return(
			markup
		); 


	}
};


WA.PlanetNav = class extends React.Component {

	render() {

		return(

			<ul className="nav-dark nav justify-content-center bg-dark text-white">
				<li className="nav-item">
					<a className="nav-link active" href="#">By ID</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">A-Z</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="#">Reverse</a>
				</li>
			</ul>

			);
	}
};

WA.PlanetTable = class extends React.Component {
	/*
	Returns an array of JSX React components to be used as table rows. We're passing the planet 
	array down into this component from the parent.
	*/
 	_getRows() {
		return this.props.planets.map((planet, i) => {
			return(
				<tr key={ i }>
					<th scope="row">{ i }</th>
					<td>({ planet.id }) { planet.name }</td>
					<td>({ planet.systemID }) { planet.system }</td>
				</tr>
			);
		});
	}

	render() {
		console.log(['props', this.props]);
		const rows = this._getRows();
		return(
				<table className="table table-dark table-striped table-bordered table-responsive-sm">
					<thead>
						<tr>
							<th scope="col"></th>
							<th scope="col">Planet</th>
							<th scope="col">System</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			);
	}
};