
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//TODO

mongoose.connect("mongodb+srv://abhaytomar2002:yDXDS15mg58zBTvG@cluster0.rvkou.mongodb.net/wikiDB?retryWrites=true&w=majority");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide title to your document."]
    },
    content: {
        type: String,
        required: [true, "Please provide content to your document."]
    }
});

const Article = mongoose.model("Article", articleSchema);

/////////Requests targeting all the articles///////////////

app.route("/articles")

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted to collection.");
            } else {
                res.send(err);
            }
        });
    });


/////////Requests targeting a specific article////////////////


app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No article with the provided title is found.");
        }
    });
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if (!err) {
                res.send("Successfully updated article!")
            }else{
                res.send(err)
            }
        }
    )
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err) {
                res.send("Successfully updated the article.");
            }else{
                res.send(err);
            }
        }
    )
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted.")
            }else{
                res.send(err);
            }
        }
    )
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});     