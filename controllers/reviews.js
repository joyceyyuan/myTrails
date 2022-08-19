//import the model

const Trail = require("../models/trail");

module.exports = {
    create,
    delete: deleteReview,
    edit,
    update
};

function create(req, res) {
    console.log(req.body, " <- the contents of the form aka the review");
    Trail.findById(req.params.id, function (err, trail) {
        console.log(trail, " <- trail");
        req.body.user = req.user._id;
        req.body.userName = req.user.name;
        req.body.email = req.user.email;
        console.log(req.body, " <- updated contents of the form aka the review");
        trail.reviews.push(req.body);
        trail.save(function (err) {
            console.log(trail, '<-this is trail document review controller create function');
            console.log(trail.reviews, 'this is the reviews of trail')
            res.redirect(`/trails/${trail._id}`);
        });
    });
}


function deleteReview(req, res) {
    Trail.findOne({ 'reviews._id': req.params.id, 'reviews.user': req.user._id }, function (err, trail) {
        if (!trail || err) return res.redirect(`/trails/${trail._id}`);
        trail.reviews.remove(req.params.id);
        trail.save(function (err) {
            res.redirect(`/trails/${trail._id}`);
        });
    });
}


function edit(req, res) {
    Trail.findOne({ 'reviews._id': req.params.id }, function (err, trail) {
        const review = trail.reviews.id(req.params.id);
        res.render('reviews/edit', { review });
    });
}

function update(req, res) {
    Trail.findOne({ 'reviews._id': req.params.id }, function (err, trail) {
        const reviewSubdoc = trail.reviews.id(req.params.id);
        if (!reviewSubdoc.user.equals(req.user._id)) return res.redirect(`/trails/${trail._id}`);
        reviewSubdoc.content = req.body.content;
        reviewSubdoc.rating = req.body.rating;
        reviewSubdoc.activityDid = req.body.activityDid;
        console.log(reviewSubdoc, '<-reviewsubdoc')
        trail.save(function (err) {
            res.redirect(`/trails/${trail._id}`);
        });
    });
}