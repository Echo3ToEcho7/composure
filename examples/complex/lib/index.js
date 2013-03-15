var user = require("./user");

exports.load = function (server) {
  var service = server.service("user");

  user.load(service);
};
