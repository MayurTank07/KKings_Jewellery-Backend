import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['home', 'our-story', 'footer', 'page'],
      required: true
    },
    pageKey: {
      type: String,
      unique: true,
      sparse: true
    },
    title: String,
    data: mongoose.Schema.Types.Mixed,
    content: mongoose.Schema.Types.Mixed,
    metadata: mongoose.Schema.Types.Mixed,
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

export default mongoose.model('Content', contentSchema)
