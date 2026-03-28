const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Team member name is required'],
    trim: true // Automatically removes extra spaces
  },

  role: { 
    type: String, 
    required: [true, 'Team member role/designation is required'],
    trim: true
  },

  photoUrl: { 
    type: String, 
    required: [true, 'Team member photo URL is required'] 
  },
bio: { 
  
  type: String ,
  default: ""
},
  order: { 
    type: Number, 
    default: 0 // Used for sorting (which member appears first)
  }

}, { 
  timestamps: true // Automatically tracks createdAt and updatedAt
});

module.exports = mongoose.model('Team', teamSchema);


/* ======================================================
🔥 DEFAULT TEAM DATA (USED IN HTML) 🔥
Ready-to-use JSON for Postman or database:
======================================================

[
  {
    "name": "Founder / Director",
    "role": "Creative Head",
    "photoUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "order": 1
  },
  {
    "name": "Lead Producer",
    "role": "Production Head",
    "photoUrl": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    "order": 2
  },
  {
    "name": "Cinematographer",
    "role": "Director of Photography",
    "photoUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    "order": 3
  },
  {
    "name": "Creative Director",
    "role": "Brand & Design Lead",
    "photoUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    "order": 4
  }
]

*/