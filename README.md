slack-email
===========

Slack email hook proof of concept.


This integration uses the free [Mail2webhook](https://www.mail2webhook.com/) Heroku addon
to provide an email address that will `POST` to your web server. The server then uses the
Slack API to upload the email text as a file. Attachments are not yet supported due to the
mailparser node module stream incompatibility.

Mail2webhook will set the `MAIL2WEBHOOK_EMAIL` config var in your app. Two other config vars
are needed for use by Slack: `SLACK_API_TOKEN` and `SLACK_CHANNELS` formatted according to
the [files.upload](https://api.slack.com/methods/files.upload) API call.

Attachment support may be added when the stream is updated or a workaround is found.
