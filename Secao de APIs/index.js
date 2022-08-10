const express = require("express");
const res = require("express/lib/response");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// rotas - endpoints

app.post("/createproduct", (req, res) => {
  const name = req.body.name;
  const price = req.body.price;

  console.log(name);
  console.log(price);

  if (!name) {
    res.status(422).json({ message: "O campo name é obrigatório!" });
    return;
  }

  res.status(201).json({ message: `Produto ${name} foi Salvo!` });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Primeira Rota criada com sucesso!" });
});

app.listen(3000);
