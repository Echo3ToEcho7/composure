var semver = require("semver");

var Resource = function Resource(verb) {
  if (!(this instanceof Resource)) {
    return new Resource(verb);
  }

  this._verb = verb;
  this._version = "1.0.0";

  this.pathParts = [];
};

Resource.prototype.resource = function resource(name) {
  this.pathParts.push({name: name, type: "resource"});

  return this;
};

Resource.prototype.param = function param(name, regexp) {
  var r = null;

  if (typeof regexp === "string") {
    r = new RegExp(regexp);
  } else if ((typeof regexp !== "undefined") && (regexp)) {
    r = regexp;
  }

  this.pathParts.push({name: name, type: "param", regexp: r});

  return this;
};

Resource.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  this._version = ver;

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

exports.Resource = Resource;
