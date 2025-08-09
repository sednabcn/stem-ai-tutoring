// session-loader.js - Enhanced Version with Fixed Session Management

// ========================================
// ENVIRONMENT CONFIGURATION
// ========================================
const ENV_CONFIG = {
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    isGitHubPages: window.location.hostname.includes('github.io'),
    isProduction: !window.location.hostname.includes('localhost') && !window.location.hostname.includes('github.io') && !window.location.hostname.includes('127.0.0.1'),
    
    get current() {
        if (this.isDevelopment) return 'development';
        if (this.isGitHubPages) return 'github';
        return 'production';
    },

    get baseURL() {
	switch (this.current) {
            case 'development':
            case 'production':
                   return '.';
            case 'github': {
                const pathParts = window.location.pathname.split('/');
                const projectRoot = '/' + pathParts[1]; // e.g., /stem-ai-tutoring
                return window.location.origin + projectRoot;
            }
            default:
                return '.';
	}
    }

};

// ========================================
// ENHANCED ERROR HANDLING SYSTEM
// ========================================
class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.silentErrors = new Set(['ResizeObserver loop limit exceeded', 'Script error']);
        this.setupGlobalErrorHandling();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            // Filter out common non-critical rejections
            if (this.shouldIgnoreError(event.reason)) {
                event.preventDefault();
                return;
            }
            
            this.logError('Unhandled Promise Rejection', event.reason);
            event.preventDefault();
        });
        
        window.addEventListener('error', (event) => {
            // Filter out non-critical errors
            if (this.shouldIgnoreError(event.message)) {
                return;
            }
            
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });
    }
    
    shouldIgnoreError(error) {
        if (!error) return true;
        
        const errorMessage = error.message || error.toString();
        
        // Ignore common non-critical errors
        const ignoredPatterns = [
            'ResizeObserver loop limit exceeded',
            'Script error',
            'Network request failed',
            'Loading CSS chunk',
            'Loading chunk',
            'ChunkLoadError',
            'Non-Error promise rejection captured'
        ];
        
        return ignoredPatterns.some(pattern => errorMessage.includes(pattern)) ||
               this.silentErrors.has(errorMessage);
    }
    
    logError(type, error, context = {}) {
        // Skip if error should be ignored
        if (this.shouldIgnoreError(error)) return;
        
        const errorEntry = {
            type,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            environment: ENV_CONFIG.current
        };
        
        this.errors.push(errorEntry);
        
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }
        
        // Only log in development for debugging
        if (ENV_CONFIG.isDevelopment) {
            console.error(`[${type}]`, error, context);
        }
        
        this.reportError(errorEntry);
    }
    
    async reportError(errorEntry) {
        if (ENV_CONFIG.isDevelopment) return;
        
        try {
            // In production, you would send to your error reporting service
            // For now, just log silently
            if (errorEntry.type !== 'JavaScript Error') {
                console.warn('Error logged:', errorEntry.type);
            }
        } catch (reportingError) {
            // Fail silently to avoid infinite error loops
        }
    }
    
    getErrorSummary() {
        const summary = {
            total: this.errors.length,
            byType: {},
            recent: this.errors.slice(-5)
        };
        
        this.errors.forEach(error => {
            summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
        });
        
        return summary;
    }
}

// ========================================
// ENHANCED PERFORMANCE MANAGER
// ========================================
class PerformanceManager {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        this.observers = new Map();
        this.preloadCache = new Set();
    }
    
    debounce(key, fn, delay = 300) {
        clearTimeout(this.debounceTimers.get(key));
        
        const timer = setTimeout(() => {
            try {
                fn();
            } catch (error) {
                window.errorHandler?.logError('Debounced Function Error', error, { key });
            }
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
    }
    
    throttle(key, fn, limit = 100) {
        if (this.throttleTimers.has(key)) return;
        
        this.throttleTimers.set(key, true);
        
        try {
            fn();
        } catch (error) {
            window.errorHandler?.logError('Throttled Function Error', error, { key });
        }
        
        setTimeout(() => {
            this.throttleTimers.delete(key);
        }, limit);
    }
    
    lazyLoad(elements, callback, options = {}) {
        if (!elements || elements.length === 0) return null;
        
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    try {
                        callback(entry.target);
                        observer.unobserve(entry.target);
                    } catch (error) {
                        window.errorHandler?.logError('Lazy Load Callback Error', error);
                    }
                }
            });
        }, { ...defaultOptions, ...options });
        
        elements.forEach(el => {
            if (el && el.nodeType === Node.ELEMENT_NODE) {
                observer.observe(el);
            }
        });
        
        return observer;
    }
    
    async preloadResources(resources) {
        if (!resources || resources.length === 0) return;
        
        const promises = resources.map(resource => {
            return new Promise((resolve) => {
                // Skip if already preloaded
                if (this.preloadCache.has(resource.url)) {
                    resolve();
                    return;
                }
                
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = resource.type || 'script';
                link.href = resource.url;
                
                const timeout = setTimeout(() => {
                    resolve(); // Don't fail on timeout
                }, 5000);
                
                link.onload = () => {
                    clearTimeout(timeout);
                    this.preloadCache.add(resource.url);
                    resolve();
                };
                
                link.onerror = () => {
                    clearTimeout(timeout);
                    resolve(); // Don't fail on error
                };
                
                document.head.appendChild(link);
                
                // Clean up after 10 seconds to prevent unused preload warnings
                setTimeout(() => {
                    if (document.head.contains(link)) {
                        document.head.removeChild(link);
                    }
                }, 10000);
            });
        });
        
        try {
            await Promise.allSettled(promises);
            console.log('✅ Resources preloaded');
        } catch (error) {
            // Fail silently - preloading is an optimization, not critical
        }
    }
    
    mark(name) {
        try {
            performance.mark(name);
        } catch (error) {
            // Ignore performance API errors
        }
    }
    
    measure(name, startMark, endMark) {
        try {
            performance.measure(name, startMark, endMark);
            const measure = performance.getEntriesByName(name)[0];
            return measure ? measure.duration : 0;
        } catch (error) {
            return 0;
        }
    }
}

// ========================================
// ENHANCED ASYNC UTILITIES
// ========================================
class AsyncWrapper {
    static async withRetry(fn, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                
                if (ENV_CONFIG.isDevelopment) {
                    console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
                }
                await this.sleep(delay);
                delay *= 2;
            }
        }
    }
    
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    static timeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timed out')), ms)
            )
        ]);
    }
}

// ========================================
// ENHANCED SCRIPT LOADER MODULE
// ========================================
class ScriptLoader {
    constructor() {
        this.loadedScripts = new Set();
        this.loadingScripts = new Map();
        this.performanceManager = new PerformanceManager();
    }
    
    async loadScript(src) {
        // Return existing promise if script is already loading
        if (this.loadingScripts.has(src)) {
            return this.loadingScripts.get(src);
        }
        
        // Return immediately if script is already loaded
        if (this.loadedScripts.has(src)) {
            return Promise.resolve();
        }
        
        const loadPromise = AsyncWrapper.withRetry(async () => {
            return AsyncWrapper.timeout(new Promise((resolve, reject) => {
                this.performanceManager.mark(`script-load-start-${src}`);
                
                const script = document.createElement('script');
                script.src = src;
                script.async = false;
                
                script.onload = () => {
                    this.loadedScripts.add(src);
                    this.loadingScripts.delete(src);
                    
                    this.performanceManager.mark(`script-load-end-${src}`);
                    const duration = this.performanceManager.measure(
                        `script-load-${src}`,
                        `script-load-start-${src}`,
                        `script-load-end-${src}`
                    );
                    
                    if (ENV_CONFIG.isDevelopment) {
                        console.log(`📊 Script loaded in ${duration.toFixed(2)}ms: ${src}`);
                    }
                    resolve();
                };
                
                script.onerror = () => {
                    this.loadingScripts.delete(src);
                    reject(new Error(`Failed to load script: ${src}`));
                };
                
                document.head.appendChild(script);
            }), 10000); // 10 second timeout
        }, 2, 500); // Only 2 retries for scripts
        
        this.loadingScripts.set(src, loadPromise);
        
        try {
            await loadPromise;
        } catch (error) {
            this.loadingScripts.delete(src);
            throw error;
        }
        
        return loadPromise;
    }
    
    async loadScriptsInOrder(scripts) {
        for (const script of scripts) {
            try {
                await this.loadScript(script);
            } catch (error) {
                window.errorHandler?.logError('Script Loading Failed', error, { script });
                // Continue loading other scripts even if one fails
                if (ENV_CONFIG.isDevelopment) {
                    console.warn(`⚠️ Failed to load ${script}, continuing with remaining scripts`);
                }
            }
        }
    }
    
    preloadScript(src) {
        if (this.loadedScripts.has(src)) return;
        
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = src;
        document.head.appendChild(link);
    }
}

// ========================================
// NOTIFICATION CENTER MODULE
// ========================================
class NotificationCenter {
    constructor() {
        this.notifications = [];
        this.isOpen = false;
        this.activeFilter = 'all';
        this.loadSampleNotifications();
    }
    
    loadSampleNotifications() {
        this.notifications = [
            {
                id: 1,
                type: 'incomplete',
                title: 'Incomplete Assignment Review',
                message: 'Assignment "Math Quiz Chapter 5" needs to be reviewed and graded.',
                time: new Date(Date.now() - 30 * 60 * 1000),
                read: false,
                priority: 'high',
                icon: '📝'
            },
            {
                id: 2,
                type: 'students',
                title: 'New Student Enrolled',
                message: 'Sarah Johnson has enrolled in your Advanced Mathematics course.',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000),
                read: false,
                priority: 'medium',
                icon: '👨‍🎓'
            }
        ];
    }
    
    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            time: new Date(),
            read: false,
            priority: notification.priority || 'medium',
            ...notification
        };
        
        this.notifications.unshift(newNotification);
        this.updateDisplay();
        this.animateBell();
    }
    
    updateDisplay() {
        this.updateBadge();
    }
    
    updateBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notificationCount');
        const bellElement = document.getElementById('notificationBell');
        
        if (countElement && bellElement) {
            if (unreadCount > 0) {
                countElement.textContent = unreadCount > 99 ? '99+' : unreadCount;
                countElement.classList.remove('hidden');
                bellElement.classList.add('has-notifications');
            } else {
                countElement.classList.add('hidden');
                bellElement.classList.remove('has-notifications');
            }
        }
    }
    
    togglePanel() {
        this.isOpen ? this.closePanel() : this.openPanel();
    }
    
    openPanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.add('active');
            this.isOpen = true;
        }
    }
    
    closePanel() {
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('active');
            this.isOpen = false;
        }
    }
    
    animateBell() {
        const bell = document.getElementById('notificationBell');
        if (bell) {
            bell.style.animation = 'none';
            setTimeout(() => {
                bell.style.animation = 'bellShake 0.5s ease-in-out';
            }, 10);
        }
    }
}

// ========================================
// MODAL MANAGER MODULE
// ========================================
class ModalManager {
    constructor() {
        this.activeModals = new Set();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                const lastModal = Array.from(this.activeModals).pop();
                this.closeModal(lastModal);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modalId = e.target.id;
                if (modalId) {
                    this.closeModal(modalId);
                }
            }
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.classList.add('show');
            this.activeModals.add(modalId);
            
            // Focus management
            const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            this.activeModals.delete(modalId);
        }
    }
    
    closeAllModals() {
        this.activeModals.forEach(modalId => this.closeModal(modalId));
    }
}

// ========================================
// FORUM SYSTEM MODULE
// ========================================
class ForumSystem {
    constructor() {
        this.currentForum = null;
        this.currentTab = 'browse';
        this.forums = new Map();
        this.posts = new Map();
    }
    
    initialize() {
        console.log('👥 Forum system initialized');
    }
    
    switchTab(tabName) {
        document.querySelectorAll('.forum-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[onclick*="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        this.currentTab = tabName;
    }
    
    openForum(forumId) {
        this.currentForum = forumId;
        console.log('Opening forum:', forumId);
    }
}

// ========================================
// SESSION MANAGER CORE
// ========================================
class SessionManager {
    constructor() {
        this.currentSession = null;
        this.tutorData = {
            name: "Dr. Sarah Johnson",
            notifications: 3,
            sessions: [],
            isVerified: false,
            profileCompletion: 25,
	     completedCards: {
		 agreement: false,      // Card 1 - Required
		 interview: false,      // Card 2 - Required  
		 documents: false,      // Card 3 - Required
		 verification: false,   // Card 4 - Required
		 schedule: false,       // Card 5 - Required
		 students: false,       // Card 6 - NOT required
		 tools: false,          // Card 7 - NOT required
		 analytics: false,      // Card 8 - NOT required
		 premium: false         // Card 9 - NOT required
	     }
        };
        
        this.topNavFeatures = {
            notifications: false,
            forums: false,
            messaging: false
        };
    }
    
    getCurrentSession() {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionParam = urlParams.get('session');
        
        if (sessionParam) return sessionParam;
        
        // Default to 'onboard' session
        return 'onboard';
    }
    
    switchSession(session) {
        console.log('🔄 Switching to session:', session);
        
        try {
            // Hide all session containers
            document.querySelectorAll('.session-container').forEach(container => {
                container.classList.add('hidden');
            });
            
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Hide the default view when switching to other sessions
            const defaultView = document.getElementById('defaultView');
            if (defaultView) {
                defaultView.classList.add('hidden');
                defaultView.style.display = 'none';
            }
            
            switch (session) {
                case 'onboard':
                    this.showOnboardSession();
                    this.updateDashboardButtons('onboarding');
                    break;
                case 'dashboard':
                    this.showDashboardSession();
                    this.updateDashboardButtons('tutor');
                    break;
                case 'home':
                    this.showHomeSession();
                    this.updateDashboardButtons(null); // Clear button states
                    break;
            }
            
            this.updateURL(session);
            this.currentSession = session;
        } catch (error) {
            window.errorHandler?.logError('Session Switch Error', error, { session });
        }
    }
    
    showOnboardSession() {
        // Try different possible IDs for onboard container
        const onboardContainer = document.getElementById('onboarding') || 
                                document.getElementById('onboard-session') ||
                                document.querySelector('.onboard-session');
        
        if (onboardContainer) {
            onboardContainer.classList.remove('hidden');
            onboardContainer.style.display = 'block';
            console.log('✅ Onboard session displayed');
        } else {
            console.warn('⚠️ Onboard container not found');
        }
    }
    
    showDashboardSession() {
        // Try different possible IDs for dashboard container
        const dashboardContainer = document.getElementById('tutor') || 
                                  document.getElementById('tutor-dashboard') ||
                                  document.querySelector('.tutor-dashboard');
	 // Add class to session display for styling
	const sessionDisplay = document.querySelector('.session-display');
	if (sessionDisplay) {
            sessionDisplay.classList.add('dashboard-active');
            sessionDisplay.classList.remove('onboard-active');
	}   
        
        if (dashboardContainer) {
            dashboardContainer.classList.remove('hidden');
            dashboardContainer.style.display = 'block';
            console.log('✅ Dashboard session displayed');
        } else {
            console.warn('⚠️ Dashboard container not found');
        }
    }
    
    showHomeSession() {
        const defaultView = document.getElementById('defaultView');
        const landingContainer = document.getElementById('landing-page');
        
        if (defaultView) {
            defaultView.style.display = 'block';
            defaultView.style.visibility = 'visible';
            defaultView.style.opacity = '1';
            defaultView.classList.remove('hidden');
        }
        
        if (landingContainer) {
            landingContainer.classList.remove('hidden');
        }
        
        console.log('✅ Home session displayed');
    }
    
    updateDashboardButtons(activeSession) {
        // Update button states to reflect current session
        const dashboardButtons = document.querySelectorAll('.dashboard-btn');
        
        // Clear all button active states
        dashboardButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Set active button based on current session
        if (activeSession === 'onboarding') {
            const onboardingBtn = document.querySelector('.dashboard-btn:contains("ONBOARDING")') || 
                                   document.querySelector('[data-session="onboard"]') ||
                                   document.querySelector('#onboardingBtn');
            if (onboardingBtn) {
                onboardingBtn.classList.add('active');
            }
        } else if (activeSession === 'tutor') {
            const tutorBtn = document.querySelector('.dashboard-btn:contains("TUTOR DASHBOARD")') || 
                            document.querySelector('[data-session="dashboard"]') ||
                            document.querySelector('#tutorBtn');
            if (tutorBtn) {
                tutorBtn.classList.add('active');
            }
        }
    }
    
    updateURL(session) {
        try {
            const url = new URL(window.location);
            url.searchParams.set('session', session);
            window.history.replaceState({}, '', url);
        } catch (error) {
            // URL update failed, continue silently
        }
    }
    
    shouldEnableTopNav() {
        const isInDashboard = this.currentSession === 'dashboard';
        const tutorVerified = this.tutorData.isVerified;
        const onboardingComplete = this.tutorData.profileCompletion >= 80;
        
        return isInDashboard || tutorVerified || onboardingComplete;
    }
    
    verifyTutor() {
        this.tutorData.isVerified = true;
        this.tutorData.profileCompletion = 100;
        
        const profilePercent = document.getElementById('profilePercent');
        const profileProgress = document.getElementById('profileProgress');
        
        if (profilePercent) profilePercent.textContent = '100%';
        if (profileProgress) profileProgress.style.width = '100%';
        
        this.updateTutorDashboardAccess();
        
        if (!this.topNavFeatures.notifications) {
            window.sessionLoader?.enableTopNavFeatures();
        }
        
        alert('Congratulations! Your tutor profile has been verified. The Tutor Dashboard with full features is now unlocked!');
    }
    
    updateTutorDashboardAccess() {
        const tutorBtn = document.getElementById('tutorBtn');
        const tutorIcon = document.getElementById('tutorIcon');
        const tutorBtnText = document.getElementById('tutorBtnText');
        
        if (!tutorBtn) return;
        
        if (this.tutorData.isVerified) {
            tutorBtn.disabled = false;
            if (tutorIcon) tutorIcon.className = 'fas fa-chalkboard-teacher btn-icon';
            if (tutorBtnText) tutorBtnText.textContent = 'Tutor Dashboard';
        } else {
            tutorBtn.disabled = true;
            if (tutorIcon) tutorIcon.className = 'fas fa-lock btn-icon';
            if (tutorBtnText) tutorBtnText.textContent = 'Tutor Dashboard';
            tutorBtn.onclick = () => {
                alert(`Complete your profile verification to unlock the Tutor Dashboard. Current progress: ${this.tutorData.profileCompletion}%`);
            };
        }
    }
}

// ========================================
// MAIN SESSION LOADER CLASS
// ========================================
class SessionLoader {
    constructor() {
        // Initialize core systems
        this.errorHandler = new ErrorHandler();
        this.performanceManager = new PerformanceManager();
        this.scriptLoader = new ScriptLoader();
        this.modalManager = new ModalManager();
        this.sessionManager = new SessionManager();
        
        // Initialize components
        this.notificationCenter = null;
        this.forumSystem = null;
        
        // Initialization flag
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            console.log(`🚀 SessionLoader initializing in ${ENV_CONFIG.current} mode...`);
            
            // Performance monitoring
            this.performanceManager.mark('session-loader-init-start');
            
            // Setup core features
            this.setupInitialView();
            this.setupEventListeners();
            this.setupPerformanceOptimizations();
            
            // Initialize top-nav features if needed
            if (this.sessionManager.shouldEnableTopNav()) {
                this.enableTopNavFeatures();
            }
            
            // Bind global functions
            this.bindGlobalFunctions();
            
            // Update tutor dashboard access
            this.sessionManager.updateTutorDashboardAccess();
            
            // Load session-specific scripts (don't await to prevent blocking)
            this.loadSessionScripts().catch(error => {
                this.errorHandler.logError('Session Scripts Loading Failed', error);
            });
            
            // Preload critical resources (don't await to prevent blocking)
            this.preloadCriticalResources().catch(error => {
                this.errorHandler.logError('Resource Preloading Failed', error);
            });
            
            this.performanceManager.mark('session-loader-init-end');
            const initTime = this.performanceManager.measure(
                'session-loader-init',
                'session-loader-init-start',
                'session-loader-init-end'
            );
            
            this.initialized = true;
            console.log(`✅ SessionLoader initialized in ${initTime.toFixed(2)}ms`);
            
        } catch (error) {
            this.errorHandler.logError('SessionLoader Initialization Failed', error);
            console.error('❌ SessionLoader initialization failed:', error);
        }
    }

    setupInitialView() {
	// Hide the default view initially
	const defaultView = document.getElementById('defaultView');
	if (defaultView) {
            defaultView.classList.add('hidden');
            defaultView.style.display = 'none';
	}
    
	// Hide all dashboard sections EXCEPT onboarding
	const sections = document.querySelectorAll('.dashboard-section');
	sections.forEach(section => {
            if (section.id !== 'onboarding') {  // ✅ Don't hide onboarding
		section.style.display = 'none';
		section.style.marginTop = '0';
            }
	});
    
	// Show onboarding session by default
	this.sessionManager.switchSession('onboard');
    }
    
    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('change', this.handleGlobalChange.bind(this));
        document.addEventListener('input', this.handleGlobalInput.bind(this));
        
        // Setup top-nav specific listeners
        this.setupTopNavEventListeners();
        
        console.log('🎧 Event listeners setup complete');
    }
    
    setupPerformanceOptimizations() {
        // Debounce window resize events
        window.addEventListener('resize', () => {
            this.performanceManager.debounce('resize', () => {
                this.handleWindowResize();
            }, 250);
        });
        
        // Throttle scroll events
        window.addEventListener('scroll', () => {
            this.performanceManager.throttle('scroll', () => {
                this.handleScroll();
            }, 16); // ~60fps
        });
        
        // Setup lazy loading
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        const dashboardSections = document.querySelectorAll('.dashboard-section');
        if (dashboardSections.length > 0) {
            this.performanceManager.lazyLoad(dashboardSections, (element) => {
                element.classList.add('loaded');
                this.initializeDashboardSection(element);
            });
        }
        
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            this.performanceManager.lazyLoad(images, (img) => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    setupTopNavEventListeners() {
        document.addEventListener('click', (e) => {
            const notificationPanel = document.getElementById('notificationPanel');
            const avatarMenu = document.getElementById('avatarMenu');
            const iconWrapper = e.target.closest('.icon-wrapper');
            const avatarContainer = e.target.closest('.avatar-container');
            
            if (notificationPanel && !notificationPanel.contains(e.target) && !iconWrapper) {
                if (this.notificationCenter) {
                    this.notificationCenter.closePanel();
                }
            }
            
            if (avatarMenu && avatarContainer && !avatarContainer.contains(e.target)) {
                avatarMenu.classList.remove('show');
            }
        });
    }
    
    enableTopNavFeatures() {
        try {
            console.log('🔧 Initializing top-nav features...');
            
            if (!this.notificationCenter) {
                this.notificationCenter = new NotificationCenter();
                this.sessionManager.topNavFeatures.notifications = true;
            }
            
            if (!this.forumSystem) {
                this.forumSystem = new		
		ForumSystem();
                this.forumSystem.initialize();
                this.sessionManager.topNavFeatures.forums = true;
            }
            
            this.initializeMessagingSystem();
            this.sessionManager.topNavFeatures.messaging = true;
            
            console.log('✅ Top-nav features enabled:', this.sessionManager.topNavFeatures);
            
        } catch (error) {
            this.errorHandler.logError('Top-nav Features Initialization Failed', error);
        }
    }
    
    initializeMessagingSystem() {
        window.messageData = {
            1: {
                sender: "📢 Platform Admin",
                subject: "New Platform Guidelines - Action Required",
                time: "2 hours ago",
                priority: "High",
                content: `<h4>Important Platform Updates</h4><p>Dear tutor, we have new guidelines...</p>`
            }
        };
    }
    
    async loadSessionScripts() {
        const currentSession = this.sessionManager.getCurrentSession();
        console.log('📚 Loading scripts for session:', currentSession);
        
        try {
            if (currentSession === 'dashboard') {
                await this.loadDashboardScripts();
            } else if (currentSession === 'onboard') {
                await this.loadOnboardScripts();
            }
        } catch (error) {
            this.errorHandler.logError('Session Script Loading Failed', error, { currentSession });
        }
    }
    
    async loadOnboardScripts() {
        const onboardScripts = [
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card1.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card2.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card3.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card4.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card5.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card6.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card7.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card8.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card9.js`,
            `${ENV_CONFIG.baseURL}/assets/js/onboarding-main.js`
        ];
        
        await this.scriptLoader.loadScriptsInOrder(onboardScripts);
    }
    
    async loadDashboardScripts() {
        const dashboardScripts = [
            `${ENV_CONFIG.baseURL}/assets/js/tutor-dashboard.js`
        ];
        
        await this.scriptLoader.loadScriptsInOrder(dashboardScripts);
    }
    
    async preloadCriticalResources() {
        const criticalResources = [
            { url: `${ENV_CONFIG.baseURL}/assets/js/onboarding-main.js`, type: 'script' },
            { url: `${ENV_CONFIG.baseURL}/assets/js/tutor-dashboard.js`, type: 'script' },
            { url: `${ENV_CONFIG.baseURL}/assets/css/mathtutor.css`, type: 'style' }
        ];
        
        await this.performanceManager.preloadResources(criticalResources);
    }
    
    handleGlobalClick(event) {
        const target = event.target;
        
        if (target.matches('[data-modal]')) {
            this.modalManager.openModal(target.dataset.modal);
        }
        
        if (target.matches('[data-tab]')) {
            this.switchTab(target.dataset.tab);
        }
        
        if (target.matches('[data-session]')) {
            this.sessionManager.switchSession(target.dataset.session);
        }
    }
    
    handleGlobalChange(event) {
        if (event.target.matches('input, select, textarea')) {
            this.performanceManager.debounce(`form-change-${event.target.name}`, () => {
                this.handleFormChange(event.target);
            }, 300);
        }
    }
    
    handleGlobalInput(event) {
        if (event.target.matches('[data-search]')) {
            this.performanceManager.throttle(`search-${event.target.name}`, () => {
                this.handleSearch(event.target.value);
            }, 200);
        }
    }
    
    handleWindowResize() {
        console.log('🔄 Window resized');
    }
    
    handleScroll() {
        // Handle scroll-based interactions
    }
    
    handleFormChange(element) {
        console.log('📝 Form changed:', element.name);
    }
    
    handleSearch(query) {
        console.log('🔍 Search query:', query);
    }
    
    initializeDashboardSection(section) {
        console.log('🎯 Initializing dashboard section:', section.id);
    }
    
    bindGlobalFunctions() {
        // Core navigation functions
        window.goHome = () => this.sessionManager.switchSession('home');
        window.backToHome = () => this.sessionManager.switchSession('home');
        window.showModal = (modalId) => this.modalManager.openModal(modalId);
        window.hideModal = (modalId) => this.modalManager.closeModal(modalId);
        window.closeModal = (modalId) => this.modalManager.closeModal(modalId);
        
        // MISSING FUNCTION - Add showDashboard
        window.showDashboard = (section = 'overview') => {
            this.sessionManager.switchSession('dashboard');
            if (section !== 'overview') {
                setTimeout(() => this.switchTab(section), 100);
            }
        };
        
        // MISSING FUNCTION - Add showOnboarding
        window.showOnboarding = () => {
            this.sessionManager.switchSession('onboard');
        };
        
        // Dashboard section navigation
        window.showOverview = () => this.showDashboardSection('overview');
        window.showSessions = () => this.showDashboardSection('sessions');
        window.showStudents = () => this.showDashboardSection('students');
        window.showMessages = () => this.showDashboardSection('messages');
        window.showEarnings = () => this.showDashboardSection('earnings');
        window.showSchedule = () => this.showDashboardSection('schedule');
        window.showProfile = () => this.showDashboardSection('profile');
        window.showSettings = () => this.showDashboardSection('settings');
        
        // Tutor functions
        window.verifyTutor = () => this.sessionManager.verifyTutor();
        window.switchTab = (tabName) => this.switchTab(tabName);
        window.filterSessions = (filter) => this.filterSessions(filter);
        
        // Top-nav functions
        window.toggleNotificationPanel = () => {
            if (this.notificationCenter) {
                this.notificationCenter.togglePanel();
            }
        };
        
        window.toggleAvatarMenu = (event) => {
            event?.stopPropagation();
            const menu = document.getElementById('avatarMenu');
            if (menu) menu.classList.toggle('show');
        };
        
        // Enhanced onboarding functions
        window.signAgreement = () => this.signAgreement();
        window.downloadAgreement = () => this.downloadAgreement();
        window.viewAgreementPreview = () => this.viewAgreementPreview();
        window.submitAgreement = () => this.submitAgreement();
        window.proceedToInterview = () => this.proceedToInterview();
        window.submitInterview = () => this.submitInterview();
        window.uploadDocuments = () => this.uploadDocuments();
        window.startVideoVerification = () => this.startVideoVerification();
        window.setSchedule = () => this.setSchedule();
        window.browseStudents = () => this.browseStudents();
        window.uploadResources = () => this.uploadResources();
        window.exploreTool = () => this.exploreTool();
        window.viewAnalytics = () => this.viewAnalytics();
        window.upgradePremium = () => this.upgradePremium();
        
        console.log('🔗 Global functions bound successfully');	
    }

    // Global Debuging
    window.sessionLoader.debugInfo = function() {
    return {
        environment: window.ENV_CONFIG?.current,
        session: this.sessionManager?.currentSession || 'unknown',
        errorCount: this.errorHandler?.getErrorSummary().total || 0,
        profileCompletion: this.sessionManager?.tutorData?.profileCompletion || 0,
        loadedScripts: Array.from(this.scriptLoader?.loadedScripts || []),
        loadingScripts: Array.from(this.scriptLoader?.loadingScripts?.keys() || [])
    };
};

    // ========================================
    // DASHBOARD FUNCTIONS
    // ========================================
    
    showDashboardSection(sectionName) {
        console.log('🏠 Showing dashboard section:', sectionName);
        
        this.sessionManager.switchSession('dashboard');
        
        setTimeout(() => {
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNavItem = document.querySelector(`[onclick*="${sectionName}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
        }, 100);
    }
    
    switchTab(tabName) {
        console.log('🔄 Switch Tab:', tabName);
        
        document.querySelectorAll('.tab-button, .dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"], [onclick*="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        document.querySelectorAll('.tab-content, .dashboard-section').forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(tabName) || 
                             document.querySelector(`[data-section="${tabName}"]`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    }
    
    filterSessions(filter = 'all') {
        console.log('🔍 Filter Sessions:', filter);
        const sessions = document.querySelectorAll('.session-item, .session-card');
        
        sessions.forEach(session => {
            if (filter === 'all') {
                session.style.display = 'block';
            } else {
                const sessionType = session.dataset.type || session.className;
                session.style.display = sessionType.includes(filter) ? 'block' : 'none';
            }
        });
    }
    
    scheduleSession() {
        console.log('📅 Schedule Session function called');
        this.modalManager.openModal('scheduleModal');
    }
    
    exportSessions() {
        console.log('📊 Export Sessions function called');
        alert('Session export functionality would be implemented here.');
    }
    
    generateReport() {
        console.log('📈 Generate Report function called');
        alert('Report generation functionality would be implemented here.');
    }
    
    markAllRead() {
        console.log('✅ Mark All Read function called');
        if (this.notificationCenter) {
            this.notificationCenter.notifications.forEach(notification => {
                notification.read = true;
            });
            this.notificationCenter.updateDisplay();
        }
    }
    
    // ========================================
    // ONBOARDING FUNCTIONS
    // ========================================
    
    signAgreement() {
        console.log('📝 Sign Agreement function called');
        this.modalManager.openModal('agreementModal');
    }
    
    downloadAgreement() {
        console.log('📥 Download Agreement function called');
        if (window.documentManager) {
            window.documentManager.downloadDocument('freelance_math_tutor_agreement.pdf');
        } else {
            alert('Document manager not initialized. Please try again.');
        }
    }
    
    viewAgreementPreview() {
        console.log('👁️ View Agreement Preview function called');
        if (window.documentManager) {
            window.documentManager.previewDocument('freelance_math_tutor_agreement.pdf');
        } else {
            alert('Document manager not initialized. Please try again.');
        }
    }
    
    submitAgreement() {
        console.log('✅ Submit Agreement function called');
        alert('Agreement submitted successfully!');
        this.sessionManager.tutorData.profileCompletion += 15;
        this.updateProfileCompletion();
    }
    
    proceedToInterview() {
        console.log('🎤 Proceed to Interview function called');
        alert('Interview scheduling interface would open here.');
    }
    
    submitInterview() {
        console.log('🎯 Submit Interview function called');
        alert('Interview submitted successfully!');
        this.sessionManager.tutorData.profileCompletion += 20;
        this.updateProfileCompletion();
    }
    
    uploadDocuments() {
        console.log('📤 Upload Documents function called');
        this.modalManager.openModal('uploadModal');
    }
    
    startVideoVerification() {
        console.log('🎥 Start Video Verification function called');
        alert('Video verification system would start here. Please prepare your ID documents.');
    }
    
    setSchedule() {
        console.log('📅 Set Schedule function called');
        this.modalManager.openModal('scheduleModal');
    }
    
    browseStudents() {
        console.log('👥 Browse Students function called');
        this.switchTab('students');
    }
    
    uploadResources() {
        console.log('📚 Upload Resources function called');
        alert('Resource upload interface would open here.');
    }
    
    exploreTool() {
        console.log('🔍 Explore Tool function called');
        alert('Tool exploration interface would open here.');
    }
    
    viewAnalytics() {
        console.log('📊 View Analytics function called');
        this.switchTab('analytics');
    }
    
    upgradePremium() {
        console.log('⭐ Upgrade Premium function called');
        this.modalManager.openModal('premiumModal');
    }

    updateProfileCompletion() {
    const profilePercent = document.getElementById('profilePercent');
    const profileProgress = document.getElementById('profileProgress');
    
    if (profilePercent) {
        profilePercent.textContent = `${this.sessionManager.tutorData.profileCompletion}%`;
    }
    if (profileProgress) {
        profileProgress.style.width = `${this.sessionManager.tutorData.profileCompletion}%`;
    }
    
    // Check if required cards are completed (5 specific cards)
    const requiredCards = ['agreement', 'interview', 'documents', 'verification', 'schedule'];
    const completedRequiredCards = requiredCards.filter(card => 
        this.sessionManager.tutorData.completedCards[card]
    ).length;
    
    if (completedRequiredCards >= 5 && !this.sessionManager.tutorData.isVerified) {
        setTimeout(() => {
            if (confirm('You have completed the required setup! Would you like to enable the Tutor Dashboard now?')) {
                this.sessionManager.verifyTutor();
            }
        }, 1000);
    }
}
    
    // ========================================
    // DEBUG AND UTILITIES
    // ========================================
    
    debugInfo() {
        const info = {
            environment: ENV_CONFIG.current,
            session: this.sessionManager.getCurrentSession(),
            tutorVerified: this.sessionManager.tutorData.isVerified,
            profileCompletion: this.sessionManager.tutorData.profileCompletion,
            topNavFeatures: this.sessionManager.topNavFeatures,
            loadedScripts: Array.from(this.scriptLoader.loadedScripts),
            activeModals: Array.from(this.modalManager.activeModals),
            errorCount: this.errorHandler.errors.length
        };
        
        console.log('🐛 SessionLoader Debug Info:', info);
        return info;
    }
    
    getPerformanceReport() {
        const report = {
            environment: ENV_CONFIG.current,
            loadTime: performance.now(),
            scriptCount: this.scriptLoader.loadedScripts.size,
            errorCount: this.errorHandler.errors.length,
            notificationCount: this.notificationCenter?.notifications.length || 0
        };
        
        console.log('📊 Performance Report:', report);
        return report;
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log(`🌟 Initializing in ${ENV_CONFIG.current} environment...`);
        
        window.errorHandler = new ErrorHandler();
        window.sessionLoader = new SessionLoader();
        
        if (ENV_CONFIG.isDevelopment) {
            window.ENV_CONFIG = ENV_CONFIG;
            window.AsyncWrapper = AsyncWrapper;
            
            console.log('🛠️ Development mode utilities available:');
            console.log('  - window.sessionLoader.debugInfo()');
            console.log('  - window.sessionLoader.getPerformanceReport()');
            console.log('  - window.verifyTutor()');
            console.log('  - window.showDashboard()');
            
            setTimeout(() => {
                console.log('🔍 Running auto-diagnostics...');
                const debugInfo = window.sessionLoader.debugInfo();
                
                if (debugInfo.errorCount > 0) {
                    console.warn(`⚠️ ${debugInfo.errorCount} errors detected.`);
                }
                
                console.log('✅ Auto-diagnostics complete');
            }, 2000);
        }
        
        console.log('🎉 SessionLoader fully initialized and ready!');
        
    } catch (error) {
        console.error('❌ Failed to initialize SessionLoader:', error);
        
        console.log('🔄 Attempting fallback initialization...');
        window.sessionLoader = {
            error: error,
            fallback: true,
            debugInfo: () => ({ error: 'Initialization failed', fallbackMode: true }),
            showDashboard: (section) => {
                console.log('Fallback: showDashboard called with section:', section);
                alert('Dashboard functionality is currently unavailable. Please refresh the page.');
            }
        };
        
        window.showDashboard = window.sessionLoader.showDashboard;
    }
});

// Global exports
window.SessionLoader = SessionLoader;
window.ENV_CONFIG = ENV_CONFIG;
window.ErrorHandler = ErrorHandler;
window.PerformanceManager = PerformanceManager;
window.AsyncWrapper = AsyncWrapper;
