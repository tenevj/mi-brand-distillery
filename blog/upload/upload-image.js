const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const app = express();

// Set up multer storage and destination for image uploads (temporarily save to disk)
const upload = multer({
  dest: path.join(__dirname, 'temp/'),  // Temporarily save images
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit to 5MB 
});

// Get GitHub token and repo info from the environment
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // Token from environment
const REPO_OWNER = 'tenevj';
const REPO_NAME = 'mi-brand-distillery';

// Route to handle image upload
app.post('/upload-image', upload.single('image'), async (req, res) => {
  if (req.file) {
    const imagePath = req.file.path;
    const fileName = req.file.originalname;

    // Read the image file content
    const imageContent = fs.readFileSync(imagePath);
    const encodedImage = imageContent.toString('base64');

    try {
      // Upload image to GitHub using the GitHub API
      const response = await axios.put(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/images/${fileName}`,
        {
          message: `Upload image: ${fileName}`,
          content: encodedImage,
        },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
          },
        }
      );

      // Delete the temp file after uploading
      fs.unlinkSync(imagePath);

      // Send the image URL back in the response
      const imageUrl = response.data.content.download_url;
      res.json({ imagePath: imageUrl });
    } catch (error) {
      console.error('Error uploading image to GitHub:', error);
      res.status(500).send('Error uploading image');
    }
  } else {
    res.status(400).send('No image uploaded');
  }
});
