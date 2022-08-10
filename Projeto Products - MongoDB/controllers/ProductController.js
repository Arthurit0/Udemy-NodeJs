const res = require("express/lib/response");
const Product = require("../models/Product");

module.exports = class ProductController {
  // async, para puxar os dados do mongoD
  static async showProducts(req, resp) {
    const products = await Product.getProducts();
    // Agora renderizaremos os produtos registrados na database
    resp.render("products/all", { products });
  }

  // Renderiza a página de criação de produtos: um formulário
  static createProduct(req, resp) {
    resp.render("products/create");
  }

  // Recebe os dados do formulário, os instancia em um novo Product:
  static async createProductPost(req, resp) {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(name, image, price, description);

    // Usa o método "save()" que envia os dados para a database
    product.save();

    // Redireciona à página de produtos
    resp.redirect("/products");
  }

  static async getProduct(req, resp) {
    // Recebemos o id do produto
    const id = req.params.id;

    // Chamamos o objeto na database através do método do Model "Product.js"
    const product = await Product.getProductById(id);

    // Renderizamos a página
    resp.render("products/product", { product });
  }

  static async removeProduct(req, resp) {
    const id = req.params.id;

    await Product.removeProductById(id);

    resp.redirect("/products");
  }

  static async editProduct(req, resp) {
    const id = req.params.id;

    // Já temos um método para resgatar o id, não precisamos recriá-lo
    const product = await Product.getProductById(id);

    resp.render("products/edit", { product });
  }

  static async editProductPost(req, resp) {
    const id = req.body.id;
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(name, image, price, description);
    await product.updateProduct(id);

    resp.redirect("/products");
  }
};
