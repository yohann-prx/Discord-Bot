const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const getVeilleRouter = require("./routes/getVeille");

// Initialize the server
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Routes
app.get("/", function (req, res) {
  res.send("Salutation, mon ami !!!");
});

app.use("/veille", getVeilleRouter);

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// Start the server
app.listen(port, () => {
  console.log(`This app is listening on port http://localhost:${port}`);
});

// Start the server
let server = app.listen(8081, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Front sevrer launched on http://${host}:${port}`);
});

app.use(express.static("public"));
