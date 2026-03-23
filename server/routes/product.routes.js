// server/routes/product.routes.js
const express = require('express');
const router = express.Router();
const { 
  createProduct, 
  getProducts, 
  deleteProduct 
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

// REUSE the upload middleware we built for the forum!
const upload = require('../middleware/upload.middleware');

router.route('/')
  .post(protect, upload.array('images', 4), createProduct)
  .get(protect, getProducts); // Getting products requires being logged in

router.route('/:id')
  .delete(protect, deleteProduct);

module.exports = router;