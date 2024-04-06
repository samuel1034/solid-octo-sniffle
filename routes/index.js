var express = require('express');
var router = express.Router();

/* GET home page. */

// request
// response
// next

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Programación 2, 2024-1',
    name: 'Kilber Hernández',
    dni: '27867062',
  });
});

module.exports = router;