require("dotenv").config();
var keys = require("./keys.js");
const Spotify = require("node-spotify-api");
var axios = require("axios");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var moment = require("moment");
var command = process.argv[2];
var input = process.argv.slice(3).join(" ");
var options = ["help", "concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]

if (!command) {
  console.log(`\nHello, I am Liri. Currently, I am able to run the following functions via your command line:\n"concert-this", which will show the next concert for an artist you put in\n"spotify-this-song", which will display some info and a 30 second preview for a song you put in\n"movie-this", which will display info for a movie you put in\n"do-what-it-says", which will do one of the three at random...how fun!`)
  console.log(`To start, type in "node liri.js (command you want to run) (item you wish to look up)". For example, try typing in "node liri.js help" and see what happens!\n`)
}

if(command && !options.includes(command)){
  console.log(`\nWHAT THE HECK DO YOU WANT ME TO DO? I CAN'T DO THAT!\n(translation: that's not one of my commands)\n\nIn case you forgot or weren't paying attention, my commands are:\n"concert-this", which will show the next concert for an artist you put in\n"spotify-this-song", which will display some info and a 30 second preview for a song you put in\n"movie-this", which will display info for a movie you put in\n"do-what-it-says", which will do one of the three at random...how fun!\n`)
}

switch (command) {

  case "help":
    console.log(`\nCongratulations! You're one step closer to using me properly. Now, type in "node liri.js" again, but instead of "help", put in "concert-this", "spotify-this-song", or "movie-this" followed by the name of a band/artist, song/artist, or movie respectively.\n\n(Or, if you're feeling lucky, type in "do-what-it-says" to do one of those three at random! You don't even need to put anything after it!)\n`)
    break

  case "concert-this":
    concert(input)
    break;

  case "spotify-this-song":
    spotifyFunction(input)
    break;

  case "movie-this":
    omdbFunction(input)
    break;

  case "do-what-it-says":
    justDoIt()
    break;
}

function concert(input) {
  if (!input) {
    console.log(`\nYou didn't put in an artist. Unless you're looking for performances of John Cage's 4'33", you should probably put in an artist to find concerts for.\n(P.S.: I don't have a suggestion here unlike the other commands)\n`)
    return false
  }
  axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
    function (response) {
      if (!response.data[0]) {
        console.log("\nI couldn't find upcoming shows for that artist. Either they're not touring right now, the artist/group is defunct, or you mistyped something/just put in a bunch of gibberish...\n")
        return false
      } else {
        var date = moment(response.data[0].datetime).format("MM/DD/YYYY")
        console.log(`\n${response.data[0].lineup[0]} will be at ${response.data[0].venue.name} in ${response.data[0].venue.city}, ${response.data[0].venue.country} on ${date}.\n`)
      }
    })
}

function spotifyFunction(input) {
  if (!input) {
    console.log("\nI saw the sign, and it opened up my eyes to see that you didn't input a song, so I'm going to pick one for you - the #1 song of 1994!")
    input = "ace of base"
  }
  spotify
    .search({
      type: 'track',
      query: input
    })
    .then(function (response) {
      if(!response.tracks.items[0]){
        console.log("\nThere are over 35 million songs and counting on Spotify, but somehow that is not one of them. Make sure you typed it correctly and then try again.\n");
        return false
      }
      if (!response.tracks.items[0].preview_url) {
        console.log(`\nI'm sorry, but I couldn't get a preview of ${response.tracks.items[0].name} by ${response.tracks.items[0].artists[0].name} from their album ${response.tracks.items[0].album.name}...\n`)
      } else {
        console.log(`\nHere is 30 seconds of ${response.tracks.items[0].name} by ${response.tracks.items[0].artists[0].name} from their album ${response.tracks.items[0].album.name}: ${response.tracks.items[0].preview_url}\n(My apologies if that wasn't quite what you were looking for...)\n`)
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function omdbFunction(input) {
  if (!input) {
    console.log("\nYou didn't put in a movie! Here's a suggestion to match what you put into the command line:")
    input = "Mr. Nobody"
  }
  axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
      if (!response.data.Title) {
        console.log("\nI didn't find anything for that movie. Either it doesn't exist, or no one bothered to put it on OMDB (or the title is too long, Mr. Wayans!). Also, make sure you typed in the title correctly.\n")
        return false
      } 
      else {
        console.log(`\nThis is what I found. Is this what you were looking for? Maybe we should watch it soon.\n====================\nTitle: ${response.data.Title}\nYear: ${response.data.Year}\nMetascore: ${response.data.Metascore}\nIMDB Rating: ${response.data.imdbRating}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nStarring: ${response.data.Actors}\n`);
      }
    })
}

function justDoIt() {
  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(",");
    command = dataArr[0];
    input = dataArr[1]
    switch (command) {

      case "concert-this":
        concert(dataArr[1])
        break;

      case "spotify-this-song":
        spotifyFunction(dataArr[1])
        break;

      case "movie-this":
        omdbFunction(dataArr[1])
        break;
    }
  })
}