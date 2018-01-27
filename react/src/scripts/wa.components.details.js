/* ============== Details ================= */

WA.Details = class extends React.Component {


	componentDidMount() {
		console.log(['Details: componentDidMount()', this.props]);
	}







	render() {
		var that = this,
			markup = null;

		console.log(['render: componentDidMount()', this.props]);
		console.log(['Details > render: componentDidMount()', that.props]);

		if (!this.props.place) {
			markup =	(
				<div>
					<p>This is the details view. There isn't a place selected at the moment.</p>
				</div>
			);

		} else {
			markup =	(
				<div>
					<p>This is the details view. The current place name is {that.props.place.name}</p>
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
/* ============== End Details ================= */
