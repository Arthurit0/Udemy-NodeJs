const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");

router.get("/create", ProductController.createProduct);
router.post("/create", ProductController.createProductPost);
router.post("/remove/:id", ProductController.removeProduct);
// Nova rota para enviar as mudanças para a database
router.post("/edit", ProductController.editProductPost);
router.get("/edit/:id", ProductController.editProduct);
router.get("/:id", ProductController.getProduct);
router.get("/", ProductController.showProducts);

module.exports = router;
