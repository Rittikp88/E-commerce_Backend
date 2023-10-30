const express = require("express");
const {
  getAllProducts,
  createProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles} = require("../middleware/authJwt");

const router = express.Router();

router.route("/products").get(getAllProducts);

//Create produdts : Seller
router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProducts);

//Update produdts : Seller
router
  .route("/product/:id")
  .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
  .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
  .get(getProductDetails);

module.exports = router;
