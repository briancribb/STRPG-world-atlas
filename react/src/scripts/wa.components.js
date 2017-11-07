var WA = WA || {};

WA.WorldAtlas = class extends React.Component {
	// In case we need initial states, which we will because we're waiting for data.
	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			initialized: false,
			view:"sort"
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

		window.getState = function() {
			return that.state;
		}



		}) );
	}// End of _getData()

	_updateTopState(obj) {
		this.setState(obj);
	}

	_updateView(str) {
		this.setState( {view:str} );
	}


	_orderPlanets(strOrderBy) {
		this.setState({
			planets: _.sortBy(this.state.planets, function(planet){ return planet[strOrderBy] } )
		});
	}
	_reverseArray(strType) {
		this.setState({
			planets: this.state.planets.reverse()
		});
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

			switch(this.state.view) {
				case 'sort':
					markup = <WA.Sort planets={this.state.planets} orderPlanets={this._orderPlanets.bind(this)} reverseArray={this._reverseArray.bind(this)} />;
					break;
				default: // Details
					markup = <WA.Details />;
			}

		} else {
			markup = 
				<div className="text-center">
					<div id="page-load-spinner" className="page-load-spinner display-1 mb-3"><i className="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i></div>
					<h3>Loading Data...</h3>
				</div>
			;
		}
		return(
			<div className="mt-3">
				<div className="text-center w-100" role="group" aria-label="First group">
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="sort" borderClass=" border-right-0" iconClass="fa fa-rocket mr-1" text="Map"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="sort" borderClass=""                iconClass="fa fa-rocket mr-1" text="Course"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="details" borderClass=" border-left-0"  iconClass="fa fa-info-circle mr-1" text="Details"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="details" borderClass=" border-left-0"  iconClass="fa fa-sort mr-1" text="Sort"/>
				</div>
				{markup}
			</div>
		);
	}
};


	WA.WorldAtlasBtn = class extends React.Component {
		_handleClick(evt) {
			evt.preventDefault();
			this.props.updateView(this.props.view);
		}


		render() {
			return(
				<button onClick={this._handleClick.bind(this)} type="button" className={"btn btn-outline-primary w-25 rounded-0" + this.props.borderClass}><i className={this.props.iconClass} aria-hidden="true"></i>{this.props.text}</button>
				);
		}
	};


/* ============== Sort ================= */


	WA.Sort = class extends React.Component {

		render() {
			return(
				<div id="sort" className="sort">
					<ul className="nav-planets nav-dark nav text-center bg-dark text-white">
						<WA.SortNavItem text="By ID"	width="25"		sortType="id"		sortPlanets={this.props.orderPlanets}/>
						<WA.SortNavItem text="A-Z"		width="25"		sortType="name"		sortPlanets={this.props.orderPlanets}/>
						<WA.SortNavItem text="Reverse"	width="25"		sortType="reverse"	sortPlanets={this.props.reverseArray}/>
						<WA.SortNavItem text="Reverse"	width="25"		sortType="reverse"	sortPlanets={this.props.reverseArray}/>
					</ul>
					<WA.SortTable planets={this.props.planets} />
				</div>
				);
		}
	};



		WA.SortNavItem = class extends React.Component {
			_handleClick(evt) {
				evt.preventDefault();
				this.props.sortPlanets(this.props.sortType);
			}

			render() {
				return(
						<li className={"nav-item w-"+this.props.width}>
							<a className="nav-link active" href="#" onClick={this._handleClick.bind(this)}>{this.props.text}</a>
						</li>
					);
			}
		};



		WA.SortTable = class extends React.Component {
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
/* ============== End Sort ================= */








/* ============== Details ================= */

	WA.Details = class extends React.Component {

		render() {
			return(
				<div id="details" className="details mt-3">
					<p>These are details</p>
				</div>
				);
		}
	};
/* ============== End Details ================= */

