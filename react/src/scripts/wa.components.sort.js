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





	render() {
		return(
			<div id="sort" className="sort">
				<div className="mb-3">
					<WA.ACInput name="ac-sort" placeholder="Planet or System"/>
				</div>
				<ul className="nav-planets nav-dark nav bg-dark text-white border border-light border-left-0 border-right-0 border-top-0">
					<WA.SortNavItem text="Planet"	width="50"	sortType="name"		sortPlanets={this._sortPlanets.bind(this)}/>
					<WA.SortNavItem text="System"	width="50"	sortType="system"	sortPlanets={this._sortPlanets.bind(this)}/>
				</ul>
				<WA.SortTable planets={this.props.planets} />
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
				<li className={"nav-item w-"+this.props.width}>
					<a className="nav-link active" href="#" onClick={() => this._handleClick()}>
						{this.props.text}
						<i className={"fa fa-sort-alpha-" + sortClass + " ml-3"} aria-hidden="true"></i>
					</a>
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
					<td>({ planet.id }) { planet.name }</td>
					<td>({ planet.systemID }) { planet.system }</td>
				</tr>
			);
		});
	}

	render() {
		let rows = this._getRows();
		return(
				<table className="table table-dark table-striped table-bordered table-responsive-sm">
					<tbody>
						{rows}
					</tbody>
				</table>
			);
	}
};
/* ============== End List ================= */
