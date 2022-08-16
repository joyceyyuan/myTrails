const Trail = require("../models/trail");


module.exports = {
  create,
  new: newTrail,
  index,
  show
};

function show(req, res) {
	Trail.findById(req.params.id, function(err, trailDocument){
		console.log(trailDocument, " <- show page");
			res.render('trails/show', { 
				title: 'Trail Detail', 
				trail: trailDocument,
			});
		});
}

function index(req, res) {
    Trail.find({}, function(err, alltrailsInDatabase) {
		console.log(alltrailsInDatabase,'<- all the trails');
		if(err){
			console.log(err,'<-error in Trail index controller')
		}
		//response should be inside of callback
		//because this is after we got a response from the database that
		//we found all the trails
    res.render('trails/index', {
      trails: alltrailsInDatabase
		});
    }).sort({length: 'asc'});
}

function newTrail(req, res) {
	res.render('trails/new');
}

//creating a trail
function create(req, res){
	console.log(req.body);
  req.body.user = req.user._id;
	Trail.create(req.body, function(err, trailDocumentCreatedInTheDatabase){
		if(err){
			console.log(err, ' <- err in the trail create controller');
			return res.render('trails/new');
		}
		console.log(trailDocumentCreatedInTheDatabase, ' <- trail created in db');
		res.redirect('/trails/${trailDocumentCreatedInTheDatabase._id}`');
	})
}