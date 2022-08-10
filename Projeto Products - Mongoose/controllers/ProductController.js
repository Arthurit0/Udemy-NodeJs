const res = require("express/lib/response");
const Product = require("../models/Product");

module.exports = class ProductController {
  static async showProducts(req, resp) {
    // Utiliza o método find que, se não utilizar nenhum filtro, puxa todos os objetos.
    // Lean serve para devolver para receber os resultados em objetos javascript, e não documentos do MongoDB
    const products = await Product.find().lean();
    resp.render("products/all", { products });
  }

  static createProduct(req, resp) {
    resp.render("products/create");
  }

  static async createProductPost(req, resp) {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    // Agora passamos um objeto para o mongoose interpretar
    const product = new Product({ name, image, price, description });

    // Método do mongoose também é save
    await product.save();

    resp.redirect("/products");
  }

  static async getProduct(req, resp) {
    const id = req.params.id;

    // Apenas alteramos para utilizar o método findById() e lean()
    const product = await Product.findById(id).lean();

    resp.render("products/product", { product });
  }

  static async removeProduct(req, resp) {
    const id = req.params.id;

    // Utilizamos o método deleteOne, com o id como filtro + lean()
    await Product.deleteOne({ _id: id }).lean();

    resp.redirect("/products");
  }

  static async editProduct(req, resp) {
    const id = req.params.id;

    const product = await Product.findById(id).lean();

    resp.render("products/edit", { product });
  }

  static async editProductPost(req, resp) {
    const id = req.body.id;
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    // Passamos o objeto para o MongoDB
    const product = { name, image, price, description };

    // Passamos o ID, e todos os dados em product substituem os do alvo com este ID
    await Product.updateOne({ _id: id }, product);

    resp.redirect("/products");
  }
};
