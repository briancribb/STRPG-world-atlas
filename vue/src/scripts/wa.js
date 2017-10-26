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
		getSystemID : function(name) {
			var that = this;
			return _.find(that.systems, function(item){ return item.name === name; }).id;
		}
	},
	template:`
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
				<td>{{ index }}</td>
				<td>({{planet.id}}) {{ planet.name }}</td>
				<td>({{ getSystemID(planet.system) }}) {{ planet.system }}</td>
			</tr>
			</tbody>
		</table>
		`
});
	$("#app").show();
};



// <planet-row v-bind:counter="index+1" v-bind:name="planet.name" v-bind:system="planet.system"></planet-row>
