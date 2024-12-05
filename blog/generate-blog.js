const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');  // Import the js-yaml library

function generateBlogPosts() {
    const blogDir = path.join(__dirname, 'posts');
    const posts = [];

    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir);
        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(blogDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const frontMatterRegex = /^---([\s\S]*?)---/;
                const match = content.match(frontMatterRegex);

                if (match) {
                    try {
                        // Use js-yaml to parse the front matter (YAML format)
                        const frontMatter = yaml.load(match[1]);
                        posts.push({
                            title: frontMatter.title,
                            date: frontMatter.date,
                            content: content.replace(frontMatterRegex, ''),
                            image: frontMatter.image || 'default.jpg' // Default image if none is provided
                        });
                    } catch (error) {
                        console.error("Error parsing YAML front matter in file:", file);
                        console.error(error);
                    }
                }
            }
        });
    }

    return posts;
}

function updateBlogPage() {
    const blogPosts = generateBlogPosts();
    const blogHtmlPath = path.join(__dirname, 'index.html');

    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Create the HTML for the blog posts using string concatenation
    let postsHtml = '';
    blogPosts.forEach(post => {
        const postItem = `
            <article class="blog-post">
                <div class="post-image-container">
                    <img src="${post.image}" alt="${post.title}" class="featured-image img-fluid">
                </div>

                <div class="post-header">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        <time datetime="${post.date}">
                            <i class="far fa-calendar-alt"></i> ${post.date}
                        </time>
                        <span class="reading-time">
                            <i class="far fa-clock"></i> 5 min read
                        </span>
                    </div>
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
        postsHtml += postItem; // Append the new post item
    });

    // Replace the placeholder in the index.html with the generated blog posts
    blogHtmlContent = blogHtmlContent.replace('<ul id="blog-posts"></ul>', postsHtml);

    // Write the updated content back to the index.html file
    fs.writeFileSync(blogHtmlPath, blogHtmlContent, 'utf8');
}

updateBlogPage();
