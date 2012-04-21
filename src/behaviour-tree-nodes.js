if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./behaviour-tree-responses"], function(responses) {
	/**
		@namespace holds the different BT node types.
	*/
	var Nodes = {};

	/**
		Creates a new priority node.
		@class Priority nodes select a child by priority until one of them succeeds or returns a running status.
		@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
		@exports Priority as AI.Nodes.Priority.
	*/
	var Priority = (function() {
		function Priority() {
			this.endBranchIndex = 0;
		}

		Nodes.Priority = Priority;
		return Priority;
	})();

	/**
		Creates a new concurrent node.
		@class Concurrent nodes run all the child nodes in every traversal.
		@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
		@exports Concurrent as AI.Nodes.Concurrent.
	*/
	var Concurrent = (function() {
		function Concurrent() {
			this.endBranchIndex = 0;
		}

		Nodes.Concurrent = Concurrent;
		return Concurrent;
	})();

	/**
		Creates a new sequence node.
		@class Sequence nodes run all the children sequentially until one of them returns failure.
		@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
		@property {Number} runningNodeIndex This variable holds the index of a subnode that is running.
		@exports Sequence as AI.Nodes.Sequence.
	*/
	var Sequence = (function() {
		function Sequence() {
			this.endBranchIndex = 0;
			this.runningNodeIndex = 0;
		}

		Nodes.Sequence = Sequence;
		return Sequence;
	})();


	/**
		Creates a new loop node.
		@class Loop nodes run all the children sequentially until one of them returns failure, and when the sequence ends it keeps looping.
		@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
		@property {Number} runningNodeIndex This variable holds the index of a subnode that is running.
		@exports Loop as AI.Nodes.Loop.
	*/
	var Loop = (function() {
		function Loop() {
			this.endBranchIndex = 0;
			this.runningNodeIndex = 0;
		}

		Nodes.Loop = Loop;
		return Loop;
	})();

	/**
		Creates a new decorator node. TODO: Decorators are not yet implemented.
		@class Decorator nodes are used for limiting the time another node can be running or the nuber of times it can run.
		@exports Decorator as AI.Nodes.Decorator.
	*/
	var Decorator = (function() {
		function Decorator() {}

		Nodes.Decorator = Decorator;
		return Decorator;
	})();

	/**
		Creates a new action node.
		@class Action nodes implement an execute method that will be called when the node is reached.
		@param {function} execute The callback that will be called when the tree is traversed.
		@property {function} execute The callback that will be called when the tree is traversed.
		@exports Action as AI.Nodes.Action.
	*/
	var Action = (function() {
		function Action(execute) {
			this.execute = execute;
		}

		Nodes.Action = Action;
		return Action;
	})();

	/**
		Creates a new condition node.
		@class Condition nodes implement an execute method that will be called when the node is reached. If the execute method returns
		failure, the next sibling node will be skipped.
		@param {function} execute The callback that will be called when the tree is traversed.
		@property {function} execute The callback that will be called when the tree is traversed.
		@exports Condition as AI.Nodes.Condition.
	*/
	var Condition = (function() {
		function Condition(execute) {
			this.execute = execute;
		}

		Nodes.Condition = Condition;
		return Condition;
	})();

	return Nodes;
});