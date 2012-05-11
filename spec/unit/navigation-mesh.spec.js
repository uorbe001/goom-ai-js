var requirejs = require("requirejs");
requirejs.config({nodeRequire: require});

requirejs(["../../src/navigation-mesh", "goom-math"], function(NavigationMesh, Mathematics) {
	describe("AI.NavigationMesh", function(){
		beforeEach(function() {
			this.nm = new NavigationMesh({
				"triangles": [
					{ "vertices": [0,0,0, 0,0,1, 1,0,1] },
					{ "vertices": [0,0,0, 1,0,1, 2,0,0] },
					{ "vertices": [2,0,0, 1,0,1, 2,0,2] },
					{ "vertices": [2,0,0, 2,0,2, 3,0,1] },
					{ "vertices": [2,0,0, 3,0,1, 4,0,0] },
					{ "vertices": [3,0,1, 4,0,2, 4,0,0] },
					{ "vertices": [2,0,0, 4,0,0, 3,0,-1] },
					{ "vertices": [2,0,0, 3,0,-1, 2,0,-2] },
					{ "vertices": [2,0,-2, 3,0,-1, 4,0,-2] }
				]
			});

			this.nm2 = new NavigationMesh({
				"triangles": [
					{"vertices": [-1,0,4, 0,0,4, -0.5,0,3]},
					{"vertices": [1,0,4, 0.5,0,3, 0,0,4]},
					{"vertices": [0,0,4, 0.5,0,3, -0.5,0,3]},
					{"vertices": [0,0,2, -0.5,0,3, 0.5,0,3]},
					{"vertices": [0,0,2, 0.5,0,3, 0.5,0,1]},
					{"vertices": [0,0,2, 0.5,0,1, -0.5,0,1]},
					{"vertices": [0,0,0, -0.5,0,1, 0.5,0,1]},

					{"vertices": [0,0,0, -1,0,0, -0.5,0,1]},
					{"vertices": [0,0,0, -0.5,0,-1, -1,0,0]},
					{"vertices": [-2,0,-1, -1,0,0, -0.5,0,-1]},
					{"vertices": [-2,0,-1, -3,0,0, -1,0,0]},
					{"vertices": [-1,0,2, -0.5,0,1, -1,0,0]},
					{"vertices": [-1,0,2, -1,0,0, -3,0,0]},
					
					{"vertices": [0,0,0, 0.5,0,1, 1,0,0]},
					{"vertices": [0,0,0, 1,0,0, 0.5,0,-1]},
					{"vertices": [2,0,-1, 0.5,0,-1, 1,0,0]},
					{"vertices": [2,0,-1, 1,0,0, 3,0,0]},
					{"vertices": [1,0,2, 1,0,0, 0.5,0,1]},
					{"vertices": [1,0,2, 3,0,0, 1,0,0]}
				]
			});
		});

		it("should create the navigation mesh correctly from the data", function() {
			expect(this.nm.triangles[0].edges[0].vertices[0].x).toBe(0);
			expect(this.nm.triangles[0].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[0].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[0].edges[0].vertices[1].x).toBe(0);
			expect(this.nm.triangles[0].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[0].edges[0].vertices[1].z).toBe(1);

			expect(this.nm.triangles[0].edges[1].vertices[0].x).toBe(0);
			expect(this.nm.triangles[0].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[0].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[0].edges[1].vertices[1].x).toBe(1);
			expect(this.nm.triangles[0].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[0].edges[1].vertices[1].z).toBe(1);

			expect(this.nm.triangles[0].edges[2].vertices[0].x).toBe(0);
			expect(this.nm.triangles[0].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[0].edges[2].vertices[0].z).toBe(1);
			expect(this.nm.triangles[0].edges[2].vertices[1].x).toBe(1);
			expect(this.nm.triangles[0].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[0].edges[2].vertices[1].z).toBe(1);
			expect(this.nm.triangles[0].getAdjacentTriangles([]).length).toBe(1);

			expect(this.nm.triangles[1].edges[0].vertices[0].x).toBe(0);
			expect(this.nm.triangles[1].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[1].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[1].edges[0].vertices[1].x).toBe(1);
			expect(this.nm.triangles[1].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[1].edges[0].vertices[1].z).toBe(1);

			expect(this.nm.triangles[1].edges[1].vertices[0].x).toBe(0);
			expect(this.nm.triangles[1].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[1].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[1].edges[1].vertices[1].x).toBe(2);
			expect(this.nm.triangles[1].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[1].edges[1].vertices[1].z).toBe(0);

			expect(this.nm.triangles[1].edges[2].vertices[0].x).toBe(1);
			expect(this.nm.triangles[1].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[1].edges[2].vertices[0].z).toBe(1);
			expect(this.nm.triangles[1].edges[2].vertices[1].x).toBe(2);
			expect(this.nm.triangles[1].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[1].edges[2].vertices[1].z).toBe(0);
			expect(this.nm.triangles[1].getAdjacentTriangles([]).length).toBe(2);

			expect(this.nm.triangles[2].edges[0].vertices[0].x).toBe(1);
			expect(this.nm.triangles[2].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[2].edges[0].vertices[0].z).toBe(1);
			expect(this.nm.triangles[2].edges[0].vertices[1].x).toBe(2);
			expect(this.nm.triangles[2].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[2].edges[0].vertices[1].z).toBe(0);

			expect(this.nm.triangles[2].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[2].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[2].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[2].edges[1].vertices[1].x).toBe(2);
			expect(this.nm.triangles[2].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[2].edges[1].vertices[1].z).toBe(2);

			expect(this.nm.triangles[2].edges[2].vertices[0].x).toBe(1);
			expect(this.nm.triangles[2].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[2].edges[2].vertices[0].z).toBe(1);
			expect(this.nm.triangles[2].edges[2].vertices[1].x).toBe(2);
			expect(this.nm.triangles[2].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[2].edges[2].vertices[1].z).toBe(2);
			expect(this.nm.triangles[2].getAdjacentTriangles([]).length).toBe(2);

			expect(this.nm.triangles[3].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[3].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[3].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[3].edges[0].vertices[1].x).toBe(2);
			expect(this.nm.triangles[3].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[3].edges[0].vertices[1].z).toBe(2);

			expect(this.nm.triangles[3].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[3].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[3].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[3].edges[1].vertices[1].x).toBe(3);
			expect(this.nm.triangles[3].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[3].edges[1].vertices[1].z).toBe(1);

			expect(this.nm.triangles[3].edges[2].vertices[0].x).toBe(2);
			expect(this.nm.triangles[3].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[3].edges[2].vertices[0].z).toBe(2);
			expect(this.nm.triangles[3].edges[2].vertices[1].x).toBe(3);
			expect(this.nm.triangles[3].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[3].edges[2].vertices[1].z).toBe(1);
			expect(this.nm.triangles[3].getAdjacentTriangles([]).length).toBe(2);

			expect(this.nm.triangles[4].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[4].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[1].x).toBe(3);
			expect(this.nm.triangles[4].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[1].z).toBe(1);

			expect(this.nm.triangles[4].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[4].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[1].x).toBe(4);
			expect(this.nm.triangles[4].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[1].z).toBe(0);

			expect(this.nm.triangles[4].edges[2].vertices[0].x).toBe(3);
			expect(this.nm.triangles[4].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[2].vertices[0].z).toBe(1);
			expect(this.nm.triangles[4].edges[2].vertices[1].x).toBe(4);
			expect(this.nm.triangles[4].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[2].vertices[1].z).toBe(0);
			expect(this.nm.triangles[4].getAdjacentTriangles([]).length).toBe(3);

			expect(this.nm.triangles[5].edges[0].vertices[0].x).toBe(3);
			expect(this.nm.triangles[5].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[0].vertices[0].z).toBe(1);
			expect(this.nm.triangles[5].edges[0].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[0].vertices[1].z).toBe(2);

			expect(this.nm.triangles[5].edges[1].vertices[0].x).toBe(3);
			expect(this.nm.triangles[5].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[1].vertices[0].z).toBe(1);
			expect(this.nm.triangles[5].edges[1].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[1].vertices[1].z).toBe(0);

			expect(this.nm.triangles[5].edges[2].vertices[0].x).toBe(4);
			expect(this.nm.triangles[5].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[2].vertices[0].z).toBe(2);
			expect(this.nm.triangles[5].edges[2].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[2].vertices[1].z).toBe(0);
			expect(this.nm.triangles[5].getAdjacentTriangles([]).length).toBe(1);

			expect(this.nm.triangles[6].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[6].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[6].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[6].edges[0].vertices[1].x).toBe(4);
			expect(this.nm.triangles[6].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[6].edges[0].vertices[1].z).toBe(0);

			expect(this.nm.triangles[6].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[6].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[6].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[6].edges[1].vertices[1].x).toBe(3);
			expect(this.nm.triangles[6].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[6].edges[1].vertices[1].z).toBe(-1);

			expect(this.nm.triangles[6].edges[2].vertices[0].x).toBe(4);
			expect(this.nm.triangles[6].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[6].edges[2].vertices[0].z).toBe(0);
			expect(this.nm.triangles[6].edges[2].vertices[1].x).toBe(3);
			expect(this.nm.triangles[6].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[6].edges[2].vertices[1].z).toBe(-1);
			expect(this.nm.triangles[6].getAdjacentTriangles([]).length).toBe(2);

			expect(this.nm.triangles[7].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[7].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[1].x).toBe(3);
			expect(this.nm.triangles[7].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[1].z).toBe(-1);

			expect(this.nm.triangles[7].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[7].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[1].x).toBe(2);
			expect(this.nm.triangles[7].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[1].z).toBe(-2);

			expect(this.nm.triangles[7].edges[2].vertices[0].x).toBe(3);
			expect(this.nm.triangles[7].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[2].vertices[0].z).toBe(-1);
			expect(this.nm.triangles[7].edges[2].vertices[1].x).toBe(2);
			expect(this.nm.triangles[7].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[2].vertices[1].z).toBe(-2);
			expect(this.nm.triangles[7].getAdjacentTriangles([]).length).toBe(2);

			expect(this.nm.triangles[8].edges[0].vertices[0].x).toBe(3);
			expect(this.nm.triangles[8].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[8].edges[0].vertices[0].z).toBe(-1);
			expect(this.nm.triangles[8].edges[0].vertices[1].x).toBe(2);
			expect(this.nm.triangles[8].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[8].edges[0].vertices[1].z).toBe(-2);

			expect(this.nm.triangles[8].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[8].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[8].edges[1].vertices[0].z).toBe(-2);
			expect(this.nm.triangles[8].edges[1].vertices[1].x).toBe(4);
			expect(this.nm.triangles[8].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[8].edges[1].vertices[1].z).toBe(-2);

			expect(this.nm.triangles[8].edges[2].vertices[0].x).toBe(3);
			expect(this.nm.triangles[8].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[8].edges[2].vertices[0].z).toBe(-1);
			expect(this.nm.triangles[8].edges[2].vertices[1].x).toBe(4);
			expect(this.nm.triangles[8].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[8].edges[2].vertices[1].z).toBe(-2);
			expect(this.nm.triangles[8].getAdjacentTriangles([]).length).toBe(1);

			expect(this.nm.triangles[0].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[0].normal.y)).toBe(1);
			expect(this.nm.triangles[0].normal.z).toBe(0);
			expect(this.nm.triangles[1].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[1].normal.y)).toBe(1);
			expect(this.nm.triangles[1].normal.z).toBe(0);
			expect(this.nm.triangles[2].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[2].normal.y)).toBe(1);
			expect(this.nm.triangles[2].normal.z).toBe(0);
			expect(this.nm.triangles[3].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[3].normal.y)).toBe(1);
			expect(this.nm.triangles[3].normal.z).toBe(0);
			expect(this.nm.triangles[4].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[4].normal.y)).toBe(1);
			expect(this.nm.triangles[4].normal.z).toBe(0);
			expect(this.nm.triangles[5].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[5].normal.y)).toBe(1);
			expect(this.nm.triangles[5].normal.z).toBe(0);
			expect(this.nm.triangles[6].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[6].normal.y)).toBe(1);
			expect(this.nm.triangles[6].normal.z).toBe(0);
			expect(this.nm.triangles[7].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[7].normal.y)).toBe(1);
			expect(this.nm.triangles[7].normal.z).toBe(0);
			expect(this.nm.triangles[8].normal.x).toBe(0);
			expect(Math.abs(this.nm.triangles[8].normal.y)).toBe(1);
			expect(this.nm.triangles[8].normal.z).toBe(0);
		});

		it("should tell which triangle is the one holding certain point", function() {
			var tri = this.nm.__selectCorrespondingTriangle(new Mathematics.Vector3D(0,0.5,0));
			expect(this.nm.triangles[0]).toBe(tri);
			tri = this.nm.__selectCorrespondingTriangle(new Mathematics.Vector3D(0.5,0,0.8));
			expect(this.nm.triangles[0]).toBe(tri);
			tri = this.nm.__selectCorrespondingTriangle(new Mathematics.Vector3D(0.5,0.5,0));
			expect(this.nm.triangles[1]).toBe(tri);
			tri = this.nm.__selectCorrespondingTriangle(new Mathematics.Vector3D(3,0.5,-1.5));
			expect(this.nm.triangles[8]).toBe(tri);
			tri = this.nm.__selectCorrespondingTriangle(new Mathematics.Vector3D(3.5,0.5,1));
			expect(this.nm.triangles[5]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(-0.5,0.5,3));
			expect(this.nm2.triangles[0]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(0,0.5,0.5));
			expect(this.nm2.triangles[6]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(-2,0.5,1));
			expect(this.nm2.triangles[12]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(-0.5,0.5,-0.5));
			expect(this.nm2.triangles[8]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(-0.5,0.5,0.5));
			expect(this.nm2.triangles[7]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(0,0.5,0.5));
			expect(this.nm2.triangles[6]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(0.5,0.5,0.5));
			expect(this.nm2.triangles[13]).toBe(tri);
			tri = this.nm2.__selectCorrespondingTriangle(new Mathematics.Vector3D(2,0.5,1));
			expect(this.nm2.triangles[18]).toBe(tri);
		});

		it("should build the abstract search graph correctly", function() {
			expect(this.nm.abstractGraph.thirdDegreeNodes.length).toBe(0);
			expect(this.nm.abstractGraph.secondDegreeNodes.length).toBe(0);
			expect(this.nm.abstractGraph.firstDegreeNodes.length).toBe(9);
			expect(this.nm.abstractGraph.zeroDegreeNodes.length).toBe(0);

			expect(this.nm.abstractGraph.firstDegreeNodes[0].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[1].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[2].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[3].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[4].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[5].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[6].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[7].root).toBeNull();
			expect(this.nm.abstractGraph.firstDegreeNodes[8].root).toBeNull();

			expect(this.nm.abstractGraph.firstDegreeNodes[0].linkedNodes.length).toBe(1);
			expect(this.nm.abstractGraph.firstDegreeNodes[1].linkedNodes.length).toBe(1);
			expect(this.nm.abstractGraph.firstDegreeNodes[2].linkedNodes.length).toBe(1);
			expect(this.nm.abstractGraph.firstDegreeNodes[3].linkedNodes.length).toBe(2);
			expect(this.nm.abstractGraph.firstDegreeNodes[4].linkedNodes.length).toBe(2);
			expect(this.nm.abstractGraph.firstDegreeNodes[5].linkedNodes.length).toBe(3);
			expect(this.nm.abstractGraph.firstDegreeNodes[6].linkedNodes.length).toBe(2);
			expect(this.nm.abstractGraph.firstDegreeNodes[7].linkedNodes.length).toBe(2);
			expect(this.nm.abstractGraph.firstDegreeNodes[8].linkedNodes.length).toBe(2);

			expect(this.nm2.abstractGraph.thirdDegreeNodes.length).toBe(2);
			expect(this.nm2.abstractGraph.secondDegreeNodes.length).toBe(11);
			expect(this.nm2.abstractGraph.firstDegreeNodes.length).toBe(6);
			expect(this.nm2.abstractGraph.zeroDegreeNodes.length).toBe(0);

			expect(this.nm2.abstractGraph.firstDegreeNodes[0].root).toBe(this.nm2.triangles[6].abstractNode);
			expect(this.nm2.abstractGraph.firstDegreeNodes[1].root).toBe(this.nm2.triangles[6].abstractNode);
			expect(this.nm2.abstractGraph.firstDegreeNodes[2].root).toBe(this.nm2.triangles[6].abstractNode);
			expect(this.nm2.abstractGraph.firstDegreeNodes[3].root).toBe(this.nm2.triangles[6].abstractNode);
			expect(this.nm2.abstractGraph.firstDegreeNodes[4].root).toBe(this.nm2.triangles[6].abstractNode);
			expect(this.nm2.abstractGraph.firstDegreeNodes[5].root).toBe(this.nm2.triangles[6].abstractNode);

			expect(this.nm2.triangles[6].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[6].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);

			expect(this.nm2.triangles[14].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[14].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[15].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[15].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[16].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[16].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[17].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[17].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[18].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(this.nm2.triangles[18].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[13].abstractNode);

			expect(this.nm2.triangles[8].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[8].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[9].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[9].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[10].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[10].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[11].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[11].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[12].abstractNode.edgeEndPoints[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(this.nm2.triangles[12].abstractNode.edgeEndPoints[1]).toBe(this.nm2.triangles[7].abstractNode);
		});

		it("should return the correct node path doing a simple search when both points are in the same tree", function() {
			var path = [];

			this.nm.findTrianglePath(new Mathematics.Vector3D(0,0.5,0), new Mathematics.Vector3D(0,0.5,0), path);
			expect(path[0]).toBe(this.nm.triangles[0].abstractNode);
			expect(path.length).toBe(1);

			this.nm.findTrianglePath(new Mathematics.Vector3D(0,0.5,0), new Mathematics.Vector3D(3, 0.5, -1.5), path);
			expect(path[0]).toBe(this.nm.triangles[0].abstractNode);
			expect(path[1]).toBe(this.nm.triangles[1].abstractNode);
			expect(path[2]).toBe(this.nm.triangles[2].abstractNode);
			expect(path[3]).toBe(this.nm.triangles[3].abstractNode);
			expect(path[4]).toBe(this.nm.triangles[4].abstractNode);
			expect(path[5]).toBe(this.nm.triangles[6].abstractNode);
			expect(path[6]).toBe(this.nm.triangles[7].abstractNode);
			expect(path[7]).toBe(this.nm.triangles[8].abstractNode);
			expect(path.length).toBe(8);

			this.nm.findTrianglePath(new Mathematics.Vector3D(0,0.5,0), new Mathematics.Vector3D(3.5,0.5,1), path);
			expect(path[0]).toBe(this.nm.triangles[0].abstractNode);
			expect(path[1]).toBe(this.nm.triangles[1].abstractNode);
			expect(path[2]).toBe(this.nm.triangles[2].abstractNode);
			expect(path[3]).toBe(this.nm.triangles[3].abstractNode);
			expect(path[4]).toBe(this.nm.triangles[4].abstractNode);
			expect(path[5]).toBe(this.nm.triangles[5].abstractNode);
			expect(path.length).toBe(6);

			this.nm.findTrianglePath(new Mathematics.Vector3D(3.5,0.5,1), new Mathematics.Vector3D(0,0.5,0), path);
			expect(path[0]).toBe(this.nm.triangles[5].abstractNode);
			expect(path[1]).toBe(this.nm.triangles[4].abstractNode);
			expect(path[2]).toBe(this.nm.triangles[3].abstractNode);
			expect(path[3]).toBe(this.nm.triangles[2].abstractNode);
			expect(path[4]).toBe(this.nm.triangles[1].abstractNode);
			expect(path[5]).toBe(this.nm.triangles[0].abstractNode);
			expect(path.length).toBe(6);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-0.5,0.5,3), new Mathematics.Vector3D(0,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[0].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[2].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[3].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[4].abstractNode);
			expect(path[4]).toBe(this.nm2.triangles[5].abstractNode);
			expect(path[5]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path.length).toBe(6);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(-0.5,0.5,-0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[8].abstractNode);
			expect(path.length).toBe(4);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(-0.5,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path.length).toBe(3);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-0.5,0.5,0.5), new Mathematics.Vector3D(-2,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path.length).toBe(3);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(0,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path.length).toBe(4);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-0.5,0.5,0.5), new Mathematics.Vector3D(0.5,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[13].abstractNode);
			expect(path.length).toBe(3);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-0.75,0.5,1), new Mathematics.Vector3D(0.5,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[13].abstractNode);
			expect(path.length).toBe(4);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(0.5,0.5,0.5), new Mathematics.Vector3D(-0.75,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[13].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path.length).toBe(4);

			//Since this is a "complicated" search, it will stop in the edge node coonected to the goal.
			this.nm2.findTrianglePath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(2,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path[4]).toBe(this.nm2.triangles[13].abstractNode);
			expect(path.length).toBe(5);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(2,0.5,1), new Mathematics.Vector3D(-2,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[18].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[17].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[13].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path[4]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path.length).toBe(5);
			
			//Another "complicated" search, will return the path to the root parent of the node.
			this.nm2.findTrianglePath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(-0.5,0.5,3), path);
			expect(path[0]).toBe(this.nm2.triangles[12].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[11].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[7].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path.length).toBe(4);

			this.nm2.findTrianglePath(new Mathematics.Vector3D(-0.5,0.5,3), new Mathematics.Vector3D(-2,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[0].abstractNode);
			expect(path[1]).toBe(this.nm2.triangles[2].abstractNode);
			expect(path[2]).toBe(this.nm2.triangles[3].abstractNode);
			expect(path[3]).toBe(this.nm2.triangles[4].abstractNode);
			expect(path[4]).toBe(this.nm2.triangles[5].abstractNode);
			expect(path[5]).toBe(this.nm2.triangles[6].abstractNode);
			expect(path.length).toBe(6);
		});

		it("should return the correct path doing a simple search when both points are in the same tree", function() {
			var path = [];

			this.nm.findPath(new Mathematics.Vector3D(0,0.5,0), new Mathematics.Vector3D(0,0.5,0), path);
			expect(path[0]).toBe(this.nm.triangles[0].orthocenter);
			expect(path.length).toBe(1);

			this.nm2.findPath(new Mathematics.Vector3D(-0.5,0.5,3), new Mathematics.Vector3D(0,0.5,0.5), path);
			expect(path[0]).toBe(this.nm2.triangles[0].orthocenter);
			expect(path[1]).toBe(this.nm2.triangles[2].orthocenter);
			expect(path[2]).toBe(this.nm2.triangles[3].orthocenter);
			expect(path[3]).toBe(this.nm2.triangles[4].orthocenter);
			expect(path[4]).toBe(this.nm2.triangles[5].orthocenter);
			expect(path[5]).toBe(this.nm2.triangles[6].orthocenter);
			expect(path.length).toBe(6);

			this.nm2.findPath(new Mathematics.Vector3D(-2,0.5,1), new Mathematics.Vector3D(2,0.5,1), path);
			expect(path[0]).toBe(this.nm2.triangles[12].orthocenter);
			expect(path[1]).toBe(this.nm2.triangles[11].orthocenter);
			expect(path[2]).toBe(this.nm2.triangles[7].orthocenter);
			expect(path[3]).toBe(this.nm2.triangles[6].orthocenter);
			expect(path[4]).toBe(this.nm2.triangles[13].orthocenter);
			expect(path.length).toBe(5);
		});
	});
});