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
					{ "vertices": [2,0,0, 4,0,0, 3,0,1] },
					{ "vertices": [3,0,1, 4,0,0, 4,0,2] },
					{ "vertices": [2,0,0, 4,0,0, 3,0,-1] },
					{ "vertices": [2,0,0, 2,0,-2, 3,0,-1] },
					{ "vertices": [2,0,-2, 3,0,-1, 4,0,-2] }
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

			expect(this.nm.triangles[2].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[2].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[2].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[2].edges[0].vertices[1].x).toBe(1);
			expect(this.nm.triangles[2].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[2].edges[0].vertices[1].z).toBe(1);

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

			expect(this.nm.triangles[4].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[4].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[1].x).toBe(4);
			expect(this.nm.triangles[4].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[0].vertices[1].z).toBe(0);

			expect(this.nm.triangles[4].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[4].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[1].x).toBe(3);
			expect(this.nm.triangles[4].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[1].vertices[1].z).toBe(1);

			expect(this.nm.triangles[4].edges[2].vertices[0].x).toBe(4);
			expect(this.nm.triangles[4].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[4].edges[2].vertices[0].z).toBe(0);
			expect(this.nm.triangles[4].edges[2].vertices[1].x).toBe(3);
			expect(this.nm.triangles[4].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[4].edges[2].vertices[1].z).toBe(1);

			expect(this.nm.triangles[5].edges[0].vertices[0].x).toBe(3);
			expect(this.nm.triangles[5].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[0].vertices[0].z).toBe(1);
			expect(this.nm.triangles[5].edges[0].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[0].vertices[1].z).toBe(0);

			expect(this.nm.triangles[5].edges[1].vertices[0].x).toBe(3);
			expect(this.nm.triangles[5].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[1].vertices[0].z).toBe(1);
			expect(this.nm.triangles[5].edges[1].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[1].vertices[1].z).toBe(2);

			expect(this.nm.triangles[5].edges[2].vertices[0].x).toBe(4);
			expect(this.nm.triangles[5].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[5].edges[2].vertices[0].z).toBe(0);
			expect(this.nm.triangles[5].edges[2].vertices[1].x).toBe(4);
			expect(this.nm.triangles[5].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[5].edges[2].vertices[1].z).toBe(2);

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

			expect(this.nm.triangles[7].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[7].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[0].z).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[1].x).toBe(2);
			expect(this.nm.triangles[7].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[0].vertices[1].z).toBe(-2);

			expect(this.nm.triangles[7].edges[1].vertices[0].x).toBe(2);
			expect(this.nm.triangles[7].edges[1].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[0].z).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[1].x).toBe(3);
			expect(this.nm.triangles[7].edges[1].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[1].vertices[1].z).toBe(-1);

			expect(this.nm.triangles[7].edges[2].vertices[0].x).toBe(2);
			expect(this.nm.triangles[7].edges[2].vertices[0].y).toBe(0);
			expect(this.nm.triangles[7].edges[2].vertices[0].z).toBe(-2);
			expect(this.nm.triangles[7].edges[2].vertices[1].x).toBe(3);
			expect(this.nm.triangles[7].edges[2].vertices[1].y).toBe(0);
			expect(this.nm.triangles[7].edges[2].vertices[1].z).toBe(-1);

			expect(this.nm.triangles[8].edges[0].vertices[0].x).toBe(2);
			expect(this.nm.triangles[8].edges[0].vertices[0].y).toBe(0);
			expect(this.nm.triangles[8].edges[0].vertices[0].z).toBe(-2);
			expect(this.nm.triangles[8].edges[0].vertices[1].x).toBe(3);
			expect(this.nm.triangles[8].edges[0].vertices[1].y).toBe(0);
			expect(this.nm.triangles[8].edges[0].vertices[1].z).toBe(-1);

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
		});
	});
});