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

