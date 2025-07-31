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

// Setup leaderboard track switching
function setupLeaderboardTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const leaderboardTable = document.querySelector('.leaderboard-table tbody');
    
    if (tabButtons.length === 0 || !leaderboardTable) {
        console.log('Elements not found, skipping leaderboard setup');
        return;
    }
    
    // Baseline data from DCVLR organizers
    const leaderboardData = {
        '10k': [
            { rank: 1, team: 'Base model (Qwen2.5-VL-72B)', score: '72.6%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 2, team: 'Base model (Molmo-7B-D-0924)', score: '56.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 3, team: 'Base model (Molmo-7B-O-0924)', score: '35.0%', submissions: 'Baseline', lastUpdate: '-' },
            { rank: 4, team: 'LLMS-R1', score: 'TBD', submissions: 'Baseline', lastUpdate: '-' },
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
    
    function updateButtonStyles(activeTrack) {
        tabButtons.forEach(btn => {
            const track = btn.getAttribute('data-track');
            if (track === activeTrack) {
                // Active button styling
                btn.classList.remove('text-text-secondary', 'bg-white');
                btn.classList.add('bg-accent', 'text-white', 'border-accent');
            } else {
                // Inactive button styling
                btn.classList.remove('bg-accent', 'text-white', 'border-accent');
                btn.classList.add('text-text-secondary', 'bg-white');
            }
        });
    }
    
    // Add click listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const track = this.getAttribute('data-track');
            
            // Update button styles
            updateButtonStyles(track);
            
            // Update leaderboard content
            updateLeaderboard(track);
            
            // Track tab switch
            trackButtonClick(`leaderboard_${track}_tab`, 'leaderboard');
        });
    });
    
    // Initialize with 10k track by default
    updateButtonStyles('10k');
    updateLeaderboard('10k');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
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
    setupLeaderboardTabs();
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