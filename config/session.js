const session = require('express-session');

module.exports.init = function(app)
{
  app.use(session({ secret: 'appsecret', resave: false, saveUninitialized: false }));
}
