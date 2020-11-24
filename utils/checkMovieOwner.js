const Movie = require('../models/movies')

const checkMovieOwner = async (req,res,next) => {
	if(req.isAuthenticated()){//Check if the user is logged in
		//If logged in, check if they own the movie
		const movie= await Movie.findById(req.params.id).exec()
		// if owner, render the form to edit
		if(movie.owner.id.equals(req.user._id)){
			next();
		}else{// if not, redirect back to show page
			req.flash("error","You dont have permission to do that:")
			res.redirect('back')
		}
	}else{ //If not logged in, redirect to /login
		req.flash("error", "You must be logged in to do that")
		res.redirect('/login')
	}
}

module.exports = checkMovieOwner;