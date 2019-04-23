require("dotenv").config();
var keys = require("./keys.js");
const Spotify = require("node-spotify-api")
var axios = require("axios")
var spotify = new Spotify(keys.spotify);
var fs = require("fs")
var moment = require("moment")

var command = process.argv[2]

switch (command) {

  case "help":
  console.log("Hello, I am Liri. Currently, I am able to run the following functions via your command line:\n'concert-this', which will show the next concert for an artist you put in\n'spotify-this-song', which will display some info and a 30 second preview for a song you put in\n'movie-this', which will display info for a movie you put in\n'do-what-it-says', which will do something at random...how fun!")
  break

  case "concert-this":
  concert()
  break;

  case "spotify-this-song":
  spotifyFunction()
  break;

  case "movie-this":
  omdbFunction()
  break;

  case "do-what-it-says":
  justDoIt()
  break;
}

function concert(){
  var artist = process.argv.slice(3).join("+")
axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
  function(response){
    var date = moment(response.data[0].datetime).format("MM/DD/YYYY")
    console.log(`${response.data[0].lineup[0]} will be at ${response.data[0].venue.name} in ${response.data[0].venue.city}, ${response.data[0].venue.country} on ${date}.`)
  })

// bands in town functionality
// print venue name, venue location, and date (MM/DD/YYYY)
}

function spotifyFunction(){
  // spotify functionality
  // print artist, song name, preview link, album
  var song = process.argv.slice(3).join("+")
  spotify
  .search({ type: 'track', query: song })
  .then(function(response) {
    if(response.tracks.items[0].preview_url === null){
      console.log(`\nI'm sorry, but I couldn't get a preview of ${response.tracks.items[0].name} by ${response.tracks.items[0].artists[0].name} from their album ${response.tracks.items[0].album.name}...\n`)
    }
    else{
    console.log(`\nHere is 30 seconds of ${response.tracks.items[0].name} by ${response.tracks.items[0].artists[0].name} from their album ${response.tracks.items[0].album.name}: ${response.tracks.items[0].preview_url}\n(My apologies if that wasn't quite what you were looking for...)\n`)
    }
  
  
    
  })
  .catch(function(err) {
    console.log(err);
  });
}

function omdbFunction(){
  var movie = process.argv.slice(3).join("+")
  axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
  function(response) {
    console.log(`I found this movie. Is this what you were looking for? Maybe we should watch it soon.\n====================\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nMetascore: ${response.data.Metascore}\nIMDB Rating: ${response.data.imdbRating}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nStarring: ${response.data.Actors}`);
  }
);
if (movie === ""){
  console.log("I'm sorry, but it seems like you didn't put in a movie. Here's a suggestion if you're stuck:")
}
// print * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
}

function justDoIt(){
  // print whatever's in random.txt
}