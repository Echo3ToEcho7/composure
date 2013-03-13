var restify = requrie("restify");
var semver = requrie("semver");

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

module.exports = Interlude;
