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
    
    // Setup section tracking and team member clicks after main content is shown
    setTimeout(() => {
        setupSectionTracking();
        setupTeamMemberClicks();
        setupLeaderboardTabs();
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

// Setup leaderboard track switching
function setupLeaderboardTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const leaderboardTable = document.querySelector('.leaderboard-table tbody');
    
    // If elements not found, try again after a short delay
    if (tabButtons.length === 0 || !leaderboardTable) {
        setTimeout(setupLeaderboardTabs, 500);
        return;
    }
    
    // Baseline data from DCVLR organizers
    const leaderboardData = {
        '1k': [
            { rank: 1, team: 'Base model (Qwen 2.5VL)', score: '60.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 2, team: 'Base model (Molmo-D)', score: '56.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 3, team: 'Base model (Molmo-O)', score: '35.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 4, team: 'LLMS-R1', score: 'TBD', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 5, team: 'Random', score: 'TBD', submissions: 'Baseline', lastUpdate: '-' }
        ],
        '10k': [
            { rank: 1, team: 'Base model (Qwen 2.5VL)', score: '60.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 2, team: 'Base model (Molmo-D)', score: '56.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 3, team: 'Base model (Molmo-O)', score: '35.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 4, team: 'LLMS-R1', score: 'TBD', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 5, team: 'Random', score: 'TBD', submissions: 'Baseline', lastUpdate: '-' }
        ]
    };
    
    function updateLeaderboard(track) {
        const data = leaderboardData[track];
        if (!data || !leaderboardTable) return;
        
        leaderboardTable.innerHTML = '';
        
        data.forEach(entry => {
            const row = document.createElement('tr');
            if (entry.rank <= 3) {
                row.classList.add('top-3');
            }
            
            row.innerHTML = `
                <td class="rank">${entry.rank}</td>
                <td class="team-name">${entry.team}</td>
                <td class="score">${entry.score}</td>
                <td>${entry.submissions}</td>
                <td>${entry.lastUpdate}</td>
            `;
            
            leaderboardTable.appendChild(row);
        });
        
        // Track leaderboard view
        trackEvent('leaderboard_view', {
            label: `${track}_track`,
            section: 'leaderboard',
            track: track,
            value: 1
        });
    }
    
    // Add click listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const track = this.getAttribute('data-track');
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update leaderboard content
            updateLeaderboard(track);
            
            // Track tab switch
            trackButtonClick(`leaderboard_${track}_tab`, 'leaderboard');
        });
    });
    
    // Initialize with 1k track by default
    updateLeaderboard('1k');
}

// Initialize password protection
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthentication()) {
        showMainContent();
        setupSectionTracking();
        setupTeamMemberClicks();
        setupLeaderboardTabs();
    } else {
        // Set up password form event listener
        const passwordForm = document.getElementById('password-form');
        passwordForm.addEventListener('submit', handlePasswordSubmit);
        
        // Focus on password input
        document.getElementById('password-input').focus();
    }

    // Initialize leaderboard regardless of password protection
    setupLeaderboardTabs();

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