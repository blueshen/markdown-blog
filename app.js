
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , md = require('github-flavored-markdown').parse;;

var app = express();
var markdown_engine = function(path, options, fn){
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    try {
      var html = md(str);
      html = html.replace(/\{([^}]+)\}/g, function(_, name){
        return options[name] || '';
      })
      fn(null, html);
    } catch(err) {
      fn(err);
    }
  });
};

app.engine('md',markdown_engine);
app.engine('mkd', markdown_engine);
app.engine('markdown', markdown_engine);

app.configure(function(){
  app.set('title',"Markdown Blog");
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir:'./public/uploads'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/markdown/:name',routes.content);
app.get('/', routes.index);
app.get('/upload',routes.upload);
app.post('/upload-file',routes.uploadfile);
app.get('/users', user.list);
app.get('/fail', function(req, res){
  res.render('missing', { title: 'Markdown Example' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

