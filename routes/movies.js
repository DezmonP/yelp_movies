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
		}
	}
	try{
		const movie = await Movie.create(newMovie)
		//console.log(movie);
		res.redirect("/movies/" + movie._id);
	}catch(err){
		console.log(err);
		res.send("You broke it ../ movies POST")
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
		res.redirect(`/movies/${req.params.id}`)
	}catch(err){
		console.log(err)
		res.send("you broke the ../movies/id PUT")
	}
})

//Delete
router.delete("/:id", checkMovieOwner, async (req,res) => {
	try{
		const deletedMovie = await Movie.findByIdAndDelete(req.params.id).exec();
		console.log("Deleted:", deletedMovie);
		res.redirect("/movies")
	}catch(err){
		console.log(err);
		res.send("Broken... /movies/id DELETE");
	}
})

module.exports = router;

