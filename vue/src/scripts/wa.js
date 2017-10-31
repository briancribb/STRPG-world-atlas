var WA = WA || {};

// Accepts a jQuery Deferred object which will be resolved when the data is ready.

WA.init = function() {
	console.log('init()');
	WA.getData( $.Deferred().done(function(data) {
		console.log(['data has arrived: ', data]);
		WA.vm(data);
	}) );

}

WA.vm = function (data) {
	console.log(['vm: ', data]);

data.message = "Hello, World!";
data.orderBy = "system";

Vue.component('planet-row', {
	props: ['name', 'system', 'counter'],
	data: function () {
		return {
			name: "Default Name"
		}
	},
	template: `
	<tr>
		<td>{{ counter }}</td>
		<td>{{ name }}</td>
		<td>{{ system }}</td>
	</tr>
	`
});

var vm = new Vue({
	el: '#app',
	data :data,
	methods : {
		orderPlanets : function(orderBy) {
			that = this;
			if (orderBy) {
				that.planets = _.sortBy(that.planets, function(planet){ return planet[orderBy] });
			}
		},
		reverseArray : function(myArray) {
			myArray = myArray.reverse();
		},
		getSystemID : function(name) {
			var that = this;
			return _.find(that.systems, function(item){ return item.name === name; }).id;
		}
	},
	template:`
		<div class="stuff-and-things">
			<ul class="nav-dark nav justify-content-center bg-dark text-white">
				<li class="nav-item">
					<a class="nav-link active" href="#" v-on:click.stop.prevent="orderPlanets('id')">By ID</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.stop.prevent="orderPlanets('name')">A-Z</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#" v-on:click.stop.prevent="reverseArray(planets)">Reverse</a>
				</li>
			</ul>

			<table class="table table-dark table-striped table-bordered table-responsive-sm">
				<thead>
					<tr>
						<th scope="col"></th>
						<th scope="col">Planet</th>
						<th scope="col">System</th>
					</tr>
				</thead>
				<tbody>
				<tr v-for="(planet, index) in planets">
					<th scope="row">{{ index }}</th>
					<td>({{planet.id}}) {{ planet.name }}</td>
					<td>({{ getSystemID(planet.system) }}) {{ planet.system }}</td>
				</tr>
				</tbody>
			</table>
		</div>
		`
});
	$("#app").show();
};



// <planet-row v-bind:counter="index+1" v-bind:name="planet.name" v-bind:system="planet.system"></planet-row>


/*
<table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Username</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
  </tbody>
</table>
*/