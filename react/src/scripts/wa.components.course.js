/* ============== Course ================= */

	WA.Course = class extends React.Component {

		render() {
			return(
				<div id="course" className="course mt-3">
					<p className="lead">Get travel info or set a new course for the map.</p>
					<div className="row">
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail1">New Origin</label></small>
								<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail2">New Destination</label></small>
								<input type="email" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail1">Origin</label></small>
								<input type="email" className="form-control mb-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
								<input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail2">Destination</label></small>
								<input type="email" className="form-control mb-1" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email"></input>
								<input type="email" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail1">Warp Factor</label></small>
								<input type="email" className="form-control mb-1" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail2">Destination</label></small>
								<input type="email" className="form-control mb-1" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
						<div className="col-sm">
							<div className="form-group">
								<small><label htmlFor="exampleInputEmail2">Partial Time</label></small>
								<input type="email" className="form-control mb-1" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email"></input>
							</div>
						</div>
					</div>
					<div class="text-center w-100" role="group" aria-label="First group">
						<button type="button" class="btn w-50 rounded-0 border-right-0 bg-success btn-outline-dark"><i class="fa fa-info-circle mr-1" aria-hidden="true"></i><span class="d-none d-md-block">Plot</span></button>
						<button type="button" class="btn w-50 rounded-0 border-left-0 bg-danger btn-outline-dark"><i class="fa fa-rocket mr-1" aria-hidden="true"></i><span class="d-none d-md-block">Clear</span></button>
					</div>
					<div class="card">
						<div class="card-body">
							Enter coordinates for a travel estimate.
						</div>
					</div>

					<h2>Instructions</h2>
					<h3>Origin and Destination</h3>
					<p>Choosing a location from the dropdowns will populate the coordinates on this page for testing purposes. (Coordinates may also be entered manually.)</p>
					<p>Clicking the blue or green map-market buttons will set coordinates to the map's current origin or destination, respectively. You'll see the system name change to reflect this.</p>
					<h3>Known Distance</h3>
					<p>If you know exactly how far you're going, there's no need to punch in coordinates. You can just enter the distance in parsecs and see how long the trip would take at the current warp factor.</p>
					<h3>Partial Time</h3>
					<p>If you want to get coordinates for an interrupted trip, enter the time in days. This defaults to 1, but can be changed to anything less-than or equal-to the resulting time.</p>
					<h3>Control Buttons</h3>
					<p><strong>Test</strong>: Just return the results from the current form values.</p>
					<p><strong>Plot</strong>: Same as test, but sets the map's origin and destination to the current coordinates.</p>
					<p><strong>Clear</strong>: Resets the form.</p>


				</div>
				);
		}
	};
/* ============== End Course ================= */
