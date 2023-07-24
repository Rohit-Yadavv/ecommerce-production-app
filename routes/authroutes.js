import express from 'express';
import { getAllOrdersController, orderStatusController, getOrdersController, updateProfileController, registerController, loginController, testController, forgetPasswordController } from "../controller/authController.js";
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';

//router object
const router = express.Router();

//routing

//register || method post 
router.post('/register', registerController);

//LOGIN || method post 
router.post('/login', loginController);

//forget password || method post 
router.post('/forget-password', forgetPasswordController);

//test-routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected-routes-auth
router.get('/user-auth', requireSignIn, (req, res) => { res.status(200).send({ ok: true }) });

//protected-routes-auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => { res.status(200).send({ ok: true }) });

//update profile
router.put("/profile", requireSignIn, updateProfileController);


// user orders
router.get("/orders", requireSignIn, getOrdersController);

// Admin all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Admin order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController
);
export default router;