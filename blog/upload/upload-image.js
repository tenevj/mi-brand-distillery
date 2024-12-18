const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up multer storage and destination for image uploads
const upload = multer({
    dest: path.resolve(__dirname, '../images/'),  // Absolute path to 'images' directory
    limits: { fileSize: 5 * 1024 * 1024 }  // Limit to 5MB
  });


// Serve images from the 'blog/images' folder
app.use('/images', express.static(path.join(__dirname, '../images')));

// Route to handle image upload
app.post('/upload-image', upload.single('image'), (req, res) => {
    console.log('Upload received');
    if (req.file) {
      console.log('File uploaded successfully:', req.file);
      res.json({ imagePath: `/images/${req.file.filename}` });
    } else {
      console.log('No file uploaded');
      res.status(400).send('No image uploaded');
    }
  });
  

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
