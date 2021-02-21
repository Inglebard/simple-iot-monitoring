
const flash = require('connect-flash');

module.exports.init = function(app)
{
	app.use(flash());
}