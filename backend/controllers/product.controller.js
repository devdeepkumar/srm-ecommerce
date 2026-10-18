import Product from "../models/product.model.js";
import ExpressError from "../custom/ExpressError.js";
import APIFunctionality from "../custom/apiFunctionality.js";
import { cloudinary } from "../custom/cloudinary.js";




// creating Product
export const createProduct = async (req, res) => {
  if (!req.user) {
    throw new ExpressError(
      401,
      "Unauthorized! Please login to create a product."
    );
  }

  if (!req.files || req.files.length === 0) {
    throw new ExpressError(400, "Please upload at least one product image.");
  }

  const images = req.files.map((file) => ({
    public_id: file.filename,
    url: file.path,
  }));

  req.body.images = images;
  req.body.user = req.user._id;

  if (req.body.isFeatured !== undefined) {
    req.body.isFeatured =
      req.body.isFeatured === true || req.body.isFeatured === "true";
  }
  if (req.body.discount !== undefined) {
    req.body.discount = Math.max(0, Math.min(99, Number(req.body.discount) || 0));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
};

// Get alll Product

export const getAllProducts = async (req, res) => {
  const query = req.query;
  // console.log(query);

  const resultPerPage = Number(req.query.limit) || 15; // Default: 10 products per page
  const currentPage = Number(req.query.page) || 1; // Default: 1st page

  const apiFeatures = new APIFunctionality(Product.find(), query)
    .search()
    .filter();
  // console.log(apiFeatures);

  // Getting Filtered query beforepagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  //Calculate totalpage nased on filtered count
  const totalPages = Math.ceil(productCount / resultPerPage);
  if (currentPage > totalPages && totalPages !== 0) {
    throw new ExpressError(
      400,
      `Page ${currentPage} Not Found. Only ${totalPages} pages available.`
    );
  }

  // Applying Pagination
  apiFeatures.pagination(resultPerPage);
  const products = await apiFeatures.query;

  if (!products.length) {
    return res.status(200).json({
      success: true,
      productCount: 0,
      totalPages: 0,
      currentPage,
      resultPerPage,
      products: [],
    });
  }

  res.status(200).json({
    success: true,
    productCount, // Total matching filter (before pagination)
    totalPages,
    currentPage,
    resultPerPage,
    products,
  });
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  let { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  res.json({ success: true, product });
};

// Update Product
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  // If new images are uploaded, delete old ones and replace
  if (req.files && req.files.length > 0) {
    // Delete old images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    // Upload new images (assuming files are already uploaded via middleware)
    const images = req.files.map((file) => ({
      public_id: file.filename, // or file.public_id if using Cloudinary upload
      url: file.path, // or file.secure_url
    }));

    req.body.images = images;
  }

  if (req.body.isFeatured !== undefined) {
    req.body.isFeatured =
      req.body.isFeatured === true || req.body.isFeatured === "true";
  }

  if (req.body.discount !== undefined) {
    req.body.discount = Math.max(0, Math.min(99, Number(req.body.discount) || 0));
  }

  // Update product with new data
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Find the product first
  const product = await Product.findById(id);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  // Delete images from Cloudinary if public_id exists
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }
  }

  // Delete the product from database
  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};



// Creating product review
export const createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !comment || !productId) {
    throw new ExpressError(400, "Rating, comment, and product ID are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  const numericRating = Number(rating);
  const userIdStr = req.user._id.toString();

  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === userIdStr
  );

  if (existingReview) {
    // Update existing review
    existingReview.rating = numericRating;
    existingReview.comment = comment;
  } else {
    // Add new review
    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment,
    });
  }

  // Update review count and average rating
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
    product.numOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: existingReview
      ? "Review updated successfully"
      : "Review added successfully",
    reviews: product.reviews,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  });
};

// Getting Product Reviews
export const getProductReviews = async (req, res) => {
  const { id } = req.query
  const product = await Product.findById(id);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }
  if (!product.reviews.length) {
    throw new ExpressError(404, "No reviews found for this product");
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  })

}


// Delete product Review 
export const deleteProductReview = async (req, res) => {
  const { productId, reviewId } = req.query;

  if (!productId || !reviewId) {
    throw new ExpressError(400, "Product ID and Review ID are required");
  }
  const product = await Product.findById(productId);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  // Find target review
  const targetReview = product.reviews.find(
    (rev) => rev._id.toString() === reviewId
  );

  if (!targetReview) {
    throw new ExpressError(404, "Review not found");
  }

  // Security Check: Only the review author or admin/superadmin can delete the review
  const isAuthor =
    targetReview.user &&
    req.user &&
    targetReview.user.toString() === req.user._id.toString();
  const isAdmin =
    req.user && (req.user.role === "admin" || req.user.role === "superadmin");

  if (!isAuthor && !isAdmin) {
    throw new ExpressError(
      403,
      "You are not authorized to delete this review"
    );
  }

  // Filter out the review
  const reviewsAfterDelete = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId
  );

  product.reviews = reviewsAfterDelete;
  product.numOfReviews = product.reviews.length;

  product.ratings =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
        product.numOfReviews
      : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    reviews: product.reviews,
    ratings: product.ratings,
    numOfReviews: product.numOfReviews,
  });
};

//  Admin getting all products
export const getAdminProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products: products || [],
  });
};
