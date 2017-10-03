require('zone.js/dist/zone-node');
require('reflect-metadata');

var express     = require('express');
var path        = require('path');
var ngUniversal = require('@nguniversal/express-engine');
var appServer   = require('../dist-server/main.bundle');

var app = express();

app.engine('html', ngUniversal.ngExpressEngine({
  bootstrap: appServer.AppServerModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../dist'));
app.use('/', express.static(path.join(__dirname, '../dist'), {index: false}));

app.get('*', function(req, res){
  res.render('index', {
    req: req,
    res: res,
  });
});

var port = 4000;
app.listen(port, function(){
  console.log('listening on http://127.0.0.1:'+port+'/');
});
