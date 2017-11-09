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

		WA.getData( $.Deferred().done(function(data) {
			//console.log(['data has arrived: ', data]);
			data.initialized = true;
			that.setState(data);

		window.getState = function() {
			return that.state;
		}



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



	componentDidMount() {
		console.log('componentDidMount()');
	}


	componentDidUpdate() {
		console.log('componentDidUpdate()');
		$('.site-container').find('.page-load-spinner').remove().end().removeClass('loading');
	}


	render() {

		let markup = null;

		if (this.state.initialized) {

			switch(this.state.view) {
				case 'list':
					markup = <WA.Course />;
					break;
				case 'course':
					markup = <WA.Course />;
					break;
				case 'map':
					markup = <WA.Sort planets={this.state.planets} orderPlanets={this._orderPlanets.bind(this)} reverseArray={this._reverseArray.bind(this)} />;
					break;
				default: // Docs
					markup = <WA.Info />;
			}

		}
		return(
			<div className="mt-3">
				<div className="text-center w-100" role="group" aria-label="First group">
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="docs" borderClass=" border-right-0"  iconClass="fa fa-info-circle mr-1" text="Docs"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="list" borderClass=""  iconClass="fa fa-sort mr-1" text="List"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="course" borderClass=" border-left-0" iconClass="fa fa-rocket mr-1" text="Course"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="map" borderClass=" border-left-0" iconClass="fa fa-rocket mr-1" text="Map"/>
				</div>
				{markup}
			</div>
		);
	}
};


	WA.WorldAtlasBtn = class extends React.Component {
		_handleClick(evt) {
			evt.preventDefault();
			this.props.updateView(this.props.view);
		}


		render() {
			return(
				<a onClick={this._handleClick.bind(this)} className={"btn w-25 rounded-0" + this.props.borderClass}><i className={this.props.iconClass} aria-hidden="true"></i><span className="d-none d-md-block">{this.props.text}</span></a>
				);
		}
	};