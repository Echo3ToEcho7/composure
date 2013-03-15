
exports.load = function (service) {
  service.version("1.1.0");

  var loc = service.post()
    .summery("Create a new user")
    .handler(function (req, res, next) {
      res.send({ id: "00001-00000-000000000", name: "World!" });
      next();
    });
};
