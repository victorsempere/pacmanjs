function ArenaAStarNode() {
	AStarNode.call(this);

	this.cell = {
		set: function(cell) {
			this._cell = cell;
		},

		get: function() {
			return this._cell;
		}
	}	
}

ArenaAStarNode.prototype.getCostToReachNode = function(node) {
	int dev = Number.MAX_SAFE_INTEGER;

	if (node != null) {
		int c1 = cell.get();
		int c2 = node.cell.get();

		dev = Math.abs(c1 - c2);
	}

	return dev;
}

ArenaAStarNode.prototype.getEstimatedCostToReachNode = function(node) {
	return this.getCostToReachNode(node);
}
