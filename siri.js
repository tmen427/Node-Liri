require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require('moment');      



//  A function that uses the ombdapi API (You do not need to pass in a parameter that is just for the dowhatissays function below)
function moviethis (parameter) {
var movie = "";


if (parameter) {
    movie = parameter; 
}
else if ( process.argv.slice(3).join(" ") ) {           //slices the process.argv after the second spot and rejoins as a string
    movie =  process.argv.slice(3).join(" "); 
}
else if (! process.argv.slice(3).join(" "))  {        // the defalut movie
    movie = "Mr.Nobody";
}

var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
axios.get(queryUrl).then(
    
    function (response) {  
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("Imdb Rating: " + response.data.Ratings[0].Value);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value)
      console.log("Country produced: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
      })
      .catch(function (error) {
        console.log(error);
      });
   

    
}

// A function that uses the bandsintown API. 
function concertthis (parameter) {
var artist = "";
if (parameter) {            //Either use a paramater or process.argv to get user input
    artist = parameter;
}    
else if ( process.argv.slice(3).join(" ") ) {
    artist =  process.argv.slice(3).join(" "); 
}

var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
axios.get(queryUrl)
    .then(
    function(response) {
        console.log(response.data[0].venue.name);
        console.log(response.data[0].venue.city + ", " + response.data[0].venue.region);

       
        var responseTime = response.data[0].datetime;
        console.log(moment(responseTime).format('MM/DD/YYYY') );
    })
    .catch(function (error) {
        console.log('Cannot find that artist!');
      });

}

// A function that uses the Spotify API (You do not need to pass in a parameter)
function spotifythissong (parameter) {

    
    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);
    var songname = " ";
    
    if (parameter) {
        songname = parameter; 
    }
    else if (process.argv.slice(3).join(" ") ) {
        songname = process.argv.slice(3).join(" "); 
    }
    // if there is not parameter passed in and no process.argv then "The sign" is the default song
    
    else if (parameter === undefined && !process.argv.slice(3).join(" ") ) {
        songname = "The Sign";   
    }
    
    //console.log(songname);
    spotify
    .search({ type: 'track', query: songname, limit: 1 })
    .then(function(response) {
    
       console.log("Artist name: " + response.tracks.items[0].album.artists[0].name) //artist name
       console.log("Song name: " + response.tracks.items[0].name);  //song name
       console.log("Album name: " + response.tracks.items[0].album.name);  //album name
      // console.log(response.tracks.items[0].preview_url);      //link to the song (preview)
       console.log("Link to the song: " + response.tracks.items[0].external_urls.spotify);  
    })
    .catch(function(err) {
      console.log("Cannot find the song!");
    });
}

// a function that uses  the values from random.txt and allows you to use those values parameters ...
function dowhatitsays () {
    var fs = require('fs'); 
    fs.readFile('random.txt', "utf8", function(error,data) {
        if(error) {
            console.log(error);
        }

        var file = data.split(",");   //this splits the string from the random.txt file and makes it into an array
        console.log()
        
        function useRandom (parameter) {           //a function that allows you to call the above three functions 
        if (parameter ==='spotify-this-song') {
          return eval(spotifythissong(file[1]));     //passing in values into the above functions INSTEAD of using process.argv!!
        }
        else if (parameter ==='movie-this') {
            return eval(moviethis(file[3]));
        }
         if (parameter ==="concert-this") {
            return eval(concertthis(file[5]));
           
        }

    }
       
       // useRandom(file[4]);    you can check the random.txt to see what the values are the pass them into the function...
        useRandom("spotify-this-song");
    }) }


    // finally, a function that calls converts whatever you input in node and calls the correct function (because javascript functions cannot have dashes in them)
var callFunction = function (yourfunction) {
    if(yourfunction==='movie-this') {
        return eval(moviethis()); 
    }
    else if (yourfunction==='concert-this') {
        return eval(concertthis());
    }
    else if (yourfunction==='spotify-this-song') {
        return eval(spotifythissong());
    }
    else if (yourfunction==='do-what-it-says') {
        return eval(dowhatitsays());
    }
}

callFunction(process.argv[2]);
             
//testing if the above functions work....activate the below function calls below, in the terminal just type 'node siri.js'
//spotifythissong("I want it that way");
//spotifythissong();
//concertthis('Coolio');
//moviethis('Last Samurai');