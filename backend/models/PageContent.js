const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  
  // ── 1. NAVIGATION BAR ──
  nav: {
    logoText: { type: String, default: 'CHILLUM PHILLUM' },
    // Logo ki image ka link (jab tu admin se nayi image upload karega toh yahan URL save hoga)
    logoImage: { type: String, default: '/img/logo.png' } 
  },

  // ── 2. HERO SECTION (Top section with slider) ──
  hero: {
    // Array of strings: Kyunki hero section mein strip ke andar multiple images hain
    backgroundImages: [{ type: String }], 
    eyebrow: { type: String, default: 'Est. · Creative Production Studio' },
    titleMain: { type: String, default: 'WHERE IT IS' },
    titleHighlight: { type: String, default: 'Always Buzzing' }, // Yellow italic wala text
    subtitle: { type: String, default: 'Film · Production · Advertising · Photography' },
    // Buttons ke text aur unke links (e.g., "#projects")
    button1: { 
        text: { type: String, default: 'Our Projects' }, 
        link: { type: String, default: '#projects' } 
    },
    button2: { 
        text: { type: String, default: 'Learn More' }, 
        link: { type: String, default: '#about' } 
    }
  },

  // ── 3. ABOUT US SECTION ──
  about: {
    label: { type: String, default: 'About Us' },
    titleMain: { type: String, default: 'A Creative Studio Where' },
    titleHighlight: { type: String, default: 'Bold Ideas' },
    titleEnd: { type: String, default: 'Come to Life' },
    // Array of Strings: Tu kitne bhi paragraphs add/remove kar sakta hai admin panel se
    paragraphs: [{ type: String }], 
    // Stats array: Multiple counters (50+ Projects, etc.)
    stats: [{
        number: { type: String }, // e.g., "50+"
        label: { type: String }   // e.g., "Projects"
    }],
    // Array for the 3 images shown in the about section grid
    images: [{ type: String }],

    // 🔥 NAYE FIELDS YAHAN HAIN 🔥
    
    // Our Journey Section
    journeyLabel: { type: String, default: 'Our Journey' },
    journeyTitleMain: { type: String, default: 'From Humble Beginnings to' },
    journeyTitleHighlight: { type: String, default: 'Industry Leaders' },
    journey: [{
        year: { type: String },
        title: { type: String },
        desc: { type: String }
    }],

    // Impact Section
    impactLabel: { type: String, default: 'Our Impact' },
    impactTitleMain: { type: String, default: 'Creating' },
    impactTitleHighlight: { type: String, default: 'Meaningful Work' },
    impactTitleEnd: { type: String, default: 'Every Day' },
    impactDescription: { type: String, default: "Over the years, we've had the privilege of working with diverse clients..." },
    impactStats: [{
        number: { type: String },
        label: { type: String }
    }]
  },

  // ── 4. THE STUDIO SECTION (What We Do) ──
  studio: {
    label: { type: String, default: 'What We Do' },
    titleMain: { type: String, default: 'The' },
    titleHighlight: { type: String, default: 'Chillum Phillum' },
    titleEnd: { type: String, default: 'Way' },
    // Cards array: Photo aur uska label (Production, Advertising, etc.)
    cards: [{
        image: { type: String },
        label: { type: String },
        description: { type: String }
    }],
    
    // 🔥 MISSING CAPABILITIES ARRAY ADDED HERE 🔥
    capabilitiesLabel: { type: String, default: 'Studio Capabilities' },
    capabilitiesTitleMain: { type: String, default: 'State-of-the-art' },
    capabilitiesTitleHighlight: { type: String, default: 'Equipment & Technology' },
    capabilities: [{
        icon: { type: String },
        title: { type: String },
        image: { type: String },
        items: [{ type: String }] // Array of strings (e.g. ["4K", "Drones"])
    }],

    // Our Process
    processLabel: { type: String, default: 'Our Process' },
    processTitleMain: { type: String, default: 'From' },
    processTitleHighlight: { type: String, default: 'Concept to Delivery' },
    processSteps: [{
        step: { type: String },
        title: { type: String },
        desc: { type: String }
    }],

    // Technology Stack
    techStackLabel: { type: String, default: 'Technology Stack' },
    techStackTitleMain: { type: String, default: 'Industry-Leading' },
    techStackTitleHighlight: { type: String, default: 'Tools & Software' },
    techStackDescription: { type: String, default: 'We utilize the latest in creative production...' },
    techStack: [{
        title: { type: String },
        desc: { type: String },
        image: { type: String }
    }]
  },

  // ── 5. CONTACT SECTION ──
  contact: {
    label: { type: String, default: 'Get In Touch' },
    titleMain: { type: String, default: "Let's Create Something" },
    titleHighlight: { type: String, default: 'Remarkable' },
    description: { type: String, default: "We're always looking for exciting projects..." },
    email: { type: String, default: 'hello@chillumphillum.com' },
    phone: { type: String, default: '+91 99999 99999' },
    location: { type: String, default: 'India' }
  },

  // ── 5.5. TEAM PAGE SECTION ──
  team: {
    cultureLabel: { type: String, default: 'Studio Culture' },
    cultureTitleMain: { type: String, default: 'Built on' },
    cultureTitleHighlight: { type: String, default: 'Collaboration & Innovation' },
    cultureDesc: { type: String, default: "Our studio thrives on a culture of creative collaboration, continuous learning, and pushing artistic boundaries." },
    cultureCards: [{
        icon: { type: String },
        title: { type: String },
        desc: { type: String }
    }],
    testimonialsLabel: { type: String, default: 'What Our Team Says' },
    testimonialsTitleMain: { type: String, default: 'Working at' },
    testimonialsTitleHighlight: { type: String, default: 'Chillum Phillum' },
    testimonials: [{
        quote: { type: String },
        name: { type: String },
        role: { type: String }
    }],
    careerLabel: { type: String, default: 'Career With Us' },
    careerTitleMain: { type: String, default: "We're Always Looking for" },
    careerTitleHighlight: { type: String, default: 'Talented Creators' },
    careerDesc: { type: String, default: "If you're passionate about filmmaking, photography, design, or any aspect of creative production, we'd love to hear from you." },
    careerButtonText: { type: String, default: 'Get In Touch' },
    careerButtonLink: { type: String, default: '/contact' }
  },

  // ── 6. FOOTER ──
  footer: {
    copyrightText: { type: String, default: '© 2026 Chillum Phillum. All rights reserved.' },
    socials: {
        instagram: { type: String, default: '#' },
        x: { type: String, default: '#' },
        facebook: { type: String, default: '#' }
    }
  }

}, { 
  timestamps: true // Ye automatically save karega ki data kab create ya update hua tha
});

module.exports = mongoose.model('PageContent', pageContentSchema);