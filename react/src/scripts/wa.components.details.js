/* ============== Details ================= */

WA.Details = class extends React.Component {


	componentDidMount() {
		console.log(['Details: componentDidMount()', this.props]);
		//this.setState({});
	}


	_getDescription() {
		// This function is only called if the place prop is defined.

		console.log(['_getDescription()', this.props]);
		let arrDesc = this.props.place.desc;

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
		var that = this,
			markup = null;

		console.log(['Details > render()', that.props]);

		if (!this.props.place) {
			markup =	(
				<div>
					<p>This is the details view. There isn't a place selected at the moment.</p>
				</div>
			);

		} else {
			markup =	(
				<div>
					<h3>System: System One</h3>
					<ul className="nav nav-tabs mb-3">
						<li className="nav-item">
							<a className="nav-link active" href="#">Planet One</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">Planet Two</a>
						</li>
					</ul>

					<WA.DetailsCard title="My Title" colorType="info" textColor="white" bodyContent = {that._getDescription()} />

					<div className="card border-primary">
						<div className="card-header bg-primary text-white">Description</div>
						<div className="card-body">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet justo eleifend, volutpat turpis ut, pretium arcu. Mauris quam dui, eleifend eu ipsum ac, egestas sagittis augue. Etiam interdum laoreet sapien, pulvinar ullamcorper urna blandit sit amet. Suspendisse in arcu et urna laoreet pulvinar. Cras nec ligula in magna cursus mollis non at justo. Proin sodales risus eget volutpat lacinia. Etiam tincidunt mollis mauris a dictum. Suspendisse potenti. Sed ac orci ut eros lacinia convallis ac ut ante.
						</div>
					</div>
				</div>
			);
		}

		return(
			<div id="info" className="details">
				<div className="mb-3">
					<WA.ACInput name="ac-details" placeholder="Planet or System" setPlace={that.props.setPlace} />
				</div>
				{markup}
			</div>
			);
	}
};




WA.DetailsCard = class extends React.Component {

	_handleClick() {
		//console.log(['clicked',this.props]);
		this.props.sortPlanets(this.props.sortType);
	}

	render() {
		let textClass = (this.props.textColor)  ? (" text-" + this.props.textColor) : '',
			bodyContent = this.props.bodyContent || null;


		return(
			<div className={"card mb-3 border-" + this.props.colorType}>
				<div className={"card-header bg-" + this.props.colorType + textClass}>{this.props.title}</div>
				<div className="card-body">
					{bodyContent}
				</div>
			</div>
			);
	}
};




/* ============== End Details ================= */









