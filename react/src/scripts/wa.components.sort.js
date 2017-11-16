/* ============== List ================= */


WA.Sort = class extends React.Component {

render() {
	return(
		<div id="sort" className="sort">
			<div className="mb-3">
				<WA.ACInput name="ac-sort" placeholder="Planet or System"/>
			</div>
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
		let rows = this._getRows();
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
/* ============== End List ================= */
