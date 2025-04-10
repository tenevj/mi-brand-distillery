/* document.getElementById('blogForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Collect form data
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const date = document.getElementById('date').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()); // Split tags and trim spaces
    const imageFile = document.getElementById('image').files[0];
  
    let imagePath = "";
  
    // If an image is uploaded, handle it
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      // Optional: Upload the image to your server or external storage (if required)
      // For now, just get the file name or simulate its path
      imagePath = `../images/${imageFile.name}`;
    }
  
    // Create the Markdown content
    const markdownContent = `---
title: "${title}"
date: "${date}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
image: "${imagePath}"
---
${content} <!-- Converts HTML links to Markdown -->
`;
  
    // Create a downloadable Markdown file
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${title.replace(/\s+/g, '_').toLowerCase()}.md`; // Create a filename based on the title
    downloadLink.click();
  
    // Provide feedback to the user
    document.getElementById('status').innerText = 'Markdown file generated and downloaded!';
  }); */




document.getElementById('blogForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const date = document.getElementById('date').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()); // Split tags and trim spaces
    const imageFile = document.getElementById('image').files[0];

    let imagePath = "";

    // If an image is uploaded, send it to the server
    if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/upload-image', {
        method: 'POST',
        body: formData,
        timeout: 60000 // 1 minute timeout
    });

    const result = await response.json();
    imagePath = result.imagePath; // Get the image path from the server response
    }

    // Create the Markdown content
    const markdownContent = `---
title: "${title}"
date: "${date}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
image: "${imagePath}"
---
${content}
`;

    // Create a downloadable Markdown file
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${title.replace(/\s+/g, '_').toLowerCase()}.md`; // Create a filename based on the title
    downloadLink.click();

    // Provide feedback to the user
    document.getElementById('status').innerText = 'Markdown file generated and downloaded!';
});
