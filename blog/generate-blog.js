// Importing required libraries
const fs = require('fs'); // To work with the file system
const path = require('path'); // To handle and transform file paths
const yaml = require('js-yaml'); // To parse YAML front matter in markdown files

// Function to generate the list of blog posts
function generateBlogPosts() {
    const blogDir = path.join(__dirname, 'posts'); // Directory where markdown files are stored
    const posts = []; // Array to hold the blog posts

    // Check if the 'posts' directory exists
    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir); // Get all files in the 'posts' directory
        
        // Loop through each file in the directory
        files.forEach(file => {
            console.log('Processing file:', file);  // Debugging line
            // Process only markdown (.md) files
            if (file.endsWith('.md')) {
                const filePath = path.join(blogDir, file); // Get the full path of the file
                const content = fs.readFileSync(filePath, 'utf8'); // Read the content of the markdown file

                // Regex to extract front matter (YAML) from markdown files
                const frontMatterRegex = /^---([\s\S]*?)---/;
                const match = content.match(frontMatterRegex);

                // If front matter exists, parse it
                if (match) {
                    try {
                        // Use js-yaml to parse the front matter
                        const frontMatter = yaml.load(match[1]);
                        
                        // Push the parsed data into the posts array
                        posts.push({
                            title: frontMatter.title,
                            date: frontMatter.date,
                            content: content.replace(frontMatterRegex, ''), // Remove the front matter from the content
                            //image: frontMatter.image || 'default.jpg' // Default image if not specified in front matter
                            image: `images/${frontMatter.image || 'default.jpg'}`

                        });
                    } catch (error) {
                        console.error("Error parsing YAML front matter in file:", file);
                        console.error(error);
                    }
                }
            }
        });
    }

    return posts; // Return the array of blog posts
}

// Function to update the blog page with the generated blog posts
function updateBlogPage() {
    const blogPosts = generateBlogPosts(); // Generate the list of blog posts
    const blogHtmlPath = path.join(__dirname, 'index.html'); // Path to the HTML file

    // Read the HTML file into memory
    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Add scoped styles for blog posts
    const scopedStyles = `
        <style>
            .blog-posts-wrapper .post-image-container img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 0 auto;
                border-radius: 8px;
            }
            .blog-posts-wrapper .post-image-container img {
                max-height: 300px;
                object-fit: cover;
            }
            @media (min-width: 769px) {
                .blog-posts-wrapper .post-image-container img {
                    max-height: 400px;
                }
            }
        </style>
    `;
    if (!blogHtmlContent.includes('<style>.blog-posts-wrapper')) {
        blogHtmlContent = blogHtmlContent.replace(
            '</head>',
            `${scopedStyles}</head>` // Inject styles only for blog posts
        );
    }

    // Create the HTML for the blog posts
    let postsHtml = '';
    blogPosts.forEach(post => {
        const postItem = `
            <article class="blog-post">

                <div class="post-header">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        <time datetime="${post.date}"><i class="far fa-calendar-alt"></i> ${post.date}</time>
                        <span class="reading-time"><i class="far fa-clock"></i> 5 min read</span>
                    </div>
                </div>

                <div class="post-image-container">
                    <img src="${post.image}" alt="${post.title}" class="featured-image">
                </div>



                <div class="post-content">
                    <p>${post.content.slice(0, 200)}...</p> <!-- truncated content -->
                    <div class="read-more-container">
                        <a href="#full-post" class="btn btn-primary read-more">Read More</a>
                    </div>
                </div>

                <div class="share-buttons">
                    <span class="share-text">Share:</span>
                    <a href="#" class="share-button" aria-label="Share on Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="share-button" aria-label="Share on Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="share-button" aria-label="Share on LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="share-button" aria-label="Share via Email"><i class="far fa-envelope"></i></a>
                </div>
            </article>
            <hr class="post-divider">
        `;
        postsHtml += postItem; // Append each post's HTML to the postsHtml string
    });

    // Wrap the postsHtml in a scoped container
    postsHtml = `<div class="blog-posts-wrapper"><ul id="blog-posts">${postsHtml}</ul></div>`;

    // Replace or append the new posts inside the <ul id="blog-posts">
    const postsContainerRegex = /<ul id="blog-posts">.*?<\/ul>/s;
    if (postsContainerRegex.test(blogHtmlContent)) {
        // If the placeholder is found, append to it
        blogHtmlContent = blogHtmlContent.replace(postsContainerRegex, postsHtml);
    } else {
        // If the placeholder doesn't exist, add it (shouldn't happen if the HTML structure is correct)
        blogHtmlContent = blogHtmlContent.replace('<ul id="blog-posts"></ul>', postsHtml);
    }

    // Write the updated content back to the index.html file
    fs.writeFileSync(blogHtmlPath, blogHtmlContent, 'utf8');
}

// Call the function to update the blog page
updateBlogPage();


