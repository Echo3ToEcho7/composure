var restify = require("restify");
var semver = require("semver");

var docgen = require("./docgen");
var Service = require("./service").Service;

var Interlude = function Interlude() {
  if (!(this instanceof Interlude)) {
    return new Interlude();
  }

  this._docRoot = "/doc";
  this._versionInUri = true;
  this._versionPrefix = "v";
  this._version = "1.0.0";
  this._recurseMajor = true;
  this._name = "";

  this.services = [];
};

Interlude.prototype.set = function set(key, value) {
  this["_" + key] = value;

  return this;
};

Interlude.prototype.get = function get(key, dValue) {
  return this["_" + key] || dValue;
};

Interlude.prototype.service = function service(name) {
  var s = new Service(name || "");

  s.version(this.get("version"));

  this.services.push(s);
  return s;
};

Interlude.prototype.name = function name(n) {
  return this.set("name", n);
};

Interlude.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  return this.set("version", semver.clean(ver));
};

Interlude.prototype.listen = function listen(port, cb) {
  var i, ii, j, jj;
  var service, path;
  var verb;
  var info = {};
  var textFormatter = function textFormatter(req, res, body) { return body + ""; };
  var binFormatter = function binFormatter(req, res, body) { return body; };

  var server = restify.createServer({
    formatters: {
      "text/html; q=0.9": textFormatter,
      "text/javascript; q=0.9": textFormatter,
      "text/css; q=0.9": textFormatter,
      "image/png; q=0.9": binFormatter
    }
  });

  server.use(restify.dateParser());
  server.use(restify.queryParser());
  server.use(restify.gzipResponse());
  server.use(restify.bodyParser());

  info.name = this._name;
  info.version = this._version;
  info.services = [];

  for (i = 0, ii = this.services.length; i < ii; i++) {
    service = this.services[i].build();
    info.services.push(service);

    for (j = 0, jj = service.endpoints.length; j < jj; j++) {
      verb = service.endpoints[j].verb.toLowerCase();

      if (verb === "delete") {
        verb = "del";
      } else if (verb === "options") {
        verb = "opts";
      }

      path = "/" + service.name + service.endpoints[j].path;

      server[verb].call(server, { path: path, version: service.endpoints[j].version }, service.endpoints[j].handler);
    }
  }

  server.get(/\/_docs\/*/, docgen.docHandler.bind({server: info}));
  server.get(/\/_static\/.*/, docgen.staticFiles);

  server.listen(port, cb);
};

module.exports = Interlude;
