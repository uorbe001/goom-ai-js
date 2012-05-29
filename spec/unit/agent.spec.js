var Agent = require("../../src/agent"), Responses = require("../../src/behaviour-tree-responses"), NavigationMesh = require("../../src/navigation-mesh");

describe("AI.Agent", function(){
	beforeEach(function() {
		this.a1 = function() { return Responses.SUCCESS; };
		spyOn(this, 'a1').andCallThrough();

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

		var config = {
			"name": "box_agent",
			"behaviour": { type: "action", execute: this.a1 },
			"movement": {
				"type": "walk",
				"velocity": 12,
				"angular_velocity": 10
			},
			"body": {
				"max_health": 100,
				"max_energy": 100
			},
			"appearance": {
				"model": "box"
			}
		};

		this.agent = new Agent(config, this.nm);
	});

	it("Should create an agent with the given description", function() {
		expect(this.agent.movement.type).toEqual("walk");
		expect(this.agent.movement.velocity).toBe(12);
		expect(this.agent.body.max_health).toBe(100);
		expect(this.agent.body.max_energy).toBe(100);
		expect(this.agent.appearance.model).toEqual("box");
		expect(this.agent.navigationMesh).toBe(this.nm);
	});

	it("should call the bt when think is called", function() {
		var agent_data = {
			"position": { "x": 1, "y": 1, "z": 1 },
			"orientation": {"r": 1, "i": 0, "j": 0, "k": 0}
		};

		this.agent.think(1, agent_data);
		expect(this.a1).toHaveBeenCalledWith(1, agent_data);
	});
});