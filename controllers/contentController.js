import Content from '../models/Content.js'
import { sendSuccess, sendError, catchAsync } from '../utils/errorHandler.js'

// GET content by type
export const getContent = catchAsync(async (req, res) => {
  const { type } = req.params
  
  const validTypes = ['home', 'our-story', 'footer', 'page']
  if (!validTypes.includes(type)) {
    return sendError(res, `Invalid content type. Must be one of: ${validTypes.join(', ')}`, 400)
  }
  
  const content = await Content.findOne({ type })
  
  if (!content) {
    // Return default empty structure
    return sendSuccess(res, { type, content: null, data: {} })
  }
  
  sendSuccess(res, content)
})

// UPDATE or CREATE content
export const saveContent = catchAsync(async (req, res) => {
  const { type } = req.params
  const { content, data, metadata } = req.body
  
  const validTypes = ['home', 'our-story', 'footer', 'page']
  if (!validTypes.includes(type)) {
    return sendError(res, `Invalid content type. Must be one of: ${validTypes.join(', ')}`, 400)
  }
  
  let doc = await Content.findOne({ type })
  
  if (!doc) {
    doc = new Content({
      type,
      content,
      data,
      metadata,
      isPublished: true
    })
  } else {
    doc.content = content
    doc.data = data
    doc.metadata = metadata
  }
  
  await doc.save()
  
  sendSuccess(res, doc, 200, 'Content updated successfully')
})

// GET all content pages
export const getAllContent = catchAsync(async (req, res) => {
  const content = await Content.find().sort({ createdAt: -1 })
  
  sendSuccess(res, content)
})

// DELETE content
export const deleteContent = catchAsync(async (req, res) => {
  const { type } = req.params
  
  const result = await Content.deleteOne({ type })
  
  if (result.deletedCount === 0) {
    return sendError(res, 'Content not found', 404)
  }
  
  sendSuccess(res, null, 200, 'Content deleted successfully')
})
