const mongoose = require('mongoose');

const teamPageSchema = new mongoose.Schema({
    // ── 1. MEET THE TEAM SECTION ──
    label: { type: String, default: 'Our People' },
    titleMain: { type: String, default: 'Meet the' },
    titleHighlight: { type: String, default: 'Creative Team' },
    
    // 🔥 Pura team data is array ke andar aayega 🔥
    members: [{
        name: { 
            type: String, 
            required: [true, 'Team member name is required'],
            trim: true 
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
            type: String,
            default: ""
        },
        order: { 
            type: Number, 
            default: 0 // Used for sorting (which member appears first)
        }
    }],

    // ── 2. STUDIO CULTURE ──
    cultureLabel: { type: String, default: 'Studio Culture' },
    cultureTitleMain: { type: String, default: 'Built on' },
    cultureTitleHighlight: { type: String, default: 'Collaboration & Innovation' },
    cultureDesc: { type: String, default: 'Our studio thrives on a culture of creative collaboration...' },
    cultureCards: [{
        icon: { type: String },
        title: { type: String },
        desc: { type: String }
    }],

    // ── 3. TESTIMONIALS ──
    testimonialsLabel: { type: String, default: 'What Our Team Says' },
    testimonialsTitleMain: { type: String, default: 'Working at' },
    testimonialsTitleHighlight: { type: String, default: 'Chillum Phillum' },
    testimonials: [{
        quote: { type: String },
        name: { type: String },
        role: { type: String }
    }],

    // ── 4. CAREER / HIRING ──
    careerLabel: { type: String, default: 'Career With Us' },
    careerTitleMain: { type: String, default: "We're Always Looking for" },
    careerTitleHighlight: { type: String, default: 'Talented Creators' },
    careerDesc: { type: String, default: "If you're passionate about filmmaking..." },
    careerButtonText: { type: String, default: 'Get In Touch' },
    careerButtonLink: { type: String, default: '/contact' }

}, { 
    timestamps: true // Automatically tracks createdAt and updatedAt
});

module.exports = mongoose.model('Team', teamPageSchema);


/* ======================================================
🔥 DEFAULT TEAM DATA (USED IN POSTMAN OR DB INITIALIZATION) 🔥
======================================================
{
    "members": [
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
}
*/