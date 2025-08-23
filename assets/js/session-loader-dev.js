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
            case 'development': { 
	         const projectRoot = '/';
	        return window.location.origin + projectRoot;
	    }
            case 'production':{
	        const projectRoot = '/';         
		return window.location.origin + projectRoot;
	    }
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
// EARLY FUNCTION SAFETY
// ========================================
(function() {
    // Define safe placeholder functions immediately
    const createSafeFunction = (name) => {
        return function(event) {
            console.log(`⏳ ${name} called before session-loader ready - queuing...`);
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            // Queue the call for when the real function is ready
            if (!window._pendingCalls) window._pendingCalls = [];
            window._pendingCalls.push({ name, event, timestamp: Date.now() });
        };
    };
    
    // Define placeholder functions immediately
    window.toggleAvatarMenu = createSafeFunction('toggleAvatarMenu');
    window.toggleNotificationPanel = createSafeFunction('toggleNotificationPanel');
    
    console.log('🛡️ Safe placeholder functions initialized');
})();

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
		if (resource.type === 'style') {
		    link.as = 'style';
		    link.type = 'text/css';
		} else {
		    link.as = resource.type || 'script';
		}
		link.href = resource.url;
		document.head.appendChild(link);
                                
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
// NOTIFICATION CENTER MODULE (FIXED)
// ========================================

  class NotificationCenter {
            constructor() {
                this.notifications = [];
                this.isOpen = false;
                this.activeFilter = 'all';
                this.init();
            }

            init() {
                this.loadSampleNotifications();
                this.setupEventListeners();
                this.updateDisplay();
            }

            loadSampleNotifications() {
                // Add some initial sample notifications
                this.notifications = [
                    {
                        id: 1,
                        type: 'incomplete',
                        title: 'Incomplete Assignment Review',
                        message: 'Assignment "Math Quiz Chapter 5" needs to be reviewed and graded.',
                        time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                        read: false,
                        priority: 'high',
                        icon: '📑'
                    },
                    {
                        id: 2,
                        type: 'students',
                        title: 'New Student Enrolled',
                        message: 'Sarah Johnson has enrolled in your Advanced Mathematics course.',
                        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                        read: false,
                        priority: 'medium',
                        icon: '👨‍🎓'
                    },
                    {
                        id: 3,
                        type: 'students',
                        title: 'Message from Student',
                        message: 'Mike Chen: "Could you clarify the homework instructions for chapter 3?"',
                        time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                        read: true,
                        priority: 'medium',
                        icon: '💬'
                    }
                ];
            }

            setupEventListeners() {
                // Close panel when clicking outside
              
                // Filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.setActiveFilter(e.target.dataset.filter);
                    });
                });

                // ESC key to close panel
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closePanel();
                    }
                });
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

            removeNotification(id) {
                this.notifications = this.notifications.filter(n => n.id !== id);
                this.updateDisplay();
            }

            markAsRead(id) {
                const notification = this.notifications.find(n => n.id === id);
                if (notification) {
                    notification.read = true;
                    this.updateDisplay();
                }
            }

            markAllAsRead() {
                this.notifications.forEach(n => n.read = true);
                this.updateDisplay();
            }

            clearAll() {
		this.notifications = [];
		this.updateDisplay();
	    }
      
            togglePanel() {
                if (this.isOpen) {
                    this.closePanel();
                } else {
                    this.openPanel();
                }
            }

            openPanel() {
                const panel = document.getElementById('notificationPanel');
                panel.classList.add('active');
                this.isOpen = true;
            }

            closePanel() {
                const panel = document.getElementById('notificationPanel');
                panel.classList.remove('active');
                this.isOpen = false;
            }

            setActiveFilter(filter) {
                this.activeFilter = filter;
                
                // Update filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });
                
                this.renderNotifications();
            }

            getFilteredNotifications() {
                if (this.activeFilter === 'all') {
                    return this.notifications;
                }
                return this.notifications.filter(n => n.type === this.activeFilter);
            }

            updateDisplay() {
                this.updateBadge();
                this.renderNotifications();
            }

            updateBadge() {
                const unreadCount = this.notifications.filter(n => !n.read).length;
                const countElement = document.getElementById('notificationCount');
                const bellElement = document.getElementById('notificationBell');
                
                if (unreadCount > 0) {
                    countElement.textContent = unreadCount > 99 ? '99+' : unreadCount;
                    countElement.classList.remove('hidden');
                    countElement.classList.add('pulse');
                    bellElement.classList.add('has-notifications');
                } else {
                    countElement.classList.add('hidden');
                    countElement.classList.remove('pulse');
                    bellElement.classList.remove('has-notifications');
                }
            }

            renderNotifications() {
                const container = document.getElementById('notificationList');
                const filteredNotifications = this.getFilteredNotifications();
                
                if (filteredNotifications.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">❤️””</div>
                            <div>No notifications found</div>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = filteredNotifications.map(notification => {
                    const timeAgo = this.getTimeAgo(notification.time);
                    return `
                        <div class="notification-item ${!notification.read ? 'unread' : ''} ${notification.priority}-priority"
                             onclick="window.notificationCenter.handleNotificationClick(${notification.id})">
                            <div class="notification-content">
                                <div class="notification-icon">${notification.icon}</div>
                                <div class="notification-text">
                                    <div class="notification-title">${notification.title}</div>
                                    <div class="notification-message">${notification.message}</div>
                                    <div class="notification-time">${timeAgo}</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            handleNotificationClick(id) {
                this.markAsRead(id);
                // Add additional click handling logic here
                console.log('Notification clicked:', id);
            }

            getTimeAgo(date) {
                const now = new Date();
                const diffMs = now - date;
                const diffMinutes = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMinutes / 60);
                const diffDays = Math.floor(diffHours / 24);

                if (diffMinutes < 1) return 'Just now';
                if (diffMinutes < 60) return `${diffMinutes}m ago`;
                if (diffHours < 24) return `${diffHours}h ago`;
                return `${diffDays}d ago`;
            }

            animateBell() {
                const bell = document.getElementById('notificationBell');
                bell.style.animation = 'none';
                setTimeout(() => {
                    bell.style.animation = 'bellShake 0.5s ease-in-out';
                }, 10);
            }
        }

        // Initialize notification center
        window.notificationCenter = new NotificationCenter();

        // Demo functions
        function addIncompleteFunction() {
            window.notificationCenter.addNotification({
                type: 'incomplete',
                title: 'Function Incomplete',
                message: 'Student progress tracking function needs completion.',
                priority: 'high',
                icon: '⚠️'
            });
        }

        function addNewStudent() {
            const names = ['Emma Wilson', 'James Rodriguez', 'Sophia Kim', 'Liam Brown'];
            const randomName = names[Math.floor(Math.random() * names.length)];
            
            window.notificationCenter.addNotification({
                type: 'students',
                title: 'New Student Enrolled',
                message: `${randomName} has joined your Physics course.`,
                priority: 'medium',
                icon: '👨‍🎓'
            });
        }

        function addStudentMessage() {
            const messages = [
                'Can you explain the homework assignment?',
                'I need help with the practice problems.',
                'When is the next quiz scheduled?',
                'Could you review my essay draft?'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            window.notificationCenter.addNotification({
                type: 'students',
                title: 'New Student Message',
                message: `Alex Thompson: "${randomMessage}"`,
                priority: 'medium',
                icon: '💬'
            });
        }

        function addTutorMessage() {
            window.notificationCenter.addNotification({
                type: 'tutors',
                title: 'Message from Tutor',
                message: 'Dr. Martinez shared new teaching resources in the staff room.',
                priority: 'low',
                icon: '👨‍🏫'
            });
        }

        function addAdminMessage() {
            const adminMessages = [
                'System maintenance scheduled for this weekend.',
                'New policy updates available in the admin panel.',
                'Monthly progress reports are due next Friday.',
                'Parent-teacher conferences scheduled for next week.'
            ];
            const randomMessage = adminMessages[Math.floor(Math.random() * adminMessages.length)];
            
            window.notificationCenter.addNotification({
                type: 'admin',
                title: 'Administrative Notice',
                message: randomMessage,
                priority: 'high',
                icon: '📢'
            });
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
        console.log('💥 Forum system initialized');
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
		 verification: false,   // Card 4 - Required				 schedule: false,       // Card 5 - Required
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

	// Check if we're on vle.html
	if (window.location.pathname.includes('vle.html')) {
            return 'vle';
	}
	
        // Default to 'onboard' session
        return 'onboard';
    }
    
    switchSession(session) {
        console.log('⚡ Switching to session:', session);
        
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
		 case 'student':
		    this.showStudentSession();
		    this.updateDashboardButtons('student');
                    break;
		case 'vle':
		    this.showVLESession();
		    this.updateDashboardButtons('vle');
                    break;
                case 'home':
                    this.showHomeSession();
                    this.updateDashboardButtons(null); // Clear button states
                    break;
            }

	    // Store session state for VLE return navigation
	    if (typeof Storage !== "undefined") {
		localStorage.setItem('currentSession', session);
		localStorage.setItem('userRole', (session === 'student') ? 'student' : 'tutor');
	    }
            this.updateURL(session);
            this.currentSession = session;

	    
	    if (window.documentManager) {
		const role = (session === 'student') ? 'student' : 'tutor';
		window.documentManager.setRole(role);
		console.log(`📂 DocumentManager role set to: ${role}`);
	    }

	    // For VLE specifically, also update role system
	    if (session === 'vle' && window.roleSystem) {
		const role = (this.getCurrentSession() === 'student') ? 'student' : 'tutor';
		localStorage.setItem('userRole', role);
		window.roleSystem.updateUI();
		console.log(`📚 VLE role system updated to: ${role}`);
	    }

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

    showStudentSession() {
	const studentContainer = document.getElementById('student-dashboard') || 
              document.querySelector('.student-dashboard');

	const sessionDisplay = document.querySelector('.session-display');
	if (sessionDisplay) {
            sessionDisplay.classList.add('dashboard-active');
            sessionDisplay.classList.remove('onboard-active');
	}

	if (studentContainer) {
            studentContainer.classList.remove('hidden');
            studentContainer.style.display = 'block';
            console.log('✅ Student session displayed');
	} else {
            console.warn('⚠️ Student container not found');
	}
    }

    showVLESession() {
    const vleContainer = document.getElementById('vle-dashboard') || 
                        document.querySelector('.vle-container') ||
                        document.querySelector('.vle-session');
    
    const sessionDisplay = document.querySelector('.session-display');
    if (sessionDisplay) {
        sessionDisplay.classList.add('vle-active');
        sessionDisplay.classList.remove('onboard-active', 'dashboard-active');
    }
    
    if (vleContainer) {
        vleContainer.classList.remove('hidden');
        vleContainer.style.display = 'block';
        console.log('✅ VLE session displayed');
    } else {
        console.warn('⚠️ VLE container not found');
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
    
	// Define button selectors for each session type
	const buttonSelectors = {
	    onboarding: [
		'#onboardingBtn',
		'.dashboard-btn.btn-administrative'
	    ],
	    tutor: [
		'#tutorBtn', 
		'.dashboard-btn.btn-tutor'
	    ],
	    student: [
		'#studentBtn',
		'.dashboard-btn.btn-student'  
	    ],
	    vle: [
		'#vleBtn',
		'.dashboard-btn.btn-learning'
	    ]
	};
	
	// Set active button based on current session
	if (activeSession && buttonSelectors[activeSession]) {
            for (const selector of buttonSelectors[activeSession]) {
		const button = document.querySelector(selector);
		if (button) {
                    button.classList.add('active');
                    break; // Stop after finding the first matching button
		}
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

	 // Initialize UIStateManager
	this.uiStateManager = null;
	
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
            await this.loadSessionScripts().catch(error => {
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


    // Detect current page context
    detectPageContext() {
	const currentPage = window.location.pathname.toLowerCase();
	const hostname = window.location.hostname;
    
	const context = {
            isTutorPage: currentPage.includes('mathtutor') || currentPage.includes('tutor'),
            isStudentPage: currentPage.includes('mathstudent') || currentPage.includes('student'), 
            isVLEPage: currentPage.includes('vle.html') || currentPage.includes('vle'),
            isIndexPage: currentPage.includes('index.html') || currentPage === '/' || currentPage === '',
            currentPage: currentPage,
            hostname: hostname
	};
    
	console.log('🔍 Page Context Detection:', context);
	return context;
    }

    setupInitialView() {
	// Detect which page we're on
	const currentPage = window.location.pathname.toLowerCase();
	const isTutorPage = currentPage.includes('mathtutor.html');
	const isStudentPage = currentPage.includes('mathstudent.html');
    
	console.log('🔍 Page detection:', { currentPage, isTutorPage, isStudentPage });
    
	// Hide all dashboard sections initially
	const sections = document.querySelectorAll('.dashboard-section');
	sections.forEach(section => {
            section.style.display = 'none';
            section.style.marginTop = '0';
	});

	if (isTutorPage || isStudentPage) {
            // Both pages: Default view is onboarding section (id="onboarding")
            const onboardingSection = document.getElementById('onboarding');
            if (onboardingSection) {
		onboardingSection.style.display = 'block';
		console.log('✅ Default onboarding section shown');
            }
        
            // Set button state to onboarding for both pages
            setTimeout(() => {
		this.updateDashboardButtons('onboarding');
            }, 100);
            
	} else {
            // OTHER PAGES: Keep default view visible, don't interfere
            const defaultView = document.getElementById('defaultView');
            if (defaultView) {
		defaultView.style.display = 'block';
		defaultView.classList.remove('hidden');
            }
            console.log('✅ Other page: default view maintained');
	}
    }
    

    setupEventListeners() {
        // Use event delegation for better performance
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('change', this.handleGlobalChange.bind(this));
        document.addEventListener('input', this.handleGlobalInput.bind(this));
        
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

    async preloadCriticalResources() {
	try {
            const criticalResources = [
		{ url: `${ENV_CONFIG.baseURL}/assets/css/mathtutor.css`, type: 'style' },
		{ url: `${ENV_CONFIG.baseURL}/assets/css/mathstudent.css`, type: 'style' },
		{ url: `${ENV_CONFIG.baseURL}/assets/css/vle.css`, type: 'style' }
            ];

            // ✅ Only preload dashboard JS if we're in the dashboard session
            if (this.sessionManager.getCurrentSession() === 'dashboard') {
		criticalResources.push({
                    url: `${ENV_CONFIG.baseURL}/assets/js/tutor-dashboard.js`,
                    type: 'script'
		});
           } else if (currentSession === 'vle') {  // ADD THIS
            criticalResources.push({
                url: `${ENV_CONFIG.baseURL}/assets/js/vle.js`,
                type: 'script'
            });
		
            }
	    
            await this.performanceManager.preloadResources(criticalResources);
            console.log('✅ Critical resources preloaded');
	} catch (error) {
            this.errorHandler.logError('Preload Critical Resources Failed', error);
	}
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
    // SETUP LISTENERS
   initializeUIStateManager() {
       if (!this.uiStateManager && window.uiStateManager) {
           this.uiStateManager = window.uiStateManager;
           console.log('🎛️ UIStateManager connected to SessionLoader');
           return true;
       }
       return false;
   }
    
    enableTopNavFeatures() {
        try {
            console.log('🛠️ Initializing top-nav features...');

	    this.initializeUIStateManager();
	    
            if (!this.notificationCenter) {
                this.notificationCenter = new NotificationCenter();
                this.sessionManager.topNavFeatures.notifications = true;
            }
            
            if (!this.forumSystem) {
                this.forumSystem = new ForumSystem();
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
                sender: "🔢 Platform Admin",
                subject: "New Platform Guidelines - Action Required",
                time: "2 hours ago",
                priority: "High",
                content: `<h4>Important Platform Updates</h4><p>Dear tutor, we have new guidelines...</p>`
            }
        };
    }
    
    async loadSessionScripts() {
        const currentSession = this.sessionManager.getCurrentSession();
        console.log('📊 Loading scripts for session:', currentSession);
        
        try {
            if (currentSession === 'dashboard') {
                await this.loadDashboardScripts();
            } else if (currentSession === 'onboard') {
                await this.loadOnboardScripts();
            } else if (currentSession === 'student') {
		await this.loadStudentScripts();
	    } else if (currentSession === 'vle') {  // ADD THIS
            await this.loadVLEScripts();
            }
	 
        } catch (error) {
            this.errorHandler.logError('Session Script Loading Failed', error, { currentSession });
        }
    }

     // ========================
    // LOAD ONBOARDING SCRIPTS
    // ========================
    async loadOnboardScripts() {
	const onboardScripts = [
	    `${ENV_CONFIG.baseURL}/assets/js/UIStateManager.js`,
	    `${ENV_CONFIG.baseURL}/assets/js/onboarding-core.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card1.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card2.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card3.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card4.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card5.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card6.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card7.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card8.js`,
            `${ENV_CONFIG.baseURL}/assets/js/tutor/card9.js`,
	     // NEW: shared + tutor logic
            `${ENV_CONFIG.baseURL}/assets/js/onboarding-tutor.js`,
	    
            // existing dashboard
            `${ENV_CONFIG.baseURL}/assets/js/tutor-dashboard.js`

	];

	try {
            console.log("📊 Loading onboarding scripts via ScriptLoader...");
	    
            const beforeKeys = Object.keys(window);

            // Load scripts in order
            await this.scriptLoader.loadScriptsInOrder(onboardScripts);
	    
            // Mark scripts as loaded in ScriptLoader
            onboardScripts.forEach(src => {
		if (!this.scriptLoader.loadedScripts.has(src)) {
                    this.scriptLoader.loadedScripts.add(src);
		}
            });
	    
            const afterKeys = Object.keys(window);
            const newGlobals = afterKeys.filter(k => !beforeKeys.includes(k));

            if (!window.cards) window.cards = {};
            if (!window.onboarding) window.onboarding = {};

            // Existing detection logic for any global keys containing "card" or "onboard"
            newGlobals.forEach(key => {
		const lowerKey = key.toLowerCase();
		if (lowerKey.includes('card')) {
                    window.cards[key] = window[key];
		} else if (lowerKey.includes('onboard')) {
                    window.onboarding[key] = window[key];
		}
            });

            // ✅ New logic: Ensure all card1â€“card9 are registered, even if missing export
            const cardFileRegex = /card(\d+)\.js$/i;
            onboardScripts.forEach(src => {
		const match = src.match(cardFileRegex);
		if (match) {
                    const cardKey = `card${match[1]}`;
                    if (!window.cards[cardKey]) {
			window.cards[cardKey] = {
                            id: cardKey,
                            missingExport: true,
                            render: () => console.warn(`⚠️ ${cardKey} loaded but no export found`)
			};
                    }
		}
            });

            console.log("✅ All onboarding scripts loaded and registered.");
            console.log("🎴 Cards:", Object.keys(window.cards));
            console.log("❤️›  Onboarding:", Object.keys(window.onboarding));

	} catch (error) {
            this.errorHandler.logError('Onboarding Scripts Loading Failed', error);
	}
    }

    // ========================
    // LOAD STUDENT SCRIPTS
    // ========================
    async loadStudentScripts() {
	const studentScripts = [
            `${ENV_CONFIG.baseURL}/assets/js/UIStateManager.js`,
	    `${ENV_CONFIG.baseURL}/assets/js/onboarding-core.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card1.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card2.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card3.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card4.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card5.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card6.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card7.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card8.js`,
            `${ENV_CONFIG.baseURL}/assets/js/student/card9.js`,

	    // NEW: shared + student logic
            `${ENV_CONFIG.baseURL}/assets/js/onboarding-student.js`,

            // existing dashboard
            `${ENV_CONFIG.baseURL}/assets/js/student-dashboard.js`
	];
	
	try {
            console.log("📚 Loading student scripts via ScriptLoader...");
            const beforeKeys = Object.keys(window);
	    
            await this.scriptLoader.loadScriptsInOrder(studentScripts);
	    
            studentScripts.forEach(src => {
		if (!this.scriptLoader.loadedScripts.has(src)) {
                    this.scriptLoader.loadedScripts.add(src);
		}
            });

            const afterKeys = Object.keys(window);
            const newGlobals = afterKeys.filter(k => !beforeKeys.includes(k));

            if (!window.student) window.student = {};
            newGlobals.forEach(key => {
		if (key.toLowerCase().includes('student')) {
                    window.student[key] = window[key];
		}
            });

            console.log("✅ Student scripts loaded and registered.");
            console.log("📚 Student globals:", Object.keys(window.student));
	} catch (error) {
            this.errorHandler.logError('Student Scripts Loading Failed', error);
	}
    }

    // ========================
    // LOAD VLE SCRIPTS (for future use in vle.html)
    // ========================

    async loadVLEScripts() {
    const vleScripts = [
        `${ENV_CONFIG.baseURL}/assets/js/UIStateManager.js`,
        `${ENV_CONFIG.baseURL}/assets/js/vle.js`,  // Your main VLE script
        `${ENV_CONFIG.baseURL}/assets/js/vle/vle-core.js`,
        `${ENV_CONFIG.baseURL}/assets/js/vle/resources.js`,
        `${ENV_CONFIG.baseURL}/assets/js/vle/course-manager.js`
    ];

    try {
        console.log("📚 Loading VLE scripts via ScriptLoader...");
        
        const beforeKeys = Object.keys(window);
        
        await this.scriptLoader.loadScriptsInOrder(vleScripts);
        
        vleScripts.forEach(src => {
            if (!this.scriptLoader.loadedScripts.has(src)) {
                this.scriptLoader.loadedScripts.add(src);
            }
        });

        const afterKeys = Object.keys(window);
        const newGlobals = afterKeys.filter(k => !beforeKeys.includes(k));

        if (!window.vle) window.vle = {};
        
        // Register VLE-related globals
        newGlobals.forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('vle') || lowerKey.includes('course') || 
                lowerKey.includes('resource') || lowerKey.includes('roleSystem') ||
                lowerKey.includes('notification') || lowerKey.includes('tabNavigation')) {
                window.vle[key] = window[key];
            }
        });

        // Initialize VLE systems if they exist
        if (window.roleSystem) {
            window.roleSystem.updateUI();
        }
        
        if (window.tabNavigation) {
            window.tabNavigation.initializeTabListeners();
        }

        console.log("✅ VLE scripts loaded and registered.");
        console.log("📚 VLE globals:", Object.keys(window.vle));
        
    } catch (error) {
        this.errorHandler.logError('VLE Scripts Loading Failed', error);
    }
}
    
    // ========================
    // LOAD DASHBOARD SCRIPTS
    // ========================
    async loadDashboardScripts() {
	const dashboardScripts = [
	    `${ENV_CONFIG.baseURL}/assets/js/UIStateManager.js`,
	     `${ENV_CONFIG.baseURL}/assets/js/onboarding-core.js`, 
            `${ENV_CONFIG.baseURL}/assets/js/tutor-dashboard.js`,
	    `${ENV_CONFIG.baseURL}/assets/js/student-dashboard.js`   
	];

	try {
            console.log("📊 Loading dashboard scripts via ScriptLoader...");
	    
            const beforeKeys = Object.keys(window);

            await this.scriptLoader.loadScriptsInOrder(dashboardScripts);

            dashboardScripts.forEach(src => {
		if (!this.scriptLoader.loadedScripts.has(src)) {
                    this.scriptLoader.loadedScripts.add(src);
		}
            });

            const afterKeys = Object.keys(window);
            const newGlobals = afterKeys.filter(k => !beforeKeys.includes(k));

            if (!window.dashboard) window.dashboard = {};

            newGlobals.forEach(key => {
		if (key.toLowerCase().includes('dashboard')) {
                    window.dashboard[key] = window[key];
		}
            });

            console.log("✅ Dashboard scripts loaded and registered.");
            console.log("📊 Dashboard globals:", Object.keys(window.dashboard));
	    
	} catch (error) {
            this.errorHandler.logError('Dashboard Scripts Loading Failed', error);
	}
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
        console.log('❤️“ Window resized');
    }
    
    handleScroll() {
        // Handle scroll-based interactions
    }
    
    handleFormChange(element) {
        console.log('📑 Form changed:', element.name);
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
	    const pageContext = this.detectPageContext();
	    console.log('🎯 showDashboard called with:', section, 'on page:', pageContext.currentPage);
    
	    if (section === 'onboarding') {
		// Return to default view (onboarding visible, others hidden)
		document.querySelectorAll('.dashboard-section').forEach(sec => {
		    if (sec.id !== 'onboarding') {
			sec.style.display = 'none';
		    }
		});
		const onboardingSection = document.getElementById('onboarding');
		if (onboardingSection) onboardingSection.style.display = 'block';
		this.updateDashboardButtons('onboarding');
        
	    } else if ((section === 'tutor' && pageContext.isTutorPage) || 
		       (section === 'student' && pageContext.isStudentPage)) {
		// Show dashboard overlapping onboarding
		const onboardingSection = document.getElementById('onboarding');
		if (onboardingSection) onboardingSection.style.display = 'none';
		
		const targetSection = document.getElementById(section);
		if (targetSection) targetSection.style.display = 'block';
		
		this.updateDashboardButtons(section);
		
	    } else {
		// Fallback for other sections - use existing functionality
		this.showDashboardSection(section);
	    }
	};

	// Enhanced navigation for specific page contexts
	window.showTutorDashboard = () => {
	    const pageContext = this.detectPageContext();
	    if (pageContext.isTutorPage) {
		this.showDashboardSection('tutor');
	    } else {
		console.warn('showTutorDashboard called on non-tutor page');
	    }
	};

	window.showStudentDashboard = () => {
	    const pageContext = this.detectPageContext();
	    if (pageContext.isStudentPage) {
		this.showDashboardSection('student');
	    } else {
		console.warn('showStudentDashboard called on non-student page');
	    }
	};

	window.showOnboardingView = () => {
	    this.showDashboardSection('onboarding');
	};
	
        // MISSING FUNCTION - Add showOnboarding
        window.showOnboarding = () => {
            this.sessionManager.switchSession('onboard');
        };

	
	//========================================
	// VLE Navigation function +LAERNING CENTRE
	//========================================
	// In bindGlobalFunctions(), add these VLE-specific functions:

	// VLE System Functions
	window.showVLETab = (tabName) => {
	    if (window.tabNavigation) {
		window.tabNavigation.showTab(tabName);
	    } else if (window.vle.tabNavigation) {
		window.vle.tabNavigation.showTab(tabName);
	    }
	};

	window.toggleNotificationPanel = () => {
	    if (window.notificationCenter) {
		window.notificationCenter.togglePanel();
	    } else if (window.vle.notificationCenter) {
		window.vle.notificationCenter.togglePanel();
	    }
	};

	window.filterNotes = (category) => {
	    if (window.notesSystem) {
		window.notesSystem.filterNotes(category);
	    } else if (window.vle.notesSystem) {
		window.vle.notesSystem.filterNotes(category);
	    }
	};

	window.createNewNote = () => {
	    if (window.notesSystem) {
		window.notesSystem.createNewNote();
	    } else if (window.vle.notesSystem) {
		window.vle.notesSystem.createNewNote();
	    }
	};

	window.saveNote = () => {
	    if (window.notesSystem) {
		window.notesSystem.saveNote();
	    } else if (window.vle.notesSystem) {
		window.vle.notesSystem.saveNote();
	    }
	};

	// VLE Navigation

	// Enhanced navigation error handling
	window.navigateToSession = (sessionName, fallbackUrl = null) => {
	    try {
		if (this.sessionManager) {
		    this.sessionManager.switchSession(sessionName);
		} else if (fallbackUrl) {
		    window.location.href = fallbackUrl;
		} else {
		    console.warn('Session manager not available and no fallback provided');
		}
	    } catch (error) {
		console.error('Navigation failed:', error);
		if (fallbackUrl) window.location.href = fallbackUrl;
	    }
	};
	
	window.goToVLE = () => {
	    console.log('📚 Navigating to VLE/Learning Centre');
	    
	    // Track interaction
	    try {
		if (typeof trackInteractionGeneric === "function") {
		    const currentSession = this.sessionManager.getCurrentSession();
		    const role = (currentSession === 'student') ? 'student' : 'tutor';
		    trackInteractionGeneric("navigate_vle", {}, role);
		}
	    } catch (e) {
		console.warn("VLE tracking failed:", e);
	    }
    
	    // Store current session
	    try {
		if (typeof Storage !== "undefined") {
		    localStorage.setItem("lastSection", "vle");
		    localStorage.setItem("previousSession", this.sessionManager.getCurrentSession());
		}
	    } catch (e) {
		// Storage not available, continue
	    }
    
	    // Redirect to vle.html
	    window.location.href = `${ENV_CONFIG.baseURL}/vle.html`;
	};

	// Add to bindGlobalFunctions()
	window.returnFromVLE = () => {
	    try {
		const previousSession = localStorage.getItem("previousSession") || 'onboard';
		const currentRole = localStorage.getItem("userRole") || 'student';
		
		// Determine the correct page based on previous session and role
		let targetPage = '../index.html';
		
		if (previousSession === 'dashboard' && currentRole === 'tutor') {
		    targetPage = '../pages/mathtutor.html';
		} else if (previousSession === 'student' || currentRole === 'student') {
            targetPage = '../pages/mathstudent.html';
		}

		// Add session parameter to return URL for proper state restoration
		if (targetPage.includes('?')) {
		    targetPage += `&session=${previousSession}`;
		} else {
		    targetPage += `?session=${previousSession}`;
}
		window.location.href = targetPage;
	    } catch (error) {
        // Fallback to main page
		window.location.href = '../index.html';
	    }
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
        
        // Toggle Notification System
	

        // UI State Management - Delegate to UIStateManager

	window.toggleNotificationPanel = (event) => {
	    if (window.uiStateManager) {
		window.uiStateManager.toggleNotification(event);
	    } else {
		console.warn('UIStateManager not available');
	    }
	};

	window.toggleAvatarMenu = (event) => {
	    if (window.uiStateManager) {
		window.uiStateManager.toggleAvatar(event);
	    } else {
		console.warn('UIStateManager not available');
	    }
	};

	// Process any queued calls from before session-loader was ready
	if (window._pendingCalls && window._pendingCalls.length > 0) {
	    console.log(`🔄 Processing ${window._pendingCalls.length} queued calls...`);
	    window._pendingCalls.forEach(call => {
		if (call.name === 'toggleAvatarMenu' && window.toggleAvatarMenu) {
		    window.toggleAvatarMenu(call.event);
		} else if (call.name === 'toggleNotificationPanel' && window.toggleNotificationPanel) {
            window.toggleNotificationPanel(call.event);
		}
	    });
	    window._pendingCalls = []; // Clear the queue
	}
	
	window.closeAvatarMenu = () => {
	    if (window.uiStateManager) {
		window.uiStateManager.closeAvatar();
	    }
	};
	
	window.openAvatarMenu = () => {
	    if (window.uiStateManager) {
		window.uiStateManager.openAvatar();
	    }
	};
	// END Toogle AvatarMenu
	window.markNotificationAsRead = (id) => {
	    if (window.sessionLoader?.notificationCenter) {
		window.sessionLoader.notificationCenter.markAsRead(id);
	    }
	};

	window.markAllNotificationsRead = () => {
	    if (window.sessionLoader?.notificationCenter) {
		window.sessionLoader.notificationCenter.markAllAsRead();
	    }
	};

	window.clearAllNotifications = () => {
	    if (window.sessionLoader?.notificationCenter) {
		window.sessionLoader.notificationCenter.clearAll();
	    }
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
        
        console.log('🔒 Global functions bound successfully');	
    }


       
    // ========================================
    // DASHBOARD FUNCTIONS
    // ========================================

    showDashboardSection(sectionName) {
	const pageContext = this.detectPageContext();
	console.log('🎯 showDashboardSection called with:', sectionName, 'on page:', pageContext.currentPage);
    
	// Hide all dashboard sections first
	document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.style.display = 'none';
	});
    
	if (sectionName === 'onboarding') {
            // Return to default view for both pages
            const onboardingSection = document.getElementById('onboarding');
            if (onboardingSection) {
		onboardingSection.style.display = 'block';
            }
            this.updateDashboardButtons('onboarding');
        
	} else if (sectionName === 'tutor' && pageContext.isTutorPage) {
            // MATHTUTOR.HTML: Show tutor dashboard overlapping default
            const tutorSection = document.getElementById('tutor');
            if (tutorSection) {
		tutorSection.style.display = 'block';
            }
            this.updateDashboardButtons('tutor');
            console.log('✅ Tutor dashboard shown overlapping default view');
        
	} else if (sectionName === 'student' && pageContext.isStudentPage) {
            // MATHSTUDENT.HTML: Show student dashboard overlapping default
            const studentSection = document.getElementById('student-dashboard') || document.getElementById('student');
            if (studentSection) {
		studentSection.style.display = 'block';
            }
            this.updateDashboardButtons('student');
            console.log('✅ Student dashboard shown overlapping default view');
            
	} else {
            // Fallback for other sections or invalid combinations
            console.warn('⚠️ Invalid section/page combination:', sectionName, pageContext.currentPage);
            // Show onboarding as fallback
            const onboardingSection = document.getElementById('onboarding');
            if (onboardingSection) {
		onboardingSection.style.display = 'block';
            }
            this.updateDashboardButtons('onboarding');
	}
    }
    
    
    switchTab(tabName) {
        console.log('⚡ Switch Tab:', tabName);
        
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
        console.log('📑 Sign Agreement function called');
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
        console.log('❤️‘❤️ View Agreement Preview function called');
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
        console.log('📊 Upload Resources function called');
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
        console.log('â­ Upgrade Premium function called');
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

	// Initialize the guard flag if it doesn't exist
	if (this.verificationPromptShown === undefined) {
            this.verificationPromptShown = false;
	}

	// Only show confirm once
	if (!this.verificationPromptShown && completedRequiredCards >= 5 && !this.sessionManager.tutorData.isVerified) {
            this.verificationPromptShown = true; // set guard
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

    // DEBUG AND UTILITIES
    debugInfo() {
	const info = {
            environment: ENV_CONFIG.current,
            session: this.sessionManager.getCurrentSession(),
            tutorVerified: this.sessionManager.tutorData.isVerified,
            profileCompletion: this.sessionManager.tutorData.profileCompletion,
            topNavFeatures: this.sessionManager.topNavFeatures,
            loadedScripts: Array.from(this.scriptLoader.loadedScripts),
            activeModals: Array.from(this.modalManager.activeModals),
            errorCount: this.errorHandler.errors.length,
	    vleReady: typeof window.goToVLE === 'function'
	};
    
	console.log('❤️› SessionLoader Debug Info:', info);
	return info;
    }

    testUIStateManager() {
	console.log('🧪 Testing UIStateManager Integration:');
	console.log('- UIStateManager available:', !!window.uiStateManager);
	console.log('- SessionLoader connection:', !!this.uiStateManager);
	console.log('- Notification panel:', !!document.getElementById('notificationPanel'));
	console.log('- Avatar menu:', !!document.querySelector('.avatar-menu'));
    
	if (window.uiStateManager) {
            console.log('- UIStateManager state:', window.uiStateManager.state);
	}
    }

    debugUIStateConflicts() {
	console.log('🔍 Checking UI State Conflicts:');
    
	// Check for multiple event listeners
	const notificationBell = document.getElementById('notificationBell');
	const avatarTrigger = document.querySelector('.avatar-container') || document.getElementById('avatarButton');
    
	console.log('- Notification bell element:', !!notificationBell);
	console.log('- Avatar trigger element:', !!avatarTrigger);
	console.log('- UIStateManager active:', !!window.uiStateManager);
	console.log('- UIStateManager state:', window.uiStateManager?.state);
    
	// Check for stuck states
	const panel = document.getElementById('notificationPanel');
	const avatarMenu = document.querySelector('.avatar-menu');
	
	if (panel) {
            console.log('- Notification panel classes:', panel.className);
            console.log('- Panel display style:', panel.style.display);
	}
    
	if (avatarMenu) {
            console.log('- Avatar menu classes:', avatarMenu.className);
            console.log('- Menu display style:', avatarMenu.style.display);
	}
    }

    forceCleanUIState() {
	console.log('🧹 Force cleaning UI state...');
    
	// Force close all panels
	const panel = document.getElementById('notificationPanel');
	const avatarMenu = document.querySelector('.avatar-menu');
    
	if (panel) {
            panel.classList.remove('active');
            panel.style.display = 'none';
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
	}
    
	if (avatarMenu) {
            avatarMenu.classList.remove('show');
            avatarMenu.style.display = 'none';
            avatarMenu.style.opacity = '0';
            avatarMenu.style.visibility = 'hidden';
	}
    
	// Reset UIStateManager state
	if (window.uiStateManager) {
            window.uiStateManager.state.notificationOpen = false;
            window.uiStateManager.state.avatarOpen = false;
	}
    
	console.log('✅ UI state force cleaned');
    }
    // ========================================
// COMPREHENSIVE UI STUCK STATES FIX
// ========================================

// ADD THESE METHODS TO SessionLoader CLASS (in DEBUG section):

// Method 1: Deep Diagnostic
deepUIStateDiagnostic() {
    console.log('🔬 DEEP UI STATE DIAGNOSTIC:');
    
    // Check all possible notification panel selectors
    const notificationSelectors = [
        '#notificationPanel',
        '.notification-panel', 
        '[data-notification="panel"]',
        '.notification-dropdown'
    ];
    
    const avatarSelectors = [
        '.avatar-menu',
        '#avatarMenu',
        '[data-avatar="menu"]',
        '.user-dropdown'
    ];
    
    console.log('📋 NOTIFICATION PANELS FOUND:');
    notificationSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            console.log(`  ${selector}[${index}]:`, {
                classes: el.className,
                display: getComputedStyle(el).display,
                visibility: getComputedStyle(el).visibility,
                opacity: getComputedStyle(el).opacity,
                transform: getComputedStyle(el).transform,
                position: getComputedStyle(el).position,
                zIndex: getComputedStyle(el).zIndex
            });
        });
    });
    
    console.log('👤 AVATAR MENUS FOUND:');
    avatarSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            console.log(`  ${selector}[${index}]:`, {
                classes: el.className,
                display: getComputedStyle(el).display,
                visibility: getComputedStyle(el).visibility,
                opacity: getComputedStyle(el).opacity,
                transform: getComputedStyle(el).transform,
                position: getComputedStyle(el).position,
                zIndex: getComputedStyle(el).zIndex
            });
        });
    });
    
    // Check UIStateManager connection
    console.log('🎛️ UISTATEMANAGER STATUS:');
    if (window.uiStateManager) {
        console.log('  State:', window.uiStateManager.state);
        console.log('  Elements found:', {
            notificationPanel: !!window.uiStateManager.notificationPanel,
            notificationBell: !!window.uiStateManager.notificationBell,
            avatarMenu: !!window.uiStateManager.avatarMenu,
            avatarTrigger: !!window.uiStateManager.avatarTrigger
        });
    } else {
        console.log('  ❌ UIStateManager not found!');
    }
}

// Method 2: Nuclear UI Reset
nuclearUIReset() {
    console.log('☢️ NUCLEAR UI RESET - Forcing all panels closed...');
    
    // Find and force close ALL possible notification panels
    const allNotificationPanels = document.querySelectorAll(`
        #notificationPanel,
        .notification-panel,
        [data-notification="panel"],
        .notification-dropdown,
        [class*="notification"][class*="panel"],
        [id*="notification"][id*="panel"]
    `);
    
    allNotificationPanels.forEach((panel, index) => {
        console.log(`  Resetting notification panel ${index}:`, panel.className);
        
        // Remove all possible active classes
        panel.classList.remove('active', 'show', 'open', 'visible', 'expanded');
        
        // Force hide with all possible methods
        panel.style.display = 'none';
        panel.style.visibility = 'hidden';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-100%)';
        panel.style.pointerEvents = 'none';
        panel.setAttribute('aria-hidden', 'true');
        
        // Clear any inline styles that might be causing issues
        setTimeout(() => {
            panel.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
        }, 50);
    });
    
    // Find and force close ALL possible avatar menus
    const allAvatarMenus = document.querySelectorAll(`
        .avatar-menu,
        #avatarMenu,
        [data-avatar="menu"],
        .user-dropdown,
        [class*="avatar"][class*="menu"],
        [id*="avatar"][id*="menu"]
    `);
    
    allAvatarMenus.forEach((menu, index) => {
        console.log(`  Resetting avatar menu ${index}:`, menu.className);
        
        // Remove all possible active classes
        menu.classList.remove('show', 'active', 'open', 'visible', 'expanded');
        
        // Force hide with all possible methods
        menu.style.display = 'none';
        menu.style.visibility = 'hidden';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-100%)';
        menu.style.pointerEvents = 'none';
        menu.setAttribute('aria-hidden', 'true');
        
        // Clear any inline styles that might be causing issues
        setTimeout(() => {
            menu.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
        }, 50);
    });
    
    // Reset UIStateManager state completely
    if (window.uiStateManager) {
        window.uiStateManager.state = {
            notificationOpen: false,
            avatarOpen: false
        };
        console.log('  ✅ UIStateManager state reset');
    }
    
    // Reset notification center state
    if (window.notificationCenter) {
        window.notificationCenter.isOpen = false;
        console.log('  ✅ NotificationCenter state reset');
    }
    
    console.log('☢️ Nuclear UI reset complete!');
}

// Method 3: Fix UIStateManager Integration
fixUIStateManagerIntegration() {
    console.log('🔧 FIXING UISTATEMANAGER INTEGRATION...');
    
    // Ensure UIStateManager is properly initialized
    if (!window.uiStateManager) {
        console.log('  ❌ UIStateManager missing - attempting to initialize...');
        
        // Try to initialize UIStateManager manually
        if (window.UIStateManager) {
            window.uiStateManager = new window.UIStateManager();
            console.log('  ✅ UIStateManager manually initialized');
        } else {
            console.log('  ❌ UIStateManager class not available');
            return false;
        }
    }
    
    // Re-bind elements to UIStateManager
    const uiStateManager = window.uiStateManager;
    
    // Force re-initialize elements
    uiStateManager.notificationPanel = document.getElementById('notificationPanel') || 
                                      document.querySelector('.notification-panel');
    uiStateManager.notificationBell = document.getElementById('notificationBell') ||
                                     document.querySelector('.notification-trigger');
    uiStateManager.avatarMenu = document.querySelector('.avatar-menu') ||
                               document.getElementById('avatarMenu');
    uiStateManager.avatarTrigger = document.getElementById('avatarButton') ||
                                  document.querySelector('.avatar-container');
    
    console.log('  Element bindings:', {
        notificationPanel: !!uiStateManager.notificationPanel,
        notificationBell: !!uiStateManager.notificationBell,
        avatarMenu: !!uiStateManager.avatarMenu,
        avatarTrigger: !!uiStateManager.avatarTrigger
    });
    
    // Remove all existing event listeners to prevent conflicts
    if (uiStateManager.notificationBell) {
        const newBell = uiStateManager.notificationBell.cloneNode(true);
        uiStateManager.notificationBell.parentNode.replaceChild(newBell, uiStateManager.notificationBell);
        uiStateManager.notificationBell = newBell;
    }
    
    if (uiStateManager.avatarTrigger) {
        const newTrigger = uiStateManager.avatarTrigger.cloneNode(true);
        uiStateManager.avatarTrigger.parentNode.replaceChild(newTrigger, uiStateManager.avatarTrigger);
        uiStateManager.avatarTrigger = newTrigger;
    }
    
    // Re-bind events
    uiStateManager._bindEvents();
    
    console.log('  ✅ UIStateManager integration fixed');
    return true;
}

// Method 4: Complete UI Health Check
completeUIHealthCheck() {
    console.log('🏥 COMPLETE UI HEALTH CHECK:');
    
    // Step 1: Deep diagnostic
    this.deepUIStateDiagnostic();
    
    // Step 2: Nuclear reset
    this.nuclearUIReset();
    
    // Step 3: Fix integration
    const integrationFixed = this.fixUIStateManagerIntegration();
    
    // Step 4: Final verification
    setTimeout(() => {
        console.log('🔍 FINAL VERIFICATION:');
        
        const notificationPanel = document.getElementById('notificationPanel') || 
                                 document.querySelector('.notification-panel');
        const avatarMenu = document.querySelector('.avatar-menu');
        
        if (notificationPanel) {
            const notificationVisible = getComputedStyle(notificationPanel).display !== 'none' &&
                                       getComputedStyle(notificationPanel).visibility !== 'hidden' &&
                                       getComputedStyle(notificationPanel).opacity !== '0';
            console.log('  Notification panel visible:', notificationVisible);
        }
        
        if (avatarMenu) {
            const avatarVisible = getComputedStyle(avatarMenu).display !== 'none' &&
                                 getComputedStyle(avatarMenu).visibility !== 'hidden' &&
                                 getComputedStyle(avatarMenu).opacity !== '0';
            console.log('  Avatar menu visible:', avatarVisible);
        }
        
        console.log('  UIStateManager state:', window.uiStateManager?.state);
        console.log('🏥 Health check complete!');
    }, 1000);
}

// EMERGENCY FIX - Call this immediately
emergencyUIFix() {
    console.log('🚨 EMERGENCY UI FIX ACTIVATED!');
    
    // Immediate nuclear reset
    this.nuclearUIReset();
    
    // Override all UI functions to force close
    window.toggleNotificationPanel = () => {
        console.log('🔒 Emergency: Force closing notification panel');
        this.nuclearUIReset();
    };
    
    window.toggleAvatarMenu = () => {
        console.log('🔒 Emergency: Force closing avatar menu');  
        this.nuclearUIReset();
    };
    
    // Set up monitoring to prevent stuck states
    setInterval(() => {
        const panel = document.getElementById('notificationPanel');
        const menu = document.querySelector('.avatar-menu');
        
        if (panel && getComputedStyle(panel).display !== 'none') {
            panel.style.display = 'none';
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
        }
        
        if (menu && getComputedStyle(menu).display !== 'none') {
            menu.style.display = 'none';
            menu.style.opacity = '0'; 
            menu.style.visibility = 'hidden';
        }
    }, 100); // Check every 100ms
    
    console.log('🚨 Emergency UI fix complete - monitoring active');
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
            
            console.log('❤️› ❤️ Development mode utilities available:');
            console.log('  - window.sessionLoader.debugInfo()');
            console.log('  - window.sessionLoader.getPerformanceReport()');
            console.log('  - window.verifyTutor()');
            console.log('  - window.showDashboard()');
            console.log('  - window.goToVLE()');  // ADD THIS LINE
	    
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
        
        console.log('⚡ Attempting fallback initialization...');
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
