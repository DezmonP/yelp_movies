//This code is for my want to watch movies button
//==========================
//SELECT ELEMENTS
//==========================
const wantBtn = document.getElementById("wantToWatch_btn");

//==========================
//Helper Functions
//==========================

const sendMovie = async () => {
	console.log("send movie function")
	const options ={
		method: "POST",
		header: {
      		'Content-Type': 'application/json'
    	}
	}
	options.body = JSON.stringify({
			movieId
			
		})
	console.log(movieId)
	await fetch("/movies/want", options)
	.then(data => {
		console.log(data);
		return data.json();
	})
	.catch(err => {
		console.log(err)
	})
}

wantBtn.addEventListener("click", async function(){
	console.log("Step 3")
	sendMovie();
})