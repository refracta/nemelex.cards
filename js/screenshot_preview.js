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
    
    // Find all screenshot links or images with preview capability
    const screenshotTriggers = document.querySelectorAll('[data-screenshot], .screenshot-trigger, .player-avatar');
    
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