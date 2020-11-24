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
		console.log(comment)
		res.redirect(`/movies/${req.body.movieId}`)
	}catch(err){
		console.log(err)
		res.send("Broker again")
	}
})
//Edit Comment - Show the edit form 
router.get("/:commentId/edit",checkCommentOwner,async(req,res) => {
	try{
		const movie = await Movie.findById(req.params.id).exec();
		const comment = await Comment.findById(req.params.commentId).exec();
		console.log("movie:", movie)
		console.log("comment:", comment);
		res.render("comment_edit", {movie,comment})
	}catch(err){
		console.log(err);
		res.send("Broken Comment Edit GET")
	}
})
//Update Comment- Actuallly update in DB
router.put("/:commentId", checkCommentOwner,async(req,res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true});
		console.log(comment);
		res.redirect(`/movies/${req.params.id}`);
	}catch(err){
		console.log(err)
		res.send("Broke comment PUT")
	}
})
//Delete Comment - Delete the Comment 
router.delete("/:commentId", checkCommentOwner, async(req,res) => {
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId).exec();
		console.log(comment);
		res.redirect(`/movies/${req.params.id}`);
	}catch(err){
		console.log(err);
		res.send("Broken agian comment DELETE")
	}

})


module.exports = router;