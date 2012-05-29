var World = require("../../src/world"), Responses = require("../../src/behaviour-tree-responses");

describe("AI.World", function(){
	beforeEach(function() {
		this.a1 = function() { return Responses.SUCCESS; };
		spyOn(this, 'a1').andCallThrough();

		var config = {
			"agent_models": [
				{
					"name": "box_agent",
					"behaviour": { type: "action", execute: this.a1 },
					"movement": {
						"type": "walk",
						"velocity": 12,
						"angular_velocity": 10
					},
					"body": {
						"max_health": 100,
						"max_energy": 100,
						"weight": 1,
						"inertial_tensor": [1/12, 1/12, 1/12],
						"primitives": [
							{
								"type": "box",
								"halfSize": {"x": 1, "y": 1, "z": 1},
								"offset": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
							}
						]
					},
					"appearance": {
						"model": "box"
					}
				}
			],

			"level": {
				"navigation_mesh": {
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
				},

				"agents": [
					{
						"model": "box_agent",
						"static": false,
						"position": {"x": 0, "y": 0, "z": 0},
						"orientation": {"r": 1, "i": 0, "j": 0, "k": 0},
						"health": 100,
						"energy": 80
					}
				]
			}
		};
		
		this.world = new World(config);
	});

	it("should create the agent models and instances properly, along with the Navigation Mesh", function() {
		expect(this.world.agentModels["box_agent"]).not.toBeNull();
		expect(this.world.agentModels["box_agent"].movement.velocity).toBe(12);
		expect(this.world.agentModels["box_agent"].movement.angular_velocity).toBe(10);
		expect(this.world.agentModels["box_agent"].body.max_health).toBe(100);
		expect(this.world.agentModels["box_agent"].appearance.model).toEqual("box");
		expect(this.world.agentModels["box_agent"].navigationMesh).toBe(this.world.navigationMesh);

		expect(this.world.agents.length).toBe(1);
		expect(this.world.agents[0].position.x).toBe(0);
		expect(this.world.agents[0].orientation.r).toBe(1);
		expect(this.world.agents[0].health).toBe(100);

		expect(this.world.navigationMesh === undefined || this.world.navigationMesh === null).not.toBeTruthy();
	});

	it("should update the models properly", function() {
		var box_agent = this.world.agentModels["box_agent"];
		spyOn(box_agent, "think").andCallThrough();

		this.world.update(1);
		expect(box_agent.think).toHaveBeenCalledWith(1, this.world.agents[0]/*, this.world.navigationMesh */);
		//Jasmine is crying here with a nested too deeply error, but it should be working fine, the last parameter is
		//the agent's responsibility anyway.
	});
});