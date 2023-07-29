import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { productUnderController, trendingProductsController, brainTreePaymentController, braintreeTokenController, productCategoryController, realtedProductController, searchProductController, listProductController, filterProductController, countProductController, createProductController, getProductsController, getSingleProductController, productPhotoController, deleteProductController, updateProductController } from '../controller/productController.js';
import formidable from 'express-formidable';


const router = express.Router();

//routes

// create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

//update product
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(),
    updateProductController
);

// get products
router.get('/get-products', formidable(), getProductsController);

//single product 
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", filterProductController);

//count product
router.get("/product-count", countProductController);

// per page product
router.get("/product-list/:page", listProductController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//category wise product
router.get("/trending-products", trendingProductsController);

//product under 199, 399... 
router.get("/product-under/:price", productUnderController);




//payments routes
// --------------------------------------

//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


export default router;