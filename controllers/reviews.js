//import the model

const Trail = require("../models/trail");

module.exports = {
    create,
    delete: deleteReview,
};

function create(req, res) {
    console.log(req.user, " <- this is req.user")
    console.log(req.params.id, " <- params trail id");
    console.log(req.body, " <- the contents of the form aka the review");
    // First we have to find the trail
    Trail.findById(req.params.id, function (err, trailDocument) {
    // then we need to add the review (aka req.body) to that trails reviews array
    // console.log(trailDocument, " <- trailDocument");
    // user centric CRUD!
    // req.user comes from passport! and it is the userDocument of the logged client
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    trailDocument.reviews.push(req.body); // <- mutating (changing) the document
    // that we found from the database,
    // so when we do that, we need to tell the database we changed something,
    // so we have to save the document
    trailDocument.save(function(err) {
        res.redirect(`/trails/${req.params.id}`);
        });
    });
}


async function deleteReview(req, res){
    try{
        const trailDocument = await Trail.findOne({
            'reviews._id': req.params.id,
            'reviews.user': req.user._id
        });
        // no logged in user
        if(!trailDocument) return res.redirect('/trails');
        // remove the review from the trails array
        // .remove is mongoose function that takes an id of a document in that array
        trailDocument.reviews.remove(req.params.id);
        await trailDocument.save();
        //redirect back to the page they came from!
        res.redirect(`/movies/${trailDocument._id}`)
    } catch(err){
        res.send(err)
    }
}

