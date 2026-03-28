const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'] 
  },

  category: { 
    type: String, 
    required: [true, 'Category (e.g., Film Making, Advertising) is required'] 
  },

  // 🔥 NAYI FIELD: Card par dikhane ke liye chhoti description
  shortDescription: { 
    type: String, 
    required: [true, 'A short description for the card is required'] 
  },

  // 🔥 NAYI FIELD: Popup/Modal mein dikhane ke liye badi description
  detailedDescription: { 
    type: String, 
    required: [true, 'A detailed description for the popup is required'] 
  },

  imageUrl: { 
    type: String, 
    required: [true, 'Project image URL is required'] 
  },

  isFeatured: { 
    type: Boolean, 
    default: true // If true, it will be displayed on the homepage
  },

  order: { 
    type: Number, 
    default: 0 // Used for sorting (set 1, 2, 3 to control display order)
  }

}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', projectSchema);