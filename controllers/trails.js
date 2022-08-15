const Trail = require("../models/trail");


module.exports = {
  new: newTrail,
  create,
  index,
  show
};

//creating a trail
function create(req, res) {
  // log out what the function needs
    console.log(req.body);
  // take the contents of the form (req.body), and add it to our database

    Trail.create(req.body, function (err, trailDocumentCreatedInTheDatabase) {
    if (err) {
        console.log(err, " <- err in the trail create controller");
        return res.render("trail/new.ejs");
    }

    console.log(trailDocumentCreatedInTheDatabase, " <- trail created in db");
    //normally redirect, but for testing
    // the response is always inside of the callback of the Trail model crud operation
    // because we want to confirm with the database our action before we respond to the client
    // aka the browser
    res.redirect(`/trail/${trailDocumentCreatedInTheDatabase._id}`);
    });
};

function index(req, res) {
  // List out the trails
    Trail.find({}, function (err, allOfTheMoviesInTheDatabase) {
    console.log(allOfTheMoviesInTheDatabase, " <- all the trails");
    if (err) {
        res.send("You have an error trying to find the trails, check the terminal");
    }
    // response should be inside the callback,
    // because this is after we got a response from the db that we
    // found all the trail
    res.render("trail/index.ejs", {
        trail: allOfTheTrailsInTheDatabase,
        }); 
    }); 
}

function newTrail(req, res) {
    res.render("trails/new.ejs");
}

