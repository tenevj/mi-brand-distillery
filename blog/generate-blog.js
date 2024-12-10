// Importing required libraries
const fs = require('fs'); // To work with the file system
const path = require('path'); // To handle and transform file paths
const yaml = require('js-yaml'); // To parse YAML front matter in markdown files


//2024-12-06 17:57:08 
const posts = []; // Array to hold the blog posts
// Function to generate the list of blog posts
function generateBlogPosts() {
    const blogDir = path.join(__dirname, 'posts'); // Directory where markdown files are stored

    // Check if the 'posts' directory exists
    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir).sort().reverse(); // Get all files in the 'posts' directory
        
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
                        
                        // Handle missing or empty `image`
                        const image = frontMatter.image && frontMatter.image.trim() !== '' 
                            ? `images/${frontMatter.image}` 
                            : 'images/default.jpg';
                        
                        
                        // Push the parsed data into the posts array
                        posts.push({
                            title: frontMatter.title,
                            date: frontMatter.date,
                            tags: frontMatter.tags || [], // Extract tags
                            content: content.replace(frontMatterRegex, '').replace(/\n/g, '<br>'), // Remove the front matter from the content; 2024-12-06 18:49:06 respect new lines 
                            image
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


// Generate and count tags
function getTagData(blogPosts) {
    const tagCounts = {};

    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (tagCounts[tag]) {
                tagCounts[tag]++;
            } else {
                tagCounts[tag] = 1;
            }
        });
    });

    return tagCounts;
}

// Function to generate a slug from the post title
function generateSlug(title, date) {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const timestamp = new Date(date).getTime();  // Use the post date as part of the ID
    return `${formattedTitle}-${timestamp}`;
}

// Function to update the blog page with the generated blog posts
function updateBlogPage() {
    const blogPosts = generateBlogPosts(); // Generate the list of blog posts
    const blogHtmlPath = path.join(__dirname, 'index.html'); // Path to the HTML file

    // Read the HTML file into memory
    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Generate tag HTML
    const tagData = getTagData(blogPosts);
    let tagHtml = '';
    for (const [tag, count] of Object.entries(tagData)) {
        tagHtml += `<span class="tag" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag} (${count})</span>`;
    }
    // Add tag HTML to the page 
    blogHtmlContent = blogHtmlContent.replace(
        /<div id="tag-container" style="padding: 0px 0px 50px 0px;">.*?<\/div>/s,
        `<div id="tag-container">${tagHtml}</div>`
    );

    // Create the HTML for the blog posts
    let postsHtml = '';
    blogPosts.forEach(post => {
        const postId = generateSlug(post.title, post.date);
        const baseUrl = "https://tenevj.github.io/mi-brand-distillery/blog/";
        const tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join(' ');

        // Extract content after the front matter (YAML is already stripped in the content property)
        const postContent = post.content.replace(/<br>/g, ' '); // Replace <br> tags with spaces to count words properly
        const wordCount = postContent.split(/\s+/).filter(word => word).length; // Count words excluding YAML

        // Calculate reading time (average: 200 words per minute)
        const averageReadingSpeed = 200;
        const readingTime = Math.ceil(wordCount / averageReadingSpeed);


        const postItem = `
            <article class="blog-post" id="${postId}" data-tags="${post.tags.join(',')}">
    
                <div class="post-header">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-meta">
                        <time datetime="${post.date}"><i class="far fa-calendar-alt"></i> ${post.date}</time>
                        <span class="reading-time"><i class="far fa-clock"></i> ${readingTime} min read</span>
                    </div>
                </div>
    
                <div class="post-image-container">
                    <img src="${post.image}" alt="${post.title}" class="featured-image">
                </div>
    
                <div class="post-content">
                    <p class="excerpt">${post.content.slice(0, 200)}...</p>
                    <p class="full-content" style="display: none;">${post.content}</p>
                    <div class="read-more-container">
                        <button class="btn btn-primary read-more" onclick="toggleContent(this)">Read More</button>
                    </div>
                </div>

            <div class="share-buttons">
                <span class="share-text">Share:</span>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}${postId}`)}" 
                class="share-button" 
                aria-label="Share on Facebook" 
                target="_blank" 
                rel="noopener noreferrer">
                    <i class="fab fa-facebook-f"></i>
                </a>

                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}${postId}`)}&text=${encodeURIComponent(post.title)}" 
                class="share-button" 
                aria-label="Share on Twitter" 
                target="_blank" 
                rel="noopener noreferrer">
                    <i class="fab fa-twitter"></i>
                </a>

                <a href="https://www.linkedin.com/shareArticle?url=${encodeURIComponent(`${baseUrl}${postId}`)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.content.slice(0, 200))}" 
                class="share-button" 
                aria-label="Share on LinkedIn" 
                target="_blank" 
                rel="noopener noreferrer">
                    <i class="fab fa-linkedin-in"></i>
                </a>

                <a href="mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.content.slice(0, 200))}%0A%0A${encodeURIComponent(`${baseUrl}${postId}`)}" 				
                class="share-button" 
                aria-label="Share via Email" 
                target="_blank" 
                rel="noopener noreferrer">
                    <i class="far fa-envelope"></i>
                </a>
                
                <div class="post-tags">${tagsHtml}</div>
            </div>

            </article>
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


