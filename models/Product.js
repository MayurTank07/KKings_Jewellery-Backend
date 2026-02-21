import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive']
    },
    selling_price: {
      type: Number,
      default: null
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    images: {
      type: [String],
      validate: {
        validator: function(arr) {
          return arr.length >= 1 && arr.length <= 4
        },
        message: 'Product must have between 1 and 4 images'
      },
      default: []
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, 'Stock cannot be negative']
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

// Create text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' })

export default mongoose.model('Product', productSchema)
