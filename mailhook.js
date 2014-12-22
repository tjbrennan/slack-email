var MailParser = require('mailparser').MailParser; // https://github.com/andris9/mailparser
var request = require('request');
var sanitize = require('sanitize-filename');
var through = require('through');

module.exports = function (req, res, next) {
  var mailparser = new MailParser({
    debug : false,
    streamAttachments : false
  });

  // mailparser.on('attachment', function (attachment) {
  //   var formData = {
  //     token : res.locals.slack.apiToken,
  //     file : ,
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
  //       return next(error);
  //     }
  //
  //     console.log(response.statusCode, body);
  //
  //   });
  // });

  mailparser.on('end', function (mailObject) {
    console.dir(mailObject);

    request({
      uri : 'https://slack.com/api/files.upload',
      method : 'POST',
      formData : {
        token : res.locals.slack.apiToken,
        content : mailObject.text,
        filename : sanitize(mailObject.subject, { replacement : '_' }),
        title : mailObject.subject,
        initial_comment : 'To: ' + mailObject.headers.to +
                          '\nFrom: ' + mailObject.headers.from +
                          '\nSubject: ' + mailObject.subject,
        channels : res.locals.slack.channels
      }
    }, function (error, response, body) {
      if (error) {
        return next(error);
      }

      console.log(response.statusCode, body);

    });

    mailObject.attachments.forEach(function (attachment) {
      console.log(attachment.content);
      var formData = {
        token : res.locals.slack.apiToken,
        file : attachment.content,
        filename : attachment.generatedFileName,
        title : attachment.fileName,
        channels : res.locals.slack.channels
      };

      request({
        uri : 'https://slack.com/api/files.upload',
        method : 'POST',
        formData : formData
      }, function (error, response, body) {
        if (error) {
          return next(error);
        }

        console.log(response.statusCode, body);

      });
    })

  });

  mailparser.write(req.body.message);
  mailparser.end();
}
