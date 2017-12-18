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




	// Setters





	// Getters




	componentDidMount() {
		//console.log('WorldAtlas: componentDidMount()');
	}


	componentDidUpdate() {
		//console.log('WorldAtlas: componentDidUpdate()');
		$('.site-container').find('.page-load-spinner').remove().end().removeClass('loading');
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
				<div className="text-center w-100 my-3" role="group" aria-label="First group">
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="docs" borderClass=" border-0" iconClass="fa fa-info-circle mr-1" text="Docs"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="course" borderClass=" border-0"  iconClass="fa fa-sort mr-1" text="Course"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="details" borderClass=" border-0" iconClass="fa fa-rocket mr-1" text="Details"/>
					<WA.WorldAtlasBtn updateView={this._updateView.bind(this)} view="sort" borderClass=" border-0" iconClass="fa fa-rocket mr-1" text="Sort"/>
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