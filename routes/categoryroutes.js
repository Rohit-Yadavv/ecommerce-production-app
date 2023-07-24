import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { categoryController, updateCategoryController, createCategoryController, deleteCategoryController, singleCategoryController } from '../controller/categoryController.js';

//router object
const router = express.Router();

// create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryController)

// update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)

// get all category
router.get('/get-categories', categoryController)

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryController
);

export default router;