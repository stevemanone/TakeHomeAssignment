const express = require('express')
const path = require('path')
const axios = require('axios');
const pg = require('pg');
const app = express();

const PORT = process.env.PORT || 5000
const connectionString = process.env.DATABASE_URL
const API_KEY = "bbb0e77b94b09193e6f32d5fac7a3b9c"
const VERSION = 3

const client = new pg.Client({
  connectionString: connectionString,
})
client.connect()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

  app.get('/', function(req, res) {
  res.render('pages/index')
  })

  app.get('/Problem1', function(req, res) {
  res.render('pages/Problem1')
  })

  app.get('/Problem2', function(req, res) {
  res.render('pages/Problem2')
  })

  //This path actually queries API and returns results.
  app.get('/addmovies', function (req, res) {
        var movieIds = new Array();

        axios.get(`https://api.themoviedb.org/${VERSION}/movie/now_playing?api_key=${API_KEY}&language=en-US&region=GR`)
            .then(response => {
                  response.data.results.forEach(function (entry) {
                  //Push movies into movieIds array.
                  movieIds.push(entry.id)
                  }
                )


  movieIds.forEach(function(movie){
  //For each of the movies, query the API for the crew information.

  axios.get(`https://api.themoviedb.org/${VERSION}/movie/${movie}?api_key=${API_KEY}&language=en-US&append_to_response=credits`)

    .then(movieDetails => {
      movieDetails.data.credits.crew.forEach(function(person){

          //If the person has the job of 'director', then add the information
          //into the database.
          if (person.job === 'Director') {
            axios.get(`https://api.themoviedb.org/${VERSION}/person/${person.id}?api_key=bbb0e77b94b09193e6f32d5fac7a3b9c`)
              .then (personDetails => {


                    let Movievalues = [`${movieDetails.data.id}`,`${movieDetails.data.title}`,`${movieDetails.data.original_title}`,`${movieDetails.data.overview}`, `${personDetails.data.id}`]


                    let directorValues = [`${personDetails.data.id}`, `${personDetails.data.name}`,`http://www.imdb.com/name/${personDetails.data.imdb_id}`]

                    client.query(
                     'INSERT INTO directors (id, name, imdb_link) values ($1, $2, $3) ;'

                     ,
                     directorValues,
                    (err, res) => {
                      console.log(err, res);
                    })

                    client.query(
                     'INSERT INTO movies (id, title , original_title , description  ,director_id ) values ($1, $2, $3, $4, $5) ;'

                     ,
                     Movievalues,
                    (err, res) => {
                      console.log(err, res);
                    })

                    //Insert values into movies and directors databases.

                  res.redirect('/db');
                }).catch(error => {
                console.log(error)
                res.redirect('/db');
              })
            }
          })
        }).catch(error => {
          console.log(error);
          res.redirect('/db');
        });
      })
    }).catch(error => {
    console.log(error);
    res.redirect('/db');
  });
});

  //This path queries the databases, and sends the rows to the
  //pages/db ejs file for rendering.
  app.get('/db', function (req, res) {
      client.query('SELECT movies.title, movies.original_title, movies.description, directors.name, directors.imdb_link FROM movies join directors on directors.id = movies.director_id;', function(err, result) {
        if (err)
         { console.error(err); res.send("Error " + err); }
        else
         {
           console.log(result.rows)
           res.render('pages/db', {results: result.rows} );
         }
      });
  });



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//These are the two datases that are created.

//create table directors (id integer primary key, name varchar(100), imdb_link varchar(40));

//create table movies (id integer primary key, title  varchar(100) not null, original_title  varchar(100), description  text,director_id integer);
