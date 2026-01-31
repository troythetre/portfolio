// app.js
const express = require("express");
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies

//Allows users to utilize cors
const cors = require("cors");
app.use(cors());

// Routes

// For online server

// app.use("/proposal", require("./Routes/proposalRoutes")); // for online server
// app.use("/proposal", require("./Routes/responseRoutes")); // for online server
// app.use("/proposal", require("./Routes/questionRoutes")); // for online server
// app.use("/proposal", require("./Routes/trashRoutes")); // for online server
// app.use("/proposal", require("./Routes/userRoutes")); // for online server
// app.use("/proposal", require("./Routes/taskRoutes")); // for online server
// app.use("/proposal", require("./Routes/sectionRoutes")); // for online server

app.use("/api/proposal", require("./Routes/proposalRoutes")); // for local server
app.use("/api/proposal", require("./Routes/responseRoutes")); // for local server
app.use("/api/proposal", require("./Routes/questionRoutes")); // for local server
app.use("/api/proposal", require("./Routes/trashRoutes")); // for local server
app.use("/api/proposal", require("./Routes/userRoutes")); // for local server
app.use("/api/proposal", require("./Routes/taskRoutes")); // for local server
app.use("/api/proposal", require("./Routes/sectionRoutes")); // for local server
app.use("/api/proposal", require("./Routes/versionRoutes")); // for local server
app.use("/api/proposal", require("./Routes/otherFieldsRoutes")); // for local server

module.exports = app;
