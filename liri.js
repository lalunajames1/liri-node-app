require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var imdb = require('imdb');
var fs = require('fs');
var request = require("request");
var keys = require('./keys.js');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

if (command === "my-tweets"){
    mytweets();
} else if (command === "spotify-this-song") {
    spotifySearch(process.argv[3]);
} else if (command === "movie-this") {
    omdbSearch(process.argv[3]);
} else if (command === "do-what-it-says"){
    fsFun()
}


function mytweets(){
    var params = {screen_name: 'lalunajames'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            for(var i =0; i < tweets.length; i++){
                console.log("\n" + tweets[i].text + "\n Added: " + tweets[i].created_at);
            }
        }
    });
}

function spotifySearch(song){
    if(song === undefined){
        song = 'The Sign ace of base';
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if ( !err ) {
            //console.log(data.tracks.items[0])
            console.log('Song:   ' + data.tracks.items[0].name);
            console.log('Artist: ' + data.tracks.items[0].artists[0].name);
            console.log('Album:  ' + data.tracks.items[0].album.name);
            console.log('Preview URL: ' + data.tracks.items[0].preview_url);
        }       
    });

}

function omdbSearch(movie){
    if (movie === undefined){
        movie = 'Mr. Nobody';
       } 
        request("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy", function (error, response, body) {
     
            //console.log('error:', error); 
            //console.log('statusCode:', response && response.statusCode); 
            //console.log('body' + body); 
            console.log('Movie Title: ' + JSON.parse(body).Title); 
            console.log('Year ' + JSON.parse(body).Year);
            console.log('IMDB Rating ' + JSON.parse(body).imdbRating);
            console.log('Rotten Tomatoes Rating ' + JSON.parse(body).Ratings[1].Value);
            console.log('Produced in ' + JSON.parse(body).Country);
            console.log('Language of the movie' + JSON.parse(body).Language);
            console.log('Plot ' + JSON.parse(body).Plot);
            console.log('Actors ' + JSON.parse(body).Actors);
        });

}

function fsFun(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
          return console.log(error);
        }
        console.log(data);
        let dataArr = data.split(","); 
        let songName = dataArr.pop()
        spotifySearch(songName);   
      });



}