var campground = require('../models/campground');
var Comment = require('../models/comment');

//all the middleware foes here
var middlewareObj = {};

middlewareObj.checkCamgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		// does the user own the campground
		campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to edit this Campground");
					res.redirect('/campgrounds/' + foundCampground._id);
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('/login');
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				req.flash('error', 'Whoops something went wrong');
				res.redirect('back');
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to be logged in to do that');
		res.redirect('/login');
	}
};

middlewareObj.isLoggedin = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that');
	res.redirect('/login');
};

module.exports = middlewareObj;
