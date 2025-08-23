        //============================
        // Tab switching functionality
        //============================
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active class from all nav tabs
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.remove('hidden');
            
            // Add active class to clicked nav tab
	    event.target.classList.add('active');
            
            // Add fade-in animation
            document.getElementById(tabName).style.animation = 'fadeIn 0.3s ease-in';
        }
        //============================
        // Tutor selection functionality
        //============================
        function selectTutor(element, tutorName) {
            // Remove active class from all tutor cards
            document.querySelectorAll('.tutor-card').forEach(card => {
                card.classList.remove('active');
            });
            
            // Add active class to selected tutor
            element.classList.add('active');
            
            // Update chat header with selected tutor
            updateChatHeader(tutorName);
            
            showToast(`Switched to ${tutorName}`, 'info');
        }

        // Update chat header based on selected tutor
        function updateChatHeader(tutorName) {
            const chatAvatar = document.getElementById('chatAvatar');
            const chatUserName = document.getElementById('chatUserName');
            
            switch(tutorName) {
                case 'Dr. Smith':
                    chatAvatar.textContent = 'DS';
                    chatAvatar.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                    break;
                case 'Ms. Johnson':
                    chatAvatar.textContent = 'MJ';
                    chatAvatar.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
                    break;
                case 'Prof. Garcia':
                    chatAvatar.textContent = 'PG';
                    chatAvatar.style.background = 'linear-gradient(45deg, #FF9800, #F57C00)';
                    break;
            }
            chatUserName.textContent = tutorName;
        }

        // Message functionality
        function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const message = messageInput.value.trim();
            
            if (message) {
                const chatMessages = document.getElementById('chatMessages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message sent';
                messageDiv.innerHTML = `
                    <div><strong>You:</strong> ${message}</div>
                    <div class="message-time">Just now</div>
                `;
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                messageInput.value = '';
                
                showToast('Message sent!', 'success');
            }
        }

        // Session management functions
        function joinSession() {
            showLoading();
            setTimeout(() => {
                hideLoading();
                showToast('Joining session...', 'info');
            }, 1500);
        }

        function bookSession() {
            showToast('Opening booking form...', 'info');
        }

        function reschedule() {
            showToast('Opening reschedule options...', 'info');
        }

        function viewRecording() {
            showToast('Loading session recording...', 'info');
        }

        // Filter functions
        function filterSessions() {
            showToast('Filtering sessions...', 'info');
        }

        function filterAssignments() {
            showToast('Filtering assignments...', 'info');
        }

        // Export functions
        function exportSessions() {
            showToast('Exporting session data...', 'success');
        }

        function downloadReport() {
            showToast('Generating progress report...', 'success');
        }

        function downloadInvoices() {
            showToast('Downloading invoices...', 'success');
        }

        // Assignment functions
        function uploadAssignment() {
            showToast('Opening file upload...', 'info');
        }

        // Payment functions
        function addPaymentMethod() {
            showToast('Opening payment setup...', 'info');
        }

        // Chat functions
        function loadTutorChat() {
            const selectedTutor = document.getElementById('tutorChatSelect').value;
            showToast(`Loading chat with ${selectedTutor}...`, 'info');
        }

        function markAllRead() {
            showToast('All messages marked as read', 'success');
        }

        // Utility functions
        function showToast(message, type = 'info') {
            const toastContainer = document.getElementById('ToastContainer');
            const toast = document.createElement('div');
            toast.className = 'toast';
            
            const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
            toast.innerHTML = `${icon} ${message}`;
            
            toastContainer.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        function showLoading() {
            document.getElementById('loadingSpinner').style.display = 'block';
        }

        function hideLoading() {
            document.getElementById('loadingSpinner').style.display = 'none';
        }

        // Back to home functionality
        document.getElementById('back-home-student').addEventListener('click', function() {
            showToast('Returning to home...', 'info');
            // Add navigation logic here
        });

        // Enter key support for chat
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            showToast('Welcome back, Rachel! 🎓', 'success');
            
            // Add smooth scrolling for better UX
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        });

        // Responsive sidebar toggle (for mobile)
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        }

        function closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('active');
        }
 

       // Add this function for mobile menu toggle
      function toggleSidebar() {
	  const sidebar = document.getElementById('sidebar');
	  sidebar.classList.toggle('open'); // Use 'open' class as defined in CSS
      }
