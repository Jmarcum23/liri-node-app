var fs = require("fs"); //reads and writes files
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require ("node-spotify-api");

var cmdOne = process.argv[2];
var cmdTwo = process.argv[3];

for(i=4; i<process.argv.length; i++){
	cmdTwo += '+' + process.argv[i];
}

function switchStmt() {
  	switch (cmdOne) {
	    case 'my-tweets':
	    myTweets();
	    break;

	    case 'spotify-this-song':
	    spotifyThis();
	    break;

	    case 'movie-this':
	    movieThis();
	    break;

	    case 'do-what-it-says':
	    doWhatItSays();
	    break;

	    default:
	    console.log('LIRI doesn\'t know that');
  }
}

//Twitter
function myTweets(){
	console.log("Getting tweets");
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'jmarcumdesigns',
		count: 20
	};

	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + 
	            	tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};

//Spotify
function spotifyThis(){
	console.log("Getting song info");

	var spotify = new Spotify({
  	id: '90eeed3c8d1f4e8894cea5c4da8b0205',
 	secret: '85fbfbc2f1fd40b18834c14475605c68',
	});

	var searchTrack;
	if(cmdTwo === undefined){
		searchTrack = "The Sign";
	}else{
		searchTrack = cmdTwo;
	}

	spotify.search({type:'track', query:searchTrack}, function(err, data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};

//Movie This
function movieThis(){
	console.log("What's playing?");

	var searchMovie;
	if(cmdTwo === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = cmdTwo;
	};
	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json&apikey=40e9cece';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};


//Do What It Says
function doWhatItSays(){
	console.log("Looking at random.txt now");
	fs.readFile("./random.txt", "utf8", function(err, data) {
	    if(err){
     		console.log(err);
     	}else{

     	var dataArr = data.split(',');
        cmdOne = dataArr[0];
        cmdTwo = dataArr[1];

        for(i = 2; i < dataArr.length; i++){
            cmdTwo = cmdTwo + "+" + dataArr[i];
        };

		switchStmt();
		
    	};
    });
};

switchStmt();
