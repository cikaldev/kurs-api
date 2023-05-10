const express = require("express");
const cors = require("cors");
const app = express();

const { getBI, getBCA } = require("./scraper");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "Web API Kurs" });
});

app.get("/bi", async (req, res) => {
  await getBI()
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

app.get("/bca", async (req, res) => {
  await getBCA()
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

app.listen(5000, () => {
  console.log("Listening at port 5000");
});

module.exports = app;