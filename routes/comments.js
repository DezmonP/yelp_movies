const express = require('express');
const router= express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Movie = require('../models/movies');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require("../utils/checkCommentOwner")


// New Comment - Show Form
router.get("/new", isLoggedIn, (req,res) => {
	res.render("comments_new", {movieId: req.params.id})
})
//Create Comment - Acutlaly Update DB
router.post("/", isLoggedIn, async (req,res) => {
	//Create the comments
	try {
		const comment = await Comment.create({
			user: {
				id: req.user._id,
				username:req.user.username
			},
			text: req.body.text,
			movieId: req.body.movieId
		});
		req.flash("success", "Comment created!")
		res.redirect(`/movies/${req.body.movieId}`)
	}catch(err){
		console.log(err)
		req.flash("error", "Error creating comment.");
		res.redirect("/movies");
	}
})
//Edit Comment - Show the edit form 
router.get("/:commentId/edit",checkCommentOwner,async(req,res) => {
	try{
		const movie = await Movie.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		
		res.render("comment_edit", {movie,comment})
	}catch(err){
		console.log(err);
	
		res.redirect("/movies");
	}
})
//Update Comment- Actuallly update in DB
router.put("/:commentId", checkCommentOwner,async(req,res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true});
		req.flash("success", "Comment edited!");
		res.redirect(`/movies/${req.params.id}`);
	}catch(err){
		req.flash("error", "Error editing comment.");
		res.redirect("/movies");
	}
})
//Delete Comment - Delete the Comment 
router.delete("/:commentId", checkCommentOwner, async(req,res) => {
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();
		req.flash("success", "Comment deleted!");
		res.redirect(`/movies/${req.params.id}`);
	}catch(err){
		console.log(err)
		req.flash("error", "Error deleting comment.");
		res.redirect("/movies");
	}

})


module.exports = router;