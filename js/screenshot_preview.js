// Screenshot Preview Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'screenshot-overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
    
    const previewImage = document.createElement('img');
    previewImage.className = 'screenshot-preview-image';
    overlay.appendChild(previewImage);
    
    let isOverOverlay = false;
    let hoverTimeout;
    let longPressTimer;
    
    // Find all screenshot links or images with preview capability
    const screenshotTriggers = document.querySelectorAll('[data-screenshot], .screenshot-trigger');
    
    screenshotTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', function(e) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                const screenshotUrl = this.getAttribute('data-screenshot') || this.src;
                if (screenshotUrl) {
                    previewImage.src = screenshotUrl;
                    overlay.style.display = 'flex';
                    overlay.classList.add('active');
                }
            }, 300); // 300ms delay before showing preview
        });
        
        trigger.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            setTimeout(() => {
                if (!isOverOverlay) {
                    overlay.style.display = 'none';
                    overlay.classList.remove('active');
                }
            }, 100);
        });
    });
    
    // Handle player avatars differently - show screenshot on long press
    const playerAvatars = document.querySelectorAll('.player-avatar');
    
    playerAvatars.forEach(avatar => {
        // Get the corresponding gallery button to find screenshots
        const row = avatar.closest('tr');
        const galleryBtn = row.querySelector('.screenshot-gallery-btn');
        const screenshots = galleryBtn ? JSON.parse(galleryBtn.getAttribute('data-screenshots')) : [];
        
        // Mouse/touch long press
        const startLongPress = (e) => {
            e.preventDefault();
            longPressTimer = setTimeout(() => {
                if (screenshots.length === 1) {
                    // If only one screenshot, show it directly
                    previewImage.src = screenshots[0];
                    overlay.style.display = 'flex';
                    overlay.classList.add('active');
                } else if (screenshots.length > 1) {
                    // If multiple screenshots, show gallery
                    galleryBtn.click();
                }
            }, 500); // 500ms long press
        };
        
        const cancelLongPress = () => {
            clearTimeout(longPressTimer);
        };
        
        // Mouse events
        avatar.addEventListener('mousedown', startLongPress);
        avatar.addEventListener('mouseup', cancelLongPress);
        avatar.addEventListener('mouseleave', cancelLongPress);
        
        // Touch events
        avatar.addEventListener('touchstart', startLongPress);
        avatar.addEventListener('touchend', cancelLongPress);
        avatar.addEventListener('touchcancel', cancelLongPress);
        
        // Prevent default context menu
        avatar.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Show screenshot on hover
        avatar.addEventListener('mouseenter', function(e) {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                if (screenshots.length === 1) {
                    // If only one screenshot, show it directly
                    previewImage.src = screenshots[0];
                    overlay.style.display = 'flex';
                    overlay.classList.add('active');
                } else if (screenshots.length > 1) {
                    // If multiple screenshots, show the first one
                    previewImage.src = screenshots[0];
                    overlay.style.display = 'flex';
                    overlay.classList.add('active');
                }
            }, 300);
        });
        
        avatar.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            setTimeout(() => {
                if (!isOverOverlay) {
                    overlay.style.display = 'none';
                    overlay.classList.remove('active');
                }
            }, 100);
        });
    });
    
    overlay.addEventListener('mouseenter', function() {
        isOverOverlay = true;
    });
    
    overlay.addEventListener('mouseleave', function() {
        isOverOverlay = false;
        overlay.style.display = 'none';
        overlay.classList.remove('active');
    });
    
    // Close overlay when clicking on it
    overlay.addEventListener('click', function() {
        this.style.display = 'none';
        this.classList.remove('active');
    });
    
    // Gallery functionality
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'screenshot-gallery-container';
    galleryContainer.style.display = 'none';
    document.body.appendChild(galleryContainer);
    
    const galleryGrid = document.createElement('div');
    galleryGrid.className = 'screenshot-gallery-grid';
    galleryContainer.appendChild(galleryGrid);
    
    const galleryClose = document.createElement('button');
    galleryClose.className = 'gallery-close-btn';
    galleryClose.innerHTML = '✕';
    galleryGrid.appendChild(galleryClose);
    
    galleryClose.addEventListener('click', function(e) {
        e.stopPropagation();
        galleryContainer.style.display = 'none';
    });
    
    // Close gallery when clicking outside
    galleryContainer.addEventListener('click', function(e) {
        if (e.target === galleryContainer) {
            galleryContainer.style.display = 'none';
        }
    });
    
    // Gallery buttons
    const galleryButtons = document.querySelectorAll('.screenshot-gallery-btn');
    galleryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const player = this.getAttribute('data-player');
            const screenshots = JSON.parse(this.getAttribute('data-screenshots'));
            
            // If only one screenshot, show it directly
            if (screenshots.length === 1) {
                previewImage.src = screenshots[0];
                overlay.style.display = 'flex';
                overlay.classList.add('active');
                return;
            }
            
            // Clear previous gallery
            galleryGrid.innerHTML = '';
            
            // Add title
            const title = document.createElement('h3');
            title.className = 'gallery-title';
            title.textContent = player + ' Screenshots';
            galleryGrid.appendChild(title);
            
            // Add screenshots
            screenshots.forEach(src => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'gallery-image-wrapper';
                
                const img = document.createElement('img');
                img.src = src;
                img.className = 'gallery-image';
                img.addEventListener('click', function() {
                    previewImage.src = src;
                    galleryContainer.style.display = 'none';
                    overlay.style.display = 'flex';
                    overlay.classList.add('active');
                });
                
                imgWrapper.appendChild(img);
                galleryGrid.appendChild(imgWrapper);
            });
            
            galleryContainer.style.display = 'flex';
        });
    });
});