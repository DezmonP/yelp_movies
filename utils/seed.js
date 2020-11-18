const Movie = require('../models/movies');
const Comment = require('../models/comment');


const movie_seeds = [
	{
		title: "Fast Five",
		description:" Fast Five (alternatively known as Fast & Furious 5[1] or Fast & Furious 5: Rio Heist[4]) is a 2011 American heist action film ",
		producer: "Neal H. Moritz,Vin Diesel,Michael Fottrell",
		productionCompany:"Original Film and One Race Films",
		date:"2011-04-15",
		genre:"action",
		color:true,
		image_link:"https://upload.wikimedia.org/wikipedia/en/0/0c/Fast_Five_poster.jpg"
	},
	{
		title: "X-Men: Apocalypse",
		description:"In the film, the ancient mutant En Sabah Nur / Apocalypse is inadvertently revived in 1983, and plans to wipe out the modern civilization and take over the world, leading the X-Men to try to stop him and defeat his team of mutants.",
		producer: "	Simon Kinberg,Bryan Singer,Hutch Parker,Lauren Shuler Donner",
		productionCompany:"	Marvel Entertainment,TSG Entertainment, Bad Hat Harry Productions,Kinberg Genre,The Donners' Company ",
		date:"2016-05-27",
		genre:"action",
		color:true,
		image_link:"https://upload.wikimedia.org/wikipedia/en/0/04/X-Men_-_Apocalypse.jpg"
	},
	{
		title: "Maze Runner ",
		description:"In the film, the ancient mutant En Sabah Nur / Apocalypse is inadvertently revived in 1983, and plans to wipe out the modern civilization and take over the world, leading the X-Men to try to stop him and defeat his team of mutants.",
		producer: "	Ellen Goldsmith-Vein, Wyck Godfrey, Marty Bowen, Lee Stollman",
		productionCompany:"	Gotham Group, Temple Hill Entertainment, TSG Entertainment",
		date:"2014-09-19",
		genre:"action",
		color:true,
		image_link:"https://upload.wikimedia.org/wikipedia/en/b/be/The_Maze_Runner_poster.jpg"
	}
	
]
const seed = async () => {
	
	// Delete all the current movies and comments 
	await Movie.deleteMany();
	console.log("Delted All The Movies")
	
	await Comment.deleteMany();
	console.log("Delted All The Movies")
	 
	// // Create three new movies 
	// for( const movie_seed of movie_seeds) {
	// 	let movie = await Movie.create(movie_seed);
	// 	console.log("created a new movie:", movie.title)
	// 	// Create a comment for each comic 
	// 	await Comment.create({
	// 		text:"I loved this Movie",
	// 		user: "Jane Doe",
	// 		movieId: movie._id
	// 	})
	// 	console.log("created a new movie")
	// }
	

}

module.exports = seed; 