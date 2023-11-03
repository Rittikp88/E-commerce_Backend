const Product = require("../models/productModel");
const ErrorHander = require("../Utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../Utils/ApiFeatures");

//Create Product --Seller

exports.createProducts = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//Get All Product
exports.getAllProducts = catchAsyncErrors(async(req, res) => {

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});


//Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async(req, res) => {

  const resultPerPage = 8;
  const products = await Product.find();
 res.status(200).json({
  success: true,
  products,
 })
});

//Get All Product
// exports.getAllProducts = catchAsyncErrors(async(req, res) => {

//   const resultPerPage = 8;
//   const productsCount = await Product.countDocuments();

//   const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
//  const product = await apiFeatures.query;
//  res.status(200).json({
//   success: true,
//   product,
//   productsCount
//  })
// });


// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
      productCount,
    });
  });


//Update Product --Seller

exports.updateProduct = catchAsyncErrors(async(req, res, next)=> {
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        product,
      });


});


//DeleteProduct --Seller


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  console.log(req.params.id)
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    // Deleting Images From Cloudinary
    // for (let i = 0; i < product.images.length; i++) {
    //   await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    // }
  
    await product.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "Product Delete Successfully",
    });
  });


  //Create New Review or Updates the review
  exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment , productId } =req.body;

    const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    };


    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed) {
      product.reviews.forEach((rev) => {
        if(rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
    }

    let avg =0;
     product.reviews.forEach(rev => {
      avg += rev.rating
    })

    product.ratings = avg/product.reviews.length


    await product.save({validateBeforeSave: false});
    res.status(200).json({
      success: true
    })
  });

  //Get All Review Of a Product

  exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
      return next(new ErrorHander("Product not found ", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews
    })
  });


  // Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});