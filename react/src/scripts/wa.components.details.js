/* ============== Details ================= */

WA.Details = class extends React.Component {

	/*
	componentDidMount() {
		console.log('WA.Details componentDidMount()');
	}
	componentDidUpdate() {
		console.log('WA.Details componentDidUpdate()');
	}
	*/

	_getDescription(planet) {
		// This function is only called if the place prop is defined.
		console.log(['planet',planet]);
		let arrDesc = planet.desc;

		let markup = arrDesc.map((paragraph, i) => {
			// Kill the bottom margin for the last paragraph. This content will be in a card, which will have bottom padding.
			let marginClass = (i === arrDesc.length-1) ? 'mb-0' : '' ;
			return(
				<p key={ i } className={marginClass}>
					{paragraph}
				</p>
			);
		});

		return( 
			<div>
				{markup}
			</div>
		);
	}

	_getPlanetaryData(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>Position</td>
						<td>{planet.systemPosition}</td>
					</tr>
					<tr>
						<td>Satellites</td>
						<td>{planet.satellites}</td>
					</tr>
					<tr>
						<td>Gravity</td>
						<td>{planet.gravity}</td>
					</tr>
				</tbody>
			</table>
		);
	}
	_getTecSocialIndex(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Space Science Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.spaceScience.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.spaceScience.index, planet.techSocIndex.spaceScience.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Engineering Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.engineering.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.engineering.index, planet.techSocIndex.engineering.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Life/Medical Science Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.lifeMedScience.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.lifeMedScience.index, planet.techSocIndex.lifeMedScience.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Physical Science Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.physicalScience.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.physicalScience.index, planet.techSocIndex.physicalScience.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Planetary Science Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.planetaryScience.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.planetaryScience.index, planet.techSocIndex.planetaryScience.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Psionics Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.psionics.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.psionics.index, planet.techSocIndex.psionics.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Social Science Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.socialScience.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.socialScience.index, planet.techSocIndex.socialScience.rating)}</small></div>
						</td>
					</tr>
					<tr>
						<td>
							<div className="d-flex justify-content-between">
								<div className="d-flex justify-content-start">Cultural Attitude Index</div>
								<div className="d-flex justify-content-end">{planet.techSocIndex.culturalAttitude.rating}</div>
							</div>
							<div><small>{WA.methods.getTechSocialDetails(planet.techSocIndex.culturalAttitude.index, planet.techSocIndex.culturalAttitude.rating)}</small></div>
						</td>
					</tr>
				</tbody>
			</table>
		);
	}
	_getTradeProfile(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>REPLACEME</td>
						<td>{planet.REPLACEME}</td>
					</tr>
				</tbody>
			</table>
		);
	}
	_getSize(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>Position</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Satellites</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Gravity</td>
						<td>3</td>
					</tr>
				</tbody>
			</table>
		);
	}
	_getSurfaceConditions(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>Position</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Satellites</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Gravity</td>
						<td>3</td>
					</tr>
				</tbody>
			</table>
		);
	}
	_getMinerals(planet) {
		// This function is only called if the place prop is defined.
		return( 
			<table className="table table-striped m-0">
				<tbody>
					<tr>
						<td>Position</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Satellites</td>
						<td>3</td>
					</tr>
					<tr>
						<td>Gravity</td>
						<td>3</td>
					</tr>
				</tbody>
			</table>
		);
	}


	render() {

		let that = this,
			markup = null,
			system = null,
			planet = null;

		// If no origin is currently selected, then this function will return a null result.
		if (!this.props.origin) {
			markup =	(
				<div>
					<p>This is the details view. There isn't a place selected at the moment.</p>
				</div>
			);

		} else {

			let origin = this.props.origin;


			if (origin.type === 'system') {
				system = origin;
				planet = WA.methods.getPlace(origin.planets[0].id);
			} else {
				system = WA.methods.getPlace(origin.systemID, 'system');
				planet = origin;
			}


			markup =	(
				<div>
					<h3>System: {system.name}</h3>
					<ul className="nav nav-tabs mb-3">
						<li className="nav-item">
							<a className="nav-link active" href="#">{planet.name}</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">Planet Two</a>
						</li>
					</ul>
					<WA.DetailsCard toggleID="desc" title="Description" colorType="info" textColor="white" bodyContent = {that._getDescription(planet)} />
					<WA.DetailsCard toggleID="pd" title="Planetary Data" colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getPlanetaryData(planet)} />
					<WA.DetailsCard toggleID="tsi" title={"TechSocial Index: " + planet.techSocIndex.rating} colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getTecSocialIndex(planet)} />
					<WA.DetailsCard toggleID="trade" title={"Trade Profile: " + planet.tradeProfile.rating} colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getTradeProfile(planet)} />
					<WA.DetailsCard toggleID="size" title="Size" colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getSize(planet)} />
					<WA.DetailsCard toggleID="surf" title="Surface Conditions" colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getSurfaceConditions(planet)} />
					<WA.DetailsCard toggleID="mineral" title="Mineral Content" colorType="info" textColor="white" paddingClass="p-0" bodyContent = {that._getMinerals(planet)} />
				</div>
			);
		}

		return(
			<div id="info" className="details">
				<div className="mb-3">
					<WA.ACInput name="ac-details" placeholder={WA.methods.getACDisplay(that.props.origin) || "Planet or System"} />
				</div>
				{markup}
			</div>
			);
	}
};




WA.DetailsCard = class extends React.Component {
	constructor() {
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			isOpen: false
		}
	}

	_handleClick() {
		this.setState({
			isOpen: !this.state.isOpen
		});

		// Could just tie the 'show' class to the state, but I've already loaded Bootstrap's JS so I'm going to use the tools.
		$('#'+this.props.toggleID).collapse( (this.state.isOpen) ? 'hide' : 'show' );
	}

	render() {
		let textClass = (this.props.textColor)  ? (" text-" + this.props.textColor) : '',
			bodyContent = this.props.bodyContent || null,
			paddingClass = ' '+this.props.paddingClass || '',
			direction = (this.state.isOpen) ? 'up' : 'down';

		return(
			<div className={"card mb-3 border-" + this.props.colorType + " " + this.props.toggleID}>
				<div className={"card-header d-flex bg-" + this.props.colorType + textClass} onClick={() => this._handleClick(this)}>
					{this.props.title} <span className={"align-self-center align-self-right ml-auto fa fa-chevron-" + direction}></span>
				</div>
				<div id={this.props.toggleID} className={"card-body collapse" + paddingClass}>
					{bodyContent}
				</div>
			</div>
			);
	}
};




/* ============== End Details ================= */









