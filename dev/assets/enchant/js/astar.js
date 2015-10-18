//
// A-Star Node
//
function AStarNode() {
	this.pathParent = {
		get: function() {
			return this._pathParent;
		},

		set: function(pathParent) {
			this._pathParent = pathParent;
		}
	}

	this.neighbours = {
		get: function() {
			return this._neighbours;
		},

		set: function(neighbours) {
			this._neighbours = neighbours;
		},

		add: function(neighbour) {
			this.neighbour.push(neighbour);
		}
	}

	this.costFromStart = {
		get: function() {
			return this._costFromStart;
		},

		set: function(costFromStart) {
			this._costFromStart = costFromStart;
		}
	}

	this.estimatedCostToGoal = {
		get: function() {
			return this._estimatedCostToGoal;
		},

		set: function(estimatedCostToGoal) {
			this._estimatedCostToGoal = estimatedCostToGoal;
		}
	}

	this.estimatedCostToGoal.set(Number.MAX_SAFE_INTEGER);
	this.costFromStart.set(Number.MAX_SAFE_INTEGER);
}

AStarNode.prototype.getCost = function() {
	return this.costFromStart.get() + this.estimatedCostToGoal.get();
}

AStarNode.prototype.getCostToReachNode = function(node) {
	return 0;
}

AStarNode.prototype.getEstimatedCostToReachNode = function(node) {
	return 0;
}

AStarNode.prototype.compareCostWithNode = function(node) {
	return (node==null? 1: this.getCost() - node.getCost());
}

AStarNode.prototype.getPath = function() {
	var path = [];

	var parent = this.pathParent.get();
	while (parent!=null) {
		path.unshift(parent);
		parent = this.pathParent.get();
	}

	return path;
}

//
// A-Star prioritized list util
//
function PriorityArray() {
	Array.call(this);
}

PriorityArray.prototype = Object.create(Array.prototype);
PriorityArray.prototype.push = function(toPush) {
	var pushed = null;

	this.forEach(function(currentValue, index, array) {
		if (toPush.compareCostWithNode(currentValue) <= 0) {
			pushed = this.splice(index, 0, toPush);
		}
	});

	if (!pushed) {
		pushed = Array.push.call(this, toPush);
	}

	return pushed;
}

//
// A-Star algorithm
//
function AStarSearch() {

}

AStarSearch.prototype.findPath = function(sourceNode, targetNode) {
	var foundPath = false;
	var path = null;

	if (!!sourceNode && !!targetNode) {
		var closedList = [];
		var openList = new PriorityArray();

		sourceNode.costFromStart.set(0);
		sourceNode.estimatedCostToGoal.set(sourceNode.getEstimatedCostToReachNode(targetNode));
		sourceNode.pathParent.set(null);

		openList.push(sourceNode);
		while (!foundPath && openList.length>0) {
			var n = openList.shift();
			foundPath = n == targetNode;
			if (!foundPath) {
				var neighbours = n.neighbours.get();
				if (neighbours != null) {
					neighbours.forEach(function(currentValue, index, source) {
						var isOpen = openList.indexOf(currentValue)>=0;
						var isClosed = closedList.indexOf(currentValue)>=0;
						var costFStart = n.getCostFromStart() + n.getCost(nn);

						if ((!isOpen && !isClosed) || costFStart < currentValue.getCostFromStart()) {
							currentValue.setPathParent(n);
							currentValue.setCostFromStart(costFStart);
							currentValue.setEstimatedCostToGoal(currentValue.getEstimatedCost(goalNode));
							
							if (isClosed) {
								closedList = closedList.splice(closedList.indexOf(currentValue), 1);
							}
							
							if (!isOpen) {
								openList.push(currentValue);
							}
						}
					});

					closedList.push(n);
				}
			}
		}
	}

	if (found) {
		path = targetNode.getPath();
	}

	return path;
}

