if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./behaviour-tree-nodes", "./behaviour-tree-responses"], function(Nodes, Responses) {
	/**
		Creates a new Behaviour Tree.
		@class Behaviour trees are used to model the behaviour of AI agents.
		@param {json} config The configuration of the behaviour tree, describing the node hierarchies etc.
		@propery {Array} nodeSequence the sequence of nodes loaded from the config.
		@property {Array} traversalStack This stack will hold the traversed parent nodes during the traversal.
		@property {Number} runningNodeIndex The index of the node that was left running (if any).
		@exports BehaviourTree as AI.BehaviourTree.
	*/
	var BehaviourTree = (function() {
		function BehaviourTree(config) {
			this.nodeSequence = this.__parseConfig(config);
			this.traversalStack = [];
			this.runningNodeIndex = 0;
		}

		/**
			Create a BT node from the given data and returns it.
			@param node description of the node.
			@returns The node Object created from the description.
			@inner
		*/
		BehaviourTree.prototype.__createNode = function (node) {
			switch (node.type.toLowerCase()) {
				case 'priority':
					return new Nodes.Priority();
				case 'concurrent':
					return new Nodes.Concurrent();
				case 'sequence':
					return new Nodes.Sequence();
				case 'loop':
					return new Nodes.Loop();
				case 'decorator':
					return new Nodes.Decorator();
				case 'action':
					return new Nodes.Action(node.execute);
				case 'condition':
					return new Nodes.Condition(node.execute);
			}
		};

		/**
			Goes down the tree another level and appends the children of the node to the nodes list.
			@param node Description of the current node.
			@param nodes List of nodes.
			@inner
		*/
		BehaviourTree.prototype.__goDeeper = function (node, nodes) {
			var next_node, node_index = nodes.length - 1;

			if (node.children !== undefined && node.children.length > 0) {
				for (var i = 0, len = node.children.length; i < len; i++) {
					next_node = node.children[i];
					nodes.push(this.__createNode(next_node));
					this.__goDeeper(next_node, nodes);
				}

				//Store where the index where the next branch begins.
				nodes[node_index].endBranchIndex = nodes.length - 1;
			}
		};

		/**
			Parses the config object and returns the node sequence described in it.
			@inner
			@param {json} config The configuration of the behaviour tree, describing the node hierarchies etc.
			@returns {Array} the node sequence described in the config.
		*/
		BehaviourTree.prototype.__parseConfig = function (config) {
			var nodes = [];
			var node = config;
			nodes.push(this.__createNode(node));
			this.__goDeeper(node, nodes);
			return nodes;
		};

		/**
			Traverses the behaviour tree.
		*/
		BehaviourTree.prototype.traverse = function() {
			var sequence = this.nodeSequence, node, result, parent, sequence_length = sequence.length;

			for(var i = 0, len = sequence.length; i < len; i++) {
				node = sequence[i];

				if (parent !== undefined && i > parent.endBranchIndex) {
					removed_parent = this.traversalStack.pop();
					parent = this.nodeSequence[this.traversalStack[this.traversalStack.length - 1]];
				}

				if (result === Responses.SUCCESS && parent instanceof Nodes.Priority) {
					i = parent.endBranchIndex;
					continue;
				}

				if (node instanceof Nodes.Condition) {
					result = node.execute();
					//If a condition node fails, the next node must be skipped.
					if (result === Responses.FAILURE) i++;
					continue;
				}

				if (node instanceof Nodes.Action) {
					result = node.execute();

					if (result === Responses.RUNNING && (parent instanceof Nodes.Sequence || parent instanceof Nodes.Loop)) {
						parent.runningNodeIndex = i;
						i = parent.endBranchIndex;
						continue;
					}

					if ((result === Responses.FAILURE && (parent instanceof Nodes.Sequence || parent instanceof Nodes.Loop)) ||
							((result === Responses.SUCCESS || result === Responses.RUNNING) && parent instanceof Nodes.Priority)) {
						i = parent.endBranchIndex;
						continue;
					}

					if (result === Responses.SUCCESS && parent instanceof Nodes.Loop && parent.endBranchIndex === i) {
						i = this.traversalStack[this.traversalStack.length - 1];
						continue;
					}

					continue;
				}

				this.traversalStack.push(i);
				parent = node;

				if (node.runningNodeIndex !== undefined && node.runningNodeIndex !== 0) {
					i = node.runningNodeIndex - 1;
				}
			}
		};

		return BehaviourTree;
	})();

	return BehaviourTree;
});