require("dotenv/config");
require("./db");
const express = require("express");


const app = express();
require("./config")(app);


// 👇 Start handling routes here
app.use("/api", require("./routes/index"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/recipe.routes"));

require("./error-handling")(app);

module.exports = app;
