// ===== ANIMATIONS JAVASCRIPT =====

// Animation configuration
const ANIMATION_CONFIG = {
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.1,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// ===== GSAP ANIMATIONS =====

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.init();
    }
    
    init() {
        if (typeof gsap !== 'undefined') {
            this.setupGSAP();
        }
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupParallaxEffects();
    }
    
    setupGSAP() {
        // Register plugins
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
        
        // Set default configurations
        gsap.defaults({
            duration: ANIMATION_CONFIG.duration,
            ease: ANIMATION_CONFIG.ease
        });
        
        // Initialize GSAP animations
        this.initHeroAnimations();
        this.initTextAnimations();
        this.initStaggerAnimations();
        this.initScrollTriggerAnimations();
    }
    
    initHeroAnimations() {
        // Hero title animation
        const heroTitle = gsap.timeline();
        heroTitle
            .from('.hero-title .title-line', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power4.out'
            })
            .from('.hero-subtitle', {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.5')
            .from('.hero-cta', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.3');
        
        this.animations.set('hero', heroTitle);
    }
    
    initTextAnimations() {
        // Typewriter effect
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            gsap.to(element, {
                duration: 0,
                onComplete: () => {
                    gsap.to(element, {
                        duration: 2,
                        text: text,
                        ease: 'none',
                        delay: 0.5
                    });
                }
            });
        });
        
        // Gradient text animation
        const gradientTexts = document.querySelectorAll('.gradient-text');
        gradientTexts.forEach(text => {
            gsap.to(text, {
                backgroundPosition: '200% 50%',
                duration: 3,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });
        });
    }
    
    initStaggerAnimations() {
        // Stats animation
        gsap.from('.stat-item', {
            y: 50,
            opacity: 0,
            duration: 0.8,
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
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Spotlight cards animation
        gsap.from('.spotlight-card', {
            x: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.spotlight-carousel',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    initScrollTriggerAnimations() {
        // Parallax backgrounds
        gsap.to('.hero-background', {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
        
        // Fade in animations
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            gsap.from(element, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
        
        // Scale animations
        const scaleElements = document.querySelectorAll('.scale-in');
        scaleElements.forEach(element => {
            gsap.from(element, {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 15%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

// ===== INTERSECTION OBSERVER ANIMATIONS =====

class IntersectionAnimations {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupRevealAnimations();
        this.setupStaggerAnimations();
        this.setupCounterAnimations();
        this.setupProgressAnimations();
    }
    
    setupRevealAnimations() {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateReveal(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        });
        
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
        
        this.observers.set('reveal', revealObserver);
    }
    
    setupStaggerAnimations() {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStagger(entry.target);
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        });
        
        const staggerContainers = document.querySelectorAll('.stagger-container');
        staggerContainers.forEach(container => {
            staggerObserver.observe(container);
        });
        
        this.observers.set('stagger', staggerObserver);
    }
    
    setupCounterAnimations() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        const counterElements = document.querySelectorAll('[data-counter]');
        counterElements.forEach(element => {
            counterObserver.observe(element);
        });
        
        this.observers.set('counter', counterObserver);
    }
    
    setupProgressAnimations() {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgress(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        const progressElements = document.querySelectorAll('.progress-bar');
        progressElements.forEach(element => {
            progressObserver.observe(element);
        });
        
        this.observers.set('progress', progressObserver);
    }
    
    animateReveal(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('revealed');
    }
    
    animateStagger(container) {
        const items = container.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('revealed');
            }, index * 100);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    animateProgress(element) {
        const target = parseInt(element.getAttribute('data-progress')) || 100;
        element.style.width = target + '%';
    }
}

// ===== SCROLL ANIMATIONS =====

class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupParallaxEffects();
        this.setupScrollBasedAnimations();
        this.setupStickyAnimations();
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupScrollBasedAnimations() {
        const scrollElements = document.querySelectorAll('[data-scroll-animation]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            scrollElements.forEach(element => {
                const elementTop = element.offsetTop;
                const elementHeight = element.offsetHeight;
                const animationType = element.getAttribute('data-scroll-animation');
                
                if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
                    this.applyScrollAnimation(element, animationType, scrolled, elementTop);
                }
            });
        });
    }
    
    setupStickyAnimations() {
        const stickyElements = document.querySelectorAll('.sticky-animation');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            stickyElements.forEach(element => {
                const start = parseInt(element.getAttribute('data-sticky-start')) || 0;
                const end = parseInt(element.getAttribute('data-sticky-end')) || 1000;
                
                if (scrolled >= start && scrolled <= end) {
                    const progress = (scrolled - start) / (end - start);
                    this.applyStickyAnimation(element, progress);
                }
            });
        });
    }
    
    applyScrollAnimation(element, type, scrolled, elementTop) {
        const progress = (scrolled - elementTop) / window.innerHeight;
        
        switch (type) {
            case 'fade':
                element.style.opacity = Math.max(0, Math.min(1, progress));
                break;
            case 'slide-up':
                element.style.transform = `translateY(${Math.max(0, 50 - progress * 50)}px)`;
                break;
            case 'scale':
                element.style.transform = `scale(${Math.max(0.8, 1 - progress * 0.2)})`;
                break;
            case 'rotate':
                element.style.transform = `rotate(${progress * 360}deg)`;
                break;
        }
    }
    
    applyStickyAnimation(element, progress) {
        element.style.transform = `translateY(${progress * 100}px)`;
        element.style.opacity = 1 - progress;
    }
}

// ===== HOVER ANIMATIONS =====

class HoverAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupButtonHovers();
        this.setupCardHovers();
        this.setupImageHovers();
        this.setupTextHovers();
        this.setupIconHovers();
    }
    
    setupButtonHovers() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.animateButtonHover(button, 'enter');
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateButtonHover(button, 'leave');
            });
        });
    }
    
    setupCardHovers() {
        const cards = document.querySelectorAll('.card, .feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, 'leave');
            });
        });
    }
    
    setupImageHovers() {
        const images = document.querySelectorAll('.img-hover-zoom, .img-hover-overlay');
        
        images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                this.animateImageHover(image, 'enter');
            });
            
            image.addEventListener('mouseleave', () => {
                this.animateImageHover(image, 'leave');
            });
        });
    }
    
    setupTextHovers() {
        const texts = document.querySelectorAll('.text-hover-glow, .text-hover-underline');
        
        texts.forEach(text => {
            text.addEventListener('mouseenter', () => {
                this.animateTextHover(text, 'enter');
            });
            
            text.addEventListener('mouseleave', () => {
                this.animateTextHover(text, 'leave');
            });
        });
    }
    
    setupIconHovers() {
        const icons = document.querySelectorAll('.icon-hover');
        
        icons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                this.animateIconHover(icon, 'enter');
            });
            
            icon.addEventListener('mouseleave', () => {
                this.animateIconHover(icon, 'leave');
            });
        });
    }
    
    animateButtonHover(button, action) {
        if (action === 'enter') {
            gsap.to(button, {
                y: -5,
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(button, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
    
    animateCardHover(card, action) {
        if (action === 'enter') {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
    
    animateImageHover(image, action) {
        const img = image.querySelector('img');
        if (!img) return;
        
        if (action === 'enter') {
            gsap.to(img, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(img, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
    
    animateTextHover(text, action) {
        if (action === 'enter') {
            gsap.to(text, {
                textShadow: '0 0 10px rgba(56, 142, 60, 0.5)',
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(text, {
                textShadow: 'none',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
    
    animateIconHover(icon, action) {
        if (action === 'enter') {
            gsap.to(icon, {
                rotation: 360,
                scale: 1.2,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        } else {
            gsap.to(icon, {
                rotation: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }
}

// ===== MICRO-INTERACTIONS =====

class MicroInteractions {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupRippleEffects();
        this.setupMagneticEffects();
        this.setupTiltEffects();
        this.setupCursorEffects();
        this.setupLoadingAnimations();
    }
    
    setupRippleEffects() {
        const rippleElements = document.querySelectorAll('.ripple');
        
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
            });
        });
    }
    
    setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.applyMagneticEffect(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetMagneticEffect(element);
            });
        });
    }
    
    setupTiltEffects() {
        const tiltElements = document.querySelectorAll('.tilt');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                this.applyTiltEffect(e, element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.resetTiltEffect(element);
            });
        });
    }
    
    setupCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            
            gsap.to(cursorFollower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });
        
        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .hover-effect');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorFollower.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorFollower.classList.remove('cursor-hover');
            });
        });
    }
    
    setupLoadingAnimations() {
        const loadingElements = document.querySelectorAll('.loading-animation');
        
        loadingElements.forEach(element => {
            this.startLoadingAnimation(element);
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
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
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    applyMagneticEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    resetMagneticEffect(element) {
        gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    applyTiltEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        gsap.to(element, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    resetTiltEffect(element) {
        gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    }
    
    startLoadingAnimation(element) {
        const dots = element.querySelectorAll('.loading-dot');
        
        gsap.to(dots, {
            y: -10,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
        });
    }
}

// ===== ANIMATION UTILITIES =====

class AnimationUtils {
    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    static easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    
    static easeInOutBack(t) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;
        
        return t < 0.5
            ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
            : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
    
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }
    
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animation classes
    window.animationManager = new AnimationManager();
    window.intersectionAnimations = new IntersectionAnimations();
    window.scrollAnimations = new ScrollAnimations();
    window.hoverAnimations = new HoverAnimations();
    window.microInteractions = new MicroInteractions();
    
    // Add custom cursor styles
    const cursorStyles = `
        <style>
            .custom-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                background: var(--color-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.1s ease;
            }
            
            .cursor-follower {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid var(--color-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: transform 0.3s ease;
            }
            
            .cursor-hover {
                transform: scale(1.5);
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .custom-cursor,
                .cursor-follower {
                    display: none;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', cursorStyles);
});

// ===== EXPORT FOR MODULE USE =====

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        IntersectionAnimations,
        ScrollAnimations,
        HoverAnimations,
        MicroInteractions,
        AnimationUtils
    };
} 