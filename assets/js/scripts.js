document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Scripts loaded successfully');
    
    // ===============================
    // SCRIPTS.JS INTEGRATION - START
    // =============================
    
    // --- 🔧 TOGGLE TEST MODE ---
    const TEST_MODE = true; // Change this to false for production

    // --- Firebase Configuration and Initialization ---
    let auth, db, storage;

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID",
    };

    // Initialize Firebase only in production mode
    async function initializeFirebase() {
        if ((!TEST_MODE)) {
            try {
                const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js");
                const {
                    getAuth,
                    createUserWithEmailAndPassword,
                    signInWithEmailAndPassword,
                    sendPasswordResetEmail,
                    updateProfile,
                    onAuthStateChanged
                } = await import("https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js");
                const {
                    getFirestore,
                    doc,
                    setDoc,
                    getDoc,
                    updateDoc
                } = await import("https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js");
                const {
                    getStorage,
                } = await import("https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js");

                const app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);
                storage = getStorage(app);

                // Make Firebase functions available globally
                window.firebase = {
                    auth,
                    db,
                    storage,
                    createUserWithEmailAndPassword,
                    signInWithEmailAndPassword,
                    sendPasswordResetEmail,
                    updateProfile,
                    onAuthStateChanged,
                    doc,
                    setDoc,
                    getDoc,
                    updateDoc
                };

                console.log("Firebase initialized successfully");
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                showToast("Firebase initialization failed. Check your configuration.", "error");
            }
        }
    }

    // --- Global State ---
    let selectedRole = "student";
    let currentUser = null;

    // --- Enhanced Auth Object for scripts.js ---
    const Auth = {
        // Check if user is logged in
        isLoggedIn() {
            return sessionStorage.getItem("isLoggedIn") === "true";
        },

        // Get current user info
        getCurrentUser() {
            if (!this.isLoggedIn()) return null;
            
            return {
                name: sessionStorage.getItem("userName"),
                email: sessionStorage.getItem("userEmail"),
                role: sessionStorage.getItem("userRole"),
                uid: sessionStorage.getItem("userUid")
            };
        },

        // Register new user - enhanced version
        async register(email, password, name = null, confirmPassword = null, role = null) {
	    try {
		// Use provided role or selected role
		const userRole = role || selectedRole;
        
		// Get name from form if not provided
		if (!name) {
		    const nameField = document.getElementById("registerName");
		    name = nameField ? nameField.value.trim() : "User";
		}

		// Get confirmPassword from form if not provided
		if (!confirmPassword) {
		    const confirmField = document.getElementById("confirmPassword");
		    confirmPassword = confirmField ? confirmField.value.trim() : password;
		}

		// ENHANCED VALIDATION WITH BETTER ERROR HANDLING
		if (!this.validateEmail(email)) {
		    this.showValidationError("Please enter a valid email address");
		    return false;
		}
        
		if (!this.validatePassword(password)) {
		    this.showValidationError("Password must be at least 6 characters long");
		    return false;
		}
        
		// FIX: Better password match validation with clear error display
		if (password !== confirmPassword) {
		    this.showValidationError("Passwords do not match. Please check and try again.");
		    
		    // Clear the confirm password field to make it obvious
		    const confirmField = document.getElementById("confirmPassword");
		    if (confirmField) {
			confirmField.value = "";
			confirmField.focus();
			confirmField.style.borderColor = "red";
                
			// Reset border color after 3 seconds
			setTimeout(() => {
			    confirmField.style.borderColor = "";
			}, 3000);
		    }
		    
		    return false;
		}
        
		if (name.length < 2) {
		    this.showValidationError("Name must be at least 2 characters long");
		    return false;
		}
		
		showLoading(true);
		
		if (TEST_MODE) {
		    // Simulate registration delay
		    await new Promise(resolve => setTimeout(resolve, 1000));
            
		    // Store user data in sessionStorage for test mode
		    const userData = {
			name: name,
			email: email,
			role: userRole,
			uid: "test-" + Date.now(),
			createdAt: new Date().toISOString()
		    };
            
		    sessionStorage.setItem("userData", JSON.stringify(userData));
		    sessionStorage.setItem("userRole", userRole);
		    sessionStorage.setItem("userName", name);
		    sessionStorage.setItem("userEmail", email);
		    sessionStorage.setItem("userUid", userData.uid);
		    sessionStorage.setItem("isLoggedIn", "true");
            
		    showLoading(false);
		    return true;
            
		} else {
		    // Firebase registration
		    const { createUserWithEmailAndPassword, updateProfile, doc, setDoc } = window.firebase;
		    
		    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		    const user = userCredential.user;
            
		    // Update user profile
		    await updateProfile(user, { displayName: name });
            
		    // Save user data to Firestore
		    const userDoc = {
			uid: user.uid,
			name: name,
			email: email,
			role: userRole,
			status: "active",
			createdAt: new Date().toISOString()
		    };
            
		    await setDoc(doc(db, "users", user.uid), userDoc);
            
		    // Store session data
		    sessionStorage.setItem("userRole", userRole);
		    sessionStorage.setItem("userName", name);
		    sessionStorage.setItem("userEmail", email);
		    sessionStorage.setItem("userUid", user.uid);
		    sessionStorage.setItem("isLoggedIn", "true");
            
		    showLoading(false);
		    return true;
		}
	    } catch (error) {
		console.error("Registration error:", error);
		this.showValidationError(error.message || "Registration failed. Please try again.");
		showLoading(false);
		return false;
	    }
	},
        
	// Add this new method to the Auth object for better error display:
	showValidationError(message) {
	    // Show toast notification
	    showToast(message, "error");
    
	    // Also show browser alert for immediate attention
	    alert(message);
    
	    // Log to console for debugging
	    console.error("Validation Error:", message);
    
	    // Optional: Show in-page error message if you have an error container
	    const errorContainer = document.getElementById("errorMessage");
	    if (errorContainer) {
		errorContainer.textContent = message;
		errorContainer.style.display = "block";
		errorContainer.style.color = "red";
		errorContainer.style.padding = "10px";
		errorContainer.style.backgroundColor = "#ffebee";
		errorContainer.style.border = "1px solid red";
		errorContainer.style.borderRadius = "4px";
		errorContainer.style.marginTop = "10px";
        
		// Auto-hide after 5 seconds
		setTimeout(() => {
		    errorContainer.style.display = "none";
		}, 5000);
	    }
	},

        // Login user - enhanced version
        async login(email, password) {
            try {
                // Validation
                if (!this.validateEmail(email)) {
                    throw new Error("Please enter a valid email address");
                }
                
                if (!password) {
                    throw new Error("Please enter your password");
                }

                showLoading(true);

                if (TEST_MODE) {
                    // Simulate login delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check if user exists in sessionStorage (for test mode)
                    const existingUser = sessionStorage.getItem("userData");
                    let userData;
                    
                    if (existingUser) {
                        userData = JSON.parse(existingUser);
                    } else {
                        // Create a default test user
                        userData = {
                            name: "Test User",
                            email: email,
                            role: "student",
                            uid: "test-" + Date.now(),
                            createdAt: new Date().toISOString()
                        };
                    }
                    
                    sessionStorage.setItem("userRole", userData.role);
                    sessionStorage.setItem("userName", userData.name);
                    sessionStorage.setItem("userEmail", userData.email);
                    sessionStorage.setItem("userUid", userData.uid);
                    sessionStorage.setItem("isLoggedIn", "true");
                    
                    showLoading(false);
                    return true;
                    
                } else {
                    // Firebase login
                    const { signInWithEmailAndPassword, doc, getDoc } = window.firebase;
                    
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;
                    
                    // Get user data from Firestore
                    const docSnap = await getDoc(doc(db, "users", user.uid));
                    let role = "student";
                    let name = user.displayName || "User";
                    
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        role = userData.role || "student";
                        name = userData.name || user.displayName || "User";
                    }
                    
                    // Store session data
                    sessionStorage.setItem("userRole", role);
                    sessionStorage.setItem("userName", name);
                    sessionStorage.setItem("userEmail", email);
                    sessionStorage.setItem("userUid", user.uid);
                    sessionStorage.setItem("isLoggedIn", "true");
                    
                    showLoading(false);
                    return true;
                }
            } catch (error) {
                console.error("Login error:", error);
                showAlert(error.message || "Login failed", "error");
                showLoading(false);
                return false;
            }
        },

        // Logout user
        logout() {
            // Clear session data
            sessionStorage.removeItem("userData");
            sessionStorage.removeItem("userRole");
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("userEmail");
            sessionStorage.removeItem("userUid");
            sessionStorage.removeItem("isLoggedIn");
            
            if ((!TEST_MODE) && auth) {
                auth.signOut();
            }
            
            return true;
        },

        // Validation functions
        validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        validatePassword(password) {
            return password && password.length >= 6;
        },

        // Password reset
        async resetPassword(email) {
            try {
                if (!this.validateEmail(email)) {
                    throw new Error("Please enter a valid email address");
                }
                
                showLoading(true);
                
                if (TEST_MODE) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    showAlert("Test mode: Password reset email would be sent", "info");
                } else {
                    const { sendPasswordResetEmail } = window.firebase;
                    await sendPasswordResetEmail(auth, email);
                    showAlert("Password reset email sent!", "success");
                }
                
                showLoading(false);
                return true;
            } catch (error) {
                console.error("Password reset error:", error);
                showAlert(error.message, "error");
                showLoading(false);
                return false;
            }
        }
    };

    // --- Utility Functions ---
    function showLoading(show = true) {
        const loading = document.getElementById("loadingIndicator");
        if (loading) {
            loading.style.display = show ? "block" : "none";
        }
    }

    function showToast(message, type = "info") {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.style.display = "block";
            
            setTimeout(() => {
                toast.style.display = "none";
            }, 4000);
        }
    }

    function showAlert(message, type = 'info') {
        // Enhanced showAlert with toast integration
        showToast(message, type);
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }

    // --- Tab Switching ---
    window.showTab = function(event, tabName) {
        // Hide all form sections
        document.querySelectorAll(".form-section").forEach(section => {
            section.classList.remove("active");
        });
        
        // Show selected form section
        const targetSection = document.getElementById(tabName + "FormElement");
        if (targetSection) {
            targetSection.classList.add("active");
        }
        
        // Update tab buttons
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        
        if (event && event.currentTarget) {
            event.currentTarget.classList.add("active");
        }
    };

    // --- Show Forgot Password Form ---
    window.showForgotPassword = function() {
        document.querySelectorAll(".form-section").forEach(section => {
            section.classList.remove("active");
        });
        document.getElementById("forgotPasswordFormElement").classList.add("active");
    };

    // --- Role Selection Handling ---
    function initializeRoleSelection() {
        document.querySelectorAll(".role-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                // Remove active class from all role buttons
                document.querySelectorAll(".role-btn").forEach(b => b.classList.remove("active"));
                
                // Add active class to clicked button
                this.classList.add("active");
                
                // Update selected role
                selectedRole = this.dataset.role;
                console.log("Selected role:", selectedRole);
            });
        });
    }

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


    // ===============================
    // ENHANCED MODAL MANAGEMENT - FIXED
    // ===============================
    
    const Modal = {
        element: null,

        init() {
            this.element = document.getElementById('authModal');
            if (!this.element) {
                console.warn('Auth modal not found - creating fallback');
                this.createFallbackModal();
            } else {
                console.log('✅ Auth modal found and initialized');
            }
            
            // Set up event listeners for modal
            this.setupEventListeners();
        },

        createFallbackModal() {
            console.log('Creating fallback modal...');
            // This would create a basic modal if none exists
            // For now, we'll just log the issue
        },

        setupEventListeners() {
            // Close modal when clicking outside
            if (this.element) {
                this.element.addEventListener('click', (e) => {
                    if (e.target === this.element) {
                        this.close();
                    }
                });
            }

            // Close button event listeners
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('close') || e.target.classList.contains('modal-close')) {
                    this.close();
                }
            });

            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen()) {
                    this.close();
                }
            });
        },

        isOpen() {
            return this.element && (this.element.style.display === 'block' || this.element.style.display === 'flex');
        },

        open() {
            console.log('🔓 Attempting to open modal...');
            
            if (!this.element) {
                this.element = document.getElementById('authModal');
            }
            
            if (this.element) {
                this.element.style.display = 'flex';
                document.body.classList.add('modal-open');
                console.log('✅ Modal opened successfully');
                
                // Ensure default tab is shown
                this.showDefaultTab();
            } else {
                console.error('❌ Cannot open modal - element not found');
                // Fallback: try to find any modal element
                const anyModal = document.querySelector('.modal, [id*="modal"], [class*="modal"]');
                if (anyModal) {
                    console.log('🔍 Found alternative modal element:', anyModal.id || anyModal.className);
                    anyModal.style.display = 'flex';
                    document.body.classList.add('modal-open');
                }
            }
        },

        close(callback) {
            console.log('🔒 Closing modal...');
            
            if (this.element) {
                this.element.style.display = 'none';
                document.body.classList.remove('modal-open');
                console.log('✅ Modal closed successfully');
                
                // Clear form data when closing
                this.clearForms();

                // Execute callback after modal is closed
                if (callback && typeof callback === 'function') {
                    setTimeout(callback, 150);
                }
            } else {
                console.warn('⚠️ Modal element not found for closing');
		// Still execute callback even if modal wasn't found
		if (callback && typeof callback === 'function') {
		    callback();
		}

            }
        },

        // Force close - for situations where normal close doesn't work
        forceClose() {
            console.log('🔨 Force closing modal...');
            
            // Try multiple approaches
            const modalSelectors = [
                '#authModal',
                '.modal',
                '[id*="modal"]',
                '[class*="modal"]'
            ];
            
            modalSelectors.forEach(selector => {
                const modals = document.querySelectorAll(selector);
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
            
            document.body.classList.remove('modal-open');
            this.clearForms();
        },

        showDefaultTab() {
            // Ensure the login tab is active by default
            const loginTab = document.querySelector('.tab-btn[onclick*="login"]');
            const registerTab = document.querySelector('.tab-btn[onclick*="register"]');
            
            if (loginTab) {
                this.switchTab({ currentTarget: loginTab }, 'login');
            } else if (registerTab) {
                this.switchTab({ currentTarget: registerTab }, 'register');
            }
        },

        clearForms() {
            const forms = ['registerForm', 'loginForm', 'forgotPasswordForm'];
            forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) {
                    form.reset();
                }
            });
        },

        switchTab(event, tabName) {
            console.log(`🔄 Switching to tab: ${tabName}`);
            
            // Hide all form sections
            document.querySelectorAll(".form-section").forEach(section => {
                section.classList.remove("active");
            });
            
            // Show selected form section
            const targetSection = document.getElementById(tabName + "FormElement");
            if (targetSection) {
                targetSection.classList.add("active");
                console.log(`✅ Activated section: ${tabName}FormElement`);
            } else {
                console.warn(`⚠️ Section not found: ${tabName}FormElement`);
            }
            
            // Update tab buttons
            document.querySelectorAll(".tab-btn").forEach(btn => {
                btn.classList.remove("active");
            });
            
            if (event && event.currentTarget) {
                event.currentTarget.classList.add("active");
            }
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
    // ENHANCED NAVIGATION MANAGEMENT
    // ===============================

    const Navigation = {
	    // ===============================
	    // CONFIGURATION
	    // ===============================
    
	    serviceConfig: {
		1: {
		    name: "Math/Statistics Tutoring",
		    url: "mathapp.html",
		    allowedRoles: ['student', 'math-tutor'],
		    requiresLogin: true,
		    icon: "📊",
		    description: "Personalized math and statistics tutoring"
		},
		2: {
		    name: "AI/Tech Hub",
		    url: "ai-tech-hub.html",
		    allowedRoles: ['professional'],
		    requiresLogin: false, // Browse first, gate actions
		    icon: "🤖",
		    description: "AI tools and technology resources"
		},
		3: {
		    name: "Client Services",
		    url: "client-services.html",
		    allowedRoles: ['professional', 'consultant'],
		    requiresLogin: false, // Browse first, gate actions
		    icon: "💼",
		    description: "Professional consulting services"
		},
		4: {
		    name: "Solutions",
		    url: "solutions.html",
		    allowedRoles: ['student', 'professional', 'consultant', 'math-tutor'],
		    requiresLogin: false, // Browse first, gate actions
		    icon: "⚡",
		    description: "Integrated solutions and tools",
		    comingSoon: true
		},
		5: {
		    name: "Events",
		    url: "events.html",
		    allowedRoles: ['student', 'professional', 'consultant', 'math-tutor'],
		    requiresLogin: false,
		    icon: "📅",
		    description: "Workshops, webinars, and community events",
		    comingSoon: true
		}
	    },
	    
	    adminConfig: {
		email: "ruperto.bonet@gmail.com",
		tutorDashboard: "mathtutor.html",
		fullAccess: true
	    },

	    // Action-based access control rules
	    actionAccessRules: {
		1: { // Math/Statistics Tutoring
		    'book_session': {
			roles: ['student'],
			statusRequired: 'application-approved'
		    },
		    'use_calculator': {
			roles: ['student', 'math-tutor'],
			statusRequired: 'registered'
		    },
		    'access_student_room': {
			roles: ['student'],
			statusRequired: 'application-approved'
		    },
		    'access_tutor_dashboard': {
			roles: ['math-tutor'],
			cvRequired: true
		    },
		    'submit_assignment': {
                roles: ['student'],
			statusRequired: 'application-in-progress'
		    },
		    'browse_resources': {
			roles: ['student', 'math-tutor'],
			statusRequired: 'registered'
		    }
		},
		2: { // AI/Tech Hub
		    'use_ai_tools': {
			roles: ['professional']
		    },
		    'access_tech_resources': {
			roles: ['professional']
		    },
		    'download_templates': {
			roles: ['professional']
		    },
		    'join_community': {
			roles: ['professional']
		    }
		},
		3: { // Client Services
		    'submit_request': {
			roles: ['professional', 'consultant']
		    },
		    'contact_consultant': {
			roles: ['professional', 'consultant']
		    },
		    'access_client_portal': {
			roles: ['professional', 'consultant']
		    },
		    'download_contracts': {
			roles: ['professional', 'consultant']
		    }
		},
		4: { // Solutions
		    'access_premium': {
			roles: ['professional', 'consultant']
		    },
		    'download_resources': {
			roles: ['student', 'professional', 'consultant', 'math-tutor']
		    },
		    'use_tools': {
			roles: ['student', 'professional', 'consultant', 'math-tutor']
		    }
		}
	    },

	    // ===============================
	    // MAIN NAVIGATION METHODS with browse-first approach
	    // ===============================
	    
	    navigateToService(serviceId) {
		console.log(`🧭 Navigation request for service: ${serviceId}`);
		
		const service = this.serviceConfig[serviceId];
		if (!service) {
		    this.showError("Invalid service or service not recognized.");
		    return;
		}
		
		// Handle coming soon services
		if (service.comingSoon) {
		    this.showComingSoonModal(service);
		    return;
		}
		
		// Store current service context
		sessionStorage.setItem("currentServiceId", serviceId.toString());
		
		// Service 1 (Math Tutoring) - requires login
		if (serviceId === 1) {
		    if (!Auth.isLoggedIn()) {
                this.handleLoginRequired(serviceId, service);
			return;
		    }
		    // If logged in, proceed with authenticated navigation
		    this.handleAuthenticatedNavigation(serviceId, service);
		    return;
		}
		
		// Other services - direct access
		if ([2, 3, 4, 5].includes(serviceId)) {
		    console.log(`🚀 Direct access to service ${serviceId}`);
		    this.performNavigation(service.url);
		    return;
		}
	    },
	    
	    /**
	     * Handle login required scenarios
	     * @param {number} serviceId - Service ID
	     * @param {Object} service - Service configuration
	     */
	     
	    handleLoginRequired(serviceId, service) {
		console.log(`🔐 Login required for service: ${serviceId}`);
		
		// Store redirect information
		sessionStorage.setItem("redirectAfterLogin", service.url);
		sessionStorage.setItem("redirectServiceId", serviceId.toString());
		// For Math/Statistics Tutoring (service 1), open main Login/Register modal directly
		if (serviceId === 1) {
		    // Use the global modal function from index.html
		    if (typeof openModal === 'function') {
			openModal();
		    } else {
			// Fallback: open modal directly
			const modal = document.getElementById('authModal');
			if (modal) {
			    modal.style.display = 'flex';
			    document.body.classList.add('modal-open');
			}
		    }
		    return;

		}

		 // For other services, use enhanced login modal
		this.showEnhancedLoginModal(service.name, 'access this service');
	    },

	    // Add method to handle redirect after login
	    handleRedirectAfterLogin() {
		const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
		const redirectServiceId = sessionStorage.getItem("redirectServiceId");
		
		if (redirectUrl && redirectServiceId) {
		    // Clear redirect data
		    sessionStorage.removeItem("redirectAfterLogin");
		    sessionStorage.removeItem("redirectServiceId");
            
		    // Perform the redirect
		    console.log(`🔄 Redirecting to: ${redirectUrl}`);
		    setTimeout(() => {
			this.performNavigation(redirectUrl);
		    }, 500);
		}
	    },

	    // Add missing performNavigation method
	    performNavigation(url) {
		console.log(`🚀 Navigating to: ${url}`);
		window.location.href = url;
	    },
	    
	    // Add missing showError method
	    showError(message) {
		console.error(message);
		showAlert(message, 'error');
	    },
	    
	    // Add missing showComingSoonModal method
	    showComingSoonModal(service) {
		showAlert(`${service.name} is coming soon! Stay tuned for updates.`, 'info');
	    },

	    /**
	     * Handle navigation for authenticated users
	     * @param {number} serviceId - Service ID
	     * @param {Object} service - Service configuration
	     */
	    handleAuthenticatedNavigation(serviceId, service) {
		const user = Auth.getCurrentUser();
		if (!user) {
		    this.handleLoginRequired(serviceId, service);
		    return;
		}

		console.log(`🔐 Checking access for role: ${user.role}, service: ${serviceId}`);
		
		// Check basic role access
		if (!service.allowedRoles.includes(user.role)) {
		    this.showRoleAccessDenied(service, user.role);
		    return;
		}
		
		// Service-specific navigation logic
		switch(serviceId) {
		case 1: // Math/Statistics Tutoring
                    this.handleMathTutoringNavigation(user);
                    break;
		case 2: // AI/Tech Hub
		case 3: // Client Services
		case 4: // Solutions
                    this.performNavigation(service.url);
                    break;
		default:
                    this.performNavigation(service.url);
		}
	    },

	    /**
	     * Handle Math Tutoring specific navigation logic
	     * @param {Object} user - Current user object
	     */
	    handleMathTutoringNavigation(user) {
		switch(user.role) {
		case 'student':
                    this.handleStudentNavigation(user);
                    break;
		case 'math-tutor':
                    this.handleMathTutorNavigation(user);
                    break;
		default:
                    this.showError("Math tutoring access error. Please contact support.");
		}
	    },

	    /**
	     * Handle student navigation with status-based routing
	     * @param {Object} user - Student user object
	     */
	    handleStudentNavigation(user) {
		const studentStatus = this.getStudentStatus();
		console.log(`👨‍🎓 Student status: ${studentStatus}`);
		
		const statusRoutes = {
		    'registered': 'mathapp.html',
		    'application-in-progress': 'mathapp.html',
		    'application-complete': 'subscription.html',
		    'application-approved': 'student-room.html',
		    'subscribed': 'student-room.html'
		};

		const targetUrl = statusRoutes[studentStatus] || 'mathapp.html';
		this.performNavigation(targetUrl);
	    },
	    
	    /**
	     * Handle math tutor navigation with admin and CV checks
	     * @param {Object} user - Math tutor user object
	     */
	    handleMathTutorNavigation(user) {
		const cvStatus = this.getTutorCVStatus();
		// Extra auth check in test/dev mode or for extra verification
		if (cvStatus === 'approved' && this.isApprovedTutor(user)) {
		    this.performNavigation(this.adminConfig.tutorDashboard);
		} else {
		    this.handleTutorCVFlow(cvStatus);
		}
	    },

	    /**
	     * Handle tutor CV verification flow
	     * @param {string} cvStatus - Current CV status
	     */
	    handleTutorCVFlow(cvStatus) {
		const statusActions = {
		    'not-uploaded': () => {
			this.showAlert("No CV on file. Please submit your CV through the designated process.", 'info');
			setTimeout(() => this.performNavigation("mathtutor.html"), 3000);
		    },
		    'uploaded': () => {
			this.showAlert("Your CV is under review. You'll be notified once it's approved.", 'info');
			setTimeout(() => this.performNavigation("index.html"), 3000);
		    },
		    'approved': () => {
			this.performNavigation(this.adminConfig.tutorDashboard);
		    },
		    'rejected': () => {
			this.showAlert("Your CV was not approved. Please contact support for more information.", 'warning');
			setTimeout(() => this.performNavigation("index.html"), 3000);
		    }
		};
		
		const action = statusActions[cvStatus] || statusActions['not-uploaded'];
		action();
	    },
	    
	    /**
	     * Check if user is an approved tutor
	     * @param {Object} user - User object
	     * @returns {boolean} - Whether user is approved tutor
	     */
	    isApprovedTutor(user) {
		if (!user || !user.email || !user.name) return false;
		
		if ( (!TEST_MODE) === true ) {
		    const tutors = JSON.parse(localStorage.getItem("tutorList") || "[]");
		    return tutors.some(tutor =>
			tutor.email === user.email &&
			    tutor.password === user.password &&
			    tutor.fullName === user.fullName
            );
		}

		// Production: you'd check Firestore or server
		return false;
	    }, 

	    // ===============================
	    // ACTION-BASED ACCESS CONTROL
	    // ===============================
	    
	    /**
	     * Check if user can perform a specific action within a service
	     * @param {string} actionType - Type of action to check
	     * @param {number} serviceId - Service ID
	     * @returns {boolean} - Whether access is granted
	     */
	    checkActionAccess(actionType, serviceId) {
		console.log(`🔐 Checking action access: ${actionType} in service: ${serviceId}`);
		
		// Check login status
		if (!Auth.isLoggedIn()) {
		    this.showContextualLogin(actionType, serviceId);
		    return false;
		}
		
		// Get user info
		const user = Auth.getCurrentUser();
		const userRole = user.role;
		const userEmail = user.email;
		
		// Validate action access
		return this.validateActionAccess(actionType, serviceId, userRole, userEmail);
	    },
	    
	    /**
	     * Validate specific action access based on rules
	     * @param {string} actionType - Action to validate
	     * @param {number} serviceId - Service ID
	     * @param {string} userRole - User's role
	     * @param {string} userEmail - User's email
	     * @returns {boolean} - Access granted or denied
	     */
	    validateActionAccess(actionType, serviceId, userRole, userEmail) {
		const serviceRules = this.actionAccessRules[serviceId];
		if (!serviceRules || !serviceRules[actionType]) {
		    console.warn(`No access rules defined for action: ${actionType} in service: ${serviceId}`);
		    return false;
		}
		
		const actionRule = serviceRules[actionType];
		
		// Check role requirement
		if (!actionRule.roles.includes(userRole)) {
		    this.showActionAccessDenied(actionType, serviceId, userRole, actionRule.roles);
		    return false;
		}
		
		// Admin bypass
		if (userEmail === this.adminConfig.email) {
		    return true;
		}

		// Additional checks based on user role
		if (userRole === 'student') {
		    return this.validateStudentActionAccess(actionType, actionRule);
		} else if (userRole === 'math-tutor') {
		    return this.validateTutorActionAccess(actionType, actionRule);
		}
		
		return true;
	    },

	    /**
	     * Validate student-specific action access
	     * @param {string} actionType - Action type
	     * @param {Object} actionRule - Access rule configuration
	     * @returns {boolean} - Access validation result
	     */
	    validateStudentActionAccess(actionType, actionRule) {
		const studentStatus = this.getStudentStatus();
		
		if (actionRule.statusRequired) {
		    if (!this.checkStudentStatusRequirement(studentStatus, actionRule.statusRequired)) {
			this.showStudentStatusMessage(actionType, studentStatus, actionRule.statusRequired);
			return false;
		    }
		}
		
		return true;
	    },

	    /**
	     * Validate tutor-specific action access
	     * @param {string} actionType - Action type
	     * @param {Object} actionRule - Access rule configuration
	     * @returns {boolean} - Access validation result
	     */
	    validateTutorActionAccess(actionType, actionRule) {
		if (actionRule.cvRequired) {
		    const cvStatus = this.getTutorCVStatus();
		    if (cvStatus !== 'approved') {
			if (cvStatus === 'not-uploaded') {
			    this.showTutorCVUpload();
			} else {
			    this.showAlert("CV approval required for this action.", 'warning');
			}
			return false;
		    }
		}
		
		return true;
	    },
	    
	    /**
	     * Check if student status meets requirement
	     * @param {string} currentStatus - Current student status
	     * @param {string} requiredStatus - Required status
	     * @returns {boolean} - Status check result
	     */
	    checkStudentStatusRequirement(currentStatus, requiredStatus) {
		const statusHierarchy = [
		    'registered',
		    'application-in-progress',
		    'application-complete',
		    'application-approved',
		    'subscribed'
		];
		
		const currentIndex = statusHierarchy.indexOf(currentStatus);
		const requiredIndex = statusHierarchy.indexOf(requiredStatus);
		
		return currentIndex >= requiredIndex;
	    },

	    // ===============================
	    // MODAL AND UI METHODS
	    // ===============================
	    
	    /**
	     * Show contextual login modal for specific actions - Updated with guest option
	     * @param {string} actionType - Action that requires login
	     * @param {number} serviceId - Service ID
	     */
	    showContextualLogin(actionType, serviceId) {
		const service = this.serviceConfig[serviceId];
		const actionDescriptions = {
		    'use_tool': 'use this tool',
		    'book_session': 'book a tutoring session',
		    'submit_request': 'submit a service request',
		    'access_premium': 'access premium features',
		    'download_resource': 'download resources',
		    'contact_consultant': 'contact a consultant',
		    'use_ai_tools': 'access AI tools',
		    'use_calculator': 'use the calculator',
		    'access_student_room': 'access the student room',
		    'access_tech_resources': 'access tech resources',
		    'download_templates': 'download templates',
		    'join_community': 'join the community',
		    'access_client_portal': 'access the client portal',
		    'download_contracts': 'download contracts',
		    'use_tools': 'use these tools'
		};

		const serviceName = service ? service.name : 'this service';
		const actionDesc = actionDescriptions[actionType] || 'perform this action';
		
		// Store pending action
		sessionStorage.setItem("pendingAction", JSON.stringify({
		    actionType: actionType,
		    serviceId: serviceId
		}));

		this.showEnhancedLoginModal(serviceName, actionDesc);
	    },

	    /**
	     * Show enhanced login modal with context and guest option
	     * @param {string} serviceName - Name of the service
	     * @param {string} actionDesc - Description of the action
	     */
	    showEnhancedLoginModal(serviceName, actionDesc) {
		const modal = document.getElementById('enhancedLoginModal');
		if (!modal) {
		    console.warn("⚠️ Modal #enhancedLoginModal not found");
		    return;
		}

		// Insert contextual text
		document.getElementById('serviceName').textContent = serviceName;
		document.getElementById('actionDesc').textContent = actionDesc;
		
		// Show the modal
		modal.style.display = 'flex';
		document.body.classList.add('modal-open');
	    },

	    /**
	     * Close enhanced login modal
	     */
	    closeEnhancedLoginModal() {
		const modal = document.getElementById('enhancedLoginModal');
		if (modal) {
		    modal.style.display = 'none';
		    document.body.classList.remove('modal-open');
		}
	    },
	    
	    // ===============================
	    // STATUS AND UTILITY METHODS (to be implemented)
	    // ===============================
	    
	    /**
	     * Get current student status
	     * @returns {string} - Student status
	     */
	    getStudentStatus() {
		// This would typically check localStorage or server
		return localStorage.getItem('studentStatus') || 'registered';
	    },
	    
	    /**
	     * Get tutor CV status
	     * @returns {string} - CV status
	     */
	    getTutorCVStatus() {
		// This would typically check localStorage or server
		return localStorage.getItem('tutorCVStatus') || 'not-uploaded';
	    },

	    /**
	     * Get test mode status
	     * @returns {string} - Test mode status
	     */
	    getTestMode() {
		return localStorage.getItem('testMode') || 'production'; // Returns a string
	    },
	    /**
	     * Show role access denied message
	     * @param {Object} service - Service configuration
	     * @param {string} userRole - User's role
	     */
	    showRoleAccessDenied(service, userRole) {
		this.showAlert(`Access denied. Your role (${userRole}) is not authorized for ${service.name}.`, 'warning');
	    },

	    /**
	     * Show action access denied message
	     * @param {string} actionType - Action type
	     * @param {number} serviceId - Service ID
	     * @param {string} userRole - User's role
	     * @param {Array} requiredRoles - Required roles
	     */
	    showActionAccessDenied(actionType, serviceId, userRole, requiredRoles) {
		const message = `Access denied. Action "${actionType}" requires role: ${requiredRoles.join(' or ')}. Your role: ${userRole}`;
		this.showAlert(message, 'warning');
	    },

	    /**
	     * Show student status message
	     * @param {string} actionType - Action type
	     * @param {string} currentStatus - Current status
	     * @param {string} requiredStatus - Required status
	     */
	    showStudentStatusMessage(actionType, currentStatus, requiredStatus) {
		const message = `Action "${actionType}" requires status: ${requiredStatus}. Your current status: ${currentStatus}`;
		this.showAlert(message, 'info');
	    },
	    
	    /**
	     * Show tutor CV upload prompt
	     */
	    showTutorCVUpload() {
		this.showAlert("Please upload your CV to access tutor features.", 'info');
	    },
	    
	    /**
	     * Show alert message
	     * @param {string} message - Alert message
	     * @param {string} type - Alert type
	     */
	    showAlert(message, type) {
		// This would integrate with your existing alert system
		console.log(`${type.toUpperCase()}: ${message}`);
		// You might want to implement a proper alert/toast system here
		alert(message);
	    }
	};
    
    // Export for use in other files
    if (typeof module !== 'undefined' && module.exports) {
	module.exports = Navigation;
    }
    
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
		const response = await fetch('data/news.json');

		if (response.ok) {
		    const data = await response.json();
		    console.log('📰 News data received:', data);

		    if (Array.isArray(data.articles) && data.articles.length > 0) {
			return data.articles.map(article => {
			    const title = article.title || 'Untitled';
			    const source = (article.source && article.source.name) || 'Unknown Source';
			    return `${title} — ${source}`;
			});
		    }

		    throw new Error('No valid news data found');
		} else {
		    throw new Error('Response not OK');
		}

	    } catch (error) {
		console.log('⚠️ News fetch failed, using fallback news:', error.message);
		// Return sample news when fetch fails
		return [
		    'Breaking News: Scientists discover new method for faster learning',
		    'Education News: Online tutoring platform shows 85% improvement rates',
		    'Tech News: AI-powered study tools gain popularity among students',
		    'Research News: Personalized learning approaches show promising results',
		    'Innovation News: New digital classroom technologies enhance engagement'
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
    // ENHANCED EVENT LISTENERS SETUP
    // ===============================

    function setupEventListeners() {
        console.log('👂 Setting up event listeners...');
        
        // Initialize Firebase
        initializeFirebase();
    
        // Initialize role selection
        initializeRoleSelection();
        
        // Registration form
        setupFormListener("registerForm", async (formData) => {
            const { registerName: name, registerEmail: email, registerPassword: password, confirmPassword } = formData;
            const success = await Auth.register(email, password, name, confirmPassword, selectedRole);
        
            if (success) {
                showAlert("Registration successful! Please log in.", 'success');
                Modal.switchTab({ currentTarget: document.querySelector('.tab-btn[onclick*="login"]') }, 'login');
            }
        });

        // Login form
	setupFormListener("loginForm", async (formData) => {
	    const { loginEmail: email, loginPassword: password } = formData;
    
	    // Clear any previous error messages
	    const errorDiv = document.getElementById('errorMessage');
	    errorDiv.style.display = 'none';
    
	    try {
		const success = await Auth.login(email, password);
		if (success) {
		    showAlert("Login successful!", 'success');
		    Modal.close(() => {
			// Navigate after modal is closed
			handlePostLoginNavigation();
		    });
		} else {
		    // Handle case where login returns false (wrong credentials)
		    const errorDiv = document.getElementById('errorMessage');
		    errorDiv.textContent = "Invalid email or password. Please try again.";
		    errorDiv.style.display = 'block';
		    errorDiv.style.color = 'red';
		    errorDiv.style.textAlign = 'center';
		    errorDiv.style.marginTop = '10px';
		}
	    } catch (error) {
		console.error("Login form error:", error);
		showAlert("Login failed. Please try again.", 'error');
	    }
	});
	
	// Add this new function for proper post-login navigation:
	function handlePostLoginNavigation() {
	    console.log('🚀 Handling post-login navigation...');
    
	    const user = Auth.getCurrentUser();
	    if (!user || !user.role) {
		console.error("❌ No user or role found after login");
		showAlert("Login error: Unable to determine user role.", 'error');
		return;
	    }

	    console.log(`👤 User role: ${user.role}`);

	    // FIX: Use Navigation module for consistent routing
	    try {
		switch (user.role) {
		case "student":
                    console.log('📚 Navigating student to math app...');
                    // Check if there's a pending redirect
                    const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
                    if (redirectUrl) {
			Navigation.handleRedirectAfterLogin();
                    } else {
			// Default student navigation
			const studentStatus = localStorage.getItem('studentStatus') || 'registered';
			const statusRoutes = {
                            'registered': 'mathapp.html',
                            'application-in-progress': 'mathapp.html',
                            'application-complete': 'subscription.html',
                            'application-approved': 'student-room.html',
                            'subscribed': 'student-room.html'
			};
			const targetUrl = statusRoutes[studentStatus] || 'mathapp.html';
			console.log(`📚 Student target URL: ${targetUrl}`);
			window.location.href = targetUrl;
                    }
                    break;

		case "math-tutor":
                    console.log('👨‍🏫 Navigating math tutor...');
                    // Check CV status
                    const cvStatus = localStorage.getItem('tutorCVStatus') || 'not-uploaded';
                
                    if (cvStatus === 'approved') {
			console.log('✅ CV approved, going to tutor dashboard');
			window.location.href = 'mathtutor.html';
                    } else {
			console.log(`⏳ CV status: ${cvStatus}, redirecting to tutor dashboard`);
			showAlert(`CV status: ${cvStatus}. Please complete the CV verification process.`, 'info');
			setTimeout(() => {
                            window.location.href = 'mathtutor.html';
			}, 2000);
                    }
                    break;

		case "professional":
                    console.log('💼 Navigating professional...');
                    // Check for pending redirect
                    const profRedirectUrl = sessionStorage.getItem("redirectAfterLogin");
                    if (profRedirectUrl) {
			Navigation.handleRedirectAfterLogin();
                    } else {
			window.location.href = 'ai-tech-hub.html';
                    }
                    break;

		case "consultant":
                    console.log('🤝 Navigating consultant...');
                    // Check for pending redirect
                    const consultRedirectUrl = sessionStorage.getItem("redirectAfterLogin");
                    if (consultRedirectUrl) {
			Navigation.handleRedirectAfterLogin();
                    } else {
			window.location.href = 'client-services.html';
                    }
                    break;

		default:
                    console.log('🏠 Default navigation to home');
                    window.location.href = 'index.html';
		}
	    } catch (error) {
		console.error("❌ Navigation error:", error);
		showAlert("Navigation error. Redirecting to home page.", 'warning');
		setTimeout(() => {
		    window.location.href = 'index.html';
		}, 2000);
	    }
	}

        // Forgot password form
        setupFormListener("forgotPasswordForm", async (formData) => {
            const { resetEmail: email } = formData;
            const success = await Auth.resetPassword(email);
        
            if (success) {
                Modal.switchTab({ currentTarget: document.querySelector('.tab-btn[onclick*="login"]') }, 'login');
            }
        });
        
        // Logout button
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", handleLogout);
        }

        console.log('✅ Event listeners setup completed');
    }

    // ===============================
    // HELPER FUNCTIONS
    // ===============================

    function setupFormListener(formId, handler) {
        const form = document.getElementById(formId);
        if (!form) {
            console.warn(`⚠️ Form not found: ${formId}`);
            return;
        }
        
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(
                Array.from(formData.entries()).map(([key, value]) => [key, value.trim()])
            );
            
            try {
                await handler(data);
            } catch (error) {
                console.error(`Form ${formId} submission error:`, error);
                showAlert("An error occurred. Please try again.", 'error');
            }
        });
        
        console.log(`✅ Form listener set up for: ${formId}`);
    }

    function handleLogout() {
        if (Auth.logout()) {
            showAlert("You have been logged out.", 'info');
            window.location.href = "index.html";
        }
    }

      function handleModalOutsideClick(event) {
	if (Modal.element && event.target === Modal.element) {
            Modal.close();
	}
    }

    // ===============================
    // ENHANCED TUTOR CV MODULE
    // ===============================

    const TutorCV = {
	// Constants
	ALLOWED_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	],

	MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
	
        
	async getTutorCVStatus() {
        // Try localStorage first for quick access
            const localStatus = localStorage.getItem("tutorCVStatus");
            
            if (TEST_MODE || !firebase || !firebase.db || !Auth.isLoggedIn()) {
		return localStatus || 'not-uploaded';
            }

            try {
		const user = Auth.getCurrentUser();
		const docSnap = await firebase.getDoc(firebase.doc(firebase.db, 'users', user.uid));
		
		if (docSnap.exists()) {
                const firestoreStatus = docSnap.data().cvStatus || 'not-uploaded';
                    // Sync with localStorage
                    localStorage.setItem("tutorCVStatus", firestoreStatus);
                    return firestoreStatus;
		}
            
		return localStatus || 'not-uploaded';
            } catch (error) {
		console.warn("Failed to fetch tutor CV status from Firestore:", error);
		return localStatus || 'not-uploaded';
            }
	},
	
	async setTutorCVStatus(status) {
            // Always update localStorage
            localStorage.setItem("tutorCVStatus", status);
	    
            // Update Firestore if available
            if ((!TEST_MODE) && firebase && firebase.db && Auth.isLoggedIn()) {
		try {
                    const user = Auth.getCurrentUser();
                    const userRef = firebase.doc(firebase.db, 'users', user.uid);
                    await firebase.updateDoc(userRef, { 
			cvStatus: status,
			cvStatusUpdated: new Date().toISOString()
                    });
                    console.log(`📦 Firestore updated with cvStatus: ${status}`);
		} catch (error) {
                    console.warn("⚠️ Failed to update Firestore CV status:", error);
		}
            }

            console.log(`👨‍🏫 Tutor CV status updated to: ${status}`);
	}
    };
  

    // ===============================
    // GLOBAL FUNCTION EXPOSURE - FIXED
    // ===============================
    
    // Modal functions - these are the key fixes
    window.openModal = function() {
        console.log('🔓 Opening modal via global function');
        Modal.open();
    };

    window.closeModal = function() {
        console.log('🔒 Closing modal via global function');
        Modal.close();
    };

    // Alternative function names that might be used in HTML
    window.showModal = function() {
        console.log('🔓 Showing modal via global function');
        Modal.open();
    };

    window.hideModal = function() {
        console.log('🔒 Hiding modal via global function');
        Modal.close();
    };

    // Open authentication modal specifically
    window.openAuthModal = function() {
        console.log('🔓 Opening auth modal specifically');
        Modal.open();
    };

    // Authentication functions
    window.Auth = Auth;
    window.Modal = Modal;
    window.showAlert = showAlert;

    // Tab switching functions
    window.showTab = (event, tabName) => Modal.switchTab(event, tabName);
    window.switchTab = (event, tabName) => Modal.switchTab(event, tabName);

    // User session functions
    window.getUserSessionInfo = function() {
        return Auth.getCurrentUser();
    };

    window.logout = function() {
        Auth.logout();
    };

    // Navigation
    window.Navigation = Navigation;

    // News management functions
    window.stopNews = function() {
	    NewsManager.stop();
	};
    window.restartNews = function() {
	    NewsManager.restart();
    };
    window.debugNews = function() {
	    console.log('News status:', NewsManager.news);
    };

    // Debugging functions
    window.debugAuth = function() {
        console.log('Auth status:', Auth.isLoggedIn());
        console.log('Current user:', Auth.getCurrentUser());
        console.log('Selected role:', selectedRole);
        console.log('Modal element:', Modal.element);
    };

    window.debugModal = function() {
        console.log('Modal element:', Modal.element);
        console.log('Modal is open:', Modal.isOpen());
        console.log('Available modals:', document.querySelectorAll('.modal, [id*="modal"]'));
    };

    // Force modal open for testing
    window.forceOpenModal = function() {
        console.log('🔨 Force opening modal...');
        
        // Try multiple selectors
        const selectors = ['#authModal', '.modal', '[id*="modal"]'];
        let opened = false;
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'flex';
                document.body.classList.add('modal-open');
                console.log(`✅ Force opened modal: ${selector}`);
                opened = true;
                break;
            }
        }
        
        if (!opened) {
            console.error('❌ No modal element found to force open');
        }
    };

    // ===============================
    // INITIALIZATION
    // ===============================
    function initialize() {
        console.log('🔧 Initializing application...');
    
        try {
            // Initialize modal first
            Modal.init();
	    BackToHomeManager.init();
            NewsManager.init();
        
	    
            // Setup event listeners
            setupEventListeners();
            
            console.log('✅ Application initialized successfully');
            console.log('🏠 Is home page:', isHomePage());
            console.log('🔒 Is logged in:', Auth.isLoggedIn());
            console.log(`🧪 Running in ${TEST_MODE ? 'TEST' : 'PRODUCTION'} mode`);
    
            // Show current user info if logged in
            if (Auth.isLoggedIn()) {
                const user = Auth.getCurrentUser();
                console.log('👤 Current user:', user);
            }
    
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
        }
    }

    // Start the application
    initialize();

    console.log('📄 Enhanced script file loaded completely');
});
    //Exporting modules
    if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
