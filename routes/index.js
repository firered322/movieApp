var express = require("express");
const request = require("request");
var router = express.Router();

const apiKey = "cc476d7bc72be5791be2027df59d8adb";
const apiBaseURL = "https://api.themoviedb.org/3";
const imageBaseURL = "http://image.tmdb.org/t/p/w300";
const nowPlayingURL = `${apiBaseURL}/movie/now_playing?api_key=${apiKey}`;

/* GET home page. */
router.get("/", function (req, res, next) {
  request.get(nowPlayingURL, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      let parsedData = JSON.parse(response.body);
      res.render("index", {
        parsedData: parsedData.results,
      });
    }
  });
});

router.get("/movie/:movieID", (req, res, next) => {
  request.get(
    `${apiBaseURL}/movie/${req.params.movieID}?api_key=${apiKey}`,
    (error, response) => {
      if (error) {
        console.log(error);
      } else {
        let parsedData = JSON.parse(response.body);
        res.render("single-movie", {
          movie: parsedData,
        });
      }
    }
  );
});

router.post("/search", (req, res, next) => {
  const searchQuery = encodeURI(req.body.movieSearch);
  const category = req.body.cat;

  const searchURL = `${apiBaseURL}/search/${category}?query=${searchQuery}&api_key=${apiKey}`;

  request.get(searchURL, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      let parsedData = JSON.parse(response.body);

      // handle person
      if (category == "person") {
        parsedData.results = parsedData.results[0].known_for;
      }

      res.render("index", {
        parsedData: parsedData.results,
      });
    }
  });
});

module.exports = router;
