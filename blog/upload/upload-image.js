const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up multer storage and destination for image uploads
const upload = multer({
  dest: path.join(__dirname, '../images/')  // Save images to 'blog/images/' directory
});

// Serve images from the 'blog/images' folder
app.use('/images', express.static(path.join(__dirname, '../images')));

// Route to handle image upload
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (req.file) {
    // Image uploaded successfully, return the image path
    res.json({ imagePath: `/images/${req.file.filename}` });
  } else {
    res.status(400).send('No image uploaded');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
