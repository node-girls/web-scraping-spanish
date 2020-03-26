const express = require("express");
const app = express();
const fs = require("fs");

const url = "./data/libros.json";
const data = fs.readFileSync(url, "utf-8");
let geoData = JSON.parse(data);

app.get("/", (req, res) => {
  res.send(geoData);
});

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});
