var requirejs = require("requirejs");
requirejs.config({nodeRequire: require});

requirejs(["../../src/behaviour-tree", "../../src/behaviour-tree-nodes", "../../src/behaviour-tree-responses"], function(BehaviourTree, Nodes, Responses) {
	describe("AI.BehaviourTree", function(){
		beforeEach(function() {
			this.c0 = function() { return Responses.FAILURE; };
			spyOn(this, 'c0').andCallThrough();
			this.c1 = function() { return Responses.FAILURE; };
			spyOn(this, 'c1').andCallThrough();
			this.a0 = function() { return Responses.FAILURE; };
			spyOn(this, 'a0').andCallThrough();
			this.a1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a1').andCallThrough();
			this.a2 = function() { return Responses.RUNNING; };
			spyOn(this, 'a2').andCallThrough();
			this.a3 = function() { return Responses.FAILURE; };
			spyOn(this, 'a3').andCallThrough();
			this.a4 = function() { return Responses.FAILURE; };
			spyOn(this, 'a4').andCallThrough();
			this.a5 = function() { return Responses.FAILURE; };
			spyOn(this, 'a5').andCallThrough();
			this.a6 = function() { return Responses.FAILURE; };
			spyOn(this, 'a6').andCallThrough();

			var config = {
				type: "priority",
				children: [
					{
						type: "concurrent", children: [
							{ type: "condition", execute: this.c0 },
							{ type: "action", execute: this.a0 }
						]
					},

					{
						type: "sequence", children: [
							{ type: "action", execute: this.a1 },
							{ type: "action", execute: this.a2 },
							{ type: "action", execute: this.a3 },
							{ type: "condition", execute: this.c1 },
							{ type: "action", execute: this.a4 },
							{ type: "action", execute: this.a5 },
							{ type: "action", execute: this.a6 }
						]
					}
				]
			};

			this.bt = new BehaviourTree(config);
		});

		it("should create the behaviour tree sequence correctly", function() {
			expect(this.bt.nodeSequence.length).toBe(12);
			expect(this.bt.nodeSequence[0] instanceof Nodes.Priority).toBeTruthy();
			expect(this.bt.nodeSequence[1] instanceof Nodes.Concurrent).toBeTruthy();
			expect(this.bt.nodeSequence[2] instanceof Nodes.Condition).toBeTruthy();
			expect(this.bt.nodeSequence[3] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[4] instanceof Nodes.Sequence).toBeTruthy();
			expect(this.bt.nodeSequence[5] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[6] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[7] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[8] instanceof Nodes.Condition).toBeTruthy();
			expect(this.bt.nodeSequence[9] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[10] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[11] instanceof Nodes.Action).toBeTruthy();
			expect(this.bt.nodeSequence[0].endBranchIndex).toBe(11);
			expect(this.bt.nodeSequence[1].endBranchIndex).toBe(3);
			expect(this.bt.nodeSequence[4].endBranchIndex).toBe(11);
		});

		it("should bail out when a leaf node returns running", function() {
			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[6].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[7].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[8].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[9].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[10].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[11].execute).not.toHaveBeenCalled();
		});

		it("should restore the running node on a new traversal", function() {
			this.bt.traverse();
			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute.callCount).toBe(2);
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[6].execute.callCount).toBe(2);
			expect(this.bt.nodeSequence[7].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[8].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[9].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[10].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[11].execute).not.toHaveBeenCalled();
		});

		it("should call all the subnodes of a sequence", function() {
			this.c0 = function() { return Responses.FAILURE; };
			spyOn(this, 'c0').andCallThrough();
			this.c1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'c1').andCallThrough();
			this.a0 = function() { return Responses.FAILURE; };
			spyOn(this, 'a0').andCallThrough();
			this.a1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a1').andCallThrough();
			this.a2 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a2').andCallThrough();
			this.a3 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a3').andCallThrough();
			this.a4 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a4').andCallThrough();
			this.a5 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a5').andCallThrough();
			this.a6 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a6').andCallThrough();

			var config = {
				type: "priority",
				children: [
					{
						type: "concurrent", children: [
							{ type: "condition", execute: this.c0 },
							{ type: "action", execute: this.a0 }
						]
					},

					{
						type: "sequence", children: [
							{ type: "action", execute: this.a1 },
							{ type: "action", execute: this.a2 },
							{ type: "action", execute: this.a3 },
							{ type: "condition", execute: this.c1 },
							{ type: "action", execute: this.a4 },
							{ type: "action", execute: this.a5 },
							{ type: "action", execute: this.a6 }
						]
					}
				]
			};

			this.bt = new BehaviourTree(config);

			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[6].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[7].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[8].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[9].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[10].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[11].execute).toHaveBeenCalled();
		});

		it("should continue searching for successful branch when the parent is a priority node", function() {
			this.c0 = function() { return Responses.FAILURE; };
			spyOn(this, 'c0').andCallThrough();
			this.c1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'c1').andCallThrough();
			this.a0 = function() { return Responses.FAILURE; };
			spyOn(this, 'a0').andCallThrough();
			this.a1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a1').andCallThrough();
			this.a2 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a2').andCallThrough();
			this.a3 = function() { return Responses.FAILURE; };
			spyOn(this, 'a3').andCallThrough();
			this.a4 = function() { return Responses.FAILURE; };
			spyOn(this, 'a4').andCallThrough();
			this.a5 = function() { return Responses.FAILURE; };
			spyOn(this, 'a5').andCallThrough();
			this.a6 = function() { return Responses.FAILURE; };
			spyOn(this, 'a6').andCallThrough();
			this.a7 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a7').andCallThrough();

			var config = {
				type: "priority",
				children: [
					{
						type: "concurrent", children: [
							{ type: "condition", execute: this.c0 },
							{ type: "action", execute: this.a0 }
						]
					},

					{
						type: "sequence", children: [
							{ type: "action", execute: this.a1 },
							{ type: "action", execute: this.a2 },
							{ type: "action", execute: this.a3 },
							{ type: "condition", execute: this.c1 },
							{ type: "action", execute: this.a4 },
							{ type: "action", execute: this.a5 },
							{ type: "action", execute: this.a6 }
						]
					},
					{ type: "action", execute: this.a7 }
				]
			};

			this.bt = new BehaviourTree(config);

			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[6].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[7].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[8].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[9].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[10].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[11].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[12].execute).toHaveBeenCalled();
		});

		it("should bail out when a priority node's subnode returns success", function() {
			this.c0 = function() { return Responses.FAILURE; };
			spyOn(this, 'c0').andCallThrough();
			this.c1 = function() { return Responses.FAILURE; };
			spyOn(this, 'c1').andCallThrough();
			this.a0 = function() { return Responses.FAILURE; };
			spyOn(this, 'a0').andCallThrough();
			this.a1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a1').andCallThrough();
			this.a2 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a2').andCallThrough();
			this.a3 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a3').andCallThrough();
			this.a4 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a4').andCallThrough();
			this.a5 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a5').andCallThrough();
			this.a6 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a6').andCallThrough();
			this.a7 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a7').andCallThrough();
			this.a8 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a8').andCallThrough();

			var config = {
				type: "priority",
				children: [
					{
						type: "concurrent", children: [
							{ type: "condition", execute: this.c0 },
							{ type: "action", execute: this.a0 }
						]
					},

					{
						type: "sequence", children: [
							{ type: "action", execute: this.a1 },
							{ type: "action", execute: this.a2 },
							{ type: "action", execute: this.a3 },
							{ type: "condition", execute: this.c1 },
							{ type: "action", execute: this.a4 },
							{ type: "action", execute: this.a5 },
							{ type: "action", execute: this.a6 }
						]
					},
					{
						type: "action", execute: this.a7
					},
					{
						type: "action", execute: this.a8
					}
				]
			};

			this.bt = new BehaviourTree(config);

			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[6].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[7].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[8].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[9].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[10].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[11].execute).toHaveBeenCalled();
			expect(this.bt.nodeSequence[12].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[13].execute).not.toHaveBeenCalled();
		});

		it("should continue looping in the same branch at loop nodes", function() {
			var c = 0;
			this.c0 = function() { return Responses.FAILURE; };
			spyOn(this, 'c0').andCallThrough();
			this.c1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'c1').andCallThrough();
			this.a0 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a0').andCallThrough();
			this.a1 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a1').andCallThrough();
			this.a2 = function() { if (c < 1) { c += 1; return Responses.SUCCESS; } else return Responses.FAILURE; };
			spyOn(this, 'a2').andCallThrough();
			this.a3 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a3').andCallThrough();
			this.a4 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a4').andCallThrough();
			this.a5 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a5').andCallThrough();
			this.a6 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a6').andCallThrough();
			this.a7 = function() { return Responses.SUCCESS; };
			spyOn(this, 'a7').andCallThrough();

			var config = {
				type: "priority",
				children: [
					{
						type: "concurrent", children: [
							{ type: "condition", execute: this.c0 },
							{ type: "action", execute: this.a0 }
						]
					},

					{
						type: "loop", children: [
							{ type: "action", execute: this.a1 },
							{ type: "action", execute: this.a2 },
							{ type: "action", execute: this.a3 },
							{ type: "condition", execute: this.c1 },
							{ type: "action", execute: this.a4 },
							{ type: "action", execute: this.a5 },
							{ type: "action", execute: this.a6 }
						]
					},
					{ type: "action", execute: this.a7 }
				]
			};

			this.bt = new BehaviourTree(config);

			this.bt.traverse();
			expect(this.bt.nodeSequence[2].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[3].execute).not.toHaveBeenCalled();
			expect(this.bt.nodeSequence[5].execute.callCount).toBe(2);
			expect(this.bt.nodeSequence[6].execute.callCount).toBe(2);
			expect(this.bt.nodeSequence[7].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[8].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[9].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[10].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[11].execute.callCount).toBe(1);
			expect(this.bt.nodeSequence[12].execute.callCount).toBe(1);
		});
	});
});