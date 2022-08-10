const conn = require("../db/conn");

// Tipo de objeto do mongoDB que contém um Id
const { ObjectId } = require("mongodb");

class Product {
  // Instancia o objeto produto com os dados enviados no construtor
  constructor(name, image, price, description) {
    this.name = name;
    // Também adicionaremos uma imagem
    this.image = image;
    this.price = price;
    this.description = description;
  }

  save() {
    // Envia os dados coletados pelo construtor para a database. Também crio a collection "products"
    const product = conn.db().collection("products").insertOne({
      name: this.name,
      image: this.image,
      price: this.price,
      description: this.description,
    });

    return product;
  }

  // Aqui recebemos o array, encontraremos um item específico no controller
  static getProducts() {
    const product = conn.db().collection("products").find().toArray();

    return product;
  }

  static async getProductById(id) {
    //Procuramos o objeto na database
    const product = await conn
      .db()
      .collection("products")
      // Não chamamos pelo id diretamente, precisamos do tipo de dado ObjectId:
      .findOne({ _id: ObjectId(id) });

    return product;
  }

  static async removeProductById(id) {
    //Procuramos o objeto na database
    const product = await conn
      .db()
      .collection("products")
      // Deletamos pelo object id
      .deleteOne({ _id: ObjectId(id) });

    return;
  }

  updateProduct(id) {
    conn
      .db()
      .collection("products")
      /*
      Método com "$" = método do MongoDB.
      Em productControllers eu chamo este método através da própria classe, por isso podemos usar this
      para fazer toda a substituição do objeto
    */
      .updateOne({ _id: ObjectId(id) }, { $set: this });

    return;
  }
}

module.exports = Product;
