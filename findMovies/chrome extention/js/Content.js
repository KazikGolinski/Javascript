let movies = {};

async function findMedia(title, callback) {
	let request = new XMLHttpRequest();
	title = title.toString().replace(/\s/g, '+');
	var url = `https://apis.justwatch.com/content/titles/pl_PL/popular?language=en&body=%7B%22page_size%22:5,%22page%22:1,%22query%22:%22${title}%22,%22content_types%22:[%22show%22,%22movie%22]%7D`;
	//console.log(title);
	request.open('GET', url);

	request.setRequestHeader('authority', 'apis.justwatch.com');
	request.setRequestHeader('accept', 'application/json, text/plain, */*');
	//request.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
	//request.setRequestHeader("sec-gpc", "1");
	//request.setRequestHeader("origin", "https://www.justwatch.com");
	//request.setRequestHeader("sec-fetch-site", "same-site");

	request.send();
	request.onload = () => {
		if (request.status === 200) {
			//console.log('success!!');
			callback(request.responseText);
		} else {
			console.log(`error${request.status} ${request.statusText}`);
		}
	};
}

let submitBtn = document.querySelector('#submit-title');
let getInput = document.querySelector('#Title');
let titles = [];
if (document.getElementById('Title')) {
	document.getElementById('Title').focus();
}

if (submitBtn) {
	getInput.addEventListener('keyup', event => {
		if (getInput.value == '' || getInput.value == null) {
			try {
				var elem = document.getElementsByClassName('suggest_box')[0];
				console.log(elem);
				elem.remove();
				return;
			} catch {}
		}
		findMedia(getInput.value, function (result) {
			titles = [];
			data = JSON.parse(result);
			let movies = data['items'];

			movies.forEach(element => {
				titles.push(element['title']);
			});

			//console.log(titles);
			event.preventDefault();
			try {
				var elem = document.getElementsByClassName('suggest_box')[0];
				console.log(elem);
				elem.parentNode.removeChild(elem);
			} catch {}
			//suggestions div
			const sugDiv = document.createElement('div');
			sugDiv.classList.add('suggest_box');
			//console.log(titles);
			for (const element of movies) {
				//console.log(element['title']);
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

				//console.log(element['offers']);

				let netflixDone = false;
				let HBODone = false;
				let primeDone = false;

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
										element['urls']['standard_web'],
										'_blank'
									);
								};
								newSug.appendChild(img);
								netflixDone = true;
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
								netflixDone = true;
								primeDone = true;
							}
						}
						//
					});
				} else {
					//console.log('undefined');
				}
			}

			const sugList = document.querySelector('#box');
			sugList.appendChild(sugDiv);
		});

		//result.innerHTML = titles;
	});
}
