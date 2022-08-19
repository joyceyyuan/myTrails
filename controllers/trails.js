const Trail = require("../models/trail");


module.exports = {
  create,
  new: newTrail,
  index,
  show,
  myTrails
};

function show(req, res) {
  Trail.findById(req.params.id, function (err, trailDocument) {
    console.log(trailDocument, " <- show page");
    res.render('trails/show', {
      title: 'Trail Details',
      trail: trailDocument
    });
  });
}

function index(req, res) {
  Trail.find({}, function (err, alltrailsInDatabase) {
    console.log(alltrailsInDatabase, '<- all the trails');
    if (err) {
      console.log(err, '<-error in Trail index controller')
    }
    res.render('trails/index', {
      trails: alltrailsInDatabase
    });
  }).sort({ length: 'asc' });
}

function newTrail(req, res) {
  res.render('trails/new');
}


function create(req, res) {
  console.log(req.body, '<-this is req.body');
  req.body.userName = req.user.name;
  req.body.email = req.user.email;
  req.body.user = req.user._id;
  console.log(req.body, '<-this is new req.body');
  Trail.create(req.body, function (err, trailDocument) {
    if (err) {
      console.log(err, ' <- err in the trail controller create function');
      return res.render('trails/new');
    }
    console.log(trailDocument, ' <- trail Document created in db');
    res.redirect('/trails'); 
  })
}

function myTrails(req, res) { 
  Trail.find ({user: req.user._id}, function(err, usersTrails){
    console.log(usersTrails,"<- this is usersTrails in trails controller myTrail function")
  res.render('trails/mytrails', {
    title:'My Trails',
    usersTrails
  });
  }).sort({ length: 'asc' });
}

