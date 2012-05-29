var Agent = require("./agent"), NavigationMesh = require("./navigation-mesh");

/**
	Creates a new AI World.
	@class AI world is the main entry point for all the AI related stuff.
	@param {json} config The configuration of the world.
	@property agentModels A map holding all of the agent models in this world (not instances).
	@property agents Array holding all of the agent instance data for this world.
	@property {AI.NavigationMesh} navigationMesh The navigation mesh for this world.
	@exports World as AI.World.
*/
function World(config) {
	this.agentModels = {}, this.agents = [];
	this.navigationMesh = new NavigationMesh(config.level.navigation_mesh);

	for (var i = 0, len = config.agent_models.length; i < len; i++) {
		this.agentModels[config.agent_models[i].name] = new Agent(config.agent_models[i], this.navigationMesh);
	}

	for (i = 0, len = config.level.agents.length; i < len; i++) {
		this.agents.push(JSON.parse(JSON.stringify(config.level.agents[i])));
	}
}

/**
	Updates all the agents in the world.
	@param {Number} time The time elapsed from previous simulation.
*/
World.prototype.update = function(time) {
	var agent;
	for (var i = this.agents.length - 1; i >= 0; i--) {
		agent = this.agents[i];
		this.agentModels[agent.model].think(time, agent);
	}
};

module.exports = World;