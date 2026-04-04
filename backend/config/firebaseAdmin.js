// config/firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccountKey.json'); // Path check kar lena

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
