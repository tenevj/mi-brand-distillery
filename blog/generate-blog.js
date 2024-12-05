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
    blogPostsList.innerHTML += postItem; // Append the new post item
  });
  