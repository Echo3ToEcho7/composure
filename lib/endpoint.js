var semver = require("semver");

var Parameter = require("./parameter").Parameter;

var Endpoint = function Endpoint(verb) {
  if (!(this instanceof Endpoint)) {
    return new Endpoint(verb);
  }

  this._verb = verb;
  this._version = "1.0.0";

  this.pathParts = [];
};

Endpoint.prototype.resource = function resource(name) {
  var p = new Parameter(name, "resource");

  this.pathParts.push(p);

  return p;
};

Endpoint.prototype.param = function param(name) {
  var p = new Parameter(name, "param");

  this.pathParts.push(p);

  return p;
};

Endpoint.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  this._version = semver.clean(ver);

  return this;
};

Endpoint.prototype.handler = function handler(cb) {
  this._handler = cb;

  return this;
};

Endpoint.prototype.summery = function summery(sum) {
  this._summery = sum;

  return this;
};

Endpoint.prototype.description = function description(desc) {
  this._description = desc;

  return this;
};

Endpoint.prototype.build = function build() {
  var path = "/";
  var pathParts = [];
  var pp;
  var usesPattern = false;
  var i, ii;

  for (i = 0, ii = this.pathParts.length; i < ii; i++) {
    pp = this.pathParts[i].build();

    if (pp.type === "resource") {
      path = path + pp.name + "/";
    } else if (pp.type === "param") {
      if (pp.pattern) {
        usesPattern = true;
        path = path + pp.pattern + "/";
      } else {
        path = path + ":" + pp.name + "/";
      }
    }

    pathParts.push(pp);
  }

  return {
    verb: this._verb,
    path: path.substring(0, path.length - 1),
    pathParts: pathParts,
    version: this._version,
    handler: this._handler,
    summery: this._summery,
    description: this._description
  };
};

exports.Endpoint = Endpoint;
