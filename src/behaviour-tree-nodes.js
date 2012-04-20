if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["./behaviour-tree-responses"], function(responses) {
	var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	};

	/**
		@namespace holds the different BT node types.
	*/
	var Nodes = {};
	Nodes.READY = 0;
	Nodes.RUNNING = 1;

	/**
		Creates a new bt node.
		@class This is the base node only used to be extended by the other nodes.
		@inner
	*/
	var Node = (function() {
		function Node() {
			this.status = Nodes.READY;
		}

		/**
			Sets the node to ready status.
		*/
		Node.prototype.setReady = function () {
			this.status = Nodes.READY;
		};

		/**
			Returns wether the node is ready or not.
		*/
		Node.prototype.isReady = function () {
			return this.status == Nodes.READY;
		};

		/**
			Sets the node to running status.
		*/
		Node.prototype.setReady = function () {
			this.status = Nodes.RUNNING;
		};

		/**
			Returns wether the node is running or not.
		*/
		Node.prototype.isRunning = function () {
			return this.status == Nodes.RUNNING;
		};

		return Node;
	})();

	/**
		Creates a new priority node.
		@class Priority nodes select a child by priority until one of them succeeds or returns a running status.
		@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
		@exports Priority as AI.Nodes.Priority.
	*/
	var Priority = (function() {
		__extends(Priority, Node);

		function Priority() {
			this.endBranchIndex = 0;
			Priority.__super__.constructor.call(this);
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
		__extends(Concurrent, Node);

		function Concurrent() {
			this.endBranchIndex = 0;
			Concurrent.__super__.constructor.call(this);
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
		__extends(Sequence, Node);

		function Sequence() {
			this.endBranchIndex = 0;
			this.runningNodeIndex = 0;
			Sequence.__super__.constructor.call(this);
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
		__extends(Loop, Node);

		function Loop() {
			this.endBranchIndex = 0;
			this.runningNodeIndex = 0;
			Loop.__super__.constructor.call(this);
		}

		Nodes.Loop = Loop;
		return Loop;
	})();

	/**
		Creates a new decorator node.
		@class Decorator nodes are used for limiting the time another node can be running or the nuber of times it can run.
		@exports Decorator as AI.Nodes.Decorator.
	*/
	var Decorator = (function() {
		__extends(Decorator, Node);

		function Decorator() {
			Decorator.__super__.constructor.call(this);
		}

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
		__extends(Action, Node);

		function Action(execute) {
			this.execute = execute;
			Action.__super__.constructor.call(this);
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
		__extends(Condition, Node);

		function Condition(execute) {
			this.execute = execute;
			Condition.__super__.constructor.call(this);
		}

		Nodes.Condition = Condition;
		return Condition;
	})();

	return Nodes;
});