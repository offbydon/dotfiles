pm.collectionValidator_old = {
	defaults: function() {
		return {
		};
	},

	getFail: function(str) {
		return {
			"result": false,
			"reason": str
		};
	},

	validateJSON: function(json, options) {
		var correctDuplicates = !!(options && options.correctDuplicates);
		var duplicatesPresent = false;

		var ro = {
			"result": true,
			"reason": "Valid Collection"
		};

		//must have a root id
		if(!json.hasOwnProperty("id")) {
			return this.getFail("Must have  a collection ID");
		}

		var collectionId = json.id;

		var order = json.order;
		if(order) {
			if (!(order instanceof Array)) {
				return this.getFail("Order must be an array")
			}
		}
		else {
			return this.getFail("Order[] must be present in the collection");
		}
		var rootOrder = order;

		var totalOrder = _.clone(order);

		var allOrders = [order];


		var requests = json.requests;
		var requestIds = [];
		if(requests) {
			if (!(requests instanceof Array)) {
				return this.getFail("Requests must be an array")
			}

			var numRequest = requests.length;
			for(var i=0;i<numRequest;i++) {
				if(!requests[i].hasOwnProperty("id") || (typeof requests[i].id !== "string")) return this.getFail("Each request must have an ID (string)");
				if(!requests[i].hasOwnProperty("collectionId") || (typeof requests[i].collectionId !== "string")) return this.getFail("Each request must have an collectionId field");
				if(requests[i].collectionId !== collectionId) return this.getFail("Each request must have the same collectionId as the root collection object");
				if(_.intersection([requests[i].id],requestIds).length!==0) {
					duplicatesPresent = true;
				}
				requestIds.push(requests[i].id);
			}
		}
		else {
			return this.getFail("Requests[] must be present in the collection");
		}

		var folders = json.folders;
		if(folders) {
			if(!(folders instanceof Array)) {
				return this.getFail("Folders must be an array")
			}

			var numFolder = folders.length;
			for(var i=0;i<numFolder;i++) {
				if(!folders[i].hasOwnProperty("id") || (typeof folders[i].id !== "string")) return this.getFail("Each folder must have an ID (String)");
				if(!folders[i].hasOwnProperty("order") || !(folders[i].order instanceof Array)) return this.getFail("Each folder must have an order[] field");
				if(_.intersection(folders[i].order,totalOrder).length!==0){
					duplicatesPresent = true;
				}
				totalOrder = totalOrder.concat(folders[i].order);
				allOrders.push(folders[i].order);
			}
		}


		//check for request duplication across orders
		if(duplicatesPresent) {
			if(correctDuplicates) {
				var numOrders = allOrders.length;
				var j;
				for(var i=0;i<numOrders-1;i++) {
					for(j=i+1;j<numOrders;j++) {
						var intersection = _.intersection(allOrders[i],allOrders[j]);
						var numIntersections = intersection.length;
						if(intersection.length!==0) {
							for(var sec=0;sec<numIntersections;sec++) {
								var indexToSplice = allOrders[j].indexOf(intersection[sec]);
								allOrders[j].splice(indexToSplice,1);
							}
						}
					}
				}
			}
			else {
				return this.getFail("Request IDs cannot be duplicated");
			}
		}

		var diff = _.difference(requestIds, totalOrder);
		if(diff.length!==0) {
			var extraRequests = diff.join(", ");
			return this.getFail("Request count not matching. "+extraRequests+" are defined, but not present in any order array");
		}

		diff = _.difference(totalOrder, requestIds);
		if(diff.length!==0) {
			var missing = diff.join(", ");
			return this.getFail("Request count not matching. "+missing+" are included in the order, but are not defined");
		}

		ro.finalCollection = json;

		return ro;

	}
};