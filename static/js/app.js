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

// Setup team member card click handlers
function setupTeamMemberClicks() {
    document.querySelectorAll('.team-member').forEach(member => {
        const link = member.querySelector('h3 a');
        if (link) {
            // Add class to indicate this card has a link
            member.classList.add('has-link');
            
            // Add click handler to the entire card
            member.addEventListener('click', function(e) {
                // Prevent double navigation if clicking directly on the link
                if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                    // Track team member profile click
                    const memberName = member.querySelector('h3').textContent;
                    trackEvent('team_member_click', {
                        label: memberName,
                        section: 'team',
                        value: 1
                    });
                    
                    // Open link in new tab (matching the target="_blank" behavior)
                    window.open(link.href, '_blank', 'noopener');
                }
            });
        }
    });
}

// Leaderboard functionality removed - using static HTML leaderboard instead

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    if (mobileMenu) {
        const isHidden = mobileMenu.classList.toggle('hidden');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', !isHidden);
        }
    }
}

// Setup FAQ functionality
function setupFAQ() {
    document.querySelectorAll('.faq-item h3').forEach(item => {
        item.addEventListener('click', event => {
            const answer = event.target.nextElementSibling;
            const faqTitle = event.target.textContent;
            
            if (answer && answer.classList.contains('faq-answer')) {
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
            }
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup all functionality
    setupFAQ();
    setupSectionTracking();
    setupTeamMemberClicks();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 