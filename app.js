// the packages we need
var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// DATABASE SETUP
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/birds'); 

var Bird     = require('./app/models/bird');

var port = process.env.PORT || 8080;    

var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Serving the request.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/birds')   
      // create a bird (accessed at POST http://localhost:8080/birds)
    .post(function(req, res) {
        console.log(req.body)
        var bird = new Bird();      
        if ('name' in req.body){
		bird.name = req.body.name;  
        }else{
		res.json({ status: '400 Bad request' });	
	}
	if ('continents' in req.body){
		bird.continents = req.body.continents.split(",")
	}else{
		res.json({ status: '400 Bad request' });
	}
	if ('family' in req.body){
		bird.family = req.body.family;  
        }else{
		res.json({ status: '400 Bad request' });	
	}
	var now = new Date();
	bird.added = now.toUTCString();;
	if ('visible' in req.body){
		bird.visible = true;
	}else{
		bird.visible = false;
	}	
	
        // save the bird and check for errors
        bird.save(function(err) {
            if (err)
                res.send(err);
            res.json({ status: '201 Created' });
        });
        
    })
    // get all the birds (accessed at GET http://localhost:8080/birds)
    .get(function(req, res) {
        Bird.find(function(err, birds) {
            if (err)
                res.send(err);	    
            res.json(birds);
        });
    });   

// on routes that end in /birds/:id
// ----------------------------------------------------
router.route('/birds/:id')
	//get the bird with that id (accessed at GET http://localhost:8080/birds/:id)
	.get(function(req, res) {
		Bird.findById(req.params.id, function(err, bird) {
		    if (err)
			res.send({ status: '404 Not found' });		    
		    res.json(bird, { status: '200 OK'} );
		});
	})
	// delete the bird with this id (accessed at DELETE http://localhost:8080/birds/:id)
	.delete(function(req, res) {
		Bird.remove({
		    _id: req.params.id
		}, function(err, bird) {
		    if (err)
			res.send({ status: '404 Not found' });

		    res.json({ status: '200 OK' });
		});
	});

-
// all of our routes will be prefixed with '/'
app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);
