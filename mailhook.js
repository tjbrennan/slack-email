var MailParser = require('mailparser').MailParser; // https://github.com/andris9/mailparser

module.exports = function (req, res, next) {
  var mailparser = new MailParser({
    debug : true,
    streamAttachments : false
  });

  mailparser.on('end', function (mailObject) {
    console.dir(mailObject);
    res.status(200).end();
  });

  mailparser.write(req.body.message);
  mailparser.end();
}
