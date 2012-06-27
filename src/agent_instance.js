var Mathematics = require("goom-math-js");

/**
	Creates a new Agent instance.
	@class AI agent instances hold the data of individual agent instances.
	@param {json} config The configuration of the agent instances.
	@property {Mathematics.Position} position The position of the instance.
	@property {Mathematics.Orientation} orientation the orientation of the instance.
	@exports AgentInstance as AI.AgentInstance.
*/
function AgentInstance(config) {
	this.position = new Mathematics.Vector3D();
	this.position.set(config.position.x, config.position.y, config.position.z);
	this.orientation = new Mathematics.Quaternion();
	this.orientation.set(config.orientation.r, config.orientation.i, config.orientation.j, config.orientation.k);

	for (var key in config) {
		if (key == "position" || key == "orientation") continue;
		this[key] = JSON.parse(JSON.stringify(config[key]));
	}
}

module.exports = AgentInstance;