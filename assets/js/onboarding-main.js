// MAIN ONBOARDING-01.JS FILE - COMPLETE REWRITE WITH SAFE DECLARATIONS
// This file contains ONLY core functionality and utilities
// Card-specific functions are in separate card files

// Prevent multiple loads
if (window.ONBOARDING_MAIN_LOADED) {
    console.warn('onboarding-main.js already loaded, skipping...');
} else {
    window.ONBOARDING_MAIN_LOADED = true;

// ============================================================================
// GLOBAL VARIABLES AND STATE MANAGEMENT (SAFE DECLARATIONS)
// ============================================================================

// Initialize global state object if it doesn't exist
window.TutorState = window.TutorState || {};

// Progress tracking - safe assignments
window.TutorState.currentProgress = window.TutorState.currentProgress || 25;
window.TutorState.agreementSigned = window.TutorState.agreementSigned || false;
window.TutorState.credentialsUploaded = window.TutorState.credentialsUploaded || false;
window.TutorState.identityVerified = window.TutorState.identityVerified || false;
window.TutorState.scheduleSet = window.TutorState.scheduleSet || false;
window.TutorState.resourcesUploaded = window.TutorState.resourcesUploaded || false;
window.TutorState.premiumActive = window.TutorState.premiumActive || false;

// Step Progress Objects
window.TutorState.agreementStepProgress = window.TutorState.agreementStepProgress || {
    signature: false,
    interview: false
};

window.TutorState.credentialsStepProgress = window.TutorState.credentialsStepProgress || {
    cv: false,
    certificates: false,
    dbs: false,
    references: false
};

window.TutorState.identityStepProgress = window.TutorState.identityStepProgress || {
    video: false,
    idDocument: false
};

window.TutorState.scheduleStepProgress = window.TutorState.scheduleStepProgress || {
    availability: false,
    timezone: false
};

window.TutorState.resourcesStepProgress = window.TutorState.resourcesStepProgress || {
    resources: false
};

// Resource Management
window.TutorState.uploadedResources = window.TutorState.uploadedResources || [];
window.TutorState.resourceCategories = window.TutorState.resourceCategories || {
    worksheets: [],
    lessonPlans: [],
    presentations: [],
    assessments: [],
    examples: [],
    games: [],
    other: []
};
window.TutorState.maxResources = window.TutorState.maxResources || 10;

// Tools Data
window.TutorState.availableTools = window.TutorState.availableTools || [
    { name: 'Interactive Whiteboard', icon: 'fas fa-chalkboard', status: 'Available', description: 'Draw, write, and solve problems collaboratively' },
    { name: 'Screen Sharing', icon: 'fas fa-desktop', status: 'Available', description: 'Share your screen for demonstrations' },
    { name: 'Calculator', icon: 'fas fa-calculator', status: 'Available', description: 'Built-in scientific calculator' },
    { name: 'Graphing Tool', icon: 'fas fa-chart-line', status: 'Available', description: 'Create and share mathematical graphs' },
    { name: 'File Sharing', icon: 'fas fa-file-share', status: 'Available', description: 'Share documents and resources' },
    { name: 'Recording', icon: 'fas fa-video', status: 'Premium', description: 'Record sessions for student review' }
];

// ============================================================================
// CORE UTILITY FUNCTIONS (Used by all cards)
// ============================================================================

// Progress Management
function updateProgress() {
    const totalSteps = 7; // Total completion steps
    let completedSteps = 1; // Welcome step is always complete
    
    // Count completed steps
    if (window.TutorState.agreementSigned) completedSteps++;
    if (window.TutorState.credentialsUploaded) completedSteps++;
    if (window.TutorState.identityVerified) completedSteps++;
    if (window.TutorState.scheduleSet) completedSteps++;
    if (window.TutorState.resourcesUploaded) completedSteps++;
    if (window.TutorState.premiumActive) completedSteps++;
    
    window.TutorState.currentProgress = Math.round((completedSteps / totalSteps) * 100);
    
    // Update UI
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const statusBadge = document.getElementById('statusBadge');
    
    if (progressFill) {
        progressFill.style.width = window.TutorState.currentProgress + '%';
        progressFill.style.transition = 'width 0.8s ease-in-out';
    }
    if (progressText) progressText.textContent = window.TutorState.currentProgress + '%';
    
    // Update status badge
    if (statusBadge) {
        if (window.TutorState.currentProgress === 100) {
            statusBadge.textContent = 'Profile Complete';
            statusBadge.className = 'status-badge status-complete';
        } else if (window.TutorState.currentProgress >= 75) {
            statusBadge.textContent = 'Almost Ready';
            statusBadge.className = 'status-badge status-in-progress';
        } else if (window.TutorState.currentProgress >= 50) {
            statusBadge.textContent = 'In Progress';
            statusBadge.className = 'status-badge status-in-progress';
        } else {
            statusBadge.textContent = 'New Tutor';
            statusBadge.className = 'status-badge status-new';
        }
    }
    
    // Check milestones
    checkMilestones();
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Advanced notification with actions
function showAdvancedNotification(message, type = 'info', duration = 5000, actions = []) {
    const notification = createNotificationElement(message, type, actions);
    
    // Position notification based on existing ones
    const existingNotifications = document.querySelectorAll('.notification');
    const topOffset = 20 + (existingNotifications.length * 80);
    notification.style.top = `${topOffset}px`;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

function createNotificationElement(message, type, actions) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#FF9800',
        info: '#2196F3',
        premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
        transform: translateX(100%);
    `;
    
    const content = document.createElement('div');
    content.style.cssText = 'display: flex; align-items: center; gap: 10px;';
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        premium: '⭐'
    };
    
    const icon = document.createElement('span');
    icon.textContent = icons[type] || icons.info;
    
    const text = document.createElement('span');
    text.textContent = message;
    text.style.flex = '1';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;';
    closeBtn.onclick = () => removeNotification(notification);
    
    content.appendChild(icon);
    content.appendChild(text);
    content.appendChild(closeBtn);
    
    if (actions.length > 0) {
        const actionContainer = document.createElement('div');
        actionContainer.style.cssText = 'margin-top: 10px; display: flex; gap: 10px;';
        
        actions.forEach(action => {
            const actionBtn = document.createElement('button');
            actionBtn.textContent = action.text;
            actionBtn.style.cssText = 'background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;';
            actionBtn.onclick = () => {
                action.callback();
                removeNotification(notification);
            };
            actionContainer.appendChild(actionBtn);
        });
        
        notification.appendChild(content);
        notification.appendChild(actionContainer);
    } else {
        notification.appendChild(content);
    }
    
    // Trigger slide-in animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    return notification;
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
            repositionNotifications();
        }
    }, 300);
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach((notification, index) => {
        notification.style.top = `${20 + (index * 80)}px`;
    });
}

// Modal Management
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Card Status Updates
function updateCardStatus(cardId, status, statusText) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const statusIndicator = card.querySelector('.status-indicator');
    if (!statusIndicator) return;
    
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusSpan = statusIndicator.querySelector('span');
    
    // Remove existing status classes
    statusIndicator.classList.remove('status-complete', 'status-incomplete', 'status-in-progress');
    
    // Add new status
    statusIndicator.classList.add(`status-${status}`);
    if (statusSpan) statusSpan.textContent = statusText;
    
    // Update status dot color
    const colors = {
        'complete': '#4CAF50',
        'in-progress': '#FF9800',
        'incomplete': '#f44336'
    };
    
    if (statusDot && colors[status]) {
        statusDot.style.background = colors[status];
    }
}

// ============================================================================
// STORAGE AND PERSISTENCE
// ============================================================================

function saveProgressToStorage() {
    const progressData = {
        currentProgress: window.TutorState.currentProgress,
        agreementSigned: window.TutorState.agreementSigned,
        credentialsUploaded: window.TutorState.credentialsUploaded,
        identityVerified: window.TutorState.identityVerified,
        scheduleSet: window.TutorState.scheduleSet,
        resourcesUploaded: window.TutorState.resourcesUploaded,
        premiumActive: window.TutorState.premiumActive,
        agreementStepProgress: window.TutorState.agreementStepProgress,
        credentialsStepProgress: window.TutorState.credentialsStepProgress,
        identityStepProgress: window.TutorState.identityStepProgress,
        scheduleStepProgress: window.TutorState.scheduleStepProgress,
        resourcesStepProgress: window.TutorState.resourcesStepProgress,
        uploadedResources: window.TutorState.uploadedResources,
        resourceCategories: window.TutorState.resourceCategories
    };
    
    try {
        localStorage.setItem('tutorOnboardingProgress', JSON.stringify(progressData));
    } catch (e) {
        console.warn('Could not save progress to localStorage:', e);
    }
}

function loadProgressFromStorage() {
    try {
        const saved = localStorage.getItem('tutorOnboardingProgress');
        if (saved) {
            const progressData = JSON.parse(saved);
            
            // Restore all variables to TutorState
            window.TutorState.currentProgress = progressData.currentProgress || 25;
            window.TutorState.agreementSigned = progressData.agreementSigned || false;
            window.TutorState.credentialsUploaded = progressData.credentialsUploaded || false;
            window.TutorState.identityVerified = progressData.identityVerified || false;
            window.TutorState.scheduleSet = progressData.scheduleSet || false;
            window.TutorState.resourcesUploaded = progressData.resourcesUploaded || false;
            window.TutorState.premiumActive = progressData.premiumActive || false;
            
            // Restore step progress
            window.TutorState.agreementStepProgress = progressData.agreementStepProgress || { signature: false, interview: false };
            window.TutorState.credentialsStepProgress = progressData.credentialsStepProgress || { cv: false, certificates: false, dbs: false, references: false };
            window.TutorState.identityStepProgress = progressData.identityStepProgress || { video: false, idDocument: false };
            window.TutorState.scheduleStepProgress = progressData.scheduleStepProgress || { availability: false, timezone: false };
            window.TutorState.resourcesStepProgress = progressData.resourcesStepProgress || { resources: false };
            
            // Restore resources
            window.TutorState.uploadedResources = progressData.uploadedResources || [];
            window.TutorState.resourceCategories = progressData.resourceCategories || {
                worksheets: [], lessonPlans: [], presentations: [], assessments: [], examples: [], games: [], other: []
            };
            
            return true;
        }
    } catch (e) {
        console.warn('Could not load progress from localStorage:', e);
    }
    
    return false;
}

// ============================================================================
// ANALYTICS AND TRACKING
// ============================================================================

function trackInteraction(action, details = {}) {
    const interactionData = {
        action,
        details,
        timestamp: new Date().toISOString(),
        progress: window.TutorState.currentProgress,
        session: Date.now()
    };
    
    console.log('Interaction tracked:', interactionData);
    
    // Store locally for demo purposes
    try {
        const interactions = JSON.parse(localStorage.getItem('tutorInteractions') || '[]');
        interactions.push(interactionData);
        
        // Keep only last 100 interactions
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('tutorInteractions', JSON.stringify(interactions));
    } catch (e) {
        console.warn('Could not save interaction data:', e);
    }
}

function checkMilestones() {
    const milestones = [
        { progress: 25, message: 'Welcome! Your onboarding journey has begun 🎉', achieved: false },
        { progress: 40, message: 'Great progress! You\'re building a strong foundation 💪', achieved: false },
        { progress: 60, message: 'Halfway there! Your profile is taking shape 🚀', achieved: false },
        { progress: 80, message: 'Almost complete! You\'re nearly ready to start tutoring 🎯', achieved: false },
        { progress: 100, message: 'Congratulations! Your profile is complete and ready! 🏆', achieved: false }
    ];
    
    try {
        const savedMilestones = JSON.parse(localStorage.getItem('achievedMilestones') || '[]');
        
        milestones.forEach(milestone => {
            if (window.TutorState.currentProgress >= milestone.progress && !savedMilestones.includes(milestone.progress)) {
                showAdvancedNotification(milestone.message, 'success', 7000);
                savedMilestones.push(milestone.progress);
                trackInteraction('milestone_achieved', { progress: milestone.progress });
            }
        });
        
        localStorage.setItem('achievedMilestones', JSON.stringify(savedMilestones));
    } catch (e) {
        console.warn('Could not process milestones:', e);
    }
}

// ============================================================================
// UTILITY FUNCTIONS FOR CARDS
// ============================================================================

// File Upload Simulation
function simulateFileUpload(fileName, callback) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (callback) callback();
            resolve(true);
        }, Math.random() * 2000 + 1000); // 1-3 seconds
    });
}

// Form Validation
function validateForm(formData) {
    const errors = [];
    
    Object.keys(formData).forEach(key => {
        if (!formData[key] || formData[key].trim() === '') {
            errors.push(`${key} is required`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal[style*="display: block"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Ctrl+S saves progress
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProgressToStorage();
        showNotification('Progress saved!', 'success');
    }
});

// Handle modal clicks outside content area
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Handle window beforeunload (save progress before leaving)
window.addEventListener('beforeunload', function() {
    saveProgressToStorage();
});

// ============================================================================
// GLOBAL EXPORTS FOR CARD FILES (BACKWARDS COMPATIBILITY)
// ============================================================================

// Make utility functions available globally for card files
window.showNotification = showNotification;
window.showAdvancedNotification = showAdvancedNotification;
window.updateProgress = updateProgress;
window.updateCardStatus = updateCardStatus;
window.closeModal = closeModal;
window.trackInteraction = trackInteraction;
window.saveProgressToStorage = saveProgressToStorage;
window.validateForm = validateForm;
window.simulateFileUpload = simulateFileUpload;

// Make global variables accessible (backwards compatibility - reference TutorState)
Object.defineProperty(window, 'currentProgress', {
    get: () => window.TutorState.currentProgress,
    set: (value) => window.TutorState.currentProgress = value
});

Object.defineProperty(window, 'agreementSigned', {
    get: () => window.TutorState.agreementSigned,
    set: (value) => window.TutorState.agreementSigned = value
});

Object.defineProperty(window, 'credentialsUploaded', {
    get: () => window.TutorState.credentialsUploaded,
    set: (value) => window.TutorState.credentialsUploaded = value
});

Object.defineProperty(window, 'identityVerified', {
    get: () => window.TutorState.identityVerified,
    set: (value) => window.TutorState.identityVerified = value
});

Object.defineProperty(window, 'scheduleSet', {
    get: () => window.TutorState.scheduleSet,
    set: (value) => window.TutorState.scheduleSet = value
});

Object.defineProperty(window, 'resourcesUploaded', {
    get: () => window.TutorState.resourcesUploaded,
    set: (value) => window.TutorState.resourcesUploaded = value
});

Object.defineProperty(window, 'premiumActive', {
    get: () => window.TutorState.premiumActive,
    set: (value) => window.TutorState.premiumActive = value
});

// Step progress objects
window.agreementStepProgress = window.TutorState.agreementStepProgress;
window.credentialsStepProgress = window.TutorState.credentialsStepProgress;
window.identityStepProgress = window.TutorState.identityStepProgress;
window.scheduleStepProgress = window.TutorState.scheduleStepProgress;
window.resourcesStepProgress = window.TutorState.resourcesStepProgress;
window.uploadedResources = window.TutorState.uploadedResources;
window.resourceCategories = window.TutorState.resourceCategories;
window.availableTools = window.TutorState.availableTools;
window.maxResources = window.TutorState.maxResources;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Tutor Onboarding Dashboard...');
    
    // Load saved progress
    const progressLoaded = loadProgressFromStorage();
    if (progressLoaded) {
        console.log('✅ Previous progress loaded');
        showNotification('Welcome back! Your progress has been restored.', 'info');
    } else {
        console.log('🆕 Starting fresh onboarding');
        showNotification('Welcome to your tutoring journey! Let\'s get you set up.', 'success');
    }
    
    // Set initial progress
    updateProgress();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .category-box, .upload-box, .tool-card, .student-card {
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            background: white;
        }
        
        .category-box:hover, .upload-box:hover, .tool-card:hover, .student-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-color: #4CAF50;
        }
        
        .status-premium {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .modal {
            backdrop-filter: blur(5px);
            background: rgba(0, 0, 0, 0.5);
        }
        
        .modal-content {
            animation: fadeIn 0.3s ease-out;
        }
        
        .btn {
            transition: all 0.2s ease;
        }
        
        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
    `;
    document.head.appendChild(style);
    
    // Set up periodic progress saves
    setInterval(() => {
        saveProgressToStorage();
    }, 30000); // Save every 30 seconds
    
    // Track initialization
    trackInteraction('dashboard_initialized', {
        progress: window.TutorState.currentProgress,
        hasStoredProgress: progressLoaded
    });
    
    console.log('✅ Main dashboard initialized successfully!');
    console.log(`📊 Current progress: ${window.TutorState.currentProgress}%`);
    console.log('🔧 Ready to load card modules...');
});

// ============================================================================
// DEBUG HELPERS (Remove in production)
// ============================================================================

// Global debug function
window.debugOnboarding = function() {
    return {
        progress: window.TutorState.currentProgress,
        steps: {
            agreement: window.TutorState.agreementSigned,
            credentials: window.TutorState.credentialsUploaded,
            identity: window.TutorState.identityVerified,
            schedule: window.TutorState.scheduleSet,
            resources: window.TutorState.resourcesUploaded,
            premium: window.TutorState.premiumActive
        },
        stepProgress: {
            agreement: window.TutorState.agreementStepProgress,
            credentials: window.TutorState.credentialsStepProgress,
            identity: window.TutorState.identityStepProgress,
            schedule: window.TutorState.scheduleStepProgress,
            resources: window.TutorState.resourcesStepProgress
        },
        fullState: window.TutorState
    };
};

console.log('🔧 Debug: Type debugOnboarding() in console to see current state');

} // End of prevention block
