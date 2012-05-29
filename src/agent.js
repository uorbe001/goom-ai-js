var BehaviourTree = require("./behaviour-tree");

/**
	Creates a new Agent.
	@class AI agents are used to model npcs.
	@param {json} config The configuration of the world.
	@property {AI.BehaviourTree} behaviourTree The BT used in this agent, loaded from config.
	@property {AI.NavigationMesh} navigationMesh The NavMesh used to find paths for this model.
	@exports Agent as AI.Agent.
*/
function Agent(config, navigation_mesh) {
	for (var key in config) {
		if (key == "name" || key == "behaviour") continue;
		this[key] = JSON.parse(JSON.stringify(config[key]));
	}

	this.behaviourTree = new BehaviourTree(config.behaviour);
	this.navigationMesh = navigation_mesh;
}

/**
	Traverses this agent's behaviour tree.
	@param {Number} time The time elapsed from previous simulation.
	@param agent_data Object containing the data relevant for this agent to think.
*/
Agent.prototype.think = function(time, agent_data) {
	this.behaviourTree.traverse(time, agent_data);
};

module.exports = Agent;