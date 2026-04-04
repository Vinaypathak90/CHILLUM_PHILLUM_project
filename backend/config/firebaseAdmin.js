const admin = require('firebase-admin');

let serviceAccount;

// Check if we are running on Render (jahan FIREBASE_PRIVATE_KEY .env mein hoga)
if (process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        // Render .env mein '\n' ko theek se read karne ke liye replace karna zaroori hai
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };
} else {
    // Local environment fallback (Jab tu apne PC pe run kar raha ho)
    try {
        serviceAccount = require('../firebaseServiceAccountKey.json');
    } catch (error) {
        console.error("Firebase Service Account key missing locally!");
    }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
