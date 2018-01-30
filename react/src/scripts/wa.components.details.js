/* ============== Details ================= */

WA.Details = class extends React.Component {


	componentDidMount() {
		//this.setState({});
	}


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




	render() {
		let that = this,
			markup = null,
			system = null,
			planet = null;

		// If no origin is currently selected, then this function will return a null result.
		if (!WA.methods.getOrigin()) {
			markup =	(
				<div>
					<p>This is the details view. There isn't a place selected at the moment.</p>
				</div>
			);

		} else {

			let origin = WA.methods.getOrigin();

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
				</div>
			);
		}

		return(
			<div id="info" className="details">
				<div className="mb-3">
					<WA.ACInput name="ac-details" placeholder="Planet or System" />
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









