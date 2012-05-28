var responses = require("./behaviour-tree-responses");

/**
	Creates a new priority node.
	@class Priority nodes select a child by priority until one of them succeeds or returns a running status.
	@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
	@exports Priority as AI.Nodes.Priority.
*/
function Priority() {
	this.endBranchIndex = 0;
}

exports.Priority = Priority;

/**
	Creates a new concurrent node.
	@class Concurrent nodes run all the child nodes in every traversal.
	@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
	@exports Concurrent as AI.Nodes.Concurrent.
*/
function Concurrent() {
	this.endBranchIndex = 0;
}

exports.Concurrent = Concurrent;

/**
	Creates a new sequence node.
	@class Sequence nodes run all the children sequentially until one of them returns failure.
	@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
	@property {Number} runningNodeIndex This variable holds the index of a subnode that is running.
	@exports Sequence as AI.Nodes.Sequence.
*/
function Sequence() {
	this.endBranchIndex = 0;
	this.runningNodeIndex = 0;
}

exports.Sequence = Sequence;

/**
	Creates a new loop node.
	@class Loop nodes run all the children sequentially until one of them returns failure, and when the sequence ends it keeps looping.
	@property {Number} endBranchIndex the index corresponding to the first node of the next branch in the tree.
	@property {Number} runningNodeIndex This variable holds the index of a subnode that is running.
	@exports Loop as AI.Nodes.Loop.
*/
function Loop() {
	this.endBranchIndex = 0;
	this.runningNodeIndex = 0;
}

exports.Loop = Loop;

/**
	Creates a new decorator node. TODO: Decorators are not yet implemented.
	@class Decorator nodes are used for limiting the time another node can be running or the nuber of times it can run.
	@exports Decorator as AI.Nodes.Decorator.
*/
function Decorator() {}

exports.Decorator = Decorator;

/**
	Creates a new action node.
	@class Action nodes implement an execute method that will be called when the node is reached.
	@param {function} execute The callback that will be called when the tree is traversed.
	@property {function} execute The callback that will be called when the tree is traversed.
	@exports Action as AI.Nodes.Action.
*/
function Action(execute) {
	this.execute = execute;
}

exports.Action = Action;

/**
	Creates a new condition node.
	@class Condition nodes implement an execute method that will be called when the node is reached. If the execute method returns
	failure, the next sibling node will be skipped.
	@param {function} execute The callback that will be called when the tree is traversed.
	@property {function} execute The callback that will be called when the tree is traversed.
	@exports Condition as AI.Nodes.Condition.
*/
function Condition(execute) {
	this.execute = execute;
}

exports.Condition = Condition;