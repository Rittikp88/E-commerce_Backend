const express = require("express");
const {
  getAllProducts,
  createProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controller/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authJwt");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(getAdminProducts);

//Create produdts : Seller,Admin
router
  .route("/admin/products/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProducts);

//Update produdts : Seller
router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
  .get(getProductDetails);

  router.route("/review").put(isAuthenticatedUser, createProductReview);

  router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;