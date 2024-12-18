const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up multer storage and destination for image uploads
const upload = multer({
  dest: path.join(__dirname, '../images/'),  // Save images to 'blog/images/' directory
  limits: { fileSize: 5 * 1024 * 1024 }  // Limit to 5MB
});

// Serve images from the 'blog/images' folder
app.use('/images', express.static(path.join(__dirname, '../images')));

// Mock image upload in GitHub Actions
if (process.env.GITHUB_ACTIONS) {
  // Simulate a successful upload in CI/CD (GitHub Actions)
  app.post('/upload-image', (req, res) => {
    console.log('Mock upload in GitHub Actions');
    res.json({ imagePath: '/images/mock-image.jpg' });  // Mocked image path
  });
} else {
  // Actual server behavior for local or other environments
  app.post('/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
      res.json({ imagePath: `/images/${req.file.filename}` });  // Real image path
    } else {
      res.status(400).send('No image uploaded');
    }
  });
  
  // Start the server only in non-GitHub Actions environments
  const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

  // Optionally shut down the server after 30 seconds in local environments
  setTimeout(() => {
    server.close(() => {
      console.log('Server closed');
    });
  }, 30000);
}
