if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["goom-math"], function(Mathematics) {
	var edge_list = [];

	var Triangle = (function(){
		function Triangle(vertex_one, vertex_two, vertex_three) {
			this.edges = [];
			this.edges.push(Edge.createEdge(vertex_one, vertex_two, this));
			this.edges.push(Edge.createEdge(vertex_one, vertex_three, this));
			this.edges.push(Edge.createEdge(vertex_two, vertex_three, this));
			this.vertices = [];
			this.vertices.push(vertex_one);
			this.vertices.push(vertex_two);
			this.vertices.push(vertex_three);

			this.normal = new Mathematics.Vector3D();
			vertex_two.substract(vertex_one, this.normal);
			this.normal.crossProduct(vertex_three.substract(vertex_one, new Mathematics.Vector3D()));
			this.normal.normalize();

			this.orthocenter = new Mathematics.Vector3D();
			this.edges[0].vertices[0].add(this.edges[0].vertices[1], this.orthocenter);
			this.orthocenter.add(this.edges[1].vertices[1]).scale(1/3);

			//Calculate matrix used to project a point onto the triangle.
			this.projectOntoTriangleMatrix = new Mathematics.Matrix4D();
			this.projectOntoTriangleMatrix.setDiagonal(1 - this.normal.x, 1 - this.normal.y, 1 - this.normal.z, 1);
			//This should work to create the projection matrix, but for some reason it doesn't TODO.
			//this.projectOntoTriangleMatrix.lookAt(this.orthocenter,
			//	this.orthocenter.add(this.normal, new Mathematics.Vector3D()), new Mathematics.Vector3D(0, 0, 0).normalize());
			this.abstractNode = null;
		}

		Triangle.prototype.countUnconstrainedEdges = function() {
			var count = 0;

			for(var i = 0; i < 3; i++) {
				if (this.edges[i].triangles.length > 1) count += 1;
			}

			return count;
		};

		Triangle.prototype.getAdjacentTriangles = function (triangles) {
			var edge; triangles.length = 0;
			for(var i = 0; i < 3; i++) {
				edge = this.edges[i];
				if (edge.triangles.length > 1) triangles.push(edge.triangles[0] === this? edge.triangles[1]: edge.triangles[0]);
			}
			return triangles;
		};

		return Triangle;
	})();

	var Edge = (function(){
		function Edge(vertex_one, vertex_two) {
			this.vertices = [];
			this.vertices.push(vertex_one);
			this.vertices.push(vertex_two);
			this.triangles = [];
		}

		Edge.createEdge = function(vertex_one, vertex_two, triangle) {
			for (var i = 0, len = edge_list.length; i < len; i++) {
				if ((edge_list[i].vertices[0].x == vertex_one.x && edge_list[i].vertices[0].z == vertex_one.z &&
						edge_list[i].vertices[0].z == vertex_one.z && edge_list[i].vertices[1].x == vertex_two.x &&
						edge_list[i].vertices[1].y == vertex_two.y && edge_list[i].vertices[1].z == vertex_two.z) ||
						(edge_list[i].vertices[1].x == vertex_one.x && edge_list[i].vertices[1].z == vertex_one.z &&
						edge_list[i].vertices[1].z == vertex_one.z && edge_list[i].vertices[0].x == vertex_two.x &&
						edge_list[i].vertices[0].y == vertex_two.y && edge_list[i].vertices[0].z == vertex_two.z)) {
					edge_list[i].addAdjacentTriangle(triangle);
					return edge_list[i];
				}
			}

			var edge = new Edge(vertex_one, vertex_two);
			edge.addAdjacentTriangle(triangle);
			edge_list.push(edge);
			return edge;
		};

		Edge.prototype.addAdjacentTriangle = function(triangle) {
			this.triangles.push(triangle);
		};

		return Edge;
	})();

	/**
		Creates a node for the abstract graph.
		@property {Number} degree The degree of this node (0-3).
		@property {Boolean} isVisited.
		@property {Number} squaredDistanceToGoal The barycentric distance to the goal, set on initialize.
		@property {Number} gScore The calculated g-value used for A* search.
		@property {Array} linkedNodes Array of nodes linked to this node.
		@property {AbstractNode} root The root node of this node.
		@property {Triangle} triangle The triangle corresponding to this node.
		@property {AbstractNode} searchParent The parent in the current search.
		@property {Array} edgeEndPoints The endpoints of edge formed by second degree nodes.
		@param {Triangle} The triangle the node represents.
		@param {Number} degree The degree of this node (0-3).
	*/
	var AbstractNode = (function(){
		function AbstractNode(triangle, degree) {
			this.degree = degree !== undefined && degree !== null? degree: 0;
			this.isVisited = false;
			this.squaredDistanceToGoal = 0;
			this.gScore = 0;
			triangle.abstractNode = this;
			this.linkedNodes = [];
			this.root = null;
			this.edgeEndPoints = [];
			this.searchParent = null;
			this.triangle = triangle;

			var adjacent_triangles = triangle.getAdjacentTriangles([]), adjacent_triangle;
			for(var i = 0, len = adjacent_triangles.length; i < len; i++) {
				adjacent_triangle = adjacent_triangles[i];
				if (adjacent_triangle.abstractNode !== null) {
					if (this.linkedNodes.indexOf(adjacent_triangle.abstractNode) < 0) this.linkedNodes.push(adjacent_triangle.abstractNode);
					if(adjacent_triangle.abstractNode.linkedNodes.indexOf(this) < 0) adjacent_triangle.abstractNode.linkedNodes.push(this);
				}
			}
		}

		return AbstractNode;
	})();

	/**
		Creates an AbstractGraph
		@class This represents the abstract graph structure used for pathfinding.
		@param [Array] triangles The array of triangles in the navigation mesh.
		@property {Mathematics.Vector3D} __helperVector Vector created in class scope to avoid the construction of objects at runtime.
		@property {Array} __helperArray Array created in class scope to avoid object creation at runtime.
		@inner
	*/
	var AbstractGraph = (function(){
		function AbstractGraph(triangles) {
			this.zeroDegreeNodes = [], this.firstDegreeNodes = [], this.secondDegreeNodes = [], this.thirdDegreeNodes = [];
			this.__helperArray = [];
			var processing_queue = [], i, len, triangle, edge, j, len2, adjacent_triangles = this.__helperArray, adjacent_triangle;
			//Go through the triangles and find the triangles with one or less unconstrained edges.
			for (i = 0, len = triangles.length; i < len; i++) {
				triangle = triangles[i];

				switch (triangle.countUnconstrainedEdges()) {
					case 0: this.zeroDegreeNodes.push(new AbstractNode(triangle, 0));
							break;
					case 1: this.firstDegreeNodes.push(new AbstractNode(triangle, 1));
							//store the adjacent triangle for processing.
							for (j = 0, len2 = triangle.edges.length; j < len2; j++) {
								edge = triangle.edges[j];
								if (edge.triangles.length > 1) {
									processing_queue.push(edge.triangles[0] === triangle? edge.triangles[1]: edge.triangles[0]);
								}
							}
							break;
				}
			}

			var is_first_degree, unmapped_count;
			//Go through the processing queue and expand the graph
			while(processing_queue.length > 0) {
				triangle = processing_queue.pop();
				adjacent_triangles = triangle.getAdjacentTriangles(adjacent_triangles);
				is_first_degree = true, unmapped_count = 0;
				for (i = 0, len = adjacent_triangles.length; i < len; i++) {
					adjacent_triangle = adjacent_triangles[i];

					if (adjacent_triangle.abstractNode === null) {
						unmapped_count += 1;
						if (unmapped_count > 1) { is_first_degree = false; break; }
						continue;
					}

					if (adjacent_triangle.abstractNode.degree !== 1) {
						is_first_degree = false;
						break;
					}
				}

				if (is_first_degree && triangle.abstractNode === null) {
					this.firstDegreeNodes.push(new AbstractNode(triangle, 1));
					//store the adjacent triangle for processing.
					for (j = 0, len2 = triangle.edges.length; j < len2; j++) {
						edge = triangle.edges[j];
						if (edge.triangles.length > 1) {
							processing_queue.push(edge.triangles[0] === triangle? edge.triangles[1]: edge.triangles[0]);
						}
					}
				}
			}
			
			var is_third_degree;
			//find the nodes wich qualify to be mapped as a third degree node and map them.
			for (i = 0, len = triangles.length; i < len; i++) {
				triangle = triangles[i];

				if (triangle.abstractNode === null && triangle.countUnconstrainedEdges() === 3) {
					adjacent_triangles = triangle.getAdjacentTriangles(adjacent_triangles);
					is_third_degree = true;
					for (j = 0, len2 = adjacent_triangles.length; j < len2; j++) {
						adjacent_triangle = adjacent_triangles[j];
						if (adjacent_triangle.abstractNode !== null && adjacent_triangle.abstractNode.degree === 1) {
							is_third_degree = false;
							break;
						}
					}

					if (!is_third_degree) continue;

					this.thirdDegreeNodes.push(new AbstractNode(triangle, 3));
					//Map the unmapped adjacent triangles to second degree nodes.
					for (j = 0, len2 = adjacent_triangles.length; j < len2; j++) {
						adjacent_triangle = adjacent_triangles[j];
						if (adjacent_triangle.abstractNode === null) {
							this.secondDegreeNodes.push(new AbstractNode(adjacent_triangle, 2));
						}
					}

				}
			}

			//The remaining unmapped triangles are degree 2 nodes.
			for (i = 0, len = triangles.length; i < len; i++) {
				triangle = triangles[i];
				if (triangle.abstractNode === null) {
					this.secondDegreeNodes.push(new AbstractNode(triangle, 2));
				}
			}


			var set_root_on_tree = function(current_node, root, visited_queue) {
				current_node.root = root;
				visited_queue.push(current_node);
				for (var k = 0, len3 = current_node.linkedNodes.length; k < len3; k++) {
					next_node = current_node.linkedNodes[k];
					if (next_node.degree === current_node.degree && visited_queue.indexOf(next_node) < 0) set_root_on_tree(next_node, root, visited_queue);
				}
			};

			//Set the first degree node's roots
			for (i = 0, len = this.secondDegreeNodes.length; i < len; i++) {
				node = this.secondDegreeNodes[i];
				for (j = 0, len2 = node.linkedNodes.length; j < len2; j++) {
					linked_node = node.linkedNodes[j];
					if (linked_node.degree === 1) set_root_on_tree(linked_node, node, [node]);
				}
			}

			var enqueue_edge_nodes = function(current_node, edge_nodes, edge_points) {
				if (current_node.degree == 2 && edge_nodes.indexOf(current_node) < 0) {
					edge_nodes.push(current_node);
					for (var k = 0, len3 = current_node.linkedNodes.length; k < len3; k++) {
						next_node = current_node.linkedNodes[k];
						enqueue_edge_nodes(next_node, edge_nodes, edge_points);
					}
				} else if (current_node.degree == 3 && edge_points.indexOf(current_node) < 0) {
					edge_points.push(current_node);
				}
			};

			var edge_nodes = [], edge_points = [], cur_node;
			//Set the second degree node's edges
			for (i = 0, len = this.secondDegreeNodes.length; i < len; i++) {
				edge_nodes.length = 0, edge_points.length = 0;
				node = this.secondDegreeNodes[i];
				if (node.edgeEndPoints.length > 0) continue;
				enqueue_edge_nodes(node, edge_nodes, edge_points);

				for (j = 0, len2 = edge_nodes.length; j < len2; j++) {
					cur_node = edge_nodes[j];
					if (cur_node.edgeEndPoints.length > 0) continue;
					cur_node.edgeEndPoints.push(edge_points[0]);
					cur_node.edgeEndPoints.push(edge_points[edge_points.length > 1? 1: 0]);
				}
			}
		}

		AbstractGraph.prototype.initialize = function(goal) {
			var i, len, node;
			for (i = 0, len = this.zeroDegreeNodes.length; i < len; i++) {
				node = this.zeroDegreeNodes[i];
				node.isVisited = false;
				node.squaredDistanceToGoal = node.triangle.orthocenter.substract(goal.triangle.orthocenter, this.__helperVector).squaredMagnitude();
				node.searchParent = null;
				node.gScore = 0;
			}

			for (i = 0, len = this.firstDegreeNodes.length; i < len; i++) {
				node = this.firstDegreeNodes[i];
				node.isVisited = false;
				node.squaredDistanceToGoal = node.triangle.orthocenter.substract(goal.triangle.orthocenter, this.__helperVector).squaredMagnitude();
				node.searchParent = null;
				node.gScore = 0;
			}

			for (i = 0, len = this.secondDegreeNodes.length; i < len; i++) {
				node = this.secondDegreeNodes[i];
				node.isVisited = false;
				node.squaredDistanceToGoal = node.triangle.orthocenter.substract(goal.triangle.orthocenter, this.__helperVector).squaredMagnitude();
				node.searchParent = null;
				node.gScore = 0;
			}

			for (i = 0, len = this.thirdDegreeNodes.length; i < len; i++) {
				node = this.thirdDegreeNodes[i];
				node.isVisited = false;
				node.squaredDistanceToGoal = node.triangle.orthocenter.substract(goal.triangle.orthocenter, this.__helperVector).squaredMagnitude();
				node.searchParent = null;
				node.gScore = 0;
			}
		};

		return AbstractGraph;
	})();

	/**
		Creates a new Navigation Mesh.
		@class Navigation Meshes are used for pathfinding, they hold the mesh where agents can move.
		@param {json} config The configuration of the navigation mesh, describing the triangles inside the mesh, etc.
		@property {Array} triangles The triangles forming the mesh.
		@property {AbstractGraph} abstractGrapth This holds the structure of the abstract graph used for pathfinding.
		@property {Mathematics.Vector3D} __helperVector Helper vector used to avoid garbage at runtime.
		@property {Mathematics.Vector3D} __helperVector2 Helper vector used to avoid garbage at runtime.
		@property {Mathematics.Vector3D} __helperVector3 Helper vector used to avoid garbage at runtime.
		@property {Array} __openNodes This array is created here to avoid creating garbage at runtime.
		@exports NavigationMesh as AI.NavigationMesh.
	*/
	var NavigationMesh = (function() {
		function NavigationMesh(config) {
			this.triangles = this.__loadMesh(config);
			this.abstractGraph = new AbstractGraph(this.triangles);
			edge_list.length = 0; //Empty the edge list. This is a very dirty way to store it, but it works.
			this.__helperVector = new Mathematics.Vector3D();
			this.__helperVector2 = new Mathematics.Vector3D();
			this.__helperVector3 = new Mathematics.Vector3D();
			this.__openNodes = [];
			this.__possiblePath = [];
		}

		/**
			Loads the mesh from the config.
			@param {json} config The configuration of the navigation mesh, describing the triangles inside the mesh, etc.
			@returns {Array} the array of triangles in this mesh.
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
			Selects the triangle that is most likely under the given point (the closest triangle).
			@param {Mathematics.Vector3D} point The vector to find inside the mesh.
			@returns {Triangle} the triangle holding the point.
		*/
		NavigationMesh.prototype.__selectCorrespondingTriangle = function(point) {
			var triangle, projected_point, dot00, dot01, dot02, dot11, dot12, inverseDenominator, u, v;
			for (var i = 0, len = this.triangles.length; i < len; i++) {
				triangle = this.triangles[i];
				//Project point onto triangle
				triangle.projectOntoTriangleMatrix.transformVector(point, this.__helperVector);
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
				if ((u >= 0) && (v >= 0) && (u + v <= 1)) break;
				triangle = null;
			}

			return triangle;
		};

		var orderFirstFirstNodes = function(a, b) {
			return a.squaredDistanceToGoal - b.squaredDistanceToGoal;
		};

		var orderAStarNodes = function(a, b) {
			return (a.gScore + a.squaredDistanceToGoal) - (b.gScore + b.squaredDistanceToGoal);
		};

		/**
			Returns the path from the origin to the goal performing a first degree search.
			@param {Mathematics.Vector3D} origin_node The origin point.
			@param {Mathematics.Vector3D} goal_node The goal point.
			@returns {Array} Array holding the path.
		*/
		NavigationMesh.prototype.performFirstDegreeSearch = function (origin_node, goal_node, path) {
			//Since the two nodes are in the same tree, we can do a simple search like best first.
			this.__openNodes.unshift(origin_node);

			while (this.__openNodes.length > 0) {
				this.__openNodes.sort(orderFirstFirstNodes);
				open_node = this.__openNodes.shift(), open_node.isVisited = true;
				//If the actual node is the goal node, stop search.
				if (open_node === goal_node) { break; }
				//Push into the queue the nodes connected to this one.
				for (i = 0, len = open_node.linkedNodes.length; i < len; i++) {
					if (!open_node.linkedNodes[i].isVisited) {
						open_node.linkedNodes[i].searchParent = open_node;
						this.__openNodes.unshift(open_node.linkedNodes[i]);
					}
				}
			}

			if (open_node !== goal_node) path.length = 0;
			//Create the search path to be returned by backtracking.
			while (open_node !== null && open_node !== undefined) {
				path.unshift(open_node);
				open_node = open_node.searchParent;
			}
		};

		/**
			Returns the path from the origin to the goal performing a second degree search.
			@param {Mathematics.Vector3D} origin_node The origin point.
			@param {Mathematics.Vector3D} goal_node The goal point.
			@returns {Array} Array holding the path.
		*/
		NavigationMesh.prototype.performSecondDegreeSearch = function (origin_node, goal_node, path) {
			//The nodes are in the same ring. A* search should do it.
			var tentative_g_score = 0;
			this.__openNodes.unshift(origin_node);

			while (this.__openNodes.length > 0) {
				this.__openNodes.sort(orderAStarNodes);
				open_node = this.__openNodes.shift(), open_node.isVisited = true;
				//If the actual node is the goal node, stop search.
				if (open_node === goal_node) { break; }

				//Push into the queue the nodes connected to this one.
				for (i = 0, len = open_node.linkedNodes.length; i < len; i++) {
					linked_node = open_node.linkedNodes[i];
					if (linked_node.isVisited || linked_node.degree == 1) continue;
					tentative_g_score = open_node.gScore + open_node.triangle.orthocenter.substract(
						linked_node.triangle.orthocenter, this.__helperVector).squaredMagnitude();
					if (this.__openNodes.indexOf(linked_node) < 0) {
						linked_node.searchParent = open_node;
						linked_node.gScore = tentative_g_score;
						this.__openNodes.unshift(linked_node);
					} else if (tentative_g_score < linked_node.gScore) {
						linked_node.searchParent = open_node;
						linked_node.gScore = tentative_g_score;
					}
				}
			}

			if (open_node !== goal_node) path.length = 0;
			//Create the search path to be returned by backtracking.
			while (open_node !== null && open_node !== undefined) {
				path.unshift(open_node);
				open_node = open_node.searchParent;
			}
		};

		/**
			Returns the path from the origin to the goal. It will not always go to the goal, with more complicated paths it will
			only return the path to important nodes connected to the goal.
			@param {Mathematics.Vector3D} origin The origin point.
			@param {Mathematics.Vector3D} goal The goal point.
			@returns {Array} Array holding the path.
		*/
		NavigationMesh.prototype.findPath = function (origin, goal, path) {
			var open_node, linked_node, i, len;
			var origin_triangle = this.__selectCorrespondingTriangle(origin), origin_node = origin_triangle.abstractNode;
			var goal_triangle = this.__selectCorrespondingTriangle(goal), goal_node = goal_triangle.abstractNode;
			this.__openNodes.length = 0, path.length = 0;
			this.abstractGraph.initialize(goal_node);
			//If either the origin or goal node aren't "over" the navmesh, return an empty search path.
			if (origin_node === null || goal_node === null) return path;

			//If both nodes are degree-1 in the same tree or one is a degree-1 node and the other one the parent of the tree...
			if (((origin_node.degree == 1 && goal_node.degree == 1) && ((origin_node.root === null && goal_node.root === null) || (origin_node.root === goal_node.root))) ||
					((origin_node.degree == 1 && goal_node.degree == 2) && (origin_node.root == goal_node)) ||
					((goal_node.degree == 1 && origin_node.degree == 2) && (goal_node.root == origin_node))) {
				this.performFirstDegreeSearch(origin_node, goal_node, path);
				return path;
			}

			//Go to the root of the node to begin with.
			if ((goal_node.degree == 2 || goal_node.degree == 3) && (origin_node.degree == 1 && origin_node.root !== null)) {
				this.performFirstDegreeSearch(origin_node, origin_node.root, path);
				return path;
			}

			//If both are degree-2 nodes in the same edge or one of them is one of the degree-3 nodes in the edge of the other node...
			if (((origin_node.degree == 2 && goal_node.degree == 2) && ((origin_node.edgeEndPoints[0] === goal_node.edgeEndPoints[0] &&
					(origin_node.edgeEndPoints[1] === goal_node.edgeEndPoints[0])) || (origin_node.edgeEndPoints[0] === goal_node.edgeEndPoints[1] &&
					origin_node.edgeEndPoints[0] === goal_node.edgeEndPoints[1]))) || (((origin_node.degree == 2 && goal_node.degree == 3 &&
					(origin_node.edgeEndPoints[0] == goal_node || origin_node.edgeEndPoints[1] == goal_node)) ||
					(origin_node.degree == 3 && goal_node.degree == 2 && (goal_node.edgeEndPoints[0] == origin_node || goal_node.edgeEndPoints[1] == origin_node))))) {
				this.performSecondDegreeSearch(origin_node, goal_node, path);
				return path;
			}

			var they_are_connected;
			//If both are degree-3 nodes and they are connected by the same degree-2 nodes,perform second degree search.
			if (origin_node.degree == 3 && goal_node.degree == 3) {
				they_are_connected = false;
				for (i = 0, len = origin_node.linkedNodes.length; i < len; i++) {
					for (j = 0, len2 = goal_node.linkedNodes.length; j < len2; j++) {
						if ((origin_node.linkedNodes[i].edgeEndPoints[0] == goal_node.linkedNodes[j].edgeEndPoints[0] &&
							origin_node.linkedNodes[i].edgeEndPoints[1] == goal_node.linkedNodes[j].edgeEndPoints[1]) ||
							(origin_node.linkedNodes[i].edgeEndPoints[0] == goal_node.linkedNodes[j].edgeEndPoints[1] &&
							origin_node.linkedNodes[i].edgeEndPoints[1] == goal_node.linkedNodes[j].edgeEndPoints[0])) {
							they_are_connected = true;
							break;
						}
					}
				}

				if (they_are_connected) {
					this.performSecondDegreeSearch(origin_node, goal_node, path);
					return path;
				}
			}

			if (origin_node.degree == 2 && goal_node.degree == 3) {
				they_are_connected = false;
				for (j = 0, len2 = goal_node.linkedNodes.length; j < len2; j++) {
					if (origin_node.edgeEndPoints[0] == goal_node.linkedNodes[j].edgeEndPoints[0] ||
						origin_node.edgeEndPoints[1] == goal_node.linkedNodes[j].edgeEndPoints[1] ||
						origin_node.edgeEndPoints[0] == goal_node.linkedNodes[j].edgeEndPoints[1] ||
						origin_node.edgeEndPoints[1] == goal_node.linkedNodes[j].edgeEndPoints[0]) {
						they_are_connected = true;
						break;
					}
				}

				if (they_are_connected) {
					this.performSecondDegreeSearch(origin_node, goal_node, path);
					return path;
				}
			} else if (origin_node.degree == 3 && goal_node.degree == 2) {
				they_are_connected = false;
				for (i = 0, len = origin_node.linkedNodes.length; i < len; i++) {
					if (origin_node.linkedNodes[i].edgeEndPoints[0] == goal_node.edgeEndPoints[0] ||
						origin_node.linkedNodes[i].edgeEndPoints[1] == goal_node.edgeEndPoints[1] ||
						origin_node.linkedNodes[i].edgeEndPoints[0] == goal_node.edgeEndPoints[1] ||
						origin_node.linkedNodes[i].edgeEndPoints[1] == goal_node.edgeEndPoints[0]) {
						they_are_connected = true;
						break;
					}
				}

				if (they_are_connected) {
					this.performSecondDegreeSearch(origin_node, goal_node, path);
					return path;
				}
			}

			if (goal_node.degree == 2 && origin_node.degree !== 1) {
				//Choose the shortest path to the node connected to the end point.
				this.performSecondDegreeSearch(origin_node, goal_node.edgeEndPoints[0], path);
				this.performSecondDegreeSearch(origin_node, goal_node.edgeEndPoints[1], this.__possiblePath);
				if (path.length > this.__possiblePath) {
					path.length = 0;
					for (i = 0, len = this.__possiblePath.length; i < len; i++) {
						path.push(this.__possiblePath[i]);
					}
				}

				return path;
			}

			if (goal_node.degree == 1) {
				//Return the path to the root node instead of the complete path.
				this.performSecondDegreeSearch(origin_node, goal_node.root, path);
				return path;
			}

			return path;
		};
		
		return NavigationMesh;
	})();

	return NavigationMesh;
});