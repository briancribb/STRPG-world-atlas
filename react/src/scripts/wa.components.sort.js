/* ============== List ================= */


WA.Sort = class extends React.Component {

	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			sortType:"name",
			ascending: true
		}
	}

	componentWillMount() {
		this.props.orderPlanets(this.state.sortType);
	}

	_sortPlanets(type) {
		console.log(['_sortPlanets()', type]);
		this.props.orderPlanets(type);
	}

	/*
	Returns an array of JSX React components to be used as table rows. We're passing the planet 
	array down into this component from the parent.
	*/
 	_getRows() {
		return this.props.planets.map((planet, i) => {
			return(
				<tr key={ i }>
					<td>({ planet.id }) { planet.name }</td>
					<td>({ planet.systemID }) { planet.system }</td>
				</tr>
			);
		});
	}




	render() {
		let rows = this._getRows();

		return(
			<div id="sort" className="sort">
				<div className="mb-3">
					<WA.ACInput name="ac-sort" placeholder="Planet or System"/>
				</div>
				<table className="table table-dark table-striped table-bordered table-responsive-sm">
					<thead>
						<tr>
							<th><WA.SortNavItem text="Planet"	width="50"	sortType="name"		sortPlanets={this._sortPlanets.bind(this)}/></th>
							<th><WA.SortNavItem text="System"	width="50"	sortType="system"	sortPlanets={this._sortPlanets.bind(this)}/></th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		);
	}
};


WA.SortNavItem = class extends React.Component {

	_handleClick() {
		//console.log(['clicked',this.props]);
		this.props.sortPlanets(this.props.sortType);
	}

	render() {
		let sortClass = (1===1) ? 'asc' : 'desc';


		return(
				<a className="nav-link active" href="#" onClick={() => this._handleClick()}>
					{this.props.text}
					<i className={"fa fa-sort-alpha-" + sortClass + " ml-3"} aria-hidden="true"></i>
				</a>
			);
	}
};

/* ============== End List ================= */
