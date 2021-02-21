
const bodyParser = require("body-parser"); 

module.exports.init = function(app)
{
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(bodyParser.json());
}