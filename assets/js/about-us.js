console.log("JS Loaded")
// Unified About Us JavaScript - Complete Navigation Solution
// Supports both hash (#about-company-overview) and URL parameter (?group=about&section=company) methods

// Global variables
let currentGroup = 'about';
let currentSection = null;
let isNavigating = false; // Prevent recursive navigation
let referrerPage = null;

// Modal functions
function openModal() {
    document.getElementById('authModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

function openTab(evt, tabName) {
    var i, formContent, tabs;
    formContent = document.getElementsByClassName("form-content");
    for (i = 0; i < formContent.length; i++) {
        formContent[i].classList.remove("active");
    }
    
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Close modal when clicking outside
window.onclick = function(event) {
    var modal = document.getElementById('authModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Enhanced initialization function that handles both hash and URL params
function init() {
    if (isNavigating) return; // Prevent recursive calls
    
    console.log('Initializing navigation system...');
    
    // First, check for hash-based navigation
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        handleHashNavigation(hash);
        return;
    }
    
    // If no hash, check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const group = urlParams.get('group');
    const section = urlParams.get('section');
    const topic = urlParams.get('topic');
    const from = urlParams.get('from');

    console.log('URL params:', { group, section, topic, from });

    // Handle referrer information
    if (from) {
        referrerPage = from;
        showExternalIndicator(from);
    }

    // Set target group and section
    const targetGroup = group || 'about';
    const targetSection = section || topic;
    
    navigateToSection(targetGroup, targetSection);
}

// Handle hash-based navigation (#about-company-overview)
function handleHashNavigation(hash) {
    console.log('Handling hash navigation:', hash);
    
    // Show external link indicator if coming from another page
    if (document.referrer && !document.referrer.includes(window.location.hostname)) {
        showExternalIndicator('external page');
    }
    
    // Parse hash: "about-company-overview" -> group: "about", section: "company-overview"
    const [group, ...sectionParts] = hash.split('-');
    const section = sectionParts.join('-');
    
    if (group && section) {
        navigateToSection(group, section);
    } else {
        // Default fallback
        navigateToSection('about', 'company-overview');
    }
}

// Main navigation function that works with both hash and URL params
function navigateToSection(groupName, sectionName) {
    if (isNavigating) return;
    isNavigating = true;
    
    console.log('Navigating to:', groupName, sectionName);
    
    // Switch to the correct group
    switchGroup(groupName);

    // If section is specified, show it
    if (sectionName) {
	const mappedSection = mapSectionName(sectionName);
	const linkId = getSectionLinkId(groupName, mappedSection);
	const linkElement = document.getElementById(linkId);
    
	setTimeout(() => {
            showContent(groupName, mappedSection, linkElement);
	   
            scrollToSection(mappedSection);

            // 👉 Inject newsletter form if SUPPORT section is active
            if (mappedSection === "support") {
		const placeholder = document.getElementById("newsletter-placeholder");
		if (placeholder) {
                    fetch("./include/form.html")
			.then(res => res.text())
			.then(html => {
                            placeholder.innerHTML = html;

                            const script = document.createElement("script");
                            script.src = "../assets/js/newsletter.js";
                            document.body.appendChild(script);

                            const saved = sessionStorage.getItem("preFilledEmail");
                            if (saved) {
				const input = document.getElementById("email");
				if (input) input.value = saved;
				sessionStorage.removeItem("preFilledEmail");
                            }
			});
		}
            }
	    
            isNavigating = false;
	}, 100);
    } else {
	console.warn('No section specified — loading default...');
	// Show default section for the group
	setTimeout(() => {
            showDefaultSection(groupName);
            isNavigating = false;
	}, 100);
    }
}

// Map different section name formats to consistent internal format
function mapSectionName(sectionName) {
    const sectionMappings = {
        // Hash format to internal format
        'company-overview': 'company-overview',
        'mission-values': 'mission-values',
        'our-team': 'our-team',
        'careers': 'careers',
        'support': 'support',
        'faqs': 'faqs',
        'privacy-policy': 'privacy-policy',
        'terms-service': 'terms-service',
        'cookie-policy': 'cookie-policy',
        
        // URL param format to internal format
        'company': 'company-overview',
        'mission': 'mission-values',
        'team': 'our-team',
        'privacy': 'privacy-policy',
        'terms': 'terms-service',
        'cookie': 'cookie-policy'
    };
    
    return sectionMappings[sectionName] || sectionName;
}

// Get the link ID for a section
function getSectionLinkId(groupName, sectionName) {
    const linkMap = {
        'about': {
            'company-overview': 'company-link',
            'mission-values': 'mission-link',
            'our-team': 'team-link',
            'careers': 'careers-link',
            'support': 'support-link',
            'faqs': 'faqs-link'
        },
        'legal': {
            'privacy-policy': 'privacy-link',
            'terms-service': 'terms-link',
            'cookie-policy': 'cookie-link'
        }
    };
    
    return linkMap[groupName] && linkMap[groupName][sectionName] 
        ? linkMap[groupName][sectionName] 
        : null;
}

// Switch between groups (About Us / Legal Info)
function switchGroup(groupName) {
    console.log('Switching to group:', groupName);
    
    // Update group tabs
    const allGroupTabs = document.querySelectorAll('.group-tab');
    allGroupTabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.getElementById(`${groupName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Update group content visibility
    const allGroupContents = document.querySelectorAll('.group-content');
    allGroupContents.forEach(content => content.classList.remove('active'));

    const targetGroup = document.getElementById(`${groupName}-group`);
    if (targetGroup) {
        targetGroup.classList.add('active');
    }

    // Show/hide section menus
    const allMenus = document.querySelectorAll('.section-menu, .section-menu-active');
    allMenus.forEach(menu => {
        menu.classList.remove('active');
        menu.style.display = 'none';
    });
    
    const selectedMenu = document.getElementById(`${groupName}-menu`);
    if (selectedMenu) {
        selectedMenu.classList.add('active');
        selectedMenu.style.display = 'block';
    }

    currentGroup = groupName;

    
    // ✅ Fallback: If no section is active, show the default section
    setTimeout(() => {
        const activeSection = document.querySelector(`#${groupName}-group .content-section.active`);
        if (!activeSection) {
            console.log(`[auto-fix] No section active in group '${groupName}' — loading default`);
            showDefaultSection(groupName);
        }
    }, 150);
}

// Show default section for a group
function showDefaultSection(groupName) {
    let defaultSectionId = null;
    let defaultLink = null;

    if (groupName === 'about') {
        defaultSectionId = 'company-overview';
        defaultLink = document.getElementById('company-link');
    } else if (groupName === 'legal') {
        defaultSectionId = 'privacy-policy';
        defaultLink = document.getElementById('privacy-link');
    }

    if (defaultSectionId && defaultLink) {
        showContent(groupName, defaultSectionId, defaultLink);

        scrollToSection(defaultSectionId);
    } else {
        console.warn('No default section found for group:', groupName);
    }
}

// Enhanced showContent function
function showContent(group, sectionId, clickedElement) {
    console.log('Showing content:', group, sectionId);

    // Hide all content sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';

    // Inject per-section enhancements
    if (sectionId === 'terms-service') {
        if (typeof initializeTermsFeatures === 'function') {
            initializeTermsFeatures(); // Make sure this is defined earlier or copied here
        }
    }

    if (sectionId === 'privacy-policy') {
        initializePrivacyPolicyTOC();
    }
    //June 7
    if (sectionId === 'terms-service') {
    initializeTermsServiceTOC();
}


    if (sectionId === 'cookie-policy') {
        initializeCookiePolicyTOC();

    }

        currentSection = sectionId;
        console.log('Successfully showed section:', sectionId);
       
	
    } else {
        console.error('Section not found:', sectionId);
        return false;
    }

    // Update active menu links
    updateActiveMenuLinks(clickedElement, group);

    // Update URL (both hash and params) - only if not already navigating
    if (!isNavigating) {
        updateURL(group, sectionId);
    }

    return false;
}

// Update both hash and URL parameters
function updateURL(group, sectionId) {
    // Update hash format
    const hashFormat = `${group}-${sectionId}`;
    
    // Update URL parameters format
    const sectionKey = getSectionKey(sectionId);
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('group', group);
    if (sectionKey) {
        currentUrl.searchParams.set('section', sectionKey);
    }
    
    // Use hash as primary method
    currentUrl.hash = hashFormat;
    
    // Update browser history without reloading
    window.history.replaceState({}, '', currentUrl);
}

// Get section key from section ID for URL params
function getSectionKey(sectionId) {
    const mapping = {
        'company-overview': 'company',
        'mission-values': 'mission',
        'our-team': 'team',
        'careers': 'careers',
        'support': 'support',
        'faqs': 'faqs',
        'privacy-policy': 'privacy',
        'terms-service': 'terms',
        'cookie-policy': 'cookie'
    };
    return mapping[sectionId] || sectionId;
}

// Update active menu links
function updateActiveMenuLinks(clickedElement, group) {
    const currentMenu = document.getElementById(`${group}-menu`);
    if (currentMenu) {
        const allLinks = currentMenu.querySelectorAll('a');
        allLinks.forEach(link => link.classList.remove('active'));
    }

    if (clickedElement) {
        clickedElement.classList.add('active');
    }
}

// Scroll to section
function scrollToSection(sectionId) {
   setTimeout(() => {
       const section = document.getElementById(sectionId);
       window.scrollTo(0, 0);
       if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback: scroll to main content
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, 100);
 }

// FAQ toggle function
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isActive = answer.classList.contains('active');
    
    // Close all FAQ answers
    document.querySelectorAll('.faq-answer').forEach(ans => ans.classList.remove('active'));
    document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

    // Toggle current FAQ
    if (!isActive) {
        answer.classList.add('active');
        element.classList.add('active');
        
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Show external link indicator
function showExternalIndicator(from) {
    const indicator = document.getElementById('external-indicator');
    if (indicator) {
        indicator.innerHTML = `<i class="fas fa-external-link-alt"></i> You were redirected from ${from || 'external page'}`;
        indicator.style.display = 'block';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                indicator.style.display = 'none';
                indicator.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

// Handle browser navigation (back/forward)
window.addEventListener('popstate', function(event) {
    console.log('Popstate event - reinitializing...');
    setTimeout(init, 50); // Small delay to ensure URL is updated
});

// Handle hash changes
window.addEventListener('hashchange', function(event) {
    console.log('Hash change event');
    if (!isNavigating) {
        setTimeout(init, 50);
    }
});

// Form handlers (keeping existing functionality)
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log('Login attempt:', { email, password });
    closeModal();
    alert('Login functionality would be implemented here');
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    console.log('Registration attempt:', { name, email, password });
    closeModal();
    alert('Registration functionality would be implemented here');
}

// Enhanced DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing unified navigation...');
    
    // Initialize the navigation system
    init();
    
    // Set up form handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
     // Add compliance button functionality
    const closeButton = document.querySelector('.close-compliance');
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            toggleCompliance(this, event);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('authModal');
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
            
            const activeAnswers = document.querySelectorAll('.faq-answer.active');
            activeAnswers.forEach(answer => {
                answer.classList.remove('active');
                answer.previousElementSibling.classList.remove('active');
            });
        }
    });

    // 🍪 Cookie Policy Scrolling and TOC Highlighting (inserted before final log)
    const cookieContainer = document.getElementById('cookie-policy');
    if (cookieContainer) {
        const cookiePolicyLinks = cookieContainer.querySelectorAll('.toc-link');
        const cookieSections = cookieContainer.querySelectorAll('.cookie-section');

        cookiePolicyLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    cookiePolicyLinks.forEach(link => {
                        link.classList.remove('active');
                        link.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                        link.style.color = '#4a5568';
                    });

                    this.classList.add('active');
                    this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    this.style.color = 'white';
                }
            });
        });

        function highlightCurrentCookieSection() {
            let current = '';
            cookieSections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            cookiePolicyLinks.forEach(link => {
                link.classList.remove('active');
                link.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                link.style.color = '#4a5568';

                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                    link.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    link.style.color = 'white';
                }
            });
        }

        window.addEventListener('scroll', highlightCurrentCookieSection);
        highlightCurrentCookieSection();
    }

    console.log('Unified navigation system initialized');
});

// Utility functions
function getCurrentState() {
    return {
        group: currentGroup,
        section: currentSection,
        referrer: referrerPage,
        hash: window.location.hash,
        search: window.location.search
    };
}

function debugNavigation() {
    console.log('=== Navigation Debug Info ===');
    console.log('Current State:', getCurrentState());
    console.log('URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Search Params:', Object.fromEntries(new URLSearchParams(window.location.search)));
    console.log('============================');
}

// Legacy function compatibility
function navigateFromExternal(group, section, from) {
    const url = new URL(window.location);
    url.searchParams.set('group', group);
    if (section) url.searchParams.set('section', section);
    if (from) url.searchParams.set('from', from);
    window.history.replaceState({}, '', url);
    init();
}

function createExternalLink(group, section, from) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#${group}-${mapSectionName(section) || 'company-overview'}`;
}

// Export functions for global access
window.openModal = openModal;
window.closeModal = closeModal;
window.openTab = openTab;
window.switchGroup = switchGroup;
window.showContent = showContent;
window.toggleFaq = toggleFaq;
window.navigateToSection = navigateToSection;
window.navigateFromExternal = navigateFromExternal;
window.createExternalLink = createExternalLink;
window.debugNavigation = debugNavigation;

// --- Section Specific Feature Initializers ---

function initializePrivacyPolicyTOC() {
    const links = document.querySelectorAll('#privacy-policy .toc-link');
    const sections = document.querySelectorAll('#privacy-policy .privacy-section');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    function highlightCurrentSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();
}

/*June 7 */
function initializeTermsServiceTOC() {
    const container = document.getElementById('terms-service');
    if (!container) return;

    const tocLinks = container.querySelectorAll('.toc-link');
    const sections = container.querySelectorAll('.terms-section');

    // Scroll to section on click
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                tocLinks.forEach(l => {
                    l.classList.remove('active');
                    l.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                    l.style.color = '#4a5568';
                });

                this.classList.add('active');
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                this.style.color = 'white';
            }
        });
    });

    // Highlight current section in TOC
    function highlightCurrentSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            link.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
            link.style.color = '#4a5568';

            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                link.style.color = 'white';
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();
}

function initializeCookiePolicyTOC() {
    const cookieContainer = document.getElementById('cookie-policy');
    if (!cookieContainer) return;

    const cookiePolicyLinks = cookieContainer.querySelectorAll('.toc-link');
    const cookieSections = cookieContainer.querySelectorAll('.cookie-section');

    cookiePolicyLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                cookiePolicyLinks.forEach(link => {
                    link.classList.remove('active');
                    link.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
                    link.style.color = '#4a5568';
                });

                this.classList.add('active');
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                this.style.color = 'white';
            }
        });
    });

    function highlightCurrentCookieSection() {
        let current = '';
        cookieSections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        cookiePolicyLinks.forEach(link => {
            link.classList.remove('active');
            link.style.background = 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)';
            link.style.color = '#4a5568';

            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                link.style.color = 'white';
            }
        });
    }

    window.addEventListener('scroll', highlightCurrentCookieSection);
    highlightCurrentCookieSection();
}


//-- JS (toggleCompliance + cookieConsent) -->

function toggleCompliance(el, event) {
    event.stopPropagation();
    event.preventDefault();
    
    let container = el.closest('.compliance-toggle-container');
    if (!container) return;
    let panel = container.querySelector('.collapsible-compliance');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Handle cookie banner
function handleCookieConsent(accepted) {
  localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.display = 'none';
  }

  // Optional: trigger analytics, etc.
  if (accepted) {
    console.log("✅ Cookies accepted");
    // initializeAnalytics();
  } else {
    console.log("🚫 Cookies rejected");
  }
}

  window.addEventListener('DOMContentLoaded', () => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      document.getElementById('cookie-banner').style.display = 'flex';
    }
  });


 
// Check on load

// Show cookie banner if not already accepted/rejected
window.addEventListener('DOMContentLoaded', () => {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.style.display = 'flex';
    }
  }
});

