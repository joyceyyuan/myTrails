const Trail = require("../models/trail");


module.exports = {
  create,
  new: newTrail,
  index,
  show,
  edit,
  // update,
  // delete: deleteTrail
};

function show(req, res) {
	Trail.findById(req.params.id, function(err, trailDocument){
		console.log(trailDocument, " <- show page");
			res.render('trails/show', { 
        title: 'Trail Detail',
				trails: trailDocument
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

function create(req, res){
	console.log(req.body,'<-this is req.body');
  req.body.userName =req.user.name;
  req.body.email = req.user.email;
  req.body.user = req.user._id;
  console.log(req.body,'<-this is new req.body');
	Trail.create(req.body, function(err, trailDocumentCreatedInTheDatabase){
		if(err){
			console.log(err, ' <- err in the trail controller create function');
			return res.render('trails/new');
		}
		console.log(trailDocumentCreatedInTheDatabase, ' <- trail created in db');
		res.redirect('/trails/${trailDocumentCreatedInTheDatabase._id}`');
	})
}

function edit(req, res) {
  console.log(req.params.id, "<-req.params.id in Trails controller edit function")
  Trail.findById(req.params.id, function(err, trailDocument) {
    // Verify trail is "owned" by logged in user
    console.log(trailDocument,"<- this is trailDocument in Trail controller edit function")
    if (!trail.user.equals(req.user._id)) return res.redirect('/trails');
    res.render('trails/edit', {trails: trailDocument});
  });
}

// function update(req, res) {
//   Trail.findByIdAndUpdate(req.params.id, req.body, function(err, trail) {
//       res.redirect(`/trails/${req.user._id}`);
//   })
// }

// function deleteTrail(req, res) {
//   Trail.findOneAndDelete(
//     {_id: req.params.id, user: req.user._id}, function(err) {
//       res.redirect(`/trails/${req.user._id}`);
//     }
//   );
// }
