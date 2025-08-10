// card10.js - Top Navigation & Communication Hub (NEW CARD APPROACH)
if (!window.cards) window.cards = {};
   window.cards['card10'] = {
       id: 'card10',
       title: 'Temporary test card',
       render: () => console.log('Rendering card1')
   };

class Card10Controller {
    constructor() {
        this.cardId = 'card10';
        this.isCompleted = false;
        this.features = {
            notifications: false,
            forums: false,
            messaging: false,
            dashboard: false
        };
        
        this.init();
    }

    init() {
        console.log('🌟 Card 10: Communication Hub initializing...');
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Feature unlock buttons
        const unlockNotifications = document.getElementById('unlockNotifications');
        const unlockForums = document.getElementById('unlockForums');
        const unlockMessaging = document.getElementById('unlockMessaging');
        const unlockDashboard = document.getElementById('unlockDashboard');

        if (unlockNotifications) {
            unlockNotifications.addEventListener('click', () => this.unlockFeature('notifications'));
        }
        
        if (unlockForums) {
            unlockForums.addEventListener('click', () => this.unlockFeature('forums'));
        }
        
        if (unlockMessaging) {
            unlockMessaging.addEventListener('click', () => this.unlockFeature('messaging'));
        }
        
        if (unlockDashboard) {
            unlockDashboard.addEventListener('click', () => this.unlockFeature('dashboard'));
        }

        // Complete card button
        const completeBtn = document.getElementById('completeCard10');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.completeCard());
        }
    }

    loadInitialData() {
        this.updateFeatureStates();
        this.checkPrerequisites();
    }

    checkPrerequisites() {
        // Auto-unlock features based on previous card completion
        const prerequisiteMet = this.getCompletedCardsCount() >= 7; // Need 7+ cards complete
        
        if (prerequisiteMet) {
            this.showCard();
            this.enableFeatureUnlocking();
        } else {
            this.showPrerequisiteMessage();
        }
    }

    getCompletedCardsCount() {
        // Check other cards' completion status
        let completed = 0;
        for (let i = 1; i <= 9; i++) {
            const card = document.getElementById(`card${i}`);
            if (card?.classList.contains('completed') || 
                localStorage.getItem(`card${i}_completed`) === 'true') {
                completed++;
            }
        }
        return completed;
    }

    showCard() {
        const card = document.getElementById(this.cardId);
        if (card) {
            card.style.display = 'block';
            card.classList.remove('hidden');
        }
    }

    showPrerequisiteMessage() {
        const card = document.getElementById(this.cardId);
        if (card) {
            card.innerHTML = `
                <div class="card-header">
                    <h3>🌟 Communication Hub</h3>
                    <div class="status-indicator status-locked">
                        <div class="status-dot"></div>
                        <span>Locked</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="prerequisite-message">
                        <div class="lock-icon">🔒</div>
                        <h4>Complete More Cards to Unlock</h4>
                        <p>You need to complete at least 7 cards before accessing the Communication Hub.</p>
                        <p>Current progress: ${this.getCompletedCardsCount()}/7 cards completed</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.getCompletedCardsCount() / 7) * 100}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    enableFeatureUnlocking() {
        const card = document.getElementById(this.cardId);
        if (!card) return;

        card.innerHTML = `
            <div class="card-header">
                <h3>🌟 Communication Hub</h3>
                <div class="status-indicator status-pending">
                    <div class="status-dot"></div>
                    <span>Configure Features</span>
                </div>
            </div>
            <div class="card-content">
                <div class="communication-features">
                    <h4>Unlock Communication Features</h4>
                    <p>Choose which advanced features to enable for your tutor dashboard:</p>
                    
                    <div class="feature-grid">
                        <div class="feature-card ${this.features.notifications ? 'unlocked' : ''}" id="notificationFeature">
                            <div class="feature-icon">🔔</div>
                            <div class="feature-info">
                                <h5>Smart Notifications</h5>
                                <p>Real-time alerts for student messages, assignments, and system updates</p>
                            </div>
                            <button class="feature-btn" id="unlockNotifications" ${this.features.notifications ? 'disabled' : ''}>
                                ${this.features.notifications ? 'Unlocked' : 'Unlock'}
                            </button>
                        </div>

                        <div class="feature-card ${this.features.forums ? 'unlocked' : ''}" id="forumFeature">
                            <div class="feature-icon">👥</div>
                            <div class="feature-info">
                                <h5>Tutor Forums</h5>
                                <p>Connect with other tutors, share resources and best practices</p>
                            </div>
                            <button class="feature-btn" id="unlockForums" ${this.features.forums ? 'disabled' : ''}>
                                ${this.features.forums ? 'Unlocked' : 'Unlock'}
                            </button>
                        </div>

                        <div class="feature-card ${this.features.messaging ? 'unlocked' : ''}" id="messagingFeature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-info">
                                <h5>Advanced Messaging</h5>
                                <p>Enhanced chat features with file sharing and video calls</p>
                            </div>
                            <button class="feature-btn" id="unlockMessaging" ${this.features.messaging ? 'disabled' : ''}>
                                ${this.features.messaging ? 'Unlocked' : 'Unlock'}
                            </button>
                        </div>

                        <div class="feature-card ${this.features.dashboard ? 'unlocked' : ''}" id="dashboardFeature">
                            <div class="feature-icon">📊</div>
                            <div class="feature-info">
                                <h5>Full Dashboard Access</h5>
                                <p>Complete analytics, reporting, and management tools</p>
                            </div>
                            <button class="feature-btn" id="unlockDashboard" ${this.features.dashboard ? 'disabled' : ''}>
                                ${this.features.dashboard ? 'Unlocked' : 'Unlock'}
                            </button>
                        </div>
                    </div>
                    
                    <div class="feature-progress">
                        <div class="progress-header">
                            <span>Features Unlocked: ${this.getUnlockedCount()}/4</span>
                            <span>${Math.round((this.getUnlockedCount() / 4) * 100)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.getUnlockedCount() / 4) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button class="btn-primary" id="completeCard10" ${this.canComplete() ? '' : 'disabled'}>
                        ${this.canComplete() ? 'Complete Setup' : `Unlock ${4 - this.getUnlockedCount()} More Features`}
                    </button>
                </div>
            </div>
        `;
        
        // Re-setup event listeners after DOM update
        this.setupEventListeners();
    }

    unlockFeature(featureName) {
        console.log(`Unlocking feature: ${featureName}`);
        
        if (this.features[featureName]) {
            console.log(`Feature ${featureName} already unlocked`);
            return;
        }
        
        // Show confirmation dialog
        const confirmed = confirm(`Unlock ${this.getFeatureDisplayName(featureName)}?\n\nThis will enable advanced communication features in your tutor dashboard.`);
        
        if (!confirmed) return;
        
        // Unlock the feature
        this.features[featureName] = true;
        
        // Initialize the feature
        this.initializeFeature(featureName);
        
        // Update UI
        this.updateFeatureStates();
        
        // Save progress
        this.saveProgress();
        
        // Show success message
        this.showFeatureUnlockedMessage(featureName);
        
        // Check if all features are unlocked
        if (this.getUnlockedCount() === 4) {
            this.showAllFeaturesUnlockedMessage();
        }
    }

    getFeatureDisplayName(featureName) {
        const names = {
            notifications: 'Smart Notifications',
            forums: 'Tutor Forums',
            messaging: 'Advanced Messaging',
            dashboard: 'Full Dashboard Access'
        };
        return names[featureName] || featureName;
    }

    initializeFeature(featureName) {
        switch (featureName) {
            case 'notifications':
                this.initializeNotifications();
                break;
            case 'forums':
                this.initializeForums();
                break;
            case 'messaging':
                this.initializeMessaging();
                break;
            case 'dashboard':
                this.initializeDashboard();
                break;
        }
    }

    initializeNotifications() {
        // Initialize NotificationCenter from top-nav.js
        if (!window.notificationCenter) {
            // Simplified NotificationCenter class
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
                    this.notifications = [
                        {
                            id: 1,
                            type: 'incomplete',
                            title: 'Welcome to Smart Notifications!',
                            message: 'Your notification system is now active and ready to keep you updated.',
                            time: new Date(),
                            read: false,
                            priority: 'medium',
                            icon: '🎉'
                        }
                    ];
                }

                setupEventListeners() {
                    document.addEventListener('click', (e) => {
                        const panel = document.getElementById('notificationPanel');
                        const iconWrapper = e.target.closest('.icon-wrapper');
                        
                        if (panel && !panel.contains(e.target) && !iconWrapper) {
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

            window.notificationCenter = new NotificationCenter();
            
            // Bind global functions
            window.toggleNotificationPanel = () => {
                if (window.notificationCenter) {
                    window.notificationCenter.togglePanel();
                }
            };
        }
        
        console.log('✅ Notifications feature initialized');
    }

    initializeForums() {
        // Initialize ForumSystem from top-nav.js
        if (!window.forumSystem) {
            window.forumSystem = {
                currentForum: null,
                currentTab: 'browse',
                forums: new Map(),
                posts: new Map(),
                userPosts: new Set(),
                notifications: [],

                initialize() {
                    this.loadSampleData();
                    console.log('👥 Forum system initialized');
                },

                loadSampleData() {
                    const samplePosts = [
                        {
                            id: 'post-welcome',
                            forumId: 'general-math',
                            title: 'Welcome to the Tutor Forums!',
                            author: { name: 'Platform Admin', avatar: '👨‍💼' },
                            content: 'Connect with fellow tutors, share resources, and learn from each other.',
                            tags: ['welcome', 'community'],
                            createdAt: new Date().toISOString(),
                            replies: 0,
                            votes: 5,
                            views: 12,
                            isPinned: true
                        }
                    ];

                    samplePosts.forEach(post => {
                        this.posts.set(post.id, post);
                    });
                },

                switchTab(tabName) {
                    document.querySelectorAll('.forum-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    const activeTab = document.querySelector(`[onclick="switchForumTab('${tabName}')"]`);
                    if (activeTab) activeTab.classList.add('active');

                    this.currentTab = tabName;
                },

                openForum(forumId) {
                    this.currentForum = forumId;
                    console.log('Opening forum:', forumId);
                }
            };

            window.forumSystem.initialize();
            
            // Bind global functions
            window.switchForumTab = (tabName) => {
                if (window.forumSystem) {
                    window.forumSystem.switchTab(tabName);
                }
            };

            window.openForum = (forumId) => {
                if (window.forumSystem) {
                    window.forumSystem.openForum(forumId);
                }
            };
        }
        
        console.log('✅ Forums feature initialized');
    }

    initializeMessaging() {
        // Initialize messaging system from top-nav.js
        if (!window.messageData) {
            window.messageData = {
                1: {
                    sender: "🎉 Welcome Team",
                    subject: "Advanced Messaging Activated!",
                    time: "Just now",
                    priority: "Medium",
                    content: `
                        <h4>Advanced Messaging Features Unlocked</h4>
                        <p>You now have access to:</p>
                        <ul>
                            <li>Enhanced chat with file sharing</li>
                            <li>Video call integration</li>
                            <li>Message templates</li>
                            <li>Bulk messaging tools</li>
                        </ul>
                    `
                }
            };

            // Bind global functions
            window.openMessage = (messageId) => {
                const message = window.messageData[messageId];
                if (message) {
                    console.log('Opening message:', message.subject);
                    alert(`Message: ${message.subject}\nFrom: ${message.sender}\n\nContent preview available in full dashboard.`);
                }
            };
        }
        
        console.log('✅ Messaging feature initialized');
    }

    initializeDashboard() {
        // Enable full dashboard access
        if (window.sessionLoader) {
            window.sessionLoader.tutorData.isVerified = true;
            window.sessionLoader.updateTutorDashboardAccess();
        }
        
        console.log('✅ Full dashboard access granted');
    }

    showFeatureUnlockedMessage(featureName) {
        const displayName = this.getFeatureDisplayName(featureName);
        
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = 'feature-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✅</div>
                <div class="notification-text">
                    <strong>${displayName} Unlocked!</strong>
                    <p>Feature is now active and ready to use.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showAllFeaturesUnlockedMessage() {
        setTimeout(() => {
            alert('🎉 Congratulations!\n\nAll communication features have been unlocked!\nYou can now complete this card and access the full tutor dashboard.');
        }, 500);
    }

    updateFeatureStates() {
        // Update feature cards visual state
        Object.keys(this.features).forEach(feature => {
            const featureCard = document.getElementById(`${feature}Feature`);
            const featureBtn = document.getElementById(`unlock${feature.charAt(0).toUpperCase() + feature.slice(1)}`);
            
            if (featureCard && featureBtn) {
                if (this.features[feature]) {
                    featureCard.classList.add('unlocked');
                    featureBtn.disabled = true;
                    featureBtn.textContent = 'Unlocked';
                } else {
                    featureCard.classList.remove('unlocked');
                    featureBtn.disabled = false;
                    featureBtn.textContent = 'Unlock';
                }
            }
        });
        
        // Update progress bar
        const progressFill = document.querySelector('#card10 .progress-fill');
        const progressText = document.querySelector('#card10 .progress-header span');
        
        if (progressFill && progressText) {
            const progress = (this.getUnlockedCount() / 4) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Features Unlocked: ${this.getUnlockedCount()}/4`;
        }
        
        // Update complete button
        const completeBtn = document.getElementById('completeCard10');
        if (completeBtn) {
            if (this.canComplete()) {
                completeBtn.disabled = false;
                completeBtn.textContent = 'Complete Setup';
            } else {
                completeBtn.disabled = true;
                completeBtn.textContent = `Unlock ${4 - this.getUnlockedCount()} More Features`;
            }
        }
    }

    getUnlockedCount() {
        return Object.values(this.features).filter(Boolean).length;
    }

    canComplete() {
        return this.getUnlockedCount() === 4; // All features must be unlocked
    }

    completeCard() {
        if (!this.canComplete()) {
            alert('Please unlock all communication features before completing this card.');
            return;
        }
        
        // Mark card as completed
        this.isCompleted = true;
        
        // Update card visual state
        const card = document.getElementById(this.cardId);
        const statusIndicator = card?.querySelector('.status-indicator');
        
        if (card) {
            card.classList.add('completed');
        }
        
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator status-complete';
            statusIndicator.innerHTML = '<div class="status-dot"></div><span>Completed</span>';
        }
        
        // Save completion
        this.saveProgress();
        
        // Trigger profile completion update
        if (window.sessionLoader && window.sessionLoader.updateProfileCompletion) {
            window.sessionLoader.updateProfileCompletion();
        }
        
        // Show completion message
        alert('🎉 Communication Hub Setup Complete!\n\nAll advanced features are now active in your tutor dashboard. You can now access the full platform capabilities!');
        
        console.log('✅ Card 10 completed - Communication Hub fully configured');
    }

    saveProgress() {
        const progressData = {
            features: this.features,
            completed: this.isCompleted,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('card10_progress', JSON.stringify(progressData));
        localStorage.setItem('card10_completed', this.isCompleted.toString());
    }

    loadProgress() {
        const saved = localStorage.getItem('card10_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.features = { ...this.features, ...data.features };
                this.isCompleted = data.completed || false;
                
                // Re-initialize unlocked features
                Object.keys(this.features).forEach(feature => {
                    if (this.features[feature]) {
                        this.initializeFeature(feature);
                    }
                });
                
            } catch (error) {
                console.error('Error loading Card 10 progress:', error);
            }
        }
    }
}

// Global functions for integration with existing system
window.unlockCommunicationFeature = (featureName) => {
    if (window.card10Controller) {
        window.card10Controller.unlockFeature(featureName);
    }
};

window.completeCommunicationHub = () => {
    if (window.card10Controller) {
        window.card10Controller.completeCard();
    }
};

// Initialize Card 10 when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Card 10 element exists
    if (document.getElementById('card10')) {
        window.card10Controller = new Card10Controller();
        window.card10Controller.loadProgress(); // Load saved progress
        
        console.log('Card 10: Communication Hub controller initialized');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Card10Controller;
}
