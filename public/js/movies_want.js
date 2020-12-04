
//==========================
//SELECT ELEMENTS
//==========================
const wantBtn = document.getElementById("wantToWatch_btn");

//==========================
//Helper Functions
//==========================

const sendMovie = async () => {
	
	const options ={
		method: "POST",
		header: {
      		'Content-Type': 'application/json'
    	}
	}
	options.body = JSON.stringify({
			movieId
		})
	await fetch("/movies/want", options)
	.then(data => {
		return data.json();
	})
	.catch(err => {
		console.log(err)
	})
}

wantBtn.addEventListener("click", async function(){
	sendMovie();
})