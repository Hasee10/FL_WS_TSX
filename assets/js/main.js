// ===== MAIN JAVASCRIPT =====

// Global variables
let currentLanguage = 'en';
let isScrolled = false;
let isMobileMenuOpen = false;

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const languageSelector = document.getElementById('language-selector');
const languageModal = document.getElementById('language-modal');
const helpWidget = document.getElementById('help-widget');
const helpToggle = document.getElementById('help-toggle');
const helpPanel = document.getElementById('help-panel');
const helpClose = document.getElementById('help-close');
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const modalClose = document.getElementById('modal-close');
const playVideoBtns = document.querySelectorAll('.play-video-btn');
const statNumbers = document.querySelectorAll('.stat-number');
const beforeAfterSliders = document.querySelectorAll('.before-after-slider');

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeStats();
    initializeSliders();
    initializeModals();
    initializeHelpWidget();
    initializeLanguageSelector();
    initializeVideoPlayers();
    initializeAOS();
    initializeSwiper();
    
    // Add event listeners
    addEventListeners();
    
    // Initialize GSAP animations
    initializeGSAP();
}

// ===== NAVIGATION =====

function initializeNavigation() {
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (isMobileMenuOpen) {
                    toggleMobileMenu();
                }
                
                // Update active link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMobileMenuOpen && !navbar.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
}

function updateActiveNavLink(activeId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====

function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to navbar
        if (scrollTop > 100 && !isScrolled) {
            navbar.classList.add('scrolled');
            isScrolled = true;
        } else if (scrollTop <= 100 && isScrolled) {
            navbar.classList.remove('scrolled');
            isScrolled = false;
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLinkOnScroll();
    });
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink('#' + sectionId);
        }
    });
}

// ===== ANIMATIONS =====

function initializeAnimations() {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Stagger animations
    const staggerElements = document.querySelectorAll('.stagger-item');
    
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    staggerElements.forEach(element => {
        staggerObserver.observe(element);
    });
}

// ===== STATS COUNTER =====

function initializeStats() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateStatCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ===== BEFORE/AFTER SLIDERS =====

function initializeSliders() {
    beforeAfterSliders.forEach(slider => {
        const container = slider.querySelector('.slider-container');
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        
        if (!container || !handle || !afterImage) return;
        
        let isDragging = false;
        let startX, startLeft;
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events
        handle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
        
        // Click to move
        container.addEventListener('click', function(e) {
            if (!isDragging) {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                updateSlider(percentage);
            }
        });
        
        function startDrag(e) {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            startLeft = parseFloat(getComputedStyle(handle).left);
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const x = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const dx = x - startX;
            const containerWidth = container.offsetWidth;
            const percentage = Math.max(0, Math.min(100, (startLeft + dx) / containerWidth * 100));
            
            updateSlider(percentage);
        }
        
        function stopDrag() {
            isDragging = false;
        }
        
        function updateSlider(percentage) {
            handle.style.left = percentage + '%';
            afterImage.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        }
    });
}

// ===== MODALS =====

function initializeModals() {
    // Language modal
    if (languageSelector) {
        languageSelector.addEventListener('click', () => {
            languageModal.classList.add('active');
        });
    }
    
    // Close modals
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            videoModal.classList.remove('active');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        });
    }
    
    if (helpClose) {
        helpClose.addEventListener('click', () => {
            helpPanel.classList.remove('active');
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.classList.remove('active');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        
        if (e.target === languageModal) {
            languageModal.classList.remove('active');
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            videoModal.classList.remove('active');
            languageModal.classList.remove('active');
            helpPanel.classList.remove('active');
            
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        }
    });
}

// ===== HELP WIDGET =====

function initializeHelpWidget() {
    if (helpToggle) {
        helpToggle.addEventListener('click', () => {
            helpPanel.classList.toggle('active');
        });
    }
    
    // Help options
    const helpOptions = document.querySelectorAll('.help-option');
    helpOptions.forEach(option => {
        option.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            handleHelpTopic(topic);
        });
    });
    
    // Chat functionality
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
}

function handleHelpTopic(topic) {
    const responses = {
        demo: 'I can help you schedule a demo! Please provide your contact information and preferred date/time.',
        pricing: 'Our pricing varies based on your specific needs. Let me connect you with our sales team.',
        support: 'For technical support, please call our 24/7 support line at 1-800-FALCON or email support@falconlaserlevelers.com.',
        contact: 'You can reach our sales team at sales@falconlaserlevelers.com or call 1-800-FALCON.'
    };
    
    addChatMessage('bot', responses[topic] || 'I\'m here to help! What would you like to know?');
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (message) {
        addChatMessage('user', message);
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                'Thank you for your message! Our team will get back to you soon.',
                'I understand your question. Let me connect you with the right person.',
                'That\'s a great question! Here\'s what I can tell you...',
                'I\'m here to help! Is there anything specific about our laser leveling technology?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('bot', randomResponse);
        }, 1000);
    }
}

function addChatMessage(type, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===== LANGUAGE SELECTOR =====

function initializeLanguageSelector() {
    const languageOptions = document.querySelectorAll('.language-option');
    
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            languageModal.classList.remove('active');
        });
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Update language selector text
    const langText = document.querySelector('#language-selector span');
    if (langText) {
        langText.textContent = lang.toUpperCase();
    }
    
    // Here you would typically load language-specific content
    // For now, we'll just show a notification
    showNotification(`Language changed to ${lang.toUpperCase()}`);
}

// ===== VIDEO PLAYERS =====

function initializeVideoPlayers() {
    playVideoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            if (videoSrc && modalVideo) {
                modalVideo.src = videoSrc;
                videoModal.classList.add('active');
                modalVideo.play();
            }
        });
    });
}

// ===== AOS (Animate On Scroll) =====

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 0
        });
    }
}

// ===== SWIPER =====

function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        const spotlightSwiper = new Swiper('.spotlight-carousel', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 1,
                }
            }
        });
    }
}

// ===== GSAP ANIMATIONS =====

function initializeGSAP() {
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.hero-title .title-line', {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-cta', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.8,
            ease: 'power3.out'
        });
        
        // Stats panel animation
        gsap.from('.stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.stats-panel',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Feature cards animation
        gsap.from('.feature-card', {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Parallax effect for hero background
        gsap.to('.hero-background', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

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

// ===== EVENT LISTENERS =====

function addEventListeners() {
    // Window resize handler
    window.addEventListener('resize', debounce(() => {
        // Reinitialize components that need resize handling
        if (typeof Swiper !== 'undefined') {
            // Update Swiper if needed
        }
    }, 250));
    
    // Window scroll handler (throttled)
    window.addEventListener('scroll', throttle(() => {
        // Additional scroll handling if needed
    }, 16));
    
    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Button click handlers
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Add loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Form submitted successfully!', 'success');
        
        // Remove loading state
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
        
        // Reset form
        e.target.reset();
    }, 2000);
}

function handleButtonClick(e) {
    const button = e.currentTarget;
    
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'assets/images/falcon-logo.svg',
        'assets/images/og-image.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    preloadResources();
});

// ===== ERROR HANDLING =====

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
}); 