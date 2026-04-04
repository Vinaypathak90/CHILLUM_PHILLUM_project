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
// Apne existing schema mein ye add kar:
projectsPage: {
    // 1. Featured Projects Headings
    projectsLabel: { type: String, default: 'OUR WORK' },
    projectsTitleMain: { type: String, default: 'Featured' },
    projectsTitleHighlight: { type: String, default: 'Projects' },

    // 2. Case Studies Section
    caseStudiesLabel: { type: String, default: 'CASE STUDIES' },
    caseStudiesTitleMain: { type: String, default: 'Deep Dive into Our' },
    caseStudiesTitleHighlight: { type: String, default: 'Best Work' },
    caseStudies: [{
        title: { type: String },
        desc: { type: String },
        type: { type: String } // e.g. Advertising, Documentary
    }],

    // 3. Stats Section (Portfolio by Numbers)
    statsLabel: { type: String, default: 'OUR PORTFOLIO BY NUMBERS' },
    statsTitleMain: { type: String, default: 'The' },
    statsTitleHighlight: { type: String, default: 'Impact of Our Work' },
    stats: [{
        number: { type: String }, // e.g. "500M+"
        label1: { type: String }, // e.g. "Views"
        label2: { type: String }  // e.g. "Generated"
    }],

    // 4. CTA Section
    ctaTitleMain: { type: String, default: 'Ready to Bring Your' },
    ctaTitleHighlight: { type: String, default: 'Vision to Life?' },
    ctaDesc: { type: String },
    ctaButtonText: { type: String, default: 'Start Your Project' },
    ctaButtonLink: { type: String, default: '/contact' }
},// 🔥 CAMPAIGNS PAGE DATA 🔥
    campaignsPage: {
        // ── CAMPAIGN SPECIALTIES ──
        specLabel: { type: String, default: 'Campaign Specialties' },
        specTitleMain: { type: String, default: 'We Excel in' },
        specTitleHighlight: { type: String, default: 'Every Campaign Type' },
        specialties: [{
            icon: { type: String },
            title: { type: String },
            desc: { type: String }
        }],

        // ── RECENT HIGHLIGHTS / TRENDING ──
        trendingLabel: { type: String, default: 'Recent Highlights' },
        trendingTitleMain: { type: String, default: 'Trending' },
        trendingTitleHighlight: { type: String, default: 'Right Now' },
        trending: [{
            title: { type: String },
            desc: { type: String },
            tags: { type: String } // e.g., "🔥 Trending • 10M+ Views • 2025"
        }],

        // ── MEASURABLE RESULTS / IMPACT STATS ──
        impactLabel: { type: String, default: 'Measurable Results' },
        impactTitleMain: { type: String, default: 'Campaigns That' },
        impactTitleHighlight: { type: String, default: 'Deliver Real Impact' },
        impactStats: [{
            number: { type: String }, // e.g., "350%" (Counter will extract the number)
            label1: { type: String }, // e.g., "Avg. Engagement"
            label2: { type: String }  // e.g., "Increase"
        }]
    },
  
  // ── 6. CONTACT PAGE ──
  contactPage: {
    // Hero Section
    heroTitleMain: { type: String, default: 'Get In' },
    heroTitleHighlight: { type: String, default: 'Touch' },
    heroSubtitle: { type: String, default: "Ready to create something amazing? Let's talk about your next project and bring your vision to reality." },
    heroBackgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80' },

    // Contact Form Section
    contactLabel: { type: String, default: 'Get In Touch' },
    contactTitleMain: { type: String, default: "Let's Create Something" },
    contactTitleHighlight: { type: String, default: 'Remarkable' },
    contactDesc: { type: String, default: "We're always looking for exciting projects and bold collaborators. Whether you're a filmmaker, brand, or storyteller — reach out and let's make something together." },
    email: { type: String, default: 'hello@chillumphillum.com' },
    phone: { type: String, default: '+91 99999 99999' },
    locationText: { type: String, default: 'India' },

    // Map Embed Code
    mapEmbedCode: { type: String, default: '' },
    mapHeight: { type: String, default: '600px' },

    // Locations Section
    locationsLabel: { type: String, default: 'Our Locations' },
    locationsTitleMain: { type: String, default: 'Where to' },
    locationsTitleHighlight: { type: String, default: 'Find Us' },
    locations: [{
        title: { type: String },
        address: { type: String },
        phone: { type: String },
        hours: { type: String }
    }],

    // FAQ Section
    faqLabel: { type: String, default: 'FAQ' },
    faqTitleMain: { type: String, default: 'Common' },
    faqTitleHighlight: { type: String, default: 'Questions' },
    faqs: [{
        question: { type: String },
        answer: { type: String }
    }],

    // Services Section
    servicesLabel: { type: String, default: 'Our Services' },
    servicesTitleMain: { type: String, default: 'Comprehensive Creative' },
    servicesTitleHighlight: { type: String, default: 'Solutions' },
    services: [{
        icon: { type: String },
        title: { type: String },
        desc: { type: String }
    }],

    
  },

  // ── 7. FOOTER ──
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