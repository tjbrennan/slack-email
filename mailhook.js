var MailParser = require('mailparser').MailParser; // https://github.com/andris9/mailparser
var request = require('request');
var sanitize = require('sanitize-filename');

module.exports = function (req, res, next) {
  var mailparser = new MailParser({
    debug : false,
    streamAttachments : false
  });

  // attachment stream is outdated and thus not supported.
  // https://github.com/andris9/mailparser/issues/91

  // mailparser.on('attachment', function (attachment) {
  //   var formData = {
  //     token : res.locals.slack.apiToken,
  //     file : attachment.stream,
  //     filename : attachment.generatedFileName,
  //     title : attachment.fileName,
  //     channels : res.locals.slack.channels
  //   };
  //
  //   request({
  //     uri : 'https://slack.com/api/files.upload',
  //     method : 'POST',
  //     formData : formData
  //   }, function (error, response, body) {
  //     if (error) {
  //       console.error(error);
  //     } else if (response.statusCode !== 200) {
  //       console.error(new Error(body));
  //     }
  //   });
  // });

  mailparser.on('end', function (mailObject) {
    var formData = {
      token : res.locals.slack.apiToken,
      content : mailObject.text,
      filename : sanitize(mailObject.subject, { replacement : '_' }),
      title : mailObject.subject,
      initial_comment : 'From: ' + mailObject.headers.from +
                        '\nTo: ' + mailObject.headers.to +
                        '\nSubject: ' + mailObject.subject,
      channels : res.locals.slack.channels
    }

    request({
      uri : 'https://slack.com/api/files.upload',
      method : 'POST',
      formData : formData
    }, function (error, response, body) {
      if (error) {
        return next(error);
      } else if (response.statusCode !== 200) {
        return next(new Error(body));
      }

      return res.status(200).end();
    });
  });

  mailparser.write(req.body.message);
  mailparser.end();
}
