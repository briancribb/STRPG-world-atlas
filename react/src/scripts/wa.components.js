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

		WA.methods.getData( $.Deferred().done(function(data) {
			//console.log(['data has arrived: ', data]);
			data.initialized = true;
			that.setState(data);

			that._addListeners();
			//window.getState = function() {
			//	return that.state;
			//}
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

	_addListeners() {
		//console.log(['_addListeners()', WA.methods]);

		// Listening to the modal from here so we'll have access to the React app state.
		$("body").on({
			"shown.bs.modal": function() {
				console.log('Showing the modal.');
			},
			"hidden.bs.modal": function() {
				console.log('Hiding the modal.');
			}
		});

		// Run the handler function once before setting it to happen on resize.
		WA.methods.map.handleResize();
		$(window).resize( _.debounce(function(){
			WA.methods.map.handleResize();
		}, 250) );

		// Handle manipulation of SVG map itself.
		$("#svg-container").on( "mousedown touchstart mouseup touchend", function(evt) {
			evt.preventDefault(); // Touch events won't generate mouse events if we prevent default behavior. Prevents double-handling.
			WA.methods.map.selectHandler(evt);
		});
	}


	componentDidMount() {
		//console.log('WorldAtlas: componentDidMount()');
	}


	componentDidUpdate() {
		//console.log('WorldAtlas: componentDidUpdate()');
		$('#page-load-spinner').remove().end().removeClass('loading');
	}


	render() {

		let markup = null;

		if (this.state.initialized) {

			switch(this.state.view) {
				case 'docs':
					markup = <WA.Docs />;
					break;
				case 'course':
					markup = <WA.Course />;
					break;
				case 'sort':
					markup = <WA.Sort planets={this.state.planets} orderPlanets={this._orderPlanets.bind(this)} reverseArray={this._reverseArray.bind(this)} />;
					break;
				default: // Details
					markup = <WA.Details />;
			}

		}
		return(
			<div>
				<div id="map-ac" className="p-2 bg-light fixed-top">
					<WA.ACInput name="ac-map" pan="true" placeholder="Planet or System"/>
				</div>
				<ul id="map-nav" className="nav nav-pills nav-fill fixed-bottom bg-white">
					<li className="nav-item">
						<WA.MapNav iconClass="fa fa-window-restore" text="Launch"/>
					</li>
					<li className="nav-item">
						<WA.MapNav iconClass="fa fa-refresh" text="Reset"/>
					</li>
					<li className="nav-item">
						<WA.MapNav iconClass="fa fa-search-minus" text="Zoom out"/>
					</li>
					<li className="nav-item ">
						<WA.MapNav iconClass="fa fa-search-plus" text="Zoom in"/>
					</li>
				</ul>
				<div id="appModal" className="modal" tabIndex="-1" role="dialog">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">STRPG World Atlas</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
							</div>
							<div className="modal-body">
								<div className="text-center w-100 my-3" role="group" aria-label="First group">
									<WA.AppNav updateView={this._updateView.bind(this)} view="docs" borderClass=" border-0" iconClass="fa fa-info-circle mr-1" text="Docs"/>
									<WA.AppNav updateView={this._updateView.bind(this)} view="course" borderClass=" border-0"  iconClass="fa fa-sort mr-1" text="Course"/>
									<WA.AppNav updateView={this._updateView.bind(this)} view="details" borderClass=" border-0" iconClass="fa fa-rocket mr-1" text="Details"/>
									<WA.AppNav updateView={this._updateView.bind(this)} view="sort" borderClass=" border-0" iconClass="fa fa-rocket mr-1" text="Sort"/>
								</div>
								{markup}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

	/* These buttons are in the app modal and control which view the app displays. */
	WA.AppNav = class extends React.Component {
		_handleClick() {
			this.props.updateView(this.props.view);
		}

		render() {
			return(
				<a onClick={() => this._handleClick()} className={"btn w-25 rounded-0" + this.props.borderClass}><i className={this.props.iconClass} aria-hidden="true"></i><span className="d-none d-md-block">{this.props.text}</span></a>
				);
		}
	};



	/* These buttons are along the bottom of the screen, and are used to control the map and to launch the app modal. */
	WA.MapNav = class extends React.Component {
		_handleClick() {
			//this.props.updateView(this.props.view);
			console.log(['WA.MapNav: _handleClick()', this.props.text]);
			switch ( this.props.text.toLowerCase() ) {
				case 'launch':
					//console.log('launch: ' + evt.target.id);
					$('#appModal').modal('show');
					break;
				case 'reset':
					//console.log('reset: ' + evt.target.id);
					WA.methods.map.reset();
					break;

				case 'zoom out':
					//console.log('zoom out: ' + evt.target.id);
					WA.methods.map.panZoomInstance.zoomOut();
					break;

				case 'zoom in':
					//console.log('zoom in: ' + evt.target.id);
					WA.methods.map.panZoomInstance.zoomIn();
					break;
				default:
					//console.log('default: ' + evt.target.id);
					break;
			}
		}

		render() {
			return(
				<a onClick={() => this._handleClick()} className="nav-link rounded-0 border-0"><i className={this.props.iconClass} aria-hidden="true"></i><span className="d-none d-md-block">{this.props.text}</span></a>
				);
		}
	};