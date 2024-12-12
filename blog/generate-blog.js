// Importing required libraries
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const posts = []; // Array to hold the blog posts

// Function to generate the list of blog posts
function generateBlogPosts() {
    const blogDir = path.join(__dirname, 'posts'); // Directory for markdown files

    if (fs.existsSync(blogDir)) {
        const files = fs.readdirSync(blogDir).sort().reverse(); // Get files sorted by name

        files.forEach(file => {
            if (file.endsWith('.md')) {
                const filePath = path.join(blogDir, file);
                const content = fs.readFileSync(filePath, 'utf8');

                const frontMatterRegex = /^---([\s\S]*?)---/;
                const match = content.match(frontMatterRegex);

                if (match) {
                    try {
                        const frontMatter = yaml.load(match[1]);
                        const image = frontMatter.image && frontMatter.image.trim() !== '' 
                            ? `images/${frontMatter.image}` 
                            : 'images/default.jpg';

                        posts.push({
                            title: frontMatter.title,
                            date: frontMatter.date,
                            tags: frontMatter.tags || [],
                            content: content.replace(frontMatterRegex, '').replace(/\n/g, '<br>'),
                            image
                        });
                    } catch (error) {
                        console.error("Error parsing YAML in file:", file, error);
                    }
                }
            }
        });
    }

    return posts;
}

// Generate and count tags
function getTagData(blogPosts) {
    const tagCounts = {};

    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count }));
}

// Function to generate a slug from the post title
function generateSlug(title, date) {
    const formattedTitle = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const timestamp = new Date(date).getTime();
    return `${formattedTitle}-${timestamp}`;
}

// Function to update the blog page with the generated blog posts
function updateBlogPage() {
    const blogPosts = generateBlogPosts();
    const blogHtmlPath = path.join(__dirname, 'index.html');
    let blogHtmlContent = fs.readFileSync(blogHtmlPath, 'utf8');

    // Generate tag HTML
    const tagData = getTagData(blogPosts);
    const topTags = tagData.slice(0, 5);
    const restTags = tagData.slice(5);

    const topTagHtml = topTags
        .map(({ tag, count }) => `<span class="tag" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag} (${count})</span>`)
        .join('');
    const restTagHtml = restTags
        .map(({ tag, count }) => `<span class="rest-tags" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag} (${count})</span>`)
        .join('');
    const loadMoreHtml = restTags.length > 0
        ? `<button id="load-more-tags" onclick="loadMoreTags()">Load More Tags</button>`
        : '';

    const tagHtml = `<div id="top-tags">${topTagHtml}</div>
                     <div id="rest-tags-container" style="display: none;">${restTagHtml}</div>
                     ${loadMoreHtml}`;

    blogHtmlContent = blogHtmlContent.replace(
        /<div id="tag-container" style="padding: 0px 0px 50px 0px;">.*?<\/div>/s,
        `<div id="tag-container" style="padding: 0px 0px 50px 0px;">${tagHtml}</div>`
    );

    // Generate HTML for blog posts
    let postsHtml = '';
    blogPosts.forEach(post => {
        const postId = generateSlug(post.title, post.date);
        const baseUrl = "https://tenevj.github.io/mi-brand-distillery/blog/";
        const tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join(' ');
        const postContent = post.content.replace(/<br>/g, ' ');
        const wordCount = postContent.split(/\s+/).filter(word => word).length;
        const readingTime = Math.ceil(wordCount / 200);

        postsHtml += `
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
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}${postId}`)}" class="share-button" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(`${baseUrl}${postId}`)}&text=${encodeURIComponent(post.title)}" class="share-button" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?url=${encodeURIComponent(`${baseUrl}${postId}`)}&title=${encodeURIComponent(post.title)}" class="share-button" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(post.content.slice(0, 200))}%0A%0A${encodeURIComponent(`${baseUrl}${postId}`)}" class="share-button" target="_blank" rel="noopener noreferrer">
                        <i class="far fa-envelope"></i>
                    </a>
                </div>
                <div class="post-tags">Tags: ${tagsHtml}</div>
            </article>`;
    });

    blogHtmlContent = blogHtmlContent.replace(/<ul id="blog-posts">.*?<\/ul>/s, `<ul id="blog-posts">${postsHtml}</ul>`);

    fs.writeFileSync(blogHtmlPath, blogHtmlContent, 'utf8');
}

updateBlogPage();
