// Google Analytics Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-LRCL2NG8LH', {
    page_title: 'DCVLR Competition',
    page_location: window.location.href,
    custom_map: {
        'custom_parameter_1': 'competition_section'
    }
});

// Custom event tracking function
function trackEvent(eventName, parameters = {}) {
    gtag('event', eventName, {
        event_category: 'DCVLR_Competition',
        event_label: parameters.label || '',
        value: parameters.value || 0,
        custom_parameter_1: parameters.section || '',
        ...parameters
    });
}

// Track page sections viewed
function trackSectionView(sectionName) {
    trackEvent('section_view', {
        label: sectionName,
        section: sectionName
    });
}

// Track button clicks
function trackButtonClick(buttonName, buttonType = 'cta') {
    trackEvent('button_click', {
        label: buttonName,
        section: buttonType,
        value: 1
    });
}

// Track form submissions
function trackFormSubmission(formName, success = true) {
    trackEvent('form_submission', {
        label: formName,
        section: 'forms',
        success: success,
        value: success ? 1 : 0
    });
}

// Track resource downloads/views
function trackResourceAccess(resourceName, resourceType) {
    trackEvent('resource_access', {
        label: resourceName,
        section: 'resources',
        resource_type: resourceType,
        value: 1
    });
}

// Track social sharing
function trackSocialShare(platform) {
    trackEvent('social_share', {
        label: platform,
        section: 'social',
        platform: platform,
        value: 1
    });
}

// Password Protection Configuration
const CORRECT_PASSWORD = 'dcvlr2025'; // Change this to your desired password
const SESSION_KEY = 'dcvlr_authenticated';

// Check if user is already authenticated in this session
function checkAuthentication() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}

// Show main content and hide password overlay
function showMainContent() {
    document.getElementById('password-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    sessionStorage.setItem(SESSION_KEY, 'true');
    
    // Setup section tracking after main content is shown
    setTimeout(() => {
        setupSectionTracking();
    }, 1000);
}

// Handle password form submission
function handlePasswordSubmit(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password-input');
    const errorDiv = document.getElementById('password-error');
    const enteredPassword = passwordInput.value;

    if (enteredPassword === CORRECT_PASSWORD) {
        // Track successful authentication
        trackFormSubmission('password_authentication', true);
        trackEvent('authentication_success', {
            label: 'password_correct',
            section: 'authentication'
        });
        showMainContent();
    } else {
        // Track failed authentication
        trackFormSubmission('password_authentication', false);
        trackEvent('authentication_failure', {
            label: 'password_incorrect',
            section: 'authentication'
        });
        errorDiv.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Setup section view tracking with Intersection Observer
function setupSectionTracking() {
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Track when 30% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                trackSectionView(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize password protection
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthentication()) {
        showMainContent();
        setupSectionTracking();
    } else {
        // Set up password form event listener
        const passwordForm = document.getElementById('password-form');
        passwordForm.addEventListener('submit', handlePasswordSubmit);
        
        // Focus on password input
        document.getElementById('password-input').focus();
    }

    // Simple FAQ toggle functionality
    document.querySelectorAll('.faq-item h3').forEach(item => {
        item.addEventListener('click', event => {
            const answer = event.target.nextElementSibling;
            const faqTitle = event.target.textContent;
            
            if (answer.style.display === 'none' || answer.style.display === '') {
                answer.style.display = 'block';
                trackEvent('faq_opened', {
                    label: faqTitle,
                    section: 'faq',
                    value: 1
                });
            } else {
                answer.style.display = 'none';
                trackEvent('faq_closed', {
                    label: faqTitle,
                    section: 'faq',
                    value: 0
                });
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 