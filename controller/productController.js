import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();
// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {

        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name: return res.status(500).send({ message: "Name is required" })
            case !description: return res.status(500).send({ message: "description is required" })
            case !category: return res.status(500).send({ message: "category is required" })
            case !quantity: return res.status(500).send({ message: "quantity is required" })
            case photo && photo.size > 1000000: return res.status(500).send({ error: "photo is required and should be less than 1mb" })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
            await products.save();
            res.status(201).send({
                success: true,
                message: "Product created successfully",
                products
            })
        }

    } catch (error) {

        res.status(500).send({
            success: false,
            error: error.message,
            message: "Error in product",
        });
    }
}
export const getProductsController = async (req, res) => {

    try {

        // -photo because we dont want photo here as it will take more time to load
        // limit 12 means we want only 12 products

        const products = await productModel
            .find({})

            // to show category collection use populate
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            TotalCount: products.length,
            message: "All Products ",
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in get product",
        });
    }
}

// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getitng single product",
            error,
        });
    }
};
// get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while getting photo",
            error,
        });
    }
};
// delete product
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error while deleting",
            error,
        });
    }
};

//upate product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

// filters
export const filterProductController = async (req, res) => {
    try {

        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error WHile Filtering Products",
            error,
        });
    }
};

// count filter
export const countProductController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error While counting Products",
            error,
        });
    }
};
// product list base on page
export const listProductController = async (req, res) => {
    try {
        const perPage = 9;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in per page controller",
            error,
        });
    }
};


// trending products 
export const trendingProductsController = async (req, res) => {
    try {
        const products = await productModel.find({ trending: true })
            .populate("category")
            .select("-photo")
            .limit(10)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error in finding trending products",
            error,
        });
    }
};

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        // const results` = await productModel
        //     .find({
        //         $or: [
        //             { name: { $regex: keyword, $options: "i" } },
        //             { description: { $regex: keyword, $options: "i" } },
        //         ],
        //     })
        const results = await productModel.aggregate([
            {
                $lookup: {
                    from: 'categories', // The name of the collection to perform the join with
                    localField: 'category', // The field from the "Product" model used for joining
                    foreignField: '_id',  // The field from the "Category" model used for joining
                    as: 'categoryData',  // The name of the new field in the output document
                },
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } },
                        { 'categoryData.name': { $regex: keyword, $options: 'i' } },
                    ],
                },
            },
        ]).select("-photo");

        res.json(results);
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};

// similar products
export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
            .find({
                category: cid,
                _id: { $ne: pid },
            })
            .select("-photo")
            .limit(3)
            .populate("category");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "error while geting related product",
            error,
        });
    }
};

// get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category").select("-photo");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};


// get product under price 
export const productUnderController = async (req, res) => {
    try {
        const priceFromParams = req.params.price;
        console.log(priceFromParams);
        const products = await productModel.find({ price: { $lt: priceFromParams } }).select("-photo");
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};































// payment gateway api

// token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });


    } catch (error) {
    }
}

// payment`
export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
    }
};