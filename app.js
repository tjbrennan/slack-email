var express = require('express');
var bodyParser = require('body-parser');
var mailHook = require('./mailhook');

var app = express();
var port = process.env.PORT || 3000;


// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// set slack values
app.use(function (req, res, next) {
  res.locals.slack = {
    apiToken : process.env.SLACK_API_TOKEN,
    channels : process.env.SLACK_CHANNELS
  }

  next();
});


// email route
app.post('/email', mailHook);


// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});


app.listen(port, function () {
  console.log('Slack email hook listening on port ' + port);
});
