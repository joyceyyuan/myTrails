//import the model

const Trail = require("../models/trail");

module.exports = {
    create,
    delete: deleteReview,
    edit,
    update
};

function create(req, res) {
    console.log(req.user, " <- this is req.user from review controller create")
    console.log(req.params.id, " <- params trail id");
    console.log(req.body, " <- the contents of the form aka the review");
    // First we have to find the trail
    Trail.findById(req.params.id, function (err, trail) {
    // then we need to add the review (aka req.body) to that trails reviews array
    console.log(trail, " <- trail");
    // user centric CRUD!
    // req.user comes from passport! and it is the userDocument of the logged client
    req.body.user = req.user._id;
    req.body.userName =req.user.name;
    req.body.email = req.user.email;
    console.log(req.body, " <- updated contents of the form aka the review");
    trail.reviews.push(req.body); // <- mutating (changing) the document
    // that we found from the database,
    // so when we do that, we need to tell the database we changed something,
    // so we have to save the document
    trail.save(function(err) {
        console.log(trail,'<-this is trail document review controller create function');
        console.log(trail.reviews,'this is the reviews of trail')
        res.redirect(`/trails/${trail._id}`);
        });
    });
}


function deleteReview(req, res) {
    Trail.findOne({'reviews._id': req.params.id, 'reviews.user': req.user._id}, function(err, trail) {
        if (!trail || err) return res.redirect(`/trails/${trail._id}`);
        trail.reviews.remove(req.params.id);
        trail.save(function(err) {
            res.redirect(`/trails/${trail._id}`);
        });
    });
}


function edit(req, res) {
    Trail.findOne({'reviews._id': req.params.id}, function(err, trail) {
    // Find the review subdoc using the id method on Mongoose arrays
        const review = trail.reviews.id(req.params.id);
    // Render the reviews/edit.ejs template, passing to it the review
    res.render('reviews/edit', {review});
    });
}

function update(req, res) {
    Trail.findOne({'reviews._id': req.params.id}, function(err, trail) {
      // Find the review subdoc using the id method on Mongoose arrays
      const reviewSubdoc = trail.reviews.id(req.params.id);
      // Ensure that the review was created by the logged in user
      if (!reviewSubdoc.user.equals(req.user._id)) return res.redirect(`/trails/${trail._id}`);
      // Update the content of the review
      reviewSubdoc.content = req.body.content;
      reviewSubdoc.rating = req.body.rating;
      reviewSubdoc.activityDid = req.body.activityDid;
      console.log(reviewSubdoc,'<-reviewsubdoc')
      // Save the updated trail
      trail.save(function(err) {
        // Redirect back to the trail's show view
        res.redirect(`/trails/${trail._id}`);
      });
    });
  }