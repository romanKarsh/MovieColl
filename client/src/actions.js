import { getState, setState } from "statezero";

// Initialize all state paths used by app as empty.
export const setEmptyState = () => {
  setState("cookie", false);
  setState("currentUser", null);
  setState("loginForm", { name: "", password: "" });
  setState("movieForm", { name: "", location: "\"Location\"", bluray: false, dvd: false });
  setState("addMovieForm", { name: "", location: "\"Location\"", bluray: false, dvd: false });
  setState("locationForm", { location: "\"Location\"" });
  setState("locationList", []);
  setState("movieList", []);
  setState("deletedMovieList", []);
  setState("imdbInfo", {});
};

export const readCookie = () => {
  const url = "/users/check-session";
  fetch(url).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(json => {
    // console.log('setting cookie');
    if (json && json.currentUser) {
      setState("currentUser", json.currentUser);
    }
    setState("cookie", true);
  }).catch(error => {
    alert(error);
  });
};

export const getLocations = () => {
  const url = "/locations";
  fetch(url).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(json => {
    json = json.map((location) => location.name); // + "(" + location.num_movies + ")");
    const locs = ["\"Location\""].concat(json);
    setState("locationList", locs);
  }).catch(error => {
    alert(error);
  });
}

export const updateLoginForm = field => {
  const { name, value } = field;
  setState(`loginForm.${name}`, value);
};

export const updateForm = field => {
  const { className, name, value } = field;
  setState(`${className}.${name}`, value);
};

export const updateCheckBox = field => {
  const { className, name, checked } = field;
  setState(`${className}.${name}`, checked);
}

export const login = (e) => {
  e.preventDefault();
  // Create our request constructor with all the parameters we need
  const request = new Request("/loginUser", {
    method: "post",
    body: JSON.stringify(getState("loginForm")),
    headers: {
      'Accept': "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  // Send the request with fetch()
  fetch(request).then(res => {
    return res.json();
  }).then(json => {
    if (json.currentUser !== undefined) {
      setState("currentUser", json.currentUser);
    } else {
      alert("Invalid name or password");
    }
  }).catch(error => {
    alert("something went wrong :(");
  });
};

export const logout = () => {
  const url = "/logoutUser";
  fetch(url).then(res => {
    setEmptyState();
    setState("cookie", true);
  }).catch(error => {
    alert(error);
  });
};

export const clearSearch = () => {
  setState("movieList", []);
}

export const deleteLocation = () => {
  const loc = prompt("Please enter location to delete", "");
  if (loc == null) {
    return;
  } else if (loc === "" || loc === "\"Location\"") {
    alert("Enter a proper location");
    return;
  }
  const request = new Request('/deleteLocation', {
    method: 'delete',
    body: JSON.stringify({ loc }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request).then((res) => {
    if (res.status === 500) {
      alert("there was a server error, sorry :(");
    } else if (res.status === 400) {
      return res.json();
    } else {
      return res.json();
    }
  }).then((json) => {
    if ("message" in json) {
      alert(json.message);
    } else {
      const locationList = getState("locationList");
      setState("locationList", locationList.filter((location) => location !== loc));
    }
  }).catch((err) => {
    alert(err);
  })
}

export const addLocation = () => {
  const loc = prompt("Please enter new location name", "");
  if (loc == null) {
    return;
  } else if (loc === "" || loc === "\"Location\"") {
    alert("Enter a proper location");
    return;
  }
  const request = new Request("/createLocation", {
    method: "post",
    body: JSON.stringify({ loc }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  })

  fetch(request).then((res) => {
    if (res.status === 500) {
      alert("make sure the new location doesn't already exist");
    } else {
      const locationList = getState("locationList");
      setState("locationList", locationList.concat([loc]));
    }
  }, (err) => {
    alert(err);
  })
}

export const movieSearch = () => {
  const movieForm = getState("movieForm");
  const name = movieForm.name === "" ? '-' : movieForm.name;
  const loc = movieForm.location === "\"Location\"" ? "-" : movieForm.location;
  const blu = movieForm.bluray ? "Y" : "-";
  const dvd = movieForm.dvd ? "Y" : "-";
  const url = "/movies/" + name + "/" + loc + "/" + blu + "/" + dvd;
  fetch(url).then((res) => {
    if (res.status === 500) {
      alert("there was a server error, sorry :(");
    } else {
      return res.json();
    }
  }).then((json) => {
    setState("movieList", json);
  }).catch((err) => {
    alert(err);
  })
}

export const locationSearch = () => {
  const locationForm = getState("locationForm");
  if (locationForm.location === "\"Location\"") {
    alert("Please select a location");
  } else {
    fetch("/movies/-/" + locationForm.location + "/-/-").then((res) => {
      if (res.status === 500) {
        alert("there was a server error, sorry :(");
      } else {
        return res.json();
      }
    }).then((json) => {
      setState("movieList", json);
    }).catch((err) => {
      alert(err);
    })
  }
}

export const imdbSearch = (title) => {
  fetch('/imdb/' + title).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      alert("there was a server error, sorry :(");
    }
  }).then((json) => {
    setState("imdbInfo", json);
    // This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.
    window.scrollTo(0, 0);
  }).catch((err) => {
    alert(err);
  })
}

export const resetAddMovieForm = () => {
  setState("addMovieForm", { name: "", location: "\"Location\"", bluray: false, dvd: false });
}

export const addMovie = (e) => {
  e.preventDefault();
  const request = new Request('/addMovie', {
    method: "post",
    body: JSON.stringify(getState("addMovieForm")),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  })
  fetch(request).then((res) => {
    if (res.status !== 200) {
      alert("there was a server error, sorry :(");
    } else {
      return res.json();
    }
  }).then((json) => {
    resetAddMovieForm();
    alert("Added Movie\nName: " + json.name + "\nLocation: " +
      json.location + "\nbluray: " + json.bluray + " dvd: " + json.dvd);
  }).catch((err) => {
    alert(err);
  });
}

export const getDeletedMovies = () => {
  const url = "/delmovies";
  fetch(url).then(res => {
    if (res.status === 200) {
      return res.json();
    }
  }).then(json => {
    setState("deletedMovieList", json);
  }).catch(error => {
    alert(error);
  });
}

export const softDelete = (id) => {
  // from deletedMovieList
  const r = prompt("Are you sure (type yes)", "");
  if (r !== "yes") {
    return;
  }
  const request = new Request('/movies/' + id, {
    method: 'delete',
    body: JSON.stringify({}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request).then((res) => {
    if (res.status === 500) {
      alert("there was a server error, sorry :(");
    } else {
      return res.json();
    }
  }).then((json) => {
    const movieList = getState("movieList");
    setState("movieList", movieList.filter((movie) => movie._id !== id));
  }).catch((err) => {
    alert(err);
  })
}

export const permDelete = (id) => {
  // from deletedMovieList
  const r = prompt("Are you sure (type yes)", "");
  if (r !== "yes") {
    return;
  }
  const request = new Request('/delmovies/' + id, {
    method: 'delete',
    body: JSON.stringify({}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request).then((res) => {
    if (res.status === 200) {
      const deletedMovieList = getState("deletedMovieList");
      setState("deletedMovieList", deletedMovieList.filter((movie) => movie._id !== id));
    }
    return res.json();
  }).then((json) => {
    if ("message" in json) {
      alert(json.message);
    }
  }).catch((err) => {
    alert(err);
  });
}

export const recover = (id) => {
  // from deletedMovieList
  const request = new Request('/delmovies/' + id, {
    method: 'put',
    body: JSON.stringify({}),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  });

  fetch(request).then((res) => {
    if (res.status === 200) {
      const deletedMovieList = getState("deletedMovieList");
      setState("deletedMovieList", deletedMovieList.filter((movie) => movie._id !== id));
    }
    return res.json();
  }).then((json) => {
    if ("message" in json) {
      alert(json.message);
    }
  }).catch((err) => {
    alert(err);
  });
}