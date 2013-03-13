var Service = function Service(name) {
  if (!(this instanceof Service)) {
    return new Service(name);
  }

  this._name = name;
  this._version = "1.0.0";

  this.resources = [];
};

Service.prototype.version = function version(ver) {
  if (!semver.valid(ver)) {
    throw new Error("Invalid version: " + ver);
  }

  this._version = ver;

  return this;
};

Service.prototype.get = function get() {
  return this.resource("GET");
};

Service.prototype.post = function post() {
  return this.resource("POST");
};

Service.prototype.put = function post() {
  return this.resource("PUT");
};

Service.prototype.del = function post() {
  return this.resource("DELETE");
};

Service.prototype.resource = function resource(verb) {
  var r = new Resource(verb);

  r.version(this._version);
  this.resources.push(r);

  return r;
};
