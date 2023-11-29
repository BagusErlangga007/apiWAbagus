const express = require("express");
const client = require("./whatsapp");

const path = require("path");
const app = express();
const port = 3000;

const apiRoute = require("./routes/api.route");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
  // res.send("Hello World!");
});

// app.set("view engine", "pug");
app.use(express.json());
app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  try {
    client.initialize();
    console.log(`Whatsapp client now is up and running.`);
  } catch (error) {
    console.log(`Something goes wrong. err: ${error}`);
  }
});
