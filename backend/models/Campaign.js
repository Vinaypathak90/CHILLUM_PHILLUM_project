const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Campaign/News title is required'],
    trim: true 
  },

  dateString: { 
    type: String, 
    required: [true, 'Display date is required (e.g., March 2026)'],
    trim: true
  },

  excerpt: { 
    type: String, 
    required: [true, 'Short description (excerpt) is required'],
    maxLength: [300, 'Excerpt should not exceed 300 characters'] // To maintain UI layout
  },

  imageUrl: { 
    type: String, 
    required: [true, 'Campaign image is required'] 
  },

  readMoreLink: { 
    type: String, 
    default: '#' // Default link if no URL is provided
  },

  isPublished: { 
    type: Boolean, 
    default: true // If set to false, it will not appear on the website (Draft mode)
  },
  detailedContent: {
    type: String,
    required: [true, 'Detailed content for the popup is required']
  },
  

  order: { 
    type: Number, 
    default: 0 // Used for sorting campaigns manually
  }

}, { 
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Campaign', campaignSchema);


/* ======================================================
🔥 DEFAULT CAMPAIGN DATA (USED IN HTML) 🔥
======================================================

[
  {
    "dateString": "March 2026",
    "title": "Chillum Phillum Announces New Short Film in Production",
    "excerpt": "Our latest cinematic short is now in pre-production, exploring stories rooted in the heartland of India.",
    "imageUrl": "https://images.unsplash.com/photo-1540655037529-dec987208707?w=800&q=80",
    "readMoreLink": "#"
  },
  {
    "dateString": "January 2026",
    "title": "Partnership with Leading Brand for National Ad Campaign",
    "excerpt": "We partnered with a top consumer brand to produce a high-impact national advertising campaign across digital platforms.",
    "imageUrl": "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80",
    "readMoreLink": "#"
  },
  {
    "dateString": "October 2025",
    "title": "Photography Series Featured at Regional Arts Exhibition",
    "excerpt": "Our Light & Shadow photography series was showcased at a regional arts exhibition, receiving critical acclaim.",
    "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    "readMoreLink": "#"
  }
]

*/