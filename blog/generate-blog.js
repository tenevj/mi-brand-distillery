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
                            content: content.replace(frontMatterRegex, '')
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

    // Generate the HTML for the blog posts as a string
    let blogPostsHtml = '';
    blogPosts.forEach(post => {
        blogPostsHtml += `
            <li>
                <h3>${post.title}</h3>
                <p>${post.date}</p>
                <div>${post.content}</div>
            </li>
        `;
    });

    // Replace the placeholder <ul id="blog-posts"></ul> with the generated posts HTML
    blogHtmlContent = blogHtmlContent.replace('<ul id="blog-posts"></ul>', `<ul id="blog-posts">${blogPostsHtml}</ul>`);

    // Write the updated HTML back to the file
    fs.writeFileSync(blogHtmlPath, blogHtmlContent, 'utf8');
}

updateBlogPage();
