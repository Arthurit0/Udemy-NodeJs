const express = require("express");
const exphds = require("express-handlebars");

const app = express();
const conn = require("./db/conn");

const productsRoutes = require("./routes/productsRoutes");

app.engine("handlebars", exphds.engine());
app.set("view engine", "handlebars");

// Read Body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("public"));

app.use("/products", productsRoutes);

app.listen(3000);
