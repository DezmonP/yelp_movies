//==========================
//SELECT ELEMENTS
//==========================
const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");

//==========================
//Helper Functions
//==========================
const sendVote = async (voteType) => {
	//Build fetch options 
	const options ={
		method: "POST",
		header: {
      		'Content-Type': 'application/json'
    	}
	}
	if(voteType ==="up"){
		options.body = JSON.stringify({
			voteType: "up",
			movieId
		})
	} else if(voteType === "down"){
		options.body = JSON.stringify({
			voteType: "down",
			movieId
		});
	}else {
		throw "voteType must be 'up' or 'down'"
	}
	
	// Send fetch request
	await fetch("/movies/vote", options)
	.then(data => {
		return data.json()
	})
	.then(res => {
		console.log(res)
	})
	.catch(err => {
		console.log(err)
	})
}
//==========================
//ADD EVENT LISTENERS
//==========================

upvoteBtn.addEventListener("click", async function(){
	sendVote("up")
})

downvoteBtn.addEventListener("click", async function(){
	sendVote("down")
})
