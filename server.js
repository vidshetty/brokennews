const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 1998;
const NewsAPI = require('newsapi');
const { query } = require("express");
const apikey = '7a0df6124ad8442c9d463874b682c6c2';
const newsapi = new NewsAPI(apikey);

app.use(express.static("public"));
app.use(express.json());

app.get("/v2/top-headlines",(req,res) => {
    newsapi.v2.topHeadlines({
        sources: "",
        q: "",
        category: req.query.category,
        language: "en",
        country: "in"
      }).then(response => {
        res.send(response);
      });
});

app.get("/v2/everything",(req,res) => {
  newsapi.v2.everything({
      sources: "",
      q: req.query.q,
      language: "en",
      page: req.query.page
    }).then(response => {
      res.send(response);
    });
});

  
app.post("/weather",(req,res) => {
    var params = {
      access_key: 'eb4fa2e874649411163137a936afcc33',
      query: req.body.data
    }
    axios.get('http://api.weatherstack.com/current',{params})
    .then(response => {
      res.send(response.data);
    }).catch(error => {
      console.log(error);
    });
}); 

app.listen(PORT,() => {
    console.log("Server listening on port " + PORT);
});