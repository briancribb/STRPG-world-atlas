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

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
		);
	}
	_getTecSocialIndex(planet) {
		// This function is only called if the place prop is defined.

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
		);
	}
	_getTradeProfile(planet) {
		// This function is only called if the place prop is defined.

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
		);
	}
	_getSize(planet) {
		// This function is only called if the place prop is defined.

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
		);
	}
	_getSurfaceConditions(planet) {
		// This function is only called if the place prop is defined.

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
		);
	}
	_getMinerals(planet) {
		// This function is only called if the place prop is defined.

		let markup = null;

		return( 
			<div>
				{markup}
			</div>
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
					<WA.DetailsCard toggleID="pd" title="Planetary Data" colorType="info" textColor="white" bodyContent = {that._getPlanetaryData(planet)} />
					<WA.DetailsCard toggleID="tsi" title={"TechSocial Index: " + planet.techSocIndex.rating} colorType="info" textColor="white" bodyContent = {that._getTecSocialIndex(planet)} />
					<WA.DetailsCard toggleID="trade" title={"Trade Profile: " + planet.tradeProfile.rating} colorType="info" textColor="white" bodyContent = {that._getTradeProfile(planet)} />
					<WA.DetailsCard toggleID="size" title="Size" colorType="info" textColor="white" bodyContent = {that._getSize(planet)} />
					<WA.DetailsCard toggleID="surf" title="Surface Conditions" colorType="info" textColor="white" bodyContent = {that._getSurfaceConditions(planet)} />
					<WA.DetailsCard toggleID="mineral" title="Mineral Content" colorType="info" textColor="white" bodyContent = {that._getMinerals(planet)} />
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
			direction = (this.state.isOpen) ? 'up' : 'down';

		return(
			<div className={"card mb-3 border-" + this.props.colorType + " " + this.props.toggleID}>
				<div className={"card-header d-flex bg-" + this.props.colorType + textClass} onClick={() => this._handleClick(this)}>
					{this.props.title} <span className={"align-self-center align-self-right ml-auto fa fa-chevron-" + direction}></span>
				</div>
				<div id={this.props.toggleID} className="card-body collapse">
					{bodyContent}
				</div>
			</div>
			);
	}
};




/* ============== End Details ================= */









