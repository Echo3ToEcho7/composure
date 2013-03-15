interlude
=========

Inspired by [Swagger](https://github.com/wordnik/swagger-core/) for
Scala, interlude is built on top of
[restify](https://github.com/mcavage/node-restify) and
provides a clean api for defining RESTful web service apis.  At the same 
time, interlude provides the ability to document your services along side
the endpoint definitions and hadlers, and creates a documentation
website.

Example
=======

```javascript
var interlude = require("interlude");

var app = interlude();

var echoService = app.name("Hello, World!").service("echo").version("1.0.0");

var hello = function (req, res, next) {
  res.json(req.params.message);
  next();
};

var endpoint = echoService.get()
  .version("1.0.0")
  .handler(hello)
  .summery("Echo's back the message that you send")
  .description("<p>This is a very long description that might be multi-lined.</p>" +
               "<p>Use html if you want.  It will get escaped out of the summery</p>");

endpoint.resource("hello");
endpoint.param("message").summery("The message that you want echoed back");

endpoint = echoService.post()
  .version("1.0.0")
  .handler(hello)
  .summery("Echo's back the message that you send (POST as an example)")
  .description("<p>This is a very long description that might be multi-lined.</p>" +
               "<p>Use html if you want.  It will get escaped out of the summery</p>");

endpoint.resource("hello");
endpoint.param("message").summery("The message that you want echoed back");

app.listen(8080, function () {
  console.log("Now listening on port 8080");
});
```

Screenshot
----------

![interlude
screenshot](https://github.com/Echo3ToEcho7/interlude/blob/master/screenshot.png)

Todos
=====

- [ ] Make the autogen documentation page prettier
- [ ] Expose the restify jsonClient
- [ ] Documentation
- [ ] Test cases
