import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        selectedSize: String,
        image: String
      }
    ],
    customer: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: String,
      mobile: {
        type: String,
        required: true
      },
      streetAddress: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String,
      zipCode: {
        type: String,
        required: true
      }
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    notes: String,
    trackingNumber: String
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
