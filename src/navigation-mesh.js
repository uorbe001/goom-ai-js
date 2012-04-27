if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["goom-math"], function(Mathematics) {
	var Triangle = (function(){
		function Triangle(vertex_one, vertex_two, vertex_three) {
			this.edges = [];
			this.edges.push(new Edge(vertex_one, vertex_two));
			this.edges.push(new Edge(vertex_one, vertex_three));
			this.edges.push(new Edge(vertex_two, vertex_three));
			this.vertices = [];
			this.vertices.push(vertex_one);
			this.vertices.push(vertex_two);
			this.vertices.push(vertex_three);

			this.normal = new Mathematics.Vector3D();
			vertex_two.substract(vertex_one, this.normal);
			this.normal.crossProduct(vertex_three.substract(vertex_one, new Mathematics.Vector3D()));
			this.normal.normalize();
		}

		return Triangle;
	})();

	var Edge = (function(){
		function Edge(vertex_one, vertex_two) {
			this.vertices = [];
			this.vertices.push(vertex_one);
			this.vertices.push(vertex_two);
		}

		return Edge;
	})();

	/**
		Creates a new Navigation Mesh.
		@class Navigation Meshes are used for pathfinding, they hold the mesh where agents can move.
		@param {json} config The configuration of the navigation mesh, describing the triangles inside the mesh, etc.
		@property [Array] triangles The triangles forming the mesh.
		@property {Mathematics.Vector3D} __helperVector Helper vector used to avoid garbage at runtime.
		@property {Mathematics.Vector3D} __helperVector2 Helper vector used to avoid garbage at runtime.
		@property {Mathematics.Vector3D} __helperVector3 Helper vector used to avoid garbage at runtime.
		@exports NavigationMesh as AI.NavigationMesh.
	*/
	var NavigationMesh = (function() {
		function NavigationMesh(config) {
			this.triangles = this.__loadMesh(config);
			this.__helperVector = new Mathematics.Vector3D();
			this.__helperVector2 = new Mathematics.Vector3D();
			this.__helperVector3 = new Mathematics.Vector3D();
		}

		/**
			Loads the mesh from the config.
			@param {json} config The configuration of the navigation mesh, describing the triangles inside the mesh, etc.
			@returns {Array} the array of triangles in this mesh.
			@inner
		*/
		NavigationMesh.prototype.__loadMesh = function(config) {
			var triangles = [], triangle_data, vertices_data;

			for (var i = 0, len = config.triangles.length; i < len; i++) {
				triangle_data = config.triangles[i];
				vertices_data = triangle_data.vertices;
				triangles.push(new Triangle(new Mathematics.Vector3D(vertices_data[0], vertices_data[1], vertices_data[2]),
											new Mathematics.Vector3D(vertices_data[3], vertices_data[4], vertices_data[5]),
											new Mathematics.Vector3D(vertices_data[6], vertices_data[7], vertices_data[8])));
			}

			return triangles;
		};

		/**
			Selects the triangle that is most likely holding the given point (the closest triangle).
			@param {Mathematics.Vector3D} point The vector to find inside the mesh.
			@returns {Triangle} the triangle holding the point.
		*/
		NavigationMesh.prototype.__selectCorrespondingTriangle = function(point) {
			var triangle, projected_point, dot00, dot01, dot02, dot11, dot12, inverseDenominator, u, v;
			for (var i = 0, len = this.triangles.length; i < len; i++) {
				triangle = this.triangles[i];
				//Project point onto triangle
				triangle.normal.componentProduct(point, this.__helperVector);
				point.substract(this.__helperVector, this.__helperVector);
				//Calculate basis vectors
				triangle.vertices[1].substract(triangle.vertices[0], this.__helperVector2);
				triangle.vertices[2].substract(triangle.vertices[0], this.__helperVector3);
				this.__helperVector.substract(triangle.vertices[0]);
				//Calculate dot products
				dot00 = this.__helperVector2.dotProduct(this.__helperVector2);
				dot01 = this.__helperVector2.dotProduct(this.__helperVector3);
				dot02 = this.__helperVector2.dotProduct(this.__helperVector);
				dot11 = this.__helperVector3.dotProduct(this.__helperVector3);
				dot12 = this.__helperVector3.dotProduct(this.__helperVector);
				//Calculate barycentric coordinates.
				inverseDenominator = 1 / (dot00 * dot11 - dot01 * dot01);
				u = (dot11 * dot02 - dot01 * dot12) * inverseDenominator;
				v = (dot00 * dot12 - dot01 * dot02) * inverseDenominator;
				//Check if point is in triangle
				if ((u >= 0) && (v >= 0) && (u + v < 1)) break;
			}

			return triangle;
		};

		return NavigationMesh;
	})();

	return NavigationMesh;
});