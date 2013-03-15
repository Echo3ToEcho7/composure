var path = require("path");
var fs = require("fs");
var jade = require("jade");

//var doc = fs.readFileSync(path.join(__dirname, "docgen", "index.jade"), "utf8");
//var tpl = jade.compile(doc, {
  //self: true,
  //pretty: true
//});

exports.docHandler = function docHandler(req, res, next) {
  var doc = fs.readFileSync(path.join(__dirname, "docgen", "index.jade"), "utf8");
  var tpl = jade.compile(doc, {
    self: true,
    pretty: true
  });

  var body = tpl(this.server);
  res.setHeader("Content-Type", "text/html");
  res.send(body);
  next();
};

exports.staticFiles = function staticFiles(req, res, next) {
  var localPath = req.url.split("/").splice(2).join("/");
  var absPath = path.join(__dirname, "docgen", localPath);
  var ct = "application/octet-stream";
  var isBin = false;

  console.log("GET - " + absPath);

  if (absPath.indexOf(".js") !== -1) {
    isBin = false;
    ct = "text/javascript";
  } else if (absPath.indexOf(".css") !== -1) {
    isBin = false;
    ct = "text/css";
  } else if (absPath.indexOf(".png") !== -1) {
    isBin = true;
    ct = "image/png";
  }

  fs.exists(absPath, function (exists) {
    if (exists) {
      fs.readFile(absPath, { encoding: isBin ? "binary" : "utf8" }, function (err, file) {
        res.setHeader("Content-Type", ct);
        res.send(file);
        next();
      });
    } else {
      res.status(404);
      next();
    }
  });
};
