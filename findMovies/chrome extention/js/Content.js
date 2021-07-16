let $submitBtn = document.querySelector('#submit-title');
let $getInput = document.querySelector('#Title');

//call api and receive info about movies
async function findMediaJustWatch(title) {
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

async function findMediaPlex(title) {
	return new Promise((resolve, reject ) => {
		let request = new XMLHttpRequest();
		title = title.toString().replace(/\s/g, '+');
		var url = `http://192.168.1.3:32400/search?query=${title}&X-Plex-Token=Y9FqzLQScAF2JYrZEwsB`;

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
	var elem = document.querySelector('#box');
	while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

let plexUrls = {};
async function main(input) {
	
	// if the suggestion box isn't empty, clear it so when the input field is empty, theres no suggestions
	if (
		input.value == '' ||
		input.value == null
		) {
			try {
				clearSug();
				return;
			} catch {}
	
		}
	
	const justWatchResponse = await findMediaJustWatch(input.value);

	// parse the JSON and extract titles to an array
	justWatchDataJSON = await JSON.parse(justWatchResponse);
	let movies = justWatchDataJSON['items'];
	
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
		sugDiv.appendChild(newSug);

		const plexResponse = await findMediaPlex(element['title']);
		console.log(element['title']);
		plexDataJSON = await JSON.parse(plexResponse);
		
		
		

		let titleP = document.createElement('p');
		titleP.innerHTML = element['title'];
		titleP.classList.add('suggestion');
		titleP.onclick = function () {
			window.open(
				`https://www.justwatch.com${element['full_path']}`,
				'_blank'
			);
		};
		newSug.appendChild(titleP);

		let netflixDone = false;
		let HBODone = false;
		let primeDone = false;
		let plexDone = false;
		// add the streaming service labels and links
		
		try{
			if(plexDataJSON['MediaContainer']['Metadata']["0"]['ratingKey']){
				var img = new Image();
				plexUrl = plexDataJSON['MediaContainer']['Metadata']['0']['ratingKey'];
				img.src = 'icons/plex.png';
				img.setAttribute("url", `${plexDataJSON['MediaContainer']['Metadata']['0']['ratingKey']}`)
				img.onclick = function () {
					let url = this.getAttribute("url");
					window.open(
						
						`http://192.168.1.3:32400/web/index.html#!/server/233bf4dceb5fad882bc4c7c4c12d1765fb3479a2/details?key=%2Flibrary%2Fmetadata%2F${url}`,
						'_blank'
					);
				};
				newSug.appendChild(img);
				plexDone = true;
			}
		}catch{
			console.log("");
		}
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
		}
		

		if(
			netflixDone == false &&
			HBODone == false &&
			primeDone == false
		){
			var img = new Image();
			img.src = 'icons/pirate-bay.png';
			img.onclick = function () {
				window.open(
					`https://www.thepiratebay.org/search.php?q=${element['title'].toString().replace(/\s/g, '+')}`,
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

let timeout = null;
if ($submitBtn) {
	$getInput.addEventListener('keyup', () => {
		clearTimeout(timeout);

		// Make a new timeout set to go off in 1000ms (1 second)
		timeout = setTimeout(function () {
			main($getInput);
		}, 300);

		
	});
}
