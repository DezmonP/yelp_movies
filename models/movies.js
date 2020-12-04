const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: String,
	description: String,
	producer: String,
	productionCompany: String,
	actors: String,
	date: Date,
	genre: String,
	color: Boolean, 
	image_link: String,
	owner: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	upvotes: [String],
	downvotes: [String]
	
})

movieSchema.index({
	'$**': 'text'
})

module.exports = mongoose.model("movie", movieSchema);