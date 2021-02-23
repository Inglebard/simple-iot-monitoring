const fs = require('fs');
const passport = require('passport');
const express = require('express')
const global_data = require('./config/data.js');

const app = express();
const port = 3000;

const bodyParser_config= require('./config/bodyParser.js');
const session_config= require('./config/session.js');
const flash_config= require('./config/connect-flash.js');
const passport_config= require('./config/passport.js');
const express_config= require('./config/express.js');

bodyParser_config.init(app);
session_config.init(app);
flash_config.init(app);
passport_config.init(app);
express_config.init(app);

var iotsArray={};

function getIots() {
	try {
		var iotsRaw = fs.readFileSync(global_data.IOTS_PATH);
		iotsArray = JSON.parse(iotsRaw);
	} catch (err) {}
}
function setIots() {
	fs.writeFileSync(global_data.IOTS_PATH, JSON.stringify(iotsArray));
}
getIots();


app.get('/login', (req,res) => {
	res.render('login', {error_message:req.flash('error')});
});
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }), (req, res) => {
  res.redirect('/');
});
app.get('/logout',(req, res) => {
  req.logout();
  res.redirect('/login');
});


app.get('/ping', (req, res) => {
		if(req.query.key == global_data.PING_KEY  && req.query.name)
		{
			var iotInfo={}
			iotInfo.name = req.query.name;
			iotInfo.type = req.query.type;
			iotInfo.location = req.query.location;
			iotInfo.description = req.query.description;
			iotInfo.lastseen = Date.now();
			iotsArray[iotInfo.name]=iotInfo;
      setIots();
      res.json({ response: 'OK' });

		}
    else {
      res.json({ response: 'NOK' });
    }
});


app.get('/', (req, res) => {
  
		if (!req.user) {
			res.redirect('/login');
      return;
		}
      
    var render ={};
    render.iotsArray=iotsArray;
    render.currentTimestamp=Date.now();
    render.warning_delay=global_data.WARNING_DELAY;
    render.error_delay=global_data.ERROR_DELAY;
  	res.render('index', {render:render});
})
app.get('/delete/:iotname', (req, res) => {  
		if (!req.user) {
			res.redirect('/login');
      return;
		}
    
		if(typeof req.params.iotname != "undefined" && typeof iotsArray[req.params.iotname]!="undefined" )
		{
			delete iotsArray[req.params.iotname];
      setIots();
		}
    res.redirect("/");
})

app.listen(port, () => {
	  console.log(`App listening at http://localhost:${port}`)
})

