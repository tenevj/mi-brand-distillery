const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const fm = require('front-matter'); // For parsing the YAML front matter
const md = new markdownIt(); // Markdown parser

// Directory where markdown posts are stored
const postsDirectory = path.join(__dirname, 'posts');

// Function to generate individual post pages
function generateIndividualPostPage(post) {
    const postSlug = post.title.toLowerCase().replace(/\s+/g, '-'); // Generate a slug from the title
    const postPath = path.join(__dirname, 'blog', `${postSlug}.html`); // Path for the individual post

    // Generate the full HTML content for the individual post
    const fullPostContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${post.title}</title>
        </head>
        <body>
            <header>
                <h1>${post.title}</h1>
                <p><i class="far fa-calendar-alt"></i> ${post.date}</p>
            </header>
            <div class="post-content">
                ${md.render(post.content)} <!-- Render the full markdown content -->
            </div>
            <footer>
                <a href="/" class="btn">Back to Home</a>
            </footer>
        </body>
        </html>
    `;

    // Write the content to the individual post file
    fs.writeFileSync(postPath, fullPostContent, 'utf8');
}

// Function to generate blog posts HTML for the main page (index.html)
function generateBlogPosts() {
    const files = fs.readdirSync(postsDirectory);
    const blogPosts = [];

    files.forEach(file => {
        if (file.endsWith('.md')) {
            const filePath = path.join(postsDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { attributes: frontMatter, body } = fm(fileContent);

            // Generate the blog post object with metadata
            const post = {
                title: frontMatter.title || 'Untitled',
                image: frontMatter.image || 'default.jpg',
                date: frontMatter.date || 'No date provided',
                content: body,
            };

            blogPosts.push(post);

            // Generate the individual post page
            generateIndividualPostPage(post);
        }
    });

    return blogPosts;
}

// Function to update the main blog page (index.html)
function updateBlogPage() {
    const blogPosts = generateBlogPosts(); // Get the list of blog posts
    const blogHtmlPath = path.join(__dirname, 'index.html'); // Path to the main blog page

    // Read the HTML file into memory
    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Create the HTML for the blog posts
    let postsHtml = '';
    blogPosts.forEach(post => {
        const postSlug = post.title.toLowerCase().replace(/\s+/g, '-');
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
                        <a href="/blog/${postSlug}" class="btn btn-primary read-more">Read More</a>
                        
                    </div>
                </div>
            </article>
            <hr class="post-divider">
        `;
        postsHtml += postItem; // Append each post's HTML to the postsHtml string
    });

    // Wrap the postsHtml in a container
    postsHtml = `<div class="blog-posts-wrapper"><ul id="blog-posts">${postsHtml}</ul></div>`;

    // Replace or append the new posts inside the <ul id="blog-posts">
    const postsContainerRegex = /<ul id="blog-posts">.*?<\/ul>/s;
    if (postsContainerRegex.test(blogHtmlContent)) {
        // If the placeholder is found, replace it with new content
        blogHtmlContent = blogHtmlContent.replace(postsContainerRegex, postsHtml);
    } else {
        // If the placeholder doesn't exist, add it
        blogHtmlContent = blogHtmlContent.replace('<ul id="blog-posts"></ul>', postsHtml);
    }

    // Write the updated content back to the index.html file
    fs.writeFileSync(blogHtmlPath, blogHtmlContent, 'utf8');
}

// Call the function to update the blog page
updateBlogPage();
