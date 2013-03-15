var semver = require("semver");

var Parameter = require("./parameter").Parameter;

var Resource = function Resource(verb) {
  if (!(this instanceof Resource)) {
    return new Resource(verb);
  }

  this._verb = verb;
  this._version = "1.0.0";

  this.pathParts = [];
};

Resource.prototype.resource = function resource(name) {
  var p = new Parameter(name, "resource");

  this.pathParts.push(p);

  return p;
};

Resource.prototype.param = function param(name) {
  var p = new Parameter(name, "param");

  this.pathParts.push(p);

  return p;
};

Resource.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  this._version = semver.clean(ver);

  return this;
};

Resource.prototype.handler = function handler(cb) {
  this._handler = cb;

  return this;
};

Resource.prototype.summery = function summery(sum) {
  this._summery = sum;

  return this;
};

Resource.prototype.description = function description(desc) {
  this._description = desc;

  return this;
};

Resource.prototype.build = function build() {
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

exports.Resource = Resource;
