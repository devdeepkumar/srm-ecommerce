import express from "express";
const router = express.Router();
import asyncHandler from "../custom/asyncHandler.js";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  createProductReview,
  getProductReviews,
  deleteProductReview,

} from "../controllers/product.controller.js";
import { verifyAdminAuth, verifyUserAuth } from "../middlewares/userAuth.js";
import { uploadProductImages } from "../middlewares/multer.js";

router.route("/products").get(asyncHandler(getAllProducts));

router
  .route("/product/reviews")
  .get(asyncHandler(getProductReviews))
  .delete(verifyUserAuth, asyncHandler(deleteProductReview));

router.route("/product/:id").get(asyncHandler(getSingleProduct));

router
  .route("/product/review")
  .put(verifyUserAuth, asyncHandler(createProductReview));

router
  .route("/admin/product/create")
  .post(
    verifyUserAuth,
    verifyAdminAuth,
    uploadProductImages.array("images", 5),
    asyncHandler(createProduct)
  );
router
  .route("/admin/product/:id")
  .put(
    verifyUserAuth,
    verifyAdminAuth,
    uploadProductImages.array("images", 5),
    asyncHandler(updateProduct)
  )
  .delete(verifyUserAuth, verifyAdminAuth, asyncHandler(deleteProduct));



// admin getting all products
router
  .route("/admin/products")
  .get(verifyUserAuth, verifyAdminAuth, asyncHandler(getAdminProducts));

export default router;
