// ===== COMPONENTS JAVASCRIPT =====

// ===== SLIDER COMPONENT =====

class Slider {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
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
            },
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (typeof Swiper !== 'undefined') {
            this.swiper = new Swiper(this.element, this.options);
        } else {
            this.initCustomSlider();
        }
    }
    
    initCustomSlider() {
        const slides = this.element.querySelectorAll('.swiper-slide');
        const pagination = this.element.querySelector('.swiper-pagination');
        const prevBtn = this.element.querySelector('.swiper-button-prev');
        const nextBtn = this.element.querySelector('.swiper-button-next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Create pagination dots
        if (pagination) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.className = 'swiper-pagination-bullet';
                dot.addEventListener('click', () => this.goToSlide(i));
                pagination.appendChild(dot);
            }
        }
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Mouse drag support
        let isDragging = false;
        let startPos = 0;
        
        this.element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.clientX;
        });
        
        this.element.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.element.addEventListener('mouseup', (e) => {
            if (isDragging) {
                const endPos = e.clientX;
                const diff = startPos - endPos;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
                isDragging = false;
            }
        });
        
        // Autoplay
        if (this.options.autoplay) {
            setInterval(() => {
                this.nextSlide();
            }, this.options.autoplay.delay);
        }
        
        this.updateSlider();
    }
    
    goToSlide(index) {
        currentSlide = index;
        this.updateSlider();
    }
    
    nextSlide() {
        currentSlide = (currentSlide + 1) % this.options.slidesPerView;
        this.updateSlider();
    }
    
    prevSlide() {
        currentSlide = currentSlide === 0 ? this.options.slidesPerView - 1 : currentSlide - 1;
        this.updateSlider();
    }
    
    handleSwipe() {
        const diff = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    updateSlider() {
        const slides = this.element.querySelectorAll('.swiper-slide');
        const dots = this.element.querySelectorAll('.swiper-pagination-bullet');
        
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('swiper-pagination-bullet-active', index === currentSlide);
        });
    }
}

// ===== MODAL COMPONENT =====

class Modal {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            backdrop: true,
            keyboard: true,
            focus: true,
            ...options
        };
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        // Create backdrop
        if (this.options.backdrop) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop';
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // Close button
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Keyboard support
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
        
        // Focus trap
        if (this.options.focus) {
            this.setupFocusTrap();
        }
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.element);
        
        // Add classes
        this.element.classList.add('modal-show');
        this.backdrop.classList.add('modal-backdrop-show');
        
        // Focus first focusable element
        const firstFocusable = this.element.querySelector('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Trigger event
        this.element.dispatchEvent(new CustomEvent('modal:open'));
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        
        // Remove classes
        this.element.classList.remove('modal-show');
        this.backdrop.classList.remove('modal-backdrop-show');
        
        // Remove elements after animation
        setTimeout(() => {
            if (this.backdrop.parentNode) {
                this.backdrop.parentNode.removeChild(this.backdrop);
            }
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Trigger event
        this.element.dispatchEvent(new CustomEvent('modal:close'));
    }
    
    setupFocusTrap() {
        const focusableElements = this.element.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// ===== FORM COMPONENT =====

class Form {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            validation: true,
            ajax: false,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.fields = this.element.querySelectorAll('input, textarea, select');
        this.submitBtn = this.element.querySelector('button[type="submit"]');
        
        // Add event listeners
        this.element.addEventListener('submit', (e) => this.handleSubmit(e));
        
        this.fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
        
        // Real-time validation
        if (this.options.validation) {
            this.setupRealTimeValidation();
        }
    }
    
    setupRealTimeValidation() {
        this.fields.forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.length > 0) {
                    this.validateField(field);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required validation
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Type-specific validation
        switch (type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'url':
                if (value && !this.isValidUrl(value)) {
                    this.showFieldError(field, 'Please enter a valid URL');
                    return false;
                }
                break;
        }
        
        // Custom validation
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && value.length < parseInt(minLength)) {
            this.showFieldError(field, `Minimum ${minLength} characters required`);
            return false;
        }
        
        if (maxLength && value.length > parseInt(maxLength)) {
            this.showFieldError(field, `Maximum ${maxLength} characters allowed`);
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('form-error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        field.classList.remove('form-error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return false;
        }
        
        if (this.submitBtn) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        }
        
        if (this.options.ajax) {
            this.submitAjax();
        } else {
            this.submitForm();
        }
    }
    
    validateForm() {
        let isValid = true;
        
        this.fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    submitAjax() {
        const formData = new FormData(this.element);
        
        fetch(this.element.action, {
            method: this.element.method || 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            this.handleResponse(data);
        })
        .catch(error => {
            this.handleError(error);
        })
        .finally(() => {
            if (this.submitBtn) {
                this.submitBtn.classList.remove('loading');
                this.submitBtn.disabled = false;
            }
        });
    }
    
    submitForm() {
        // Simulate form submission
        setTimeout(() => {
            this.showSuccess('Form submitted successfully!');
            this.element.reset();
            
            if (this.submitBtn) {
                this.submitBtn.classList.remove('loading');
                this.submitBtn.disabled = false;
            }
        }, 2000);
    }
    
    handleResponse(data) {
        if (data.success) {
            this.showSuccess(data.message || 'Form submitted successfully!');
            this.element.reset();
        } else {
            this.showError(data.message || 'An error occurred. Please try again.');
        }
    }
    
    handleError(error) {
        console.error('Form submission error:', error);
        this.showError('An error occurred. Please try again.');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `form-notification form-notification-${type}`;
        notification.textContent = message;
        
        this.element.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    // Validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

// ===== ACCORDION COMPONENT =====

class Accordion {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            multiple: false,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.items = this.element.querySelectorAll('.accordion-item');
        
        this.items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', () => this.toggleItem(item));
            }
        });
    }
    
    toggleItem(item) {
        const isActive = item.classList.contains('active');
        
        if (!this.options.multiple) {
            // Close other items
            this.items.forEach(otherItem => {
                if (otherItem !== item) {
                    this.closeItem(otherItem);
                }
            });
        }
        
        if (isActive) {
            this.closeItem(item);
        } else {
            this.openItem(item);
        }
    }
    
    openItem(item) {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        item.classList.add('active');
        header.classList.add('active');
        content.classList.add('active');
        
        // Animate content height
        const contentHeight = content.scrollHeight;
        content.style.height = '0px';
        
        requestAnimationFrame(() => {
            content.style.height = contentHeight + 'px';
        });
    }
    
    closeItem(item) {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        item.classList.remove('active');
        header.classList.remove('active');
        
        // Animate content height
        const contentHeight = content.scrollHeight;
        content.style.height = contentHeight + 'px';
        
        requestAnimationFrame(() => {
            content.style.height = '0px';
        });
        
        setTimeout(() => {
            content.classList.remove('active');
        }, 300);
    }
}

// ===== TABS COMPONENT =====

class Tabs {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            defaultTab: 0,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.tabList = this.element.querySelector('.tab-list');
        this.tabButtons = this.element.querySelectorAll('.tab-button');
        this.tabContents = this.element.querySelectorAll('.tab-content');
        
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.switchTab(index));
        });
        
        // Set default tab
        this.switchTab(this.options.defaultTab);
    }
    
    switchTab(index) {
        // Update buttons
        this.tabButtons.forEach((button, i) => {
            button.classList.toggle('active', i === index);
        });
        
        // Update contents
        this.tabContents.forEach((content, i) => {
            content.classList.toggle('active', i === index);
        });
        
        // Trigger event
        this.element.dispatchEvent(new CustomEvent('tabs:change', {
            detail: { index, tab: this.tabButtons[index] }
        }));
    }
}

// ===== DROPDOWN COMPONENT =====

class Dropdown {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            trigger: 'click',
            ...options
        };
        
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.toggle = this.element.querySelector('.dropdown-toggle');
        this.menu = this.element.querySelector('.dropdown-menu');
        
        if (this.options.trigger === 'click') {
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleDropdown();
            });
        } else if (this.options.trigger === 'hover') {
            this.element.addEventListener('mouseenter', () => this.open());
            this.element.addEventListener('mouseleave', () => this.close());
        }
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.close();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggleDropdown() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.element.classList.add('show');
        this.menu.classList.add('show');
        
        // Focus first item
        const firstItem = this.menu.querySelector('.dropdown-item');
        if (firstItem) {
            firstItem.focus();
        }
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.element.classList.remove('show');
        this.menu.classList.remove('show');
    }
}

// ===== TOOLTIP COMPONENT =====

class Tooltip {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            content: element.getAttribute('data-tooltip'),
            position: 'top',
            delay: 200,
            ...options
        };
        
        this.isVisible = false;
        this.timeout = null;
        this.init();
    }
    
    init() {
        this.createTooltip();
        
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
        this.element.addEventListener('focus', () => this.show());
        this.element.addEventListener('blur', () => this.hide());
    }
    
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.textContent = this.options.content;
        document.body.appendChild(this.tooltip);
    }
    
    show() {
        clearTimeout(this.timeout);
        
        this.timeout = setTimeout(() => {
            this.isVisible = true;
            this.positionTooltip();
            this.tooltip.classList.add('show');
        }, this.options.delay);
    }
    
    hide() {
        clearTimeout(this.timeout);
        
        this.timeout = setTimeout(() => {
            this.isVisible = false;
            this.tooltip.classList.remove('show');
        }, this.options.delay);
    }
    
    positionTooltip() {
        const elementRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (this.options.position) {
            case 'top':
                top = elementRect.top - tooltipRect.height - 8;
                left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = elementRect.bottom + 8;
                left = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
                left = elementRect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = elementRect.top + (elementRect.height - tooltipRect.height) / 2;
                left = elementRect.right + 8;
                break;
        }
        
        // Ensure tooltip stays within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (left < 0) left = 8;
        if (left + tooltipRect.width > viewportWidth) left = viewportWidth - tooltipRect.width - 8;
        if (top < 0) top = 8;
        if (top + tooltipRect.height > viewportHeight) top = viewportHeight - tooltipRect.height - 8;
        
        this.tooltip.style.top = top + 'px';
        this.tooltip.style.left = left + 'px';
    }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize sliders
    const sliders = document.querySelectorAll('.swiper');
    sliders.forEach(slider => {
        new Slider(slider);
    });
    
    // Initialize modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        new Modal(modal);
    });
    
    // Initialize forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        new Form(form);
    });
    
    // Initialize accordions
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        new Accordion(accordion);
    });
    
    // Initialize tabs
    const tabs = document.querySelectorAll('.tabs');
    tabs.forEach(tab => {
        new Tabs(tab);
    });
    
    // Initialize dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        new Dropdown(dropdown);
    });
    
    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        new Tooltip(element);
    });
});

// ===== EXPORT FOR MODULE USE =====

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Slider,
        Modal,
        Form,
        Accordion,
        Tabs,
        Dropdown,
        Tooltip
    };
} 