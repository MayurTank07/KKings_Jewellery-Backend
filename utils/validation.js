/**
 * Input validation utilities
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateProduct = (product) => {
  const errors = []
  
  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required')
  }
  if (!product.description || product.description.trim().length === 0) {
    errors.push('Product description is required')
  }
  if (!product.price || product.price < 0) {
    errors.push('Product price is required and must be positive')
  }
  if (!product.category || product.category.trim().length === 0) {
    errors.push('Product category is required')
  }
  if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
    errors.push('At least one product image is required')
  }
  if (product.images && product.images.length > 4) {
    errors.push('Product can have maximum 4 images')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateOrder = (order) => {
  const errors = []
  
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('Order must contain at least one item')
  }
  if (!order.total || order.total < 0) {
    errors.push('Order total is required and must be positive')
  }
  if (!order.customer) {
    errors.push('Customer information is required')
  } else {
    const { firstName, lastName, streetAddress, city, zipCode, mobile } = order.customer
    if (!firstName) errors.push('Customer first name is required')
    if (!lastName) errors.push('Customer last name is required')
    if (!streetAddress) errors.push('Street address is required')
    if (!city) errors.push('City is required')
    if (!zipCode) errors.push('Zip code is required')
    if (!mobile) errors.push('Mobile number is required')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export const validateAdmin = (admin) => {
  const errors = []
  
  if (!admin.username || admin.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters')
  }
  if (!admin.password || admin.password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  if (!admin.email || !validateEmail(admin.email)) {
    errors.push('Valid email is required')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
