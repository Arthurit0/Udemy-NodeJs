const mongoose = require("mongoose");
const { Schema } = mongoose;

// Criamos um modelo através do próprio mongoose
const Product = mongoose.model(
  // Nome do modelo
  "Product",
  // Em um schema definimos que atributos estarão no objeto, além de algumas regras.
  new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  })

  // Agora, os métodos em ProductController.js por agora não irão funcionar.
);

module.exports = Product;
