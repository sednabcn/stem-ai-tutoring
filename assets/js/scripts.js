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
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            return userData.isLoggedIn === true;
        },

        // Login user
        login(email, password) {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");

            if (!userData.email || !userData.password) {
                showAlert("No user registered. Please register first.", 'error');
                return false;
            }

            if (email === userData.email && hashPassword(password) === userData.password) {
                userData.isLoggedIn = true;
                localStorage.setItem("userData", JSON.stringify(userData));
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

            const userData = {
                email: email,
                password: hashPassword(password),
                isLoggedIn: false
            };
            
            localStorage.setItem("userData", JSON.stringify(userData));
            console.log('✅ User registered successfully');
            return true;
        },

        // Logout user
        logout() {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            userData.isLoggedIn = false;
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.removeItem("redirectAfterLogin");
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
                localStorage.setItem("redirectAfterLogin", "/tutoring/mathtutor.html");
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
            const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/tutoring/mathtutor.html";
            localStorage.removeItem("redirectAfterLogin");
            
            console.log(`🔄 Redirecting to: ${redirectUrl}`);
            window.location.href = redirectUrl;
        }
    };

    // ===============================
// BACK TO HOME LINK MANAGEMENT (dynamic footer support)
// ===============================

const BackToHomeManager = {
    init() {
        this.waitForBackHomeLink(() => {
            this.setBackHomeHref();

            if (isHomePage()) {
                this.hideBackToHomeLink();
            } else {
                console.log('📄 Not on home page — back-home link should be visible');
            }
        });
    },

    waitForBackHomeLink(callback) {
        const existing = document.getElementById("back-home-link");
        if (existing) {
            callback();
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const found = document.getElementById("back-home-link");
            if (found) {
                console.log('🔍 Detected #back-home-link dynamically injected');
                obs.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Stop looking after 10 seconds
        setTimeout(() => {
            observer.disconnect();
            console.warn("⚠️ #back-home-link not found after 10s");
        }, 10000);
    },

    setBackHomeHref() {
        const link = document.getElementById("back-home-link");
        if (link) {
            link.href = window.location.origin + "/stem-ai-tutoring/index.html";
            console.log("✅ Set back-home-link href to:", link.href);
        }
    },

    hideBackToHomeLink() {
        console.log('🏠 On home page — attempting to hide back-home link');

        if (this.hideElementById('back-home-link')) return;

        this.injectHidingCSS();
        this.setupObserver();
        this.setupPeriodicCheck();
    },

    hideElementById(id) {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            console.log(`✅ Hidden element: ${id}`);
            return true;
        }
        return false;
    },

    injectHidingCSS() {
        if (!document.getElementById('back-home-hide-style')) {
            const style = document.createElement('style');
            style.id = 'back-home-hide-style';
            style.textContent = `
                #back-home-link {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
            console.log('🎨 CSS injected to hide back-home-link');
        }
    },

    setupObserver() {
        const observer = new MutationObserver(() => {
            if (this.hideElementById('back-home-link')) {
                observer.disconnect();
                console.log('🛑 Observer disconnected after hiding');
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            console.log('⏱️ Observer auto-disconnected after 10 seconds');
        }, 10000);
    },

    setupPeriodicCheck() {
        let count = 0;
        const maxChecks = 20;

        const intervalId = setInterval(() => {
            count++;
            if (this.hideElementById('back-home-link') || count >= maxChecks) {
                clearInterval(intervalId);
                console.log('⏰ Periodic check ended');
            }
        }, 500);
    }
};

    // ===============================
    // NEWS MANAGEMENT - FIXED VERSION
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
                console.log('📰 NewsManager initialized');
                this.setupStopLink();
                this.displayNews();
            } else {
                console.log('⚠️ News elements not found, skipping news display');
            }
        },

        async fetchNews() {
            try {
                console.log('📡 Attempting to fetch news from /data/news.json');
                const response = await fetch('/data/news.json');
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('📰 News data received:', data);

                    if (data.articles && data.articles.length > 0) {
                        return data.articles.map(article => `${article.title} — ${article.source.name}`);
                    }
                }
                throw new Error('No valid news data found');
            } catch (error) {
                console.log('⚠️ News fetch failed, using fallback news:', error.message);
                // Return sample news when fetch fails
                return [
                    'Breaking: Scientists discover new method for faster learning',
                    'Education News: Online tutoring platform shows 85% improvement rates',
                    'Tech Update: AI-powered study tools gain popularity among students',
                    'Research: Personalized learning approaches show promising results',
                    'Innovation: New digital classroom technologies enhance engagement'
                ];
            }
        },

        async createFlushingEffect() {
            let iterations = 0;
            const maxIterations = 6; // Reduced for smoother effect

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
                }, 200); // Faster flashing
            });
        },

        async displayNews() {
            console.log('🎬 Starting news display');
            this.news = await this.fetchNews();

            if (!this.news.length) {
                console.log('❌ No news to display');
                if (this.contentSpan) {
                    this.contentSpan.textContent = 'No news available';
                }
                return;
            }

            console.log(`📰 Loaded ${this.news.length} news items`);
            this.currentIndex = 0;

            // Show the first news immediately with flushing effect
            await this.createFlushingEffect();
            if (this.contentSpan) {
                this.contentSpan.textContent = this.news[this.currentIndex];
                console.log('📺 Displaying news:', this.news[this.currentIndex]);
            }

            this.currentIndex++;

            // Start interval to rotate news every 6 seconds
            this.intervalId = setInterval(async () => {
                if (this.currentIndex >= this.news.length) {
                    this.currentIndex = 0;
                }

                await this.createFlushingEffect();
                if (this.contentSpan) {
                    this.contentSpan.textContent = this.news[this.currentIndex];
                    console.log('📺 Rotating to news:', this.news[this.currentIndex]);
                }

                this.currentIndex++;
            }, 6000);

            console.log('✅ News rotation started');
        },

        setupStopLink() {
            const stopLink = document.getElementById('stopLink');
            if (stopLink) {
                stopLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.stop();
                });
                console.log('🛑 Stop link setup complete');
            }
        },

        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                console.log('⏹️ News rotation stopped');
            }
            if (this.contentSpan) {
                this.contentSpan.textContent += ' (News paused)';
            }
        },

        restart() {
            this.stop();
            this.displayNews();
            console.log('🔄 News restarted');
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
    
    // News management functions
    window.stopNews = () => NewsManager.stop();
    window.restartNews = () => NewsManager.restart();
    window.debugNews = () => console.log('News status:', NewsManager.news);

    // ===============================
    // INITIALIZATION
    // ===============================
    
    function initialize() {
        console.log('🔧 Initializing application...');
        
        // Initialize modules
        Modal.init();
        BackToHomeManager.init();
        NewsManager.init(); // Re-enabled!
        
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

