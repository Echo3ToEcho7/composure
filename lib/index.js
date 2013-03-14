var restify = require("restify");
var semver = require("semver");

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

Interlude.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  return this.set("version", semver.clean(ver));
};

Interlude.prototype.listen = function listen(port, cb) {
  var i, ii, j, jj;
  var service, path;
  var server = restify.createServer();
  var verb;

  server.use(restify.dateParser());
  server.use(restify.queryParser());
  server.use(restify.gzipResponse());
  server.use(restify.bodyParser());

  for (i = 0, ii = this.services.length; i < ii; i++) {
    service = this.services[i].build();

    for (j = 0, jj = service.paths.length; j < jj; j++) {
      verb = service.paths[j].verb.toLowerCase();

      if (verb === "delete") {
        verb = "del";
      } else if (verb === "options") {
        verb = "opts";
      }

      path = "/" + service.name + service.paths[j].path;

      server[verb].call(server, { path: path, version: service.paths[j].version }, service.paths[j].handler);
    }
  }

  server.listen(port, cb);
};

module.exports = Interlude;
