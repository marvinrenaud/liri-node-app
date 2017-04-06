// Pull in the exports from the keys file
var majorKeyAlert = require('./keys.js');
var twitterKeys = majorKeyAlert.twitterKeys;

// Pull npm packages that we will / might need
var request = require('request');
var spotify = require('spotify');

// Capture the user's action input to figure out what they want to do
var userAction = process.argv[2];

// Capture the user's search input even if it is multiple words
var inputArray = process.argv;
var newUserInput = "";

for (var i = 3; i < inputArray.length; i++) {

    if (i > 3 && i < inputArray.length) {
        newUserInput = newUserInput + "+" + inputArray[i];
    } else {
        newUserInput += inputArray[i];
    }
}

console.log("Checking user input array: " + newUserInput);

// Have a switch in place to run a function based on their action input
switch (userAction) {
    case "omdb-this-movie":
        omdb();
        break;
    case "spotify-this-song":
        spot();
        break;
    default:
        instructions();
}

// Run the function to query OMDB
function omdb() {
    // Construct the api call based on user's input
    var queryBase = "http://www.omdbapi.com/?t=";
    var queryURL = queryBase + newUserInput;
    // Then run a request to the OMDB API with the movie specified
    request(queryURL, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the content and recover just the key elements
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country Produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value);
        }
    });


}


// Run the function to query spotify
function spot() {
    spotify.search({
        type: 'track',
        query: newUserInput
    }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // Extract just the key elements from the json response
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Artist(s) Name: " + data.tracks.items[0].artists[0].name);
        console.log("Link to Song: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album Name: " + data.tracks.items[0].album.name);

    });
}

// Run the function to provide instructions if user puts in a userAction that is not supported
function instructions() {
    console.log("Hi there! This Node.js app has limited functionality.");
    console.log("You can do two things:");
    console.log("1) Query movie titles on OMDB using the action term 'omdb-this-movie' followed by the movie title.");
    console.log("2) Query song titles on Spotify using the action term 'spotify-this-song' followed by the song title.");
    console.log("The syntax would look something like this 'node liri.js omdb-this-movie scarface'");
    console.log("Thanks for playing!");
}
