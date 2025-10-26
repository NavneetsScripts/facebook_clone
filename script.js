// Facebook Clone JavaScript Functionality

// Global variables
let posts = [];
let postIdCounter = 1;
let currentUser = {
    name: 'You',
    avatar: 'socialbook_img/images/profile-pic.png'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    setupEventListeners();
    
    // Load sample posts
    loadSamplePosts();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize reaction functionality
    initializeReactions();
    
    // Initialize notifications
    initializeNotifications();
}

function setupEventListeners() {
    // Post creation
    const postInput = document.getElementById('postInput');
    if (postInput) {
        postInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                createPost(this.value.trim());
                this.value = '';
            }
        });
    }
    
    // Comment inputs
    document.addEventListener('keypress', function(e) {
        if (e.target.classList.contains('comment-input') && e.key === 'Enter') {
            if (e.target.value.trim()) {
                addComment(e.target);
                e.target.value = '';
            }
        }
    });
    
    // Share buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.share-btn')) {
            handleShare(e.target.closest('.share-btn'));
        }
    });
}

function loadSamplePosts() {
    // Sample posts are already in HTML, we'll add them to our posts array
    const existingPosts = document.querySelectorAll('.post');
    existingPosts.forEach((post, index) => {
        const postData = {
            id: postIdCounter++,
            author: post.querySelector('.post-info h4').textContent,
            time: post.querySelector('.post-info span').textContent,
            content: post.querySelector('.post-content p').textContent,
            image: post.querySelector('.post-image') ? post.querySelector('.post-image').src : null,
            likes: parseInt(post.querySelector('.likes span').textContent),
            comments: [],
            isLiked: false
        };
        
        // Add existing comments
        const comments = post.querySelectorAll('.comment');
        comments.forEach(comment => {
            const author = comment.querySelector('.comment-author').textContent;
            const text = comment.querySelector('.comment-text').textContent;
            postData.comments.push({ author, text });
        });
        
        posts.push(postData);
    });
}

function createPost(content) {
    const postsContainer = document.getElementById('postsContainer');
    
    // Create new post element
    const postElement = document.createElement('div');
    postElement.className = 'post new-post';
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${currentUser.avatar}" alt="Profile" class="profile-img">
            <div class="post-info">
                <h4>You</h4>
                <span>Just now</span>
            </div>
            <div class="post-menu">
                <img src="socialbook_img/images/more.png" alt="More" class="post-menu-icon">
            </div>
        </div>
        <div class="post-content">
            <p>${escapeHtml(content)}</p>
        </div>
        <div class="post-stats">
            <div class="likes">
                <img src="socialbook_img/images/like-blue.png" alt="Likes" class="likes-icon">
                <span>0</span>
            </div>
            <div class="comments-count">
                <span>0 comments</span>
            </div>
        </div>
        <div class="post-actions">
            <div class="reaction-buttons">
                <button class="action-btn like-btn" onclick="toggleReaction(this, 'like')">
                    <img src="socialbook_img/images/like.png" alt="Like" class="action-icon">
                    <span>Like</span>
                </button>
                <div class="reaction-menu" style="display: none;">
                    <button class="reaction-btn" data-reaction="like" onclick="setReaction(this, 'like')">
                        <img src="socialbook_img/images/like-blue.png" alt="Like" class="reaction-icon">
                    </button>
                    <button class="reaction-btn" data-reaction="love" onclick="setReaction(this, 'love')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="haha" onclick="setReaction(this, 'haha')">
                        <i class="fas fa-laugh"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="wow" onclick="setReaction(this, 'wow')">
                        <i class="fas fa-surprise"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="sad" onclick="setReaction(this, 'sad')">
                        <i class="fas fa-sad-tear"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="angry" onclick="setReaction(this, 'angry')">
                        <i class="fas fa-angry"></i>
                    </button>
                </div>
            </div>
            <button class="action-btn comment-btn" onclick="toggleComments(this)">
                <img src="socialbook_img/images/comments.png" alt="Comment" class="action-icon">
                <span>Comment</span>
            </button>
            <button class="action-btn share-btn" onclick="sharePost(this)">
                <img src="socialbook_img/images/share.png" alt="Share" class="action-icon">
                <span>Share</span>
            </button>
        </div>
        <div class="comments-section" style="display: none;">
            <div class="add-comment">
                <img src="${currentUser.avatar}" alt="Profile" class="comment-img">
                <input type="text" placeholder="Write a comment..." class="comment-input">
            </div>
        </div>
    `;
    
    // Insert at the top
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
    
    // Add to posts array
    const newPost = {
        id: postIdCounter++,
        author: 'You',
        time: 'Just now',
        content: content,
        image: null,
        likes: 0,
        comments: [],
        isLiked: false
    };
    posts.unshift(newPost);
    
    // Remove animation class after animation completes
    setTimeout(() => {
        postElement.classList.remove('new-post');
    }, 300);
}

// Photo Upload Functions
function openPhotoUpload() {
    document.getElementById('photoUpload').click();
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const postContent = document.getElementById('postInput').value || 'Check out these photos!';
        createPostWithImages(postContent, files);
        document.getElementById('postInput').value = '';
    }
}

function handlePhotoUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const postContent = document.getElementById('postInput').value || 'Check out these photos!';
        createPostWithImages(postContent, files);
        document.getElementById('postInput').value = '';
    }
}

function createPostWithImages(content, files) {
    const postsContainer = document.getElementById('postsContainer');
    
    const postElement = document.createElement('div');
    postElement.className = 'post new-post';
    
    let imagesHtml = '';
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            imagesHtml += `<img src="" alt="Uploading..." class="post-image loading-image" data-file="${file.name}">`;
        }
    });
    
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${currentUser.avatar}" alt="Profile" class="profile-img">
            <div class="post-info">
                <h4>${currentUser.name}</h4>
                <span>Just now</span>
            </div>
            <div class="post-menu">
                <img src="socialbook_img/images/more.png" alt="More" class="post-menu-icon">
            </div>
        </div>
        <div class="post-content">
            <p>${escapeHtml(content)}</p>
            ${imagesHtml}
        </div>
        <div class="post-stats">
            <div class="likes">
                <img src="socialbook_img/images/like-blue.png" alt="Likes" class="likes-icon">
                <span>0</span>
            </div>
            <div class="comments-count">
                <span>0 comments</span>
            </div>
        </div>
        <div class="post-actions">
            <div class="reaction-buttons">
                <button class="action-btn like-btn" onclick="toggleReaction(this, 'like')">
                    <img src="socialbook_img/images/like.png" alt="Like" class="action-icon">
                    <span>Like</span>
                </button>
                <div class="reaction-menu" style="display: none;">
                    <button class="reaction-btn" data-reaction="like" onclick="setReaction(this, 'like')">
                        <img src="socialbook_img/images/like-blue.png" alt="Like" class="reaction-icon">
                    </button>
                    <button class="reaction-btn" data-reaction="love" onclick="setReaction(this, 'love')">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="haha" onclick="setReaction(this, 'haha')">
                        <i class="fas fa-laugh"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="wow" onclick="setReaction(this, 'wow')">
                        <i class="fas fa-surprise"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="sad" onclick="setReaction(this, 'sad')">
                        <i class="fas fa-sad-tear"></i>
                    </button>
                    <button class="reaction-btn" data-reaction="angry" onclick="setReaction(this, 'angry')">
                        <i class="fas fa-angry"></i>
                    </button>
                </div>
            </div>
            <button class="action-btn comment-btn" onclick="toggleComments(this)">
                <img src="socialbook_img/images/comments.png" alt="Comment" class="action-icon">
                <span>Comment</span>
            </button>
            <button class="action-btn share-btn" onclick="sharePost(this)">
                <img src="socialbook_img/images/share.png" alt="Share" class="action-icon">
                <span>Share</span>
            </button>
        </div>
        <div class="comments-section" style="display: none;">
            <div class="add-comment">
                <img src="${currentUser.avatar}" alt="Profile" class="comment-img">
                <input type="text" placeholder="Write a comment..." class="comment-input">
            </div>
        </div>
    `;
    
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
    
    // Load images asynchronously
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = postElement.querySelector(`img[data-file="${file.name}"]`);
                if (img) {
                    img.src = e.target.result;
                    img.classList.remove('loading-image');
                    img.alt = 'Uploaded Image';
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add to posts array
    const newPost = {
        id: postIdCounter++,
        author: currentUser.name,
        time: 'Just now',
        content: content,
        images: Array.from(files).map(f => f.name),
        likes: 0,
        comments: [],
        reactions: {}
    };
    posts.unshift(newPost);
    
    setTimeout(() => {
        postElement.classList.remove('new-post');
    }, 400);
}

// Reaction Functions
function initializeReactions() {
    // Close reaction menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.reaction-buttons')) {
            document.querySelectorAll('.reaction-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
}

function toggleReaction(button, defaultReaction) {
    const reactionMenu = button.querySelector('.reaction-menu');
    const isVisible = reactionMenu.style.display !== 'none';
    
    // Close all other reaction menus
    document.querySelectorAll('.reaction-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    
    if (!isVisible) {
        reactionMenu.style.display = 'flex';
    }
}

function setReaction(reactionBtn, reactionType) {
    const post = reactionBtn.closest('.post');
    const reactionButtons = post.querySelector('.reaction-buttons');
    const mainButton = reactionButtons.querySelector('.action-btn');
    const likesSpan = post.querySelector('.likes span');
    const likeIcon = mainButton.querySelector('i');
    const likeText = mainButton.querySelector('span');
    
    // Update main button
    mainButton.className = 'action-btn liked';
    mainButton.setAttribute('data-reaction', reactionType);
    
    // Update icon and text based on reaction
    const reactionIcons = {
        like: 'fas fa-thumbs-up',
        love: 'fas fa-heart',
        haha: 'fas fa-laugh',
        wow: 'fas fa-surprise',
        sad: 'fas fa-sad-tear',
        angry: 'fas fa-angry'
    };
    
    const reactionColors = {
        like: '#1877f2',
        love: '#f02849',
        haha: '#f7b928',
        wow: '#f7b928',
        sad: '#1877f2',
        angry: '#f02849'
    };
    
    likeIcon.className = reactionIcons[reactionType];
    likeText.textContent = reactionType.charAt(0).toUpperCase() + reactionType.slice(1);
    likeIcon.style.color = reactionColors[reactionType];
    
    // Update likes count
    let currentLikes = parseInt(likesSpan.textContent);
    if (!mainButton.classList.contains('liked')) {
        currentLikes++;
    }
    likesSpan.textContent = currentLikes;
    
    // Hide reaction menu
    const reactionMenu = reactionButtons.querySelector('.reaction-menu');
    reactionMenu.style.display = 'none';
    
    // Show notification
    showNotification(`You reacted with ${reactionType}!`);
}

function toggleLike(button) {
    // Legacy function for backward compatibility
    toggleReaction(button, 'like');
}

function toggleComments(button) {
    const post = button.closest('.post');
    const commentsSection = post.querySelector('.comments-section');
    
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        button.querySelector('span').textContent = 'Hide Comments';
    } else {
        commentsSection.style.display = 'none';
        button.querySelector('span').textContent = 'Comment';
    }
}

function addComment(input) {
    const commentText = input.value.trim();
    if (!commentText) return;
    
    const post = input.closest('.post');
    const commentsSection = post.querySelector('.comments-section');
    const commentsCount = post.querySelector('.comments-count span');
    
    // Create comment element
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <img src="${currentUser.avatar}" alt="Profile" class="comment-img">
        <div class="comment-content">
            <span class="comment-author">You</span>
            <span class="comment-text">${escapeHtml(commentText)}</span>
        </div>
    `;
    
    // Insert before the add-comment div
    const addCommentDiv = commentsSection.querySelector('.add-comment');
    commentsSection.insertBefore(commentElement, addCommentDiv);
    
    // Update comments count
    const currentCount = parseInt(commentsCount.textContent);
    commentsCount.textContent = `${currentCount + 1} comments`;
    
    // Update posts array
    const postIndex = Array.from(post.parentNode.children).indexOf(post);
    if (posts[postIndex]) {
        posts[postIndex].comments.push({
            author: 'You',
            text: commentText
        });
    }
}

function sharePost(button) {
    const post = button.closest('.post');
    const postContent = post.querySelector('.post-content p').textContent;
    
    // Simple share functionality - in a real app, this would integrate with social sharing APIs
    if (navigator.share) {
        navigator.share({
            title: 'Facebook Post',
            text: postContent,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(postContent).then(() => {
            showNotification('Post copied to clipboard!');
        }).catch(() => {
            showNotification('Unable to share post');
        });
    }
}

// Notification Functions
function initializeNotifications() {
    // Simulate random notifications
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            showRandomNotification();
        }
    }, 30000); // Every 30 seconds
}

function showRandomNotification() {
    const notifications = [
        'Alice Smith liked your post',
        'Bob Johnson commented on your photo',
        'Sarah Wilson shared your post',
        'Mike Davis sent you a friend request',
        'You have 3 new messages',
        'Your memory from 2 years ago is trending'
    ];
    
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
    showNotification(randomNotification);
}

function showNotifications() {
    showNotification('You have 3 new notifications');
}

function showMessages() {
    showNotification('You have 5 new messages');
}

function toggleUserMenu() {
    showNotification('User menu clicked');
}

// Additional utility functions
function openLiveVideo() {
    showNotification('Live video feature coming soon!');
}

function openFeelingActivity() {
    showNotification('Feeling/Activity feature coming soon!');
}

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Loading states
function showLoading(element) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    `;
    element.style.position = 'relative';
    element.appendChild(loading);
}

function hideLoading(element) {
    const loading = element.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Optimized search with debouncing
const debouncedSearch = debounce(function(query) {
    searchPosts(query);
}, 300);

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                debouncedSearch(query);
            } else {
                showAllPosts();
            }
        });
    }
}

function searchPosts(query) {
    const postsContainer = document.getElementById('postsContainer');
    const allPosts = postsContainer.querySelectorAll('.post');
    
    allPosts.forEach(post => {
        const content = post.querySelector('.post-content p').textContent.toLowerCase();
        const author = post.querySelector('.post-info h4').textContent.toLowerCase();
        
        if (content.includes(query) || author.includes(query)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function showAllPosts() {
    const postsContainer = document.getElementById('postsContainer');
    const allPosts = postsContainer.querySelectorAll('.post');
    
    allPosts.forEach(post => {
        post.style.display = 'block';
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #1877f2;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Additional utility functions
function formatTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Handle responsive menu
function toggleMobileMenu() {
    const leftSidebar = document.querySelector('.left-sidebar');
    if (leftSidebar) {
        leftSidebar.classList.toggle('mobile-open');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const leftSidebar = document.querySelector('.left-sidebar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (leftSidebar && leftSidebar.classList.contains('mobile-open')) {
        if (!leftSidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            leftSidebar.classList.remove('mobile-open');
        }
    }
});

// Initialize mobile menu on load
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        const leftSidebar = document.querySelector('.left-sidebar');
        if (leftSidebar) {
            leftSidebar.classList.remove('mobile-open');
        }
    }
});
