var version100 = require("./1.0.0");

exports.load = function (service) {
  service.version("1.1.0");

  version100.load(service);
};
