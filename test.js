const app = require('./app');
const chaiHttp = require('chai-http');
const chai = require('chai');
const { Location } = require('./models/location');
const { Movie } = require('./models/movie');
const { Delmovie } = require('./models/delmovie');

chai.use(chaiHttp);
chai.should();

const agent = chai.request.agent(app);
let troyId;
let ramboId;
let delTroyId;
let delRamboId;

describe('============ Authenticate restricts access ============', () => {
  const requester = chai.request(app).keepOpen();

  after(() => {
    requester.close();
  })

  describe('GET /locations', () => {
    // Test to get all students record
    it('should get status 401', (done) => {
      requester
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('POST /createLocation', () => {
    // Test to get all students record
    it('should get status 401', (done) => {
      requester
        .post('/createLocation')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });
  });
  describe('DELETE /deleteLocation', () => {
    // Test to get all students record
    it('should get status 401', (done) => {
      requester
        .delete('/deleteLocation')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          done();
        });
    });
  });
});

describe('============ Login ====================================', () => {
  const requeste = chai.request(app).keepOpen();
  after(() => {
    requeste.close();
  })

  describe('POST /loginUser', function () {
    this.timeout(4000);
    it('should not login, missing name', (done) => {
      requeste
        .post('/loginUser')
        .send({ password: '12345678' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('POST /loginUser', function () {
    this.timeout(4000);
    it('should not login, wrong username', (done) => {
      requeste
        .post('/loginUser')
        .send({ name: 'romanka', password: '12345678' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('POST /loginUser', function () {
    this.timeout(4000);
    it('should not login, wrong password', (done) => {
      requeste
        .post('/loginUser')
        .send({ name: 'romankar', password: '123456' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe('POST /loginUser', function () {
    this.timeout(4000);
    it('should login', (done) => {
      agent
        .post('/loginUser')
        .send({ name: 'romankar', password: '12345678' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('currentUser');
          res.body.currentUser.should.equal('romankar');
          done();
        });
    });
  });
});

describe('============ Locations ================================', () => {

  before((done) => {
    Location.remove({}, (err) => {
      done();
    });
  });

  describe("GET /locations", () => {
    it('should get 0 locations', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  describe("POST /createLocation", () => {
    // Test to get all students record
    it('should not create location without loc field', (done) => {
      agent
        .post('/createLocation')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
    it('should add location \'desktop\'', (done) => {
      agent
        .post('/createLocation')
        .send({ loc: 'desktop' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.num_movies.should.equal(0);
          res.body.name.should.equal('desktop');
          done();
        });
    });
    it("should add location \'cupboard\'", (done) => {
      agent
        .post('/createLocation')
        .send({ loc: 'cupboard' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.num_movies.should.equal(0);
          res.body.name.should.equal('cupboard');
          done();
        });
    });
    it("should add location \'shelf\'", (done) => {
      agent
        .post('/createLocation')
        .send({ loc: 'shelf' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.num_movies.should.equal(0);
          res.body.name.should.equal('shelf');
          done();
        });
    });
    it('should not add location \'desktop\' again', (done) => {
      agent
        .post('/createLocation')
        .send({ loc: 'desktop' })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          done();
        });
    });
  });

  describe("GET /locations", () => {
    it('should get 3 locations, at [0] {name: \'desktop\' and num_movies: 0, ..}', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[0].num_movies.should.equal(0);
          res.body[0].name.should.equal('desktop');
          done();
        });
    });
  });

  describe("DELETE /deleteLocation", () => {
    // Test to get all students record
    it('should not delete any location without loc field', (done) => {
      agent
        .delete('/deleteLocation')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not delete a location that doesn\'t exist', (done) => {
      agent
        .delete('/deleteLocation')
        .send({ loc: 'noExisto' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should delete location \'desktop\'', (done) => {
      agent
        .delete('/deleteLocation')
        .send({ loc: 'desktop' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.num_movies.should.equal(0);
          res.body.name.should.equal('desktop');
          done();
        });
    });
  });

  describe("GET /locations", () => {
    it('should get 2 locations, at [0] {name: \'cupboard\' and num_movies: 0, ..}', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].num_movies.should.equal(0);
          res.body[0].name.should.equal('cupboard');
          done();
        });
    });
  });
});

describe('============ Movies ===================================', () => {

  before((done) => {
    Movie.remove({}).then(() => {
      return Delmovie.remove({})
    }).then(() => {
      done();
    });
  })

  describe("GET /movies/-/-/-/-", () => {
    it('should get 0 novies', (done) => {
      agent
        .get('/movies/-/-/-/-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  describe("POST /addMovie", () => {
    it('should not add movie without all fields', (done) => {
      agent
        .post('/addMovie')
        .send({ location: 'desktop' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not add movie with a non existent location', (done) => {
      agent
        .post('/addMovie')
        .send({ location: 'desktop', name: 'troy', bluray: true, dvd: false })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should add movie \'troy\' to location \'cupboard\', bluray: true, dvd: false', (done) => {
      agent
        .post('/addMovie')
        .send({ location: 'cupboard', name: 'troy', bluray: true, dvd: false })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('troy');
          res.body.location.should.equal('cupboard');
          res.body.bluray.should.equal(true);
          res.body.dvd.should.equal(false);
          res.body.should.have.property('_id');
          troyId = res.body._id;
          done();
        });
    });
    it('should add movie \'shrek\' to location \'cupboard\', bluray: true, dvd: true', (done) => {
      agent
        .post('/addMovie')
        .send({ location: 'cupboard', name: 'shrek', bluray: true, dvd: true })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('shrek');
          res.body.location.should.equal('cupboard');
          res.body.bluray.should.equal(true);
          res.body.dvd.should.equal(true);
          res.body.should.have.property('_id');
          done();
        });
    });
    it('should add movie \'rambo\' to location \'shelf\', bluray: false, dvd: true', (done) => {
      agent
        .post('/addMovie')
        .send({ location: 'shelf', name: 'rambo', bluray: false, dvd: true })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('rambo');
          res.body.location.should.equal('shelf');
          res.body.bluray.should.equal(false);
          res.body.dvd.should.equal(true);
          res.body.should.have.property('_id');
          ramboId = res.body._id;
          done();
        });
    });
  });

  describe("GET /movies/-/-/-/-", () => {
    it('should get 3 novies', (done) => {
      agent
        .get('/movies/-/-/-/-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          done();
        });
    });
  });

  describe("GET /movies/-/-/Y/-", () => {
    it('should get 2 novies', (done) => {
      agent
        .get('/movies/-/-/Y/-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          done();
        });
    });
  });

  describe("GET /movies/-/-/Y/Y", () => {
    it('should get 1 novies, named \'shelf\'', (done) => {
      agent
        .get('/movies/-/-/Y/Y')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].name.should.equal('shrek');
          done();
        });
    });
  });

  describe("GET /locations", () => {
    it('should get 2 locations, at [0] {name: \'cupboard\' and num_movies: 2, ..}', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].num_movies.should.equal(2);
          res.body[0].name.should.equal('cupboard');
          res.body[1].num_movies.should.equal(1);
          done();
        });
    });
  });

  describe("DELETE /deleteLocation", () => {
    it('should not delete location \'cupboard\', has movies', (done) => {
      agent
        .delete('/deleteLocation')
        .send({ loc: 'cupboard' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe("DELETE /movies/:id", () => {
    it('should not delete movie using non valid id', (done) => {
      agent
        .delete('/movies/34')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not delete movie using non existent id', (done) => {
      agent
        .delete('/movies/5f3b671c3052ab1d4448aba7')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should delete movie troy', (done) => {
      agent
        .delete(`/movies/${troyId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('troy');
          res.body.location.should.equal('cupboard');
          res.body.bluray.should.equal(true);
          res.body.dvd.should.equal(false);
          delTroyId = res.body._id;
          done();
        });
    });
    it('should delete movie rambo', (done) => {
      agent
        .delete(`/movies/${ramboId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('rambo');
          res.body.location.should.equal('shelf');
          res.body.bluray.should.equal(false);
          res.body.dvd.should.equal(true);
          delRamboId = res.body._id;
          done();
        });
    });
  });

  describe("DELETE /deleteLocation", () => {
    it('should delete location \'shelf\', has no movies', (done) => {
      agent
        .delete('/deleteLocation')
        .send({ loc: 'shelf' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.num_movies.should.equal(0);
          res.body.name.should.equal('shelf');
          done();
        });
    });
  });

  describe("GET /locations", () => {
    it('should get 1 locations, at [0] {name: \'cupboard\' and num_movies: 1, ..}', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].num_movies.should.equal(1);
          res.body[0].name.should.equal('cupboard');
          done();
        });
    });
  });

  describe("GET /movies/-/-/-/-, name = shrek", () => {
    it('should get 1 novies', (done) => {
      agent
        .get('/movies/-/-/-/-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].name = 'shrek';
          done();
        });
    });
  });
});

describe('============ Deleted Movies ===========================', () => {

  describe("GET /delmovies", () => {
    it('should get 2 novies', (done) => {
      agent
        .get('/delmovies')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          done();
        });
    });
  });

  describe("DELETE /delmovies/:id", () => {
    it('should not delete deleted movie using non valid id', (done) => {
      agent
        .delete('/delmovies/34')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not delete deleted movie, must be admin', (done) => {
      agent
        .delete(`/delmovies/${delTroyId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });

  describe("PUT /delmovies/:id", () => {
    it('should not recover deleted movie using non valid id', (done) => {
      agent
        .put('/delmovies/34')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should not recover deleted movie using non existent id', (done) => {
      agent
        .put('/delmovies/5f3b671c3052ab1d4448aba7')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should recover deleted movie \'troy\'', (done) => {
      agent
        .put(`/delmovies/${delTroyId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('troy');
          res.body.location.should.equal('cupboard');
          res.body.bluray.should.equal(true);
          res.body.dvd.should.equal(false);
          done();
        });
    });
    it('should recover deleted movie \'rambo\'', (done) => {
      agent
        .put(`/delmovies/${delRamboId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.name.should.equal('rambo');
          res.body.location.should.equal('shelf');
          res.body.bluray.should.equal(false);
          res.body.dvd.should.equal(true);
          done();
        });
    });
  });

  describe("GET /delmovies", () => {
    it('should get 0 novies', (done) => {
      agent
        .get('/delmovies')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(0);
          done();
        });
    });
  });

  describe("GET /movies/-/-/-/-, name = shrek", () => {
    it('should get 3 novies', (done) => {
      agent
        .get('/movies/-/-/-/-')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          done();
        });
    });
  });

  describe("GET /locations", () => {
    it('should get 2 locations, at [0] {name: \'cupboard\' and num_movies: 2, ..}', (done) => {
      agent
        .get('/locations')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].num_movies.should.equal(2);
          res.body[0].name.should.equal('cupboard');
          res.body[1].num_movies.should.equal(1);
          res.body[1].name.should.equal('shelf');
          done();
        });
    });
  });
});

describe('============ IMDB Info ================================', () => {
  describe('GET /imdb/rambo', function() {
    this.timeout(4000);
    it('should get imdb info', (done) => {
      agent
        .get('/imdb/rambo')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('Title');
          res.body.Title.should.equal("Rambo");
          res.body.should.have.property('Title');
          res.body.should.have.property('Year');
          res.body.should.have.property('Runtime');
          res.body.should.have.property('Genre');
          res.body.should.have.property('Director');
          res.body.should.have.property('Actors');
          res.body.should.have.property('imdbRating');
          done();
        });
    })
  })

  describe('GET /imdb/rambo', () => {
    it('should get imdb info faster', (done) => {
      agent
        .get('/imdb/rambo')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('Title');
          res.body.Title.should.equal("Rambo");
          res.body.should.have.property('Title');
          res.body.should.have.property('Year');
          res.body.should.have.property('Runtime');
          res.body.should.have.property('Genre');
          res.body.should.have.property('Director');
          res.body.should.have.property('Actors');
          res.body.should.have.property('imdbRating');
          done();
        });
    })
  })

  describe('GET /imdb/troy', function() {
    this.timeout(4000);
    it('should get imdb info', (done) => {
      agent
        .get('/imdb/troy')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('Title');
          res.body.Title.should.equal("Troy");
          res.body.should.have.property('Title');
          res.body.should.have.property('Year');
          res.body.should.have.property('Runtime');
          res.body.should.have.property('Genre');
          res.body.should.have.property('Director');
          res.body.should.have.property('Actors');
          res.body.should.have.property('imdbRating');
          done();
        });
    })
  })
});

describe('============ Logout ===================================', () => {
  describe('POST /logoutUser', function () {
    it('should logout', (done) => {
      agent
        .get('/logoutUser')
        .send()
        .end((err, res) => {
          res.should.have.status(200);
          agent.close()
          done();
        });
    });
  });
});