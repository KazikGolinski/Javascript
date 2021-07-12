
const cheerio = require('cheerio');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let movies = {};


function findMedia(title, callback){

    let request = new XMLHttpRequest();

    var url = "https://apis.justwatch.com/content/titles/pl_PL/popular?language=pl&body=%7B%22page_size%22:5,%22page%22:1,%22query%22:%22hobbit%22,%22content_types%22:[%22show%22,%22movie%22]%7D";

    request.open("GET", url);

    request.setRequestHeader("authority", "apis.justwatch.com");
    request.setRequestHeader("accept", "application/json, text/plain, */*");
    request.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    request.setRequestHeader("sec-gpc", "1");
    //request.setRequestHeader("origin", "https://www.justwatch.com");
    request.setRequestHeader("sec-fetch-site", "same-site");

    request.send();
    request.onload  = () => {
        if (request.status === 200){
            console.log('success!!');
            callback(request.responseText)
           
        }
        else{
            console.log(`error${request.status} ${request.statusText}`);

        }
        
    
    }
    
}



function checkStreamingPlatforms(link, callback) {
        let request = new XMLHttpRequest();
        let data;
        let margin;
        request.open("GET", link);
    
        request.setRequestHeader("authority", "zalukajvod.eu");
        request.setRequestHeader("accept", "*/*");
        request.setRequestHeader("x-csrf-token", "5CIXBUkEKcVvAEuKZ7G3ypI5IErJ2KipcdGNeOpW");
        request.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        request.setRequestHeader("x-requested-with", "XMLHttpRequest");
        request.setRequestHeader("sec-gpc", "1");
        request.setRequestHeader("sec-fetch-site", "same-origin");
        request.setRequestHeader("sec-fetch-mode", "cors");
    
    
        request.send();
        request.onload  = () => {
            if (request.status === 200){
                data = request.responseText;
                console.log(request.status)
                callback(data)
            }
            else{
                console.log(`error${request.status} ${request.statusText}`);
            }
        }
    }

findMedia('stranger things',function(result){

    data = JSON.parse(result);
    console.log(data);
    let movies = data['items'];
    let titles = [];
    movies.forEach(element => {
        titles.push(element['title']);
    });

    console.log(titles);
    movies['3']['offers'].forEach(element => {
        //console.log(element);
        if (element['provider_id'] == 8){
            console.log('Netlfix');
        }else if(element['provider_id'] == 280){
            console.log('HBO go');
        }
        else if(element['provider_id'] == 119){
            console.log('Prime Video');
        }
        //console.log(element[urls])
        
    });
    
});
