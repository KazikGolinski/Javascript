let submitBtn = document.querySelector('#submit-title');
let getInput = document.querySelector('#Title');

//call api and receive info about movies
async function findMedia(title) {
	return new Promise((resolve, reject ) => {
		let request = new XMLHttpRequest();
		title = title.toString().replace(/\s/g, '+');
		var url = `https://apis.justwatch.com/content/titles/pl_PL/popular?language=en&body=%7B%22page_size%22:5,%22page%22:1,%22query%22:%22${title}%22,%22content_types%22:[%22show%22,%22movie%22]%7D`;

		request.open('GET', url);
		request.setRequestHeader('authority', 'apis.justwatch.com');
		request.setRequestHeader('accept', 'application/json, text/plain, */*');

		request.send();
		request.onload = () => {
			if (request.status === 200) {
				resolve(request.responseText);
			} else {
				reject(`error${request.status} ${request.statusText}`);
			}
		};
	});
}

//function removes displayed suggestions 
function clearSug() {
	var elem = document.getElementsByClassName('suggest_box')[0];
	console.log(elem);
	elem.remove();
}


async function main(getInput) {
	// if the suggestion box isn't empty, clear it so when the input field is empty, theres no suggestions
	if (getInput.value == '' || getInput.value == null) {
		try {
			clearSug();
			return;
		} catch {}
	}

	const response = await findMedia(getInput.value);

	// parse the JSON and extract titles to an array
	dataJSON = await JSON.parse(response);
	let movies = dataJSON['items'];

	// if the suggestion box isn't empty, clear it
	try {
		clearSug();
	} catch {}

	// div containing list movies
	const sugDiv = document.createElement('div');
	sugDiv.classList.add('suggest_box');
	for (const element of movies) {
		// add element to the list of movies
		let newSug = document.createElement('li');
		newSug.classList.add('suggestion-box');
		newSug.onclick = function () {
			window.open(
				`https://www.justwatch.com${element['full_path']}`,
				'_blank'
			);
		};
		sugDiv.appendChild(newSug);

		let titleP = document.createElement('p');
		titleP.innerHTML = element['title'];
		titleP.classList.add('suggestion');
		newSug.appendChild(titleP);

		let netflixDone = false;
		let HBODone = false;
		let primeDone = false;

		// add the streaming service labels and links
		if (typeof element['offers'] != 'undefined') {
			element['offers'].forEach(element => {
				//console.log(element);
				if (element['provider_id'] == 8) {
					if (netflixDone == false) {
						var img = new Image();
						img.src = 'icons/netflix.jpg';
						img.onclick = function () {
							window.open(
								element['urls']['standard_web'],
								'_blank'
							);
						};
						newSug.appendChild(img);
						netflixDone = true;
					}
				} else if (element['provider_id'] == 280) {
					if (HBODone == false) {
						var img = new Image();
						img.src = 'icons/HBOgo.jpg';
						img.onclick = function () {
							window.open(
								element['urls']['standard_web']+'/#play',
								'_blank'
							);
						};
						newSug.appendChild(img);
						HBODone = true;
					}
				} else if (element['provider_id'] == 119) {
					if (primeDone == false) {
						var img = new Image();
						img.src = 'icons/prime.jpg';
						img.onclick = function () {
							window.open(
								element['urls']['standard_web'],
								'_blank'
							);
						};
						newSug.appendChild(img);
						primeDone = true;
					}
				}
			});
		}else if(
			netflixDone == false &&
			HBODone == false &&
			primeDone == false
		){
			var img = new Image();
			img.src = 'icons/torrents.png';
			img.onclick = function () {
				window.open(
					`https://solidtorrents.net/search?q=${element['title']}`,
					'_blank'
				);
			};
			newSug.appendChild(img);
		}
	}
	// attach the ready movie list to the HTML file
	const sugList = document.querySelector('#box');
	sugList.appendChild(sugDiv);
}



// focus keyboard on input field on startup
if (document.getElementById('Title')) {
	document.getElementById('Title').focus();
}


if (submitBtn) {
	getInput.addEventListener('keyup', event => {
		main(getInput);
	});
}
