import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';

// helper to upload a single file buffer to Cloudinary and return secure_url
const uploadBufferToCloudinary = async (fileBuffer, mimetype, filename) => {
  const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
  const res = await cloudinary.uploader.upload(dataUri, { folder: 'shop_products' });
  return res.secure_url;
};

export const createProduct = async (req, res) => {
  try {
    let { name, description, price, stock, category, storeId } = req.body;
    const images = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        try {
          const url = await uploadBufferToCloudinary(file.buffer, file.mimetype, file.originalname);
          images.push(url);
        } catch (e) {
          console.error('Upload to Cloudinary failed for file', file.originalname, e.message);
        }
      }
    }

    // validate/resolve category: accept ObjectId string, or try to find by name
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        // keep as ObjectId string
      } else {
        // try to find category by name (case-insensitive)
        try {
          const found = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
          if (found) category = found._id;
          else {
            // invalid category value -> ignore it to avoid cast error
            console.warn('createProduct: provided category not an ObjectId and not found by name, ignoring:', category);
            category = undefined;
          }
        } catch (e) {
          console.warn('createProduct: error while resolving category by name', e?.message || e);
          category = undefined;
        }
      }
    }

    const product = new Product({
      storeId,
      name,
      description,
      price: Number(price || 0),
      stock: Number(stock || 0),
      category,
      images,
    });

    await product.save();
    return res.status(201).json(product);
  } catch (err) {
    console.error('createProduct error', err);
    return res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    console.error('getProducts error', err);
    return res.status(500).json({ message: 'Error fetching products' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, storeId } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (storeId !== undefined) product.storeId = storeId || undefined;

    // resolve category similar to create
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        product.category = category;
      } else {
        const found = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
        if (found) product.category = found._id;
      }
    } else if (category === '') {
      product.category = undefined;
    }

    // handle images: if files uploaded, replace images array with uploaded URLs
    if (req.files && req.files.length) {
      const images = [];
      for (const file of req.files) {
        try {
          const url = await uploadBufferToCloudinary(file.buffer, file.mimetype, file.originalname);
          images.push(url);
        } catch (e) {
          console.warn('Update: Cloudinary upload failed for', file.originalname, e?.message || e);
        }
      }
      if (images.length) product.images = images;
    }

    await product.save();
    return res.json(product);
  } catch (err) {
    console.error('updateProduct error', err);
    return res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted', id: deleted._id });
  } catch (err) {
    console.error('deleteProduct error', err);
    return res.status(500).json({ message: 'Error deleting product' });
  }
};
