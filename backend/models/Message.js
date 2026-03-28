const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Sender name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Sender email is required'],
    trim: true,
    // Regex for basic email validation to prevent fake formats
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
      'Please provide a valid email address'
    ]
  },
  phone: { 
    type: String, 
    trim: true,
    default: '' // Phone number is optional in the HTML form
  },
  subject: { 
    type: String, 
    required: [true, 'Message subject is required'],
    trim: true 
  },
  message: { 
    type: String, 
    required: [true, 'Message body cannot be empty'],
    trim: true 
  },
  // For admin panel message management
  status: { 
    type: String, 
    enum: ['Unread', 'Read', 'Archived'], 
    default: 'Unread' 
  }
}, { 
  timestamps: true // Automatically saves the exact date and time the message was received
});

module.exports = mongoose.model('Message', messageSchema);

/* ======================================================
🔥 HOW IT CONNECTS TO YOUR HTML 🔥
When your HTML contact form is submitted:
<form class="contact-form">
  <input type="text" placeholder="Your Name"/>      --> maps to 'name'
  <input type="email" placeholder="your@email.com"/>--> maps to 'email'
  <input type="tel" placeholder="+91 XXXXX XXXXX"/> --> maps to 'phone'
  <input type="text" placeholder="Project Inquiry"/>--> maps to 'subject'
  <textarea placeholder="Tell us..."></textarea>    --> maps to 'message'
</form>
====================================================== */