var interlude = require("../../lib");
var services = require("./lib");

var app = interlude().name("Complex Example API").version("1.1.0");

services.load(app);

app.listen(8080, function () {
  console.log("Now listening on port 8080");
});
