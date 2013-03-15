exports.load = function (service) {
  service.version("1.0.0");

  var loc = service.get()
    .summery("Location the use by UUID")
    .handler(function (req, res, next) {
      res.json({ usename: "Hello!", id: req.params.id });
      next();
    });

  var param = loc.param("id").summery("The uuid of the user");


  loc = service.post()
    .summery("Create a new user")
    .handler(function (req, res, next) {
      res.json({ id: "00000-00000-000000000" });
      next();
    });
};
