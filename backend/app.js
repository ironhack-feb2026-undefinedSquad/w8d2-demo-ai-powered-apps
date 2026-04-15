require("dotenv/config");
const { connectDB } = require("./db");
const express = require("express");


const app = express();

// Each time a request is made, ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        next(e);
    }
});

require("./config")(app);


// 👇 Start handling routes here
app.use("/api", require("./routes/index"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/recipe.routes"));

require("./error-handling")(app);

module.exports = app;
