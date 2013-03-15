var interlude = require("../../lib");

var app = interlude();

var echoService = app.name("Hello, World!").service("echo").version("1.0.0");

var hello = function (req, res, next) {
  res.json(req.params.message);
  next();
};

var loc = echoService.get()
  .version("1.0.0")
  .handler(hello)
  .summery("Echo's back the message that you send")
  .description("<p>This is a very long description that might be multi-lined.</p>" +
               "<p>Use html if you want.  It will get escaped out of the summery</p>");

loc.resource("hello");
loc.param("message").summery("The message that you want echoed back");

loc = echoService.post()
  .version("1.0.0")
  .handler(hello)
  .summery("Echo's back the message that you send (POST as an example)")
  .description("<p>This is a very long description that might be multi-lined.</p>" +
               "<p>Use html if you want.  It will get escaped out of the summery</p>");

loc.resource("hello");
loc.param("message").summery("The message that you want echoed back");

app.listen(8080, function () {
  console.log("Now listening on port 8080");
});
