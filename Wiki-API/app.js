const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////////// RequestTaegetting A Specific articles ///////////////////////////////////////////////////////

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////// RequestTaegetting A Specific articles ///////////////////////////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.updateOne(
    {title: articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err){
      if (!err){
        res.send("Successfully updated the selected article.");
      } else {
        res.send(err);
      }
    });
})

.patch(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.updateOne(
    {title: articleTitle},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully updated the selected article.");
      } else {
        res.send(err);
      }
    });
})

.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.deleteOne({title: articleTitle}, function(err){
    if (!err) {
      res.send("Successfully deleted the selected article");
    } else {
      res.send(err);
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
