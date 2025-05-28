document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Scripts loaded successfully');

    // ===============================
    // UTILITY FUNCTIONS
    // ===============================
    
    function isHomePage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        
        const homePagePatterns = [
            path === "/",
            path === "/index.html",
            path.endsWith("/index.html"),
            fileName === "index.html",
            fileName === "",
            path === "",
            path === "/index",
            (path.endsWith("/") && path.split('/').filter(p => p).length <= 1)
        ];
        
        return homePagePatterns.some(pattern => pattern);
    }

    function hashPassword(password) {
        return btoa(password); // Simple base64 encoding for demo purposes
    }

    function showAlert(message, type = 'info') {
        alert(message);
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    // ===============================
    // AUTHENTICATION & USER MANAGEMENT
    // ===============================
    
    const Auth = {
        // Check if user is logged in
        isLoggedIn() {
            return sessionStorage.getItem("isLoggedIn") === "true";
        },

        // Login user
        login(email, password) {
            const storedEmail = sessionStorage.getItem("userEmail");
            const storedPassword = sessionStorage.getItem("userPassword");

            if (!storedEmail || !storedPassword) {
                showAlert("No user registered. Please register first.", 'error');
                return false;
            }

            if (email === storedEmail && hashPassword(password) === storedPassword) {
                sessionStorage.setItem("isLoggedIn", "true");
                console.log('✅ User logged in successfully');
                return true;
            } else {
                showAlert("Incorrect email or password.", 'error');
                return false;
            }
        },

        // Register user
        register(email, password) {
            if (!email || !password) {
                showAlert("Please enter a valid email and password.", 'error');
                return false;
            }

            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userPassword", hashPassword(password));
            console.log('✅ User registered successfully');
            return true;
        },

        // Logout user
        logout() {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("userEmail");
            sessionStorage.removeItem("userPassword");
            sessionStorage.removeItem("redirectAfterLogin");
            console.log('✅ User logged out successfully');
        }
    };

    // ===============================
    // MODAL MANAGEMENT
    // ===============================
    
    const Modal = {
        element: null,
        
        init() {
            this.element = document.getElementById('authModal');
        },

        open() {
            if (this.element) {
                this.element.style.display = 'flex';
                console.log('📱 Modal opened');
            }
        },

        close() {
            if (this.element) {
                this.element.style.display = 'none';
                console.log('📱 Modal closed');
            }
        },

        switchTab(event, tabName) {
            // Remove active class from all tabs and content
            document.querySelectorAll('.form-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });

            // Add active class to selected tab and content
            const targetContent = document.getElementById(tabName);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            if (event && event.currentTarget) {
                event.currentTarget.classList.add('active');
            }
            
            console.log(`📋 Switched to tab: ${tabName}`);
        }
    };

    // ===============================
    // NAVIGATION MANAGEMENT
    // ===============================
    
    const Navigation = {
        navigateToService(serviceId) {
            console.log(`🧭 Attempting to navigate to service: ${serviceId}`);
            
            if (!Auth.isLoggedIn()) {
                sessionStorage.setItem("redirectAfterLogin", "/tutoring/mathtutor.html");
                Modal.open();
                console.log('🔒 User not logged in, showing modal');
                return;
            }

            // Handle different services
            switch(serviceId) {
                case 1:
                    window.location.href = "/tutoring/mathtutor.html";
                    break;
                case 2:
                    // Add more services here
                    showAlert("Service coming soon!", 'info');
                    break;
                default:
                    showAlert("Invalid service or service not recognized.", 'error');
            }
        },

        handleRedirectAfterLogin() {
            const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/tutoring/mathtutor.html";
            sessionStorage.removeItem("redirectAfterLogin");
            
            console.log(`🔄 Redirecting to: ${redirectUrl}`);
            window.location.href = redirectUrl;
        }
    };

    // ===============================
    // BACK TO HOME LINK MANAGEMENT
    // ===============================
    
    const BackToHomeManager = {
        init() {
            if (isHomePage()) {
                this.hideBackToHomeLink();
            } else {
                console.log('📄 Not on home page, back-home link should be visible');
            }
        },

        hideBackToHomeLink() {
            console.log('🏠 On home page - attempting to hide back-home link');
            
            // Method 1: Immediate hiding
            if (this.hideElementById('back-home-link')) {
                return;
            }

            // Method 2: CSS injection (immediate effect)
            this.injectHidingCSS();

            // Method 3: Observer for dynamically loaded content
            this.setupObserver();

            // Method 4: Periodic checks as backup
            this.setupPeriodicCheck();
        },

        hideElementById(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'none';
                console.log(`✅ Hidden element: ${elementId}`);
                return true;
            }
            return false;
        },

        injectHidingCSS() {
            const style = document.createElement('style');
            style.id = 'back-home-hide-style';
            style.textContent = `
                #back-home-link {
                    display: none !important;
                }
            `;
            
            if (!document.getElementById('back-home-hide-style')) {
                document.head.appendChild(style);
                console.log('🎨 CSS injection completed');
            }
        },

        setupObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        if (this.hideElementById('back-home-link')) {
                            observer.disconnect();
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Cleanup observer after 10 seconds
            setTimeout(() => {
                observer.disconnect();
                console.log('🔍 Observer cleanup completed');
            }, 10000);
        },

        setupPeriodicCheck() {
            let checkCount = 0;
            const maxChecks = 20;
            
            const intervalId = setInterval(() => {
                checkCount++;
                
                if (this.hideElementById('back-home-link') || checkCount >= maxChecks) {
                    clearInterval(intervalId);
                    console.log('⏰ Periodic check completed');
                }
            }, 500);
        }
    };

    // ===============================
    // NEWS MANAGEMENT
    // ===============================
    const NewsManager = {
    element: null,
    contentSpan: null,
    intervalId: null,
    news: [],
    currentIndex: 0,

    init() {
        this.element = document.getElementById('flushingText');
        this.contentSpan = document.getElementById('newsContent');
        if (this.element && this.contentSpan) {
            this.setupStopLink();
            this.displayNews();
        }
    },

    async fetchNews() {
        try {
            const response = await fetch('/data/news.json');
            const data = await response.json();

            if (!data.articles || data.articles.length === 0) {
                return ['No news found.'];
            }

            return data.articles.map(article => `${article.title} — ${article.source.name}`);
        } catch (error) {
            console.error('News fetch failed:', error);
            return ['Fallback news: Stay curious!'];
        }
    },

    async createFlushingEffect() {
        let iterations = 0;
        const maxIterations = 10;

        return new Promise((resolve) => {
            const flushInterval = setInterval(() => {
                if (this.element) {
                    this.element.style.visibility = 
                        this.element.style.visibility === 'hidden' ? 'visible' : 'hidden';
                }

                iterations++;
                if (iterations >= maxIterations) {
                    clearInterval(flushInterval);
                    if (this.element) this.element.style.visibility = 'visible';
                    resolve();
                }
            }, 300);
        });
    },

    async displayNews() {
        this.news = await this.fetchNews();
        if (!this.news.length) {
            this.contentSpan.textContent = 'No news available';
            return;
        }

        await this.createFlushingEffect();
        this.contentSpan.textContent = this.news[0];
        this.currentIndex = 1;

        this.intervalId = setInterval(() => {
            this.contentSpan.textContent = this.news[this.currentIndex % this.news.length];
            this.currentIndex++;
        }, 6000);
    },

    setupStopLink() {
        const stopLink = document.getElementById('stopLink');
        if (stopLink) {
            stopLink.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(this.intervalId);
                if (this.contentSpan) {
                    this.contentSpan.textContent += ' (News paused)';
                }
            });
        }
    }
};

    // ===============================
    // EVENT LISTENERS SETUP
    // ===============================
    
    function setupEventListeners() {
        // Registration form
        const registerForm = document.getElementById("registerForm");
        if (registerForm) {
            registerForm.addEventListener("submit", function (event) {
                event.preventDefault();
                
                const email = document.getElementById("registerEmail").value.trim();
                const password = document.getElementById("registerPassword").value.trim();

                if (Auth.register(email, password)) {
                    showAlert("Registration successful! Please log in.", 'success');
                    Modal.switchTab({ currentTarget: document.querySelector('.tab') }, 'login');
                }
            });
        }

        // Login form
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const email = document.getElementById("loginEmail").value.trim();
                const password = document.getElementById("loginPassword").value.trim();

                if (Auth.login(email, password)) {
                    showAlert("Login successful!", 'success');
                    Modal.close();
                    Navigation.handleRedirectAfterLogin();
                }
            });
        }

        // Logout button
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", function () {
                Auth.logout();
                showAlert("You have been logged out.", 'info');
                window.location.href = "index.html";
            });
        }

        // Modal outside click to close
        window.addEventListener('click', function (event) {
            if (Modal.element && event.target === Modal.element) {
                Modal.close();
            }
        });

        // Window load event for additional setup
        window.addEventListener('load', function() {
            BackToHomeManager.init();
        });

        console.log('👂 Event listeners setup completed');
    }

    // ===============================
    // GLOBAL FUNCTION EXPOSURE
    // ===============================
    
    // Expose functions to global scope for HTML onclick handlers
    window.openModal = Modal.open.bind(Modal);
    window.closeModal = Modal.close.bind(Modal);
    window.openTab = Modal.switchTab.bind(Modal);
    window.navigateToService = Navigation.navigateToService.bind(Navigation);

    // Manual functions for debugging
    window.forceHideBackHomeLink = () => BackToHomeManager.hideElementById('back-home-link');
    window.checkIfHomePage = isHomePage;
    window.debugAuth = () => console.log('Auth status:', Auth.isLoggedIn());

    // ===============================
    // INITIALIZATION
    // ===============================
    
    function initialize() {
        console.log('🔧 Initializing application...');
        
        // Initialize modules
        Modal.init();
        BackToHomeManager.init();
        NewsManager.init();
        
        // Setup event listeners
        setupEventListeners();
        
        console.log('✅ Application initialized successfully');
        console.log('🏠 Is home page:', isHomePage());
        console.log('🔒 Is logged in:', Auth.isLoggedIn());
    }

    // Start the application
    initialize();
});

// ===============================
// ADDITIONAL WINDOW EVENTS
// ===============================

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible');
    }
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    console.log('👋 Page unloading...');
});

console.log('📄 Script file loaded completely');
