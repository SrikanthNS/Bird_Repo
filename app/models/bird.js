var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BirdSchema   = new Schema({
	"name": {
		"type": "string",
		"description": "English bird name"
	},
	"family": {
		"type": "string",
		"description": "Latin bird family name"
	},
	"continents": {
		"type": "array",
		"description": "Continents the bird exist on",
		"minItems": 1,
		"items": { "type": "string" },
		"uniqueItems": true
	},
	"added": {
	"type": "string",
	"description": "Date the bird was added to the registry. Format YYYY-MM-DD"
	},
	"visible": {
	"type": "boolean",
	"description": "Determines if the bird should be visible in lists"
	}
	
});

module.exports = mongoose.model('Birds', BirdSchema);
