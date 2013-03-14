var Parameter = function Parameter(name, type) {
  if (!(this instanceof Parameter)) {
    return new Parameter(type);
  }

  this._type = type;
  this._name = name;
  this._summery = "";
};

Parameter.prototype.summery = function summery(sum) {
  this._summery = sum;

  return this;
};

Parameter.prototype.build = function build() {
  var ret = { name: this._name, type: this._type };

  if (this._type === "param") {
    ret.summery = this._summery;
  }

  return ret;
};

exports.Parameter = Parameter;
