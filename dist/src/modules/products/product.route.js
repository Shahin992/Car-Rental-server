"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const router = express_1.Router();
router.post('/', product_controller_1.createProduct); // Add Product 
router.get('/', product_controller_1.getProducts); //  Get All Product
router.get('/:productId', product_controller_1.getProductById); // Get Product by id
router.put('/:productId', product_controller_1.updateProduct); // update product details
router.delete('/:productId', product_controller_1.deleteProduct); // delete product from database
exports.default = router;
