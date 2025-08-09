        // Enhanced Data Management with Firebase-ready structure
        class TutorDashboard {
            constructor() {
                this.currentStudent = null;
                this.activeTab = 'sessions';
                this.notifications = [];
                this.isLoading = false;
                this.init();
		this.tutorStatus = 'active'; // or 'new', 'verified', 'premium'
            }

            init() {
                this.loadStudents();
                this.loadSessions();
                this.loadNotifications();
		this.initializeTutorStatus();
                this.setupEventListeners();
                this.startRealTimeUpdates();
            }

            // Student Management
            loadStudents() {
                // Firebase query would go here: db.collection('students').where('tutorId', '==', currentTutorId)
                const students = [
                    {
                        id: 'sarah',
                        name: 'Sarah Johnson',
                        subject: 'Algebra II',
                        status: 'active',
                        avatar: 'SJ',
                        sessions: 12,
                        progress: 85,
                        lastSession: '2025-08-02',
                        messages: [
                            { type: 'received', text: 'Hi Dr. Martinez! I need help with quadratic equations.', time: '10:30 AM', read: true },
                            { type: 'sent', text: 'Of course! Let\'s schedule a session for tomorrow at 3 PM.', time: '10:45 AM', read: true },
                            { type: 'received', text: 'Perfect! Thank you so much.', time: '10:47 AM', read: false }
                        ]
                    },
                    {
                        id: 'mike',
                        name: 'Mike Chen',
                        subject: 'AP Calculus',
                        status: 'active',
                        avatar: 'MC',
                        sessions: 8,
                        progress: 92,
                        lastSession: '2025-08-01',
                        messages: [
                            { type: 'received', text: 'The derivatives practice is really helping!', time: '2:15 PM', read: true },
                            { type: 'sent', text: 'Great to hear! Ready for integration next?', time: '2:30 PM', read: true }
                        ]
                    },
                    {
                        id: 'emma',
                        name: 'Emma Davis',
                        subject: 'Geometry',
                        status: 'completed',
                        avatar: 'ED',
                        sessions: 15,
                        progress: 78,
                        lastSession: '2025-07-30',
                        messages: [
                            { type: 'received', text: 'Thank you for all your help this semester!', time: '4:20 PM', read: true },
                            { type: 'sent', text: 'You worked so hard! Good luck on your final exam!', time: '4:25 PM', read: true }
                        ]
                    },
                    {
                        id: 'james',
                        name: 'James Brown',
                        subject: 'Statistics',
                        status: 'pending',
                        avatar: 'JB',
                        sessions: 3,
                        progress: 65,
                        lastSession: 'Upcoming',
                        messages: [
                            { type: 'received', text: 'Hi! I\'m new to statistics and feeling overwhelmed.', time: 'Yesterday', read: true },
                            { type: 'sent', text: 'Welcome! We\'ll take it step by step.', time: 'Yesterday', read: true }
                        ]
                    },
                    {
                        id: 'lisa',
                        name: 'Lisa Wang',
                        subject: 'Pre-Calculus',
                        status: 'active',
                        avatar: 'LW',
                        sessions: 6,
                        progress: 88,
                        lastSession: '2025-08-04',
                        messages: [
                            { type: 'received', text: 'Trigonometry is making more sense now!', time: '11:15 AM', read: false },
                            { type: 'sent', text: 'Great! Let\'s focus on identities next.', time: '11:30 AM', read: true }
                        ]
                    }
                ];

                this.students = students;
                this.renderStudents();
                this.populateStudentSelectors();
            }

            renderStudents() {
                const container = document.getElementById('studentsList');
                container.innerHTML = '';

                this.students.forEach(student => {
                    const studentElement = document.createElement('div');
                    studentElement.className = 'student-item';
                    studentElement.onclick = () => this.selectStudent(student.id);
                    
                    const unreadCount = student.messages.filter(m => !m.read && m.type === 'received').length;
                    
                    studentElement.innerHTML = `
                        <div class="student-avatar">${student.avatar}</div>
                        <div class="student-info">
                            <div class="student-name">
                                ${student.name}
                                ${unreadCount > 0 ? `<span style="background: #f44336; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: inline-flex; align-items: center; justify-content: center; margin-left: 0.5rem;">${unreadCount}</span>` : ''}
                            </div>
                            <div class="student-subject">${student.subject}</div>
                            <div class="student-status status-${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</div>
                        </div>
                    `;
                    
                    container.appendChild(studentElement);
                });
            }

            selectStudent(studentId) {
                this.currentStudent = this.students.find(s => s.id === studentId);
                
                // Update UI
                document.querySelectorAll('.student-item').forEach(item => {
                    item.classList.remove('selected');
                });
                event.target.closest('.student-item').classList.add('selected');
                
                // Update different tabs based on current view
                this.updateProgressTab();
                this.updateChatTab();
                
                this.showToast('Student selected: ' + this.currentStudent.name, 'success');
            }

            // Session Management
            loadSessions() {
                // Firebase query: db.collection('sessions').where('tutorId', '==', currentTutorId)
                this.sessions = [
                    {
                        id: 1,
                        studentName: 'Sarah Johnson',
                        subject: 'Algebra II',
                        date: '2025-08-05',
                        time: '15:00',
                        duration: 60,
                        rate: 45,
                        status: 'scheduled',
                        payment: 'pending'
                    },
                    {
                        id: 2,
                        studentName: 'Mike Chen',
                        subject: 'AP Calculus',
                        date: '2025-08-04',
                        time: '14:00',
                        duration: 90,
                        rate: 65,
                        status: 'completed',
                        payment: 'paid'
                    },
                    {
                        id: 3,
                        studentName: 'Lisa Wang',
                        subject: 'Pre-Calculus',
                        date: '2025-08-03',
                        time: '16:30',
                        duration: 75,
                        rate: 45,
                        status: 'completed',
                        payment: 'paid'
                    },
                    {
                        id: 4,
                        studentName: 'James Brown',
                        subject: 'Statistics',
                        date: '2025-08-06',
                        time: '10:00',
                        duration: 60,
                        rate: 45,
                        status: 'scheduled',
                        payment: 'pending'
                    }
                ];
                
                this.renderSessions();
            }

            renderSessions() {
                const tbody = document.getElementById('sessionsTableBody');
                tbody.innerHTML = '';

                this.sessions.forEach(session => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${session.studentName}</strong></td>
                        <td>${session.subject}</td>
                        <td>${this.formatDateTime(session.date, session.time)}</td>
                        <td>${session.duration} min</td>
                        <td>${session.rate}/hr</td>
                        <td><span class="session-status session-${session.status}">${session.status}</span></td>
                        <td><span class="session-status session-${session.payment}">${session.payment}</span></td>
                        <td>
                            <button onclick="dashboard.editSession(${session.id})" style="background: none; border: 1px solid #ddd; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">✏️</button>
                            <button onclick="dashboard.cancelSession(${session.id})" style="background: none; border: 1px solid #f44336; color: #f44336; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer;">❌</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }

            // Add this entire method after renderSessions()
	    loadNotifications() {
		// Firebase query would go here: db.collection('notifications').where('tutorId', '==', currentTutorId)
		this.notifications = [
		    {
			id: 1,
			type: 'message',
			title: 'New Message',
			text: 'Sarah Johnson sent you a message',
			time: '5 minutes ago',
			read: false
		    },
		    {
			id: 2,
			type: 'session',
			title: 'Session Reminder',
			text: 'Upcoming session with Mike Chen in 30 minutes',
			time: '25 minutes ago',
			read: false
		    },
		    {
			id: 3,
			type: 'payment',
			title: 'Payment Received',
			text: 'Payment of $65 received from Lisa Wang',
			time: '1 hour ago',
			read: true
		    }
		];
    
		// Update notification badge
		const unreadCount = this.notifications.filter(n => !n.read).length;
		document.getElementById('notificationBadge').textContent = unreadCount;
	    }
	    
	    // Enhanced UI Methods		
       	    updateProgressTab() {
                if (!this.currentStudent) return;
                
                const student = this.currentStudent;
                const progressContent = document.getElementById('progressContent');
                
                progressContent.innerHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <h3 style="margin-bottom: 1.5rem; color: #333; display: flex; align-items: center; gap: 0.5rem;">
                                <div class="student-avatar" style="width: 40px; height: 40px; font-size: 1rem;">${student.avatar}</div>
                                ${student.name} - Progress Overview
                            </h3>
                            <div style="margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Overall Progress:</span>
                                    <strong>${student.progress}%</strong>
                                </div>
                                <div style="background: #f0f0f0; border-radius: 10px; height: 8px; overflow: hidden;">
                                    <div style="width: ${student.progress}%; height: 100%; background: linear-gradient(45deg, #4CAF50, #45a049); transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem;">
                                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                                    <div style="font-size: 1.8rem; font-weight: bold; color: #4CAF50;">${student.sessions}</div>
                                    <div style="font-size: 0.9rem; color: #666;">Sessions Completed</div>
                                </div>
                                <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                                    <div style="font-size: 1.8rem; font-weight: bold; color: #2196F3;">${Math.round(student.sessions * student.rate * 0.85)}</div>
                                    <div style="font-size: 0.9rem; color: #666;">Hours Studied</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <h3 style="margin-bottom: 1.5rem; color: #333;">📊 Performance Metrics</h3>
                            <div style="space-y: 1rem;">
                                <div style="margin-bottom: 1rem;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Homework Completion:</span>
                                        <strong style="color: #4CAF50;">95%</strong>
                                    </div>
                                    <div style="background: #f0f0f0; border-radius: 10px; height: 6px;">
                                        <div style="width: 95%; height: 100%; background: #4CAF50; border-radius: 10px;"></div>
                                    </div>
                                </div>
                                <div style="margin-bottom: 1rem;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Test Scores:</span>
                                        <strong style="color: #2196F3;">88%</strong>
                                    </div>
                                    <div style="background: #f0f0f0; border-radius: 10px; height: 6px;">
                                        <div style="width: 88%; height: 100%; background: #2196F3; border-radius: 10px;"></div>
                                    </div>
                                </div>
                                <div style="margin-bottom: 1rem;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                        <span>Engagement Level:</span>
                                        <strong style="color: #ff9800;">92%</strong>
                                    </div>
                                    <div style="background: #f0f0f0; border-radius: 10px; height: 6px;">
                                        <div style="width: 92%; height: 100%; background: #ff9800; border-radius: 10px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h3 style="margin-bottom: 1.5rem; color: #333;">📈 Recent Activity & Notes</h3>
                        <div style="border-left: 3px solid #4CAF50; padding-left: 1rem; margin-bottom: 1rem;">
                            <div style="font-weight: 600; margin-bottom: 0.5rem;">Last Session: ${student.lastSession}</div>
                            <div style="color: #666; font-size: 0.9rem;">Excellent progress on ${student.subject.toLowerCase()}. Student is showing great improvement in problem-solving skills.</div>
                        </div>
                        <div style="border-left: 3px solid #2196F3; padding-left: 1rem; margin-bottom: 1rem;">
                            <div style="font-weight: 600; margin-bottom: 0.5rem;">Study Goals</div>
                            <div style="color: #666; font-size: 0.9rem;">Continue building confidence with complex equations. Focus on test preparation strategies.</div>
                        </div>
                        <div style="border-left: 3px solid #ff9800; padding-left: 1rem;">
                            <div style="font-weight: 600; margin-bottom: 0.5rem;">Areas for Improvement</div>
                            <div style="color: #666; font-size: 0.9rem;">Time management during exams. Practice more word problems to build application skills.</div>
                        </div>
                    </div>
                `;
            }

            updateChatTab() {
                if (!this.currentStudent) return;
                
                const student = this.currentStudent;
                document.getElementById('chatAvatar').textContent = student.avatar;
                document.getElementById('chatUserName').textContent = student.name;
                document.getElementById('chatStatus').textContent = `${student.subject} • ${student.status}`;
                
                // Load messages
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.innerHTML = '';
                
                student.messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${message.type}`;
                    messageDiv.innerHTML = `
                        <div>${message.text}</div>
                        <div class="message-time">${message.time}</div>
                        ${message.type === 'sent' ? '<div class="message-status">✓ Delivered</div>' : ''}
                    `;
                    chatMessages.appendChild(messageDiv);
                });
                
                // Enable input
                const messageInput = document.getElementById('messageInput');
                const sendBtn = document.getElementById('sendBtn');
                messageInput.disabled = false;
                messageInput.placeholder = `Message ${student.name}...`;
                sendBtn.disabled = false;
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            populateStudentSelectors() {
                const chatSelect = document.getElementById('studentChatSelect');
                chatSelect.innerHTML = '<option value="">Select student...</option>';
                
                this.students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = `${student.name} (${student.subject})`;
                    chatSelect.appendChild(option);
                });
            }

            // Messaging System
            sendMessage() {
                if (!this.currentStudent) return;
                
                const input = document.getElementById('messageInput');
                const message = input.value.trim();
                
                if (!message) return;
                
                // Add message to current student's messages
                this.currentStudent.messages.push({
                    type: 'sent',
                    text: message,
                    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                    read: true
                });
                
                // Clear input
                input.value = '';
                
                // Update chat display
                this.updateChatTab();
                
                // Show success toast
                this.showToast('Message sent successfully!', 'success');
                
                // Simulate student response after 2-3 seconds
                setTimeout(() => {
                    const responses = [
                        "Thank you for the quick response!",
                        "That makes sense now, thanks!",
                        "I'll work on that for our next session.",
                        "Can we schedule another session soon?",
                        "Your explanation really helped!"
                    ];
                    
                    this.currentStudent.messages.push({
                        type: 'received',
                        text: responses[Math.floor(Math.random() * responses.length)],
                        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                        read: false
                    });
                    
                    this.updateChatTab();
                    this.renderStudents(); // Update unread count
                }, Math.random() * 2000 + 1000);
            }

            // Utility Methods
            formatDateTime(date, time) {
                const dateObj = new Date(date + 'T' + time);
                return dateObj.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
            }

            showToast(message, type = 'success') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.8rem;">
                        <span style="font-size: 1.2rem;">
                            ${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
                        </span>
                        <span>${message}</span>
                    </div>
                `;
                
                document.getElementById('toastContainer').appendChild(toast);
                
                // Show toast
                setTimeout(() => toast.classList.add('show'), 100);
                
                // Remove toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            // Enhanced Event Listeners
            setupEventListeners() {
                // Message input enter key
                document.getElementById('messageInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage();
                    }
                });

                // Student chat selector
                document.getElementById('studentChatSelect').addEventListener('change', (e) => {
                    if (e.target.value) {
                        this.selectStudent(e.target.value);
                    }
                });

                // Click outside to close dropdowns
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.avatar-menu')) {
                        document.getElementById('avatarDropdown').classList.remove('active');
                    }
                });
            }

            // Real-time updates simulation
            startRealTimeUpdates() {
                // Simulate real-time notification updates
                setInterval(() => {
                    const badge = document.getElementById('notificationBadge');
                    const currentCount = parseInt(badge.textContent);
                    if (Math.random() < 0.1) { // 10% chance every 5 seconds
                        badge.textContent = currentCount + 1;
                        this.showToast('New notification received!', 'info');
                    }
                }, 5000);
            }


	    // Add this entire method after startRealTimeUpdates()
	    updateTutorStatus(newStatus) {
		this.tutorStatus = newStatus;
		const statusBadge = document.getElementById('statusBadge');
		const statusBadgeTutor = document.getElementById('statusBadgeTutor');
    
		// Update both badges if they exist
		[statusBadge, statusBadgeTutor].forEach(badge => {
		    if (badge) {
			// Remove existing status classes
			badge.classList.remove('status-new', 'status-active', 'status-verified', 'status-premium');
            
			// Add new status class
			badge.classList.add(`status-${newStatus}`);
            
			// Update text content
			const statusText = {
			    'new': 'New Tutor',
			    'active': 'Active Tutor', 
			    'verified': 'Verified Tutor',
			    'premium': 'Premium Tutor'
			};
            
			badge.textContent = statusText[newStatus] || 'Unknown Status';
		    }
		});
    
		this.showToast(`Status updated to: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`, 'success');
}
             // Add this entire method after updateTutorStatus()
	    initializeTutorStatus() {
		// Set initial status based on tutor data (in real app, this would come from database)
		const tutorData = {
		    sessionsCompleted: this.sessions.filter(s => s.status === 'completed').length,
		    isVerified: true, // This would come from database
		    isPremium: false // This would come from database
		};
    
		let initialStatus = 'new';
		if (tutorData.isPremium) {
		    initialStatus = 'premium';
		} else if (tutorData.isVerified && tutorData.sessionsCompleted >= 10) {
		    initialStatus = 'verified';
		} else if (tutorData.sessionsCompleted >= 3) {
		    initialStatus = 'active';
		}
    
		this.updateTutorStatus(initialStatus);
	    }
            // Session Management Methods
            editSession(sessionId) {
                this.showToast(`Editing session ${sessionId}...`, 'info');
                // In real app: open modal with session edit form
            }

            cancelSession(sessionId) {
                if (confirm('Are you sure you want to cancel this session?')) {
                    this.sessions = this.sessions.filter(s => s.id !== sessionId);
                    this.renderSessions();
                    this.showToast('Session cancelled successfully', 'warning');
                }
            }

            filterSessions() {
                // Implement session filtering logic
                this.renderSessions();
            }
        }

        // Global Dashboard Instance
        const dashboard = new TutorDashboard();

        // Global Functions for UI Interactions
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('open');
        }

        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('open');
        }

        function toggleAvatarMenu() {
            const dropdown = document.getElementById('avatarDropdown');
            dropdown.classList.toggle('active');
        }

        function switchTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.remove('hidden');
            
            // Add active class to clicked nav tab
            event.target.classList.add('active');
            
            // Update dashboard state
            dashboard.activeTab = tabName;
            
            // Show loading briefly for better UX
            dashboard.showToast(`Switched to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} tab`, 'success');
        }

        function loadStudentChat() {
            const select = document.getElementById('studentChatSelect');
            if (select.value) {
                dashboard.selectStudent(select.value);
            }
        }

        function scheduleSession() {
            dashboard.showToast('Opening session scheduler...', 'info');
            // In real app: open scheduling modal
        }

        function exportSessions() {
            dashboard.showToast('Exporting sessions to CSV...', 'info');
            // In real app: generate and download CSV
        }

        function generateReport() {
            if (!dashboard.currentStudent) {
                dashboard.showToast('Please select a student first', 'warning');
                return;
            }
            dashboard.showToast(`Generating report for ${dashboard.currentStudent.name}...`, 'info');
        }

        function markAllRead() {
            dashboard.showToast('All messages marked as read', 'success');
            // Update all students' messages to read
            dashboard.students.forEach(student => {
                student.messages.forEach(message => {
                    if (message.type === 'received') message.read = true;
                });
            });
            dashboard.renderStudents();
        }

        function downloadInvoices() {
            dashboard.showToast('Downloading invoices...', 'info');
        }

        function updateRates() {
            dashboard.showToast('Opening rate settings...', 'info');
        }

        function addPaymentMethod() {
            dashboard.showToast('Opening payment method form...', 'info');
        }

        function exportCalendar() {
            dashboard.showToast('Exporting calendar...', 'info');
        }

        function setAvailability() {
            dashboard.showToast('Opening availability settings...', 'info');
        }

        function showNotifications() {
            dashboard.showToast('Notifications: 2 new messages, 1 session reminder', 'info');
        }

        function showProfile() {
            dashboard.showToast('Opening profile settings...', 'info');
        }

        function showSettings() {
            dashboard.showToast('Opening application settings...', 'info');
        }

        function showHelp() {
            dashboard.showToast('Opening help center...', 'info');
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                dashboard.showToast('Logging out...', 'info');
                // In real app: clear session and redirect to login
            }
        }

        // Add this entire function after the logout() function
        function changeTutorStatus() {
	    const currentStatus = dashboard.tutorStatus;
	    const statusOptions = ['new', 'active', 'verified', 'premium'];
	    const currentIndex = statusOptions.indexOf(currentStatus);
	    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
	    dashboard.updateTutorStatus(nextStatus);
	}
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            dashboard.showToast('Welcome back, Dr. Martinez!', 'success');
        });

