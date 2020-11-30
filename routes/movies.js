const express = require('express');
const router= express.Router();
const Movie = require('../models/movies');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkMovieOwner = require('../utils/checkMovieOwner');

//Index
router.get("/", async (req,res) => {
	console.log(req.user);
	try {
		const movies = await Movie.find().exec()
		res.render("movies", {movies});
	} catch(err){
		console.log(err);
		res.send("You broke it ../ index")
	}
	
})
//Create
router.post("/", isLoggedIn, async (req,res) => {
	const genre = req.body.genre.toLowerCase();
	const newMovie = 
	{
		title: req.body.title,
		description: req.body.description,
		producer: req.body.producer,
		productionCompany: req.body.productionCompany,
		date: req.body.date,
		genre: genre,
		color: !req.body.color,
		image_link: req.body.image_link,
		owner: {
			id: req.user._id,
			username:req.user.username
		},
		upvotes: [req.user.username],
		downvotes: []
	}
	try{
		const movie = await Movie.create(newMovie)
		//console.log(movie);
		req.flash("success", "Movie Created")
		res.redirect("/movies/" + movie._id);
	}catch(err){
		req.flash("error", "Error creating movie")
		res.redirect("/movies")
		// res.send("You broke it ../ movies POST")
		
	}
})
//New
router.get("/new", isLoggedIn, async (req,res) => {
	res.render("movies_new");
})
//Search
router.get("/search", async (req,res) => {
	try{
		const movies = await Movie.find({
			$text: {
				$search: req.query.term
			}
		});
		res.render("movies", {movies});
	}catch(err){
		console.log(err)
		res.send("Broken search")
	}
})

//Genre 
router.get("/genre/:genre", async(req,res) => {
	// Check if the given genre is valid 
	const validGenres = ["action", "horror", "comedy", "drama", "romance", "animation", "crime","documentary", "sports"];
	if(validGenres.includes(req.params.genre.toLowerCase())){
		// If yes, continue 
		const movies = await Movie.find({genre: req.params.genre}).exec();
		res.render("movies", {movies});
	}else{
		// If no, send an error
		res.send("Please enter a valid genre");
	}
	
	
})

//vote 
router.post("/vote", isLoggedIn, async (req,res) => {
	console.log("Request body: ",req.body);
	console.log(req.user.username); 
	
	const movie = await Movie.findById(req.body.movieId)
	const alreadyUpVoted = movie.upvotes.indexOf(req.user.username) // will be -1 if not found 
	const alreadyDownVoted = movie.downvotes.indexOf(req.user.username) //Will be -1 if not found
	
	let response = {}
	//Voting logic 
	if(alreadyUpVoted === -1 && alreadyDownVoted === -1){ // Has not voted 
		if(req.body.voteType === "up"){ //Upvoting 
			movie.upvotes.push(req.user.uername);
			movie.save()
			response = {message:"Upvote tallied", code: 1}
		}else if(req.body.voteType ==="down"){ //Downvoting
			movie.downvotes.push(req.user.uername);
			movie.save()
			response = {message:"Downvote tallied", code: -1}
		}else { //Error
			response = {message:"Error 1", code:"err"}
		}
	}else if (alreadyUpVoted>=0) { // Already upvoted
		if(req.body.voteType === "up"){
			movie.upvotes.splice(alreadyUpVoted,1);
			movie.save()
			response = {message:"Upvote removed", code: 0}
		}else if (req.body.voteType ==="down"){
			movie.upvotes.splice(alreadyUpVoted,1);
			movie.downvotes.push(req.user.username);
			movie.save()
			response = {message:"Changed to downvote", code: -1}
		}else { //Error
			response = {message:"Error 2", code:"err"}
		}
		movie.save()
	}else if (alreadyDownVoted>=0) {// Already downvoted
		
		if(req.body.voteType === "up"){
			movie.downvotes.splice(alreadyDownVoted,1);
			movie.upvotes.push(req.user.username);
			movie.save()
			response = {message:"Changed to upvote", code: 1}
		}else if (req.body.voteType ==="down"){
			movie.downvotes.splice(alreadyDownVoted,1);
			movie.save()
			response = {message:"Downvote removed", code: 0}
		}else { //Error
			response = {message:"Error 3", code:"err"}
		}
		
	}else { // Error
		
		response = {message:"Error 4", code:"err"}
	}
	
	//Update score
	response.score = movie.upvotes.length - movie.downvotes.length;
	
	
	res.json(response);
})

//Show
router.get("/:id", async (req,res) => {	
	try{
		const movie = await Movie.findById(req.params.id).exec()
		const comments = await Comment.find({movieId: req.params.id});
		res.render("movies_show", {movie, comments});
	} catch(err){
		console.log(err)
		res.send("You broke it ... /movies/:id ")
	}
	
})
//Edit
router.get("/:id/edit", checkMovieOwner, async(req,res) => {
	const movie= await Movie.findById(req.params.id).exec();
	res.render("movies_edit", {movie});
})
//Update
router.put("/:id", checkMovieOwner,async (req,res) => {
	const genre = req.body.genre.toLowerCase();
	const movieBody = {
		title: req.body.title,
		description: req.body.description,
		producer: req.body.producer,
		productionCompany: req.body.productionCompany,
		date: req.body.date,
		genre: genre,
		color: !req.body.color,
		image_link: req.body.image_link
		
	}
	try{
		const movie = await Movie.findByIdAndUpdate(req.params.id,movieBody,{new:true}).exec()
		req.flash("success", "Movie updated!")
		res.redirect(`/movies/${req.params.id}`)
	}catch(err){
		console.log(err)
		req.flash("error", "Error updating movie.");
		res.redirect("/movies");
	}
})

//Delete
router.delete("/:id", checkMovieOwner, async (req,res) => {
	try{
		const deletedMovie = await Movie.findByIdAndDelete(req.params.id).exec();
		req.flash("success", "Movie deleted!")
		res.redirect("/movies")
	}catch(err){
		console.log(err);
		req.flash("error", "Error deleting movie.")
		res.redirect("back");
	}
})

module.exports = router;

