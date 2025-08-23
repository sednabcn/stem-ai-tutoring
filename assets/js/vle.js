// Enhanced VLE System with Role Detection and Dynamic Features

// ==========================================
// ROLE DETECTION & USER MANAGEMENT SYSTEM
// ==========================================

const roleSystem = {
    // Role detection with multiple fallback methods
    detectRole() {
        // 1. Priority: URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlRole = urlParams.get('role');
        if (urlRole && ['tutor', 'student'].includes(urlRole)) {
            localStorage.setItem('userRole', urlRole);
            localStorage.setItem('roleSource', urlParams.get('source') || 'url');
            console.log(`Role detected from URL: ${urlRole}`);
            return urlRole;
        }
        
        // 2. Secondary: Document referrer analysis
        const referrer = document.referrer;
        if (referrer.includes('mathtutor.html')) {
            localStorage.setItem('userRole', 'tutor');
            localStorage.setItem('roleSource', 'referrer');
            console.log('Role detected from referrer: tutor');
            return 'tutor';
        } else if (referrer.includes('mathstudent.html')) {
            localStorage.setItem('userRole', 'student');
            localStorage.setItem('roleSource', 'referrer');
            console.log('Role detected from referrer: student');
            return 'student';
        }
        
        // 3. Fallback: localStorage or default
        const storedRole = localStorage.getItem('userRole');
        console.log(`Using ${storedRole ? 'stored' : 'default'} role: ${storedRole || 'student'}`);
        return storedRole || 'student';
    },
    
    // User data configuration for different roles
    getUserData(role) {
        const userData = {
            tutor: {
                name: 'Dr. Rachel Martinez',
                role: 'Mathematics Tutor',
                badge: 'Verified Tutor',
                badgeClass: 'status-badge tutor-badge',
                email: 'r.martinez@simleng.edu',
                specialization: 'Advanced Mathematics, Calculus, Statistics',
                memberSince: 'January 2024',
                avatar: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%3E%3Crect%20width='48'%20height='48'%20rx='24'%20fill='%23667eea'/%3E%3Ctext%20x='50%25'%20y='50%25'%20text-anchor='middle'%20dy='0.35em'%20fill='white'%20font-family='Arial'%20font-size='18'%20font-weight='600'%3ET%3C/text%3E%3C/svg%3E",
                indicatorClass: 'tutor-indicator',
                dashboardUrl: '../pages/mathtutor.html',
                messageCount: 5
            },
            student: {
                name: 'Alex Johnson',
                role: 'Mathematics Student',
                badge: 'Active Student',
                badgeClass: 'status-badge student-badge',
                email: 'alex.johnson@student.edu',
                specialization: 'Undergraduate Mathematics',
                memberSince: 'February 2024',
                avatar: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='48'%20height='48'%20viewBox='0%200%2048%2048'%3E%3Crect%20width='48'%20height='48'%20rx='24'%20fill='%2310b981'/%3E%3Ctext%20x='50%25'%20y='50%25'%20text-anchor='middle'%20dy='0.35em'%20fill='white'%20font-family='Arial'%20font-size='18'%20font-weight='600'%3ES%3C/text%3E%3C/svg%3E",
                indicatorClass: 'student-indicator',
                dashboardUrl: '../pages/mathstudent.html',
                messageCount: 2
            }
        };
        return userData[role] || userData.student;
    },
    
    // Main UI update method
    updateUI() {
        const role = this.detectRole();
        const userData = this.getUserData(role);
        
        try {
            this.updateAvatarElements(userData);
            this.updateUserInfo(userData);
            this.updateMenuItems(role);
            this.updateProfileModal(userData);
            console.log(`UI updated for role: ${role}`);
        } catch (error) {
            console.error('Error updating UI:', error);
        }
    },
    
    // Update avatar-related elements
    updateAvatarElements(userData) {
        const avatarImage = document.getElementById('avatarImage');
        const avatarIndicator = document.querySelector('.avatar-status-indicator');
        const menuAvatar = document.getElementById('menuAvatarImage');
        
        if (avatarImage) avatarImage.src = userData.avatar;
        if (menuAvatar) menuAvatar.src = userData.avatar;
        if (avatarIndicator) {
            avatarIndicator.className = `avatar-status-indicator active ${userData.indicatorClass}`;
        }
    },
    
    // Update user information in menus
    updateUserInfo(userData) {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const statusBadge = document.querySelector('.status-badge');
        const messageBadge = document.getElementById('messageBadge');
        
        if (userName) userName.textContent = userData.name;
        if (userRole) userRole.textContent = userData.role;
        if (statusBadge) {
            statusBadge.textContent = userData.badge;
            statusBadge.className = userData.badgeClass;
        }
        if (messageBadge) messageBadge.textContent = userData.messageCount;
    },
    
    // Update profile modal with user data
    updateProfileModal(userData) {
        // Update profile modal elements if they exist
        const profileEmail = document.querySelector('#profileModal .form-input[type="email"]');
        const profileSpecialization = document.querySelector('#profileModal .form-input[value*="Mathematics"]');
        const profileMemberSince = document.querySelector('#profileModal .form-input[value*="January"]');
        
        if (profileEmail) profileEmail.value = userData.email;
        if (profileSpecialization) profileSpecialization.value = userData.specialization;
        if (profileMemberSince) profileMemberSince.value = userData.memberSince;
    },
    
    // Generate menu items based on role
    updateMenuItems(role) {
        const menuItems = document.querySelector('.menu-items');
        if (!menuItems) return;
        
        const userData = this.getUserData(role);
        
        // Common menu items for both roles
        const commonItems = `
            <div class="avatar-menu-item" onclick="showModal('profileModal')">
                <span class="icon">👤</span>
                Profile
            </div>
            
            <div class="avatar-menu-item" onclick="showModal('settingsModal')">
                <span class="icon">⚙️</span>
                Settings
            </div>
            
            <div class="avatar-menu-item" onclick="showModal('messagesModal')">
                <span class="icon">💬</span>
                Messages
                <span class="message-badge" id="messageBadge">${userData.messageCount}</span>
            </div>
            
            <div class="avatar-menu-item" onclick="showModal('notesModal')">
                <span class="icon">📝</span>
                Notes
            </div>
            
            <div class="avatar-menu-item" onclick="showModal('documentsModal')">
                <span class="icon">📁</span>
                Documents
            </div>`;
        
        // Role-specific navigation item
        const roleSpecificItem = role === 'tutor' 
            ? `<div class="avatar-menu-item" onclick="goToTutorDashboard()">
                <span class="icon">📊</span>
                Tutor Dashboard
            </div>`
            : `<div class="avatar-menu-item" onclick="goToStudentPortal()">
                <span class="icon">📚</span>
                Student Portal
            </div>`;
        
        // Logout item
        const logoutItem = `
            <div class="avatar-menu-item danger" onclick="logout()">
                <span class="icon">🚪</span>
                Logout
            </div>`;
        
        menuItems.innerHTML = commonItems + roleSpecificItem + logoutItem;
    }
};

// ==========================================
// NOTIFICATION CENTER SYSTEM
// ==========================================

const notificationCenter = {
    notifications: [
        {
            id: 1,
            title: "📚 New Assignment Available",
            message: "Calculus Problem Set #5 is now available for submission.",
            time: "2 hours ago",
            category: "assignments",
            priority: "high",
            read: false
        },
        {
            id: 2,
            title: "🎥 Webinar Reminder",
            message: "Advanced Statistics webinar starts in 1 hour.",
            time: "4 hours ago",
            category: "webinars", 
            priority: "medium",
            read: false
        },
        {
            id: 3,
            title: "🤖 AI Tutor Update",
            message: "New features added to the AI tutor system.",
            time: "1 day ago",
            category: "ai-tutor",
            priority: "low",
            read: false
        }
    ],
    
    togglePanel() {
        const panel = document.getElementById('notificationPanel');
        const isActive = panel.classList.contains('active');
        
        if (isActive) {
            panel.classList.remove('active');
        } else {
            panel.classList.add('active');
            this.updateNotificationDisplay();
        }
    },
    
    updateNotificationDisplay() {
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;
        
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notificationCount');
        
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        // Generate notification HTML
        notificationList.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'} ${notification.priority}-priority" 
                 data-id="${notification.id}" onclick="notificationCenter.markAsRead(${notification.id})">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong>${notification.title}</strong>
                    <span style="color: #6b7280; font-size: 12px;">${notification.time}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">${notification.message}</p>
            </div>
        `).join('');
    },
    
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationDisplay();
        }
    },
    
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationDisplay();
        
        const bell = document.getElementById('notificationBell');
        if (bell) bell.classList.remove('has-notifications');
    },
    
    filterNotifications(category) {
        const filteredNotifications = category === 'all' 
            ? this.notifications 
            : this.notifications.filter(n => n.category === category);
        
        const notificationList = document.getElementById('notificationList');
        if (!notificationList) return;
        
        notificationList.innerHTML = filteredNotifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'} ${notification.priority}-priority" 
                 data-id="${notification.id}" onclick="notificationCenter.markAsRead(${notification.id})">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong>${notification.title}</strong>
                    <span style="color: #6b7280; font-size: 12px;">${notification.time}</span>
                </div>
                <p style="color: #6b7280; font-size: 14px; margin: 0;">${notification.message}</p>
            </div>
        `).join('');
    }
};

// ==========================================
// VLE TAB NAVIGATION SYSTEM
// ==========================================

const tabNavigation = {
    showTab(tabName) {
        try {
            // Remove active class from all buttons and contents
            const tabButtons = document.querySelectorAll('.vle-tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            // Show corresponding content
            const activeContent = document.getElementById(tabName);
            if (activeContent) {
                activeContent.classList.add('active');
            }
            
            console.log(`Switched to tab: ${tabName}`);
        } catch (error) {
            console.error('Error switching tabs:', error);
        }
    },
    
    initializeTabListeners() {
        const tabButtons = document.querySelectorAll('.vle-tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = button.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });
    }
};

// ==========================================
// NOTES SYSTEM
// ==========================================

const notesSystem = {
    notes: [
        {
            id: 1,
            title: "Calculus Problem Set Notes",
            content: "Key formulas and approaches for solving derivative problems...",
            category: "assignments",
            date: "2024-03-10",
            preview: "Key formulas and approaches for solving..."
        },
        {
            id: 2,
            title: "Linear Algebra Webinar",
            content: "Matrix operations, eigenvalues, and eigenvectors discussion...",
            category: "lectures",
            date: "2024-03-08", 
            preview: "Matrix operations and eigenvalues..."
        },
        {
            id: 3,
            title: "Study Schedule",
            content: "Weekly study plan for mathematics courses...",
            category: "personal",
            date: "2024-03-05",
            preview: "Weekly study plan for mathematics..."
        }
    ],
    
    displayNotes(category = 'all') {
        const notesList = document.getElementById('notesList');
        if (!notesList) return;
        
        const filteredNotes = category === 'all' 
            ? this.notes 
            : this.notes.filter(note => note.category === category);
        
        notesList.innerHTML = filteredNotes.map(note => `
            <div class="note-item" data-category="${note.category}" onclick="notesSystem.editNote(${note.id})">
                <div class="note-header">
                    <strong>${note.title}</strong>
                    <span class="note-date">${note.date}</span>
                </div>
                <p class="note-preview">${note.preview}</p>
            </div>
        `).join('');
    },
    
    createNewNote() {
        const notesList = document.getElementById('notesList');
        const noteEditor = document.getElementById('noteEditor');
        const titleInput = document.querySelector('.note-title');
        const contentInput = document.querySelector('.note-content');
        
        if (notesList) notesList.style.display = 'none';
        if (noteEditor) noteEditor.style.display = 'flex';
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        
        // Store that we're creating a new note
        noteEditor.dataset.noteId = 'new';
    },
    
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;
        
        const notesList = document.getElementById('notesList');
        const noteEditor = document.getElementById('noteEditor');
        const titleInput = document.querySelector('.note-title');
        const contentInput = document.querySelector('.note-content');
        
        if (notesList) notesList.style.display = 'none';
        if (noteEditor) noteEditor.style.display = 'flex';
        if (titleInput) titleInput.value = note.title;
        if (contentInput) contentInput.value = note.content;
        
        // Store which note we're editing
        noteEditor.dataset.noteId = noteId;
    },
    
    saveNote() {
        const titleInput = document.querySelector('.note-title');
        const contentInput = document.querySelector('.note-content');
        const noteEditor = document.getElementById('noteEditor');
        
        if (!titleInput || !contentInput) return;
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title) {
            alert('Please enter a title for your note');
            return;
        }
        
        const noteId = noteEditor.dataset.noteId;
        const currentDate = new Date().toISOString().split('T')[0];
        
        if (noteId === 'new') {
            // Create new note
            const newNote = {
                id: this.notes.length + 1,
                title: title,
                content: content,
                category: 'personal',
                date: currentDate,
                preview: content.substring(0, 50) + '...'
            };
            this.notes.unshift(newNote);
        } else {
            // Update existing note
            const note = this.notes.find(n => n.id == noteId);
            if (note) {
                note.title = title;
                note.content = content;
                note.date = currentDate;
                note.preview = content.substring(0, 50) + '...';
            }
        }
        
        alert('Note saved successfully!');
        this.closeNoteEditor();
        this.displayNotes();
    },
    
    closeNoteEditor() {
        const noteEditor = document.getElementById('noteEditor');
        const notesList = document.getElementById('notesList');
        
        if (noteEditor) noteEditor.style.display = 'none';
        if (notesList) notesList.style.display = 'block';
    },
    
    filterNotes(category) {
        // Update active category button
        document.querySelectorAll('.note-category').forEach(cat => 
            cat.classList.remove('active')
        );
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Display filtered notes
        this.displayNotes(category);
    },
    
    searchNotes(searchTerm) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const notesList = document.getElementById('notesList');
        if (!notesList) return;
        
        notesList.innerHTML = filteredNotes.map(note => `
            <div class="note-item" data-category="${note.category}" onclick="notesSystem.editNote(${note.id})">
                <div class="note-header">
                    <strong>${note.title}</strong>
                    <span class="note-date">${note.date}</span>
                </div>
                <p class="note-preview">${note.preview}</p>
            </div>
        `).join('');
    }
};

// ==========================================
// MODAL SYSTEM
// ==========================================

const modalSystem = {
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Special handling for notes modal
            if (modalId === 'notesModal') {
                notesSystem.displayNotes();
            }
        }
    },
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    },
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
};

// ==========================================
// SETTINGS SYSTEM
// ==========================================

const settingsSystem = {
    settings: {
        notifications: {
            email: true,
            assignments: true,
            webinars: false
        },
        appearance: {
            theme: 'light',
            language: 'en'
        },
        privacy: {
            showOnlineStatus: true,
            allowDirectMessages: false
        }
    },
    
    saveSettings() {
        // Collect settings from form
        const emailNotifications = document.querySelector('input[type="checkbox"]:checked') !== null;
        const theme = document.querySelector('.setting-select').value;
        
        // Save to localStorage
        localStorage.setItem('vleSettings', JSON.stringify(this.settings));
        
        alert('Settings saved successfully!');
        modalSystem.closeModal('settingsModal');
    },
    
    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            // Reset to defaults
            this.settings = {
                notifications: { email: true, assignments: true, webinars: false },
                appearance: { theme: 'light', language: 'en' },
                privacy: { showOnlineStatus: true, allowDirectMessages: false }
            };
            
            localStorage.removeItem('vleSettings');
            alert('Settings reset to default');
        }
    },
    
    loadSettings() {
        const savedSettings = localStorage.getItem('vleSettings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }
};

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function goToTutorDashboard() {
    window.location.href = '../pages/mathtutor.html';
}

function goToStudentPortal() {
    window.location.href = '../pages/mathstudent.html';
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        alert('Logging out...');
        window.location.href = '../index.html';
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function toggleAvatarMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('avatarMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Global functions for backward compatibility
function showVLETab(tabName) {
    tabNavigation.showTab(tabName);
}

function showModal(modalId) {
    modalSystem.showModal(modalId);
}

function closeModal(modalId) {
    modalSystem.closeModal(modalId);
}

function createNewNote() {
    notesSystem.createNewNote();
}

function saveNote() {
    notesSystem.saveNote();
}

function closeNoteEditor() {
    notesSystem.closeNoteEditor();
}

function filterNotes(category) {
    notesSystem.filterNotes(category);
}

function saveSettings() {
    settingsSystem.saveSettings();
}

function resetSettings() {
    settingsSystem.resetSettings();
}

// ==========================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('VLE System initializing...');
    
    try {
        // Initialize all systems
        roleSystem.updateUI();
        tabNavigation.initializeTabListeners();
        notificationCenter.updateNotificationDisplay();
        settingsSystem.loadSettings();
        
        // Setup notification filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active filter
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter notifications
                const category = btn.dataset.filter;
                notificationCenter.filterNotifications(category);
            });
        });
        
        // Setup note category listeners
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('note-category')) {
                const category = e.target.dataset.category;
                notesSystem.filterNotes(category);
            }
        });
        
        // Setup notes search
        const notesSearch = document.getElementById('notesSearch');
        if (notesSearch) {
            notesSearch.addEventListener('input', (e) => {
                notesSystem.searchNotes(e.target.value);
            });
        }
        
        console.log('VLE System initialized successfully');
        
    } catch (error) {
        console.error('Error initializing VLE System:', error);
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
    const avatarMenu = document.getElementById('avatarMenu');
    const notificationPanel = document.getElementById('notificationPanel');
    
    // Close avatar menu if clicking outside
    if (avatarMenu && !event.target.closest('.avatar-container')) {
        avatarMenu.classList.remove('active');
    }
    
    // Close notification panel if clicking outside
    if (notificationPanel && 
        !event.target.closest('.icon-wrapper') && 
        !event.target.closest('.notification-panel')) {
        notificationPanel.classList.remove('active');
    }
});

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        const modal = event.target;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // ESC to close modals
    if (event.key === 'Escape') {
        modalSystem.closeAllModals();
        
        // Close dropdowns
        const avatarMenu = document.getElementById('avatarMenu');
        const notificationPanel = document.getElementById('notificationPanel');
        
        if (avatarMenu) avatarMenu.classList.remove('active');
        if (notificationPanel) notificationPanel.classList.remove('active');
    }
    
    // Ctrl+N for new note (when notes modal is open)
    if (event.ctrlKey && event.key === 'n') {
        const notesModal = document.getElementById('notesModal');
        if (notesModal && notesModal.classList.contains('active')) {
            event.preventDefault();
            notesSystem.createNewNote();
        }
    }
});

console.log('Enhanced VLE Script loaded successfully');
