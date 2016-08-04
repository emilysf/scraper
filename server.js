//npm packages
var cheerio = require('cheerio');
var request = require('request');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var express = require('express');

var app = express();

app.use(express.static('app'));

//body parser
app.use(bodyParser.urlencoded({
	extended: false
}));

//handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//database
var databaseUrl = "news";
var collections = ["articles"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  	console.log('Database Error:', err);
});


app.get('/', function(req, res) {
	//res.render('home');



  request("https://www.buzzfeed.com/", function (error, response, html) {
  
  var $ = cheerio.load(html);

  // an empty array to save the data that we'll scrape
  var result = [];

    $('h2.lede__title').each(function(i, element){
  		
  		var title = $(this).text();

		// scrapes and concatinates content p tags from each article adding a space inbetween p tags within an article
		$('p.lede__kicker').each(function(j, element) {
			
		var content = $(this).text();
		

		result.push({
			title:title,
			content:content
  	    });

  	    });
  	   
	});
 
	

	db.articles.insert(result, function(err, docs){
    	if (err) throw err;
    	
		db.articles.find({}, function(err, docs){
			if (err) throw err;
			// render the index page and pass the data to handlebars
			res.render('home',  {
				result: result
			}); 
		});
	
  	});


});
});

app.get('/addComments/:id', function(req, res) {

  var comment = req.body;

  db.articles.update({"title": comment.dataTitle}, {$set: {comments: {comment: comment.comment, title: comment.dataTitle}}}, function(err, edited){
    res.send(edited);
  });
});


// mark a book as having been read
app.get('/deleteComments/:id', function(req, res) {
 
	var deleteComment = req.body;

   db.articles.update({"title": comment.dataTitle}, {$pull: {comments: {comment: comment.deleteComment, title: comment.dataTitle}}}, function(err, edited){
    res.send(edited);
  });

});

//port
app.listen(3000, function(){
	console.log('App running on port 3000!');

});
