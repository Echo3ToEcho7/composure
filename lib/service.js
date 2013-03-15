var semver = require("semver");

var Endpoint = require("./endpoint").Endpoint;

var Service = function Service(name) {
  if (!(this instanceof Service)) {
    return new Service(name);
  }

  this._name = name;
  this._version = "1.0.0";

  this.endpoints = [];
};

Service.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  this._version = semver.clean(ver);

  return this;
};

Service.prototype.get = function get() {
  return this.endpoint("GET");
};

Service.prototype.post = function post() {
  return this.endpoint("POST");
};

Service.prototype.put = function post() {
  return this.endpoint("PUT");
};

Service.prototype.del = function post() {
  return this.endpoint("DELETE");
};

Service.prototype.endpoint = function endpoint(verb) {
  var r = new Endpoint(verb);

  r.version(this._version);
  this.endpoints.push(r);

  return r;
};

Service.prototype.build = function build() {
  var i, ii;
  var res;
  var ret = { name: this._name, version: this._version, endpoints: [] };

  for (i = 0, ii = this.endpoints.length; i < ii; i++) {
    res = this.endpoints[i].build();

    ret.endpoints.push(res);
  }

  return ret;
};

exports.Service = Service;
