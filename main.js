var express = require('express');
var db = require('mongode2')('personal', 'blog');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

/*------ Routing Table ------*/
router.get('/posts', function(req, res) {
  db.read(function(err, docs) {
    err ? (
      console.log(err),
      res.status = 404,
      res.send(err)
    ) : res.send(docs);
  });
});

router.post('/newPost', bodyParser.json(), function(req, res) {
  db.create(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.status = 504;
      res.send(err);
    } else {
      console.log(result);
      res.status = 200;
      res.send("ok");
    }
  })
});

router.get('/featured', function(req, res) {
  db.read({featured: true}, function(err, docs) {
    err ? (
      res.status = 504,
      res.send(err)
    ) : res.send(docs);
  })
});

router.get('/deletePost/:id', function(req, res) {
  db.delete({created_at: req.params.id}, function(err) {
    err ? (
      res.status = 504,
      res.send(err)
    ) : res.send("ok");
  });
});

app.use('/blog/service', router);

module.exports = app;
