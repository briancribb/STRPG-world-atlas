class TestComponent extends React.Component {
	// In case we need initial states, which we will because we're waiting for data.
	constructor() {
		//console.log('constructor()');
		super(); // Gotta call this first when doing a constructor.
		this.state = {
			test: false
		}
		//this._getData();
		console.log('this.state');
		console.log(this.state);
	}

	/*
	Showing a download icon while the assets load, and then a round arrow spinner while the data loads. When the "loading" 
	class is removed, the initial loader container is hidden and the Timeline app container is shown. 
	*/
	componentDidMount() {
		$('body').removeClass('loading');
		console.log('componentDidMount()');
	}

	/*
	After the app updates, we run some jQuery to put every other entry on the right side. This could have been done by 
	looping through the entries array and checking to see who's visible, but we're already paying for jQuery in our page 
	load so we should just go ahead and use it where appropriate.
	*/
	componentDidUpdate() {
		if (this.state.initialized) {
			//this._alternateFloats();
		}
		console.log('componentDidUpdate()');
	}



	render() {
		let markup = null;
		/*
		if (this.state.initialized) {
			const entries = this._getEntries();
			markup = 
				<div id="timeline">
					<TLToggles sources={this.state.sources} updateSource={this._updateSource.bind(this)} />
					<ul id="tl-list" className={"tl-list " + this.state.parentClasses}>
						{entries}
					</ul>
				</div>
		} else {
			markup = 
				<div className="page-load text-center">
					<div id="page-load-spinner" className="page-load-spinner"><span className="glyphicon glyphicon-repeat trans-spin" aria-hidden="true"></span></div>
					<p>Loading Timeline Events...</p>
				</div>
		}
		*/
		markup = 
			<div className="btn-group btn-group-lg" role="group" aria-label="Large button group">
				<button type="button" className="btn btn-secondary">Left</button>
				<button type="button" className="btn btn-secondary">Middle</button>
				<button type="button" className="btn btn-secondary">Right</button>
			</div>;

		return(
			markup
		); 
	}
}

ReactDOM.render(
	<TestComponent />, document.getElementById('test-app')
);