'use strict'
const log = console.log;
const request = require('request');
const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const { Movie } = require('./models/movie');
const { Location } = require('./models/location');
const { User } = require('./models/user');
const { Delmovie } = require('./models/delmovie');
const { ObjectID } = require('mongodb');
const ADMIN_ID = process.env.ADMIN_ID || "5ed2ad2d9a92d123009a287d";
const CACHE_MAXSIZE = 50;
const CACHE = { "movieList": [] };
let cacheSize = 0;
// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));

/*** Session handling **************************************/
// Create a session cookie
app.use(session({
  secret: 'oursecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 1200000,
    httpOnly: true
  }
}));



// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user).then((user) => {
      if (!user) {
        return Promise.reject()
      } else {
        req.user = user
        next()
      }
    }).catch((error) => {
      res.status(401).send({ message: "Unauthorized" })
    })
  } else {
    res.status(401).send({ message: "Unauthorized" })
  }
}

// A route to check if a use is logged in on the session cookie
app.get("/users/check-session", (req, res) => {
  if (req.session.user) {
    res.send({ currentUser: req.session.name });
  } else {
    res.status(401).send();
  }
});


// A route to login and create a session
app.post('/loginUser', (req, res) => {
  if (!("name" in req.body) || !("password" in req.body)) {
    res.status(400).send({ message: "request should have the user name and password" });
    return;
  }
  const name = req.body.name
  const password = req.body.password
  // Use the static method on the User model to find a user
  // by their email and password
  User.findByNamePassword(name, password).then((user) => {
    if (!user) {
      res.status(401).send({ message: "no such user" });
    } else {
      // Add the user's id to the session cookie.
      // We can check later if this exists to ensure we are logged in.
      req.session.user = user._id;
      req.session.name = user.name;
      res.send({ currentUser: user.name });
    }
  }).catch((error) => {
    res.status(400).send({ message: "Invalid name or password" });
  })
})

// A route to logout a user
app.get('/logoutUser', (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  })
})

app.get('/locations', authenticate, (req, res) => {
  Location.find().then((locs) => {
    res.status(200).send(locs);
  }, (err) => {
    res.status(500).send(err);
  })
})

app.post('/createLocation', authenticate, (req, res) => {
  if (!("loc" in req.body)) {
    res.status(400).send({ message: "request should have the locations name" });
    return;
  }
  const loc = new Location({
    name: req.body.loc,
    num_movies: 0
  });
  loc.save().then((loc) => {
    res.status(200).send(loc);
  }, (err) => {
    res.status(500).send(err);
  })
})

app.delete('/deleteLocation', authenticate, (req, res) => {
  if (!("loc" in req.body)) {
    res.status(400).send({ message: "request should have the locations name" });
    return;
  }
  const locName = req.body.loc;
  Location.findOneAndDelete({ name: locName, num_movies: 0 }).then((loc) => {
    if (!loc) {
      res.status(400).send({ message: "make sure location exists and is empty" });
    } else {
      res.status(200).send(loc);
    }
  }, (err) => {
    res.status(500).send(err);
  })
})

app.get('/delmovies', authenticate, (req, res) => {
  Delmovie.find().then((delmovs) => {
    res.status(200).send(delmovs);
  }, (err) => {
    res.status(500).send(err);
  });
})

app.delete("/delmovies/:id", authenticate, (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send({ message: "not a valid id" });  // if invalid id, definitely can't find resource, 404.
  } else if (req.session.user !== ADMIN_ID) {
    res.status(401).send({ message: "must be admin" });
  } else {
    Delmovie.findOneAndDelete({ _id: id }).then((mov) => {
      if (!mov) {
        res.status(404).send({ message: "no such movie" });
      } else {
        res.status(200).send(mov);
      }
    }).catch((err) => {
      res.status(500).send({ message: err });
    })
  }
})

app.put("/delmovies/:id", authenticate, (req, res) => {
  const id = req.params.id;
  let movName;
  let locName;
  let dvd;
  let blu;
  if (!ObjectID.isValid(id)) {
    res.status(404).send({ message: "not a valid id" });
    return;
  }
  Delmovie.findOneAndDelete({ _id: id }).then((mov) => {
    if (!mov) {
      res.status(404).send({ message: "no such movie" });
      return Promise.reject();
    } else {
      movName = mov.name;
      locName = mov.location;
      blu = mov.bluray;
      dvd = mov.dvd;
      return Location.find({ name: mov.location });
    }
  }).then((locs) => {
    if (locs.length === 0) {
      const locat = new Location({
        name: locName,
        num_movies: 1
      })
      return locat.save();
    } else {
      return Location.findOneAndUpdate({ name: locs[0].name }, { $inc: { num_movies: 1 } }, { returnOriginal: false });
    }
  }).then((loc) => {
    const mov = new Movie({
      name: movName,
      location: locName,
      location_id: loc._id,
      bluray: blu,
      dvd: dvd
    })
    return mov.save();
  }).then((mov) => {
    res.status(200).send(mov);
  }).catch((err) => {
    if (!res.headersSent) {
      res.status(500).send({ message: err });
    }
  })
})

app.get('/movies/:name/:loc/:blu/:dvd', authenticate, (req, res) => {
  const name = req.params.name;
  const loc = req.params.loc;
  const blu = req.params.blu;
  const dvd = req.params.dvd;
  const query = {};
  if (name !== '-') {
    query.name = { $regex: new RegExp(name), $options: 'i' };
  }
  if (loc !== '-') {
    query.location = loc;
  }
  if (blu !== '-') {
    query.bluray = true;
  }
  if (dvd !== '-') {
    query.dvd = true;
  }
  //log(query);
  Movie.find(query).then((movs) => {
    res.status(200).send(movs);
  }, (err) => {
    res.status(500).send(err);
  })
})

app.post("/addMovie", authenticate, (req, res) => {
  if (!('location' in req.body) || !('name' in req.body) || !('bluray' in req.body) || !('dvd' in req.body)) {
    res.status(400).send({ message: "request body is missing fields" });
    return;
  }
  Location.findOneAndUpdate({ name: req.body.location }, { $inc: { num_movies: 1 } }, { returnOriginal: false }).then((loc) => {
    if (!loc) {
      res.status(400).send({ message: "make sure location exists" });
      return Promise.reject();
    } else {
      const mov = new Movie({
        name: req.body.name,
        location: loc.name,
        location_id: loc._id,
        bluray: req.body.bluray,
        dvd: req.body.dvd
      })
      return mov.save();
    }
  }).then((mov) => {
    res.status(200).send(mov);
  }).catch((err) => {
    if (!res.headersSent) {
      res.status(500).send(err);
    }
  });
})

app.delete("/movies/:id", authenticate, (req, res) => {
  const id = req.params.id;
  let mov;
  if (!ObjectID.isValid(id)) {
    res.status(400).send({ message: "not a valid id" });  // if invalid id, definitely can't find resource, 404.
    return;
  }
  Movie.findOneAndDelete({ _id: id }).then((movi) => {
    mov = movi;
    if (!mov) {
      res.status(404).send({ message: "no such movie" });
      return Promise.reject();
    } else {
      return Location.findOneAndUpdate({ _id: mov.location_id }, { $inc: { num_movies: -1 } });
    }
  }).then((loc) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = date_ob.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let seconds = date_ob.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    const delMov = new Delmovie({
      name: mov.name,
      location: mov.location,
      location_id: mov.location_id,
      dvd: mov.dvd,
      bluray: mov.bluray,
      datedel: year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    })
    return delMov.save();
  }).then((delmovie) => {
    res.status(200).send(delmovie);
  }).catch((err) => {
    if (!res.headersSent) {
      res.status(500).send(err);
    }
  })
})

app.get('/imdb/:title', authenticate, (req, res) => {
  imdbMovie(req.params.title).then((movie) => {
    addToCache(req.params.title, movie);
    res.status(200).send(movie);
  }, (err) => {
    res.status(500).send(err);
  })
})

/*** Webpage routes below **********************************/
// Serve the build
app.use(express.static(__dirname + "/client/build"));

// All routes other than above will go to index.html
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 3001
app.listen(port, () => {
  log(`Listening on port ${port}...`)
})


// IMDB API helper
// fetch some data from IMDB
function imdbMovie(movie) {
  if (movie in CACHE) { // tag is in the cache
    //log("cache hit on tag name " + movie);
    return Promise.resolve(CACHE[movie]);
  }
  //log("cache miss on tag name " + movie);
  return new Promise((resolve, reject) => {
    const url = 'https://www.omdbapi.com/?t=' + movie + '&apikey=ee25783d';
    request({ url, json: true }, (error, response, body) => {
      if (error) {
        reject("Can't connect to server");
      } else if (response.statusCode !== 200) {
        reject('Issue with getting resource');
      } else {
        resolve(body);
      }
    })
  })
}

// Cache helper
// Adds movie with title movieName to CACHE.movieList
function addToCache(movieName, movie) {
  if (movieName in CACHE) { // tagName already in the cache
    let j = 0;
    while (CACHE.movieList[j] !== movieName) j++;
    CACHE.movieList.splice(j, 1); // delete movieName from where it was in the movieList
  } else if (cacheSize === CACHE_MAXSIZE) { // tagName not in the cache and cache full
    CACHE[movieName] = movie; // add movie to curTagName in the cache
    const tagRemove = CACHE.movieList.shift(); // evict LRU tag
    delete CACHE[tagRemove];
  } else { // tagName not in the cache but it isn't full
    CACHE[movieName] = movie;
    cacheSize++;
  }
  CACHE.movieList.push(movieName); // make movieName most recently used
}

module.exports = app;