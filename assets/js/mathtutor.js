document.addEventListener('DOMContentLoaded', function () {
    console.log('Document is ready');

    // *** Modal Logic ***
    // Opens the modal (e.g., for login or authorization purposes)
    function openModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';  // Show the modal by setting display to 'flex'
            console.log('Modal opened');
        } else {
            console.log('Modal element not found');
        }
    }

    // Closes the modal
    function closeModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';  // Hide the modal
            console.log('Modal closed');
        } else {
            console.log('Modal element not found');
        }
    }

    // Make the openModal and closeModal functions globally accessible
    window.openModal = openModal;
    window.closeModal = closeModal;

    // *** Avatar and Login Menu Toggle ***
    // Handles showing and hiding the login menu when avatar is clicked
    const avatar = document.getElementById('avatar');
    const loginMenu = document.getElementById('loginmenu');

    if (avatar && loginMenu) {
        avatar.addEventListener('click', function (event) {
            event.stopPropagation();  // Prevents the click from affecting other elements
            loginMenu.classList.toggle('active');  // Toggles the visibility of the login menu
            console.log('Avatar clicked, login menu toggled');
        });

        // Close the login menu when clicking outside of it
        window.addEventListener('click', function (event) {
            if (!loginMenu.contains(event.target) && event.target !== avatar) {
                loginMenu.classList.remove('active');  // Hide the login menu
                console.log('Clicked outside login menu, menu closed');
            }
        });
    } else {
        console.log('Avatar or login menu not found');
    }

    // *** Form Switching Logic ***
    // Function to switch between different tabs/forms (registration, login, etc.)
    function openTab(event, tabName) {
        // Hide all forms by removing 'active' class
        document.querySelectorAll('.form-content').forEach(content => content.classList.remove('active'));
        // Remove 'active' class from all tab buttons
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

        // Show the selected tab by adding 'active' class
        const tab = document.getElementById(tabName);
        if (tab) {
            tab.classList.add('active');
            event.currentTarget.classList.add('active');
            console.log(`${tabName} tab opened`);
        } else {
            console.log(`Tab ${tabName} not found`);
        }
    }

    // Make openTab function globally accessible
    window.openTab = openTab;

    // *** Login Form Submission ***
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevents form from submitting the traditional way
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Check local storage for registered users
            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = registeredUsers.find(u => u.email === email && u.password === password);

            // If the user exists, log them in
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');  // Store login status
                localStorage.setItem('userEmail', email);    // Store user email
                console.log('Login successful');

                // Redirect to appropriate page after login
                const redirectAfterLogin = localStorage.getItem('redirectAfterLogin') || 'mathtutor.html';
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectAfterLogin;
            } else {
                alert('Incorrect email or password');
                console.log('Login failed: Incorrect email or password');
            }
        });
    } else {
        console.log('Login form not found');
    }

    // *** Registration Form Submission ***
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevents default form submission
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            // Retrieve existing users from local storage
            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];

            // Check if user already exists
            if (registeredUsers.some(u => u.email === email)) {
                alert('User already exists. Please log in.');
                console.log('Registration failed: User already exists');
            } else {
                // Add new user to local storage
                registeredUsers.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(registeredUsers));
                alert('Registration successful. Please log in.');
                console.log('User registered successfully');

                // Switch to the login tab after successful registration
                const loginTab = document.querySelector('.tab[onclick*="openTab(event, \'login\')"]');
                if (loginTab) {
                    openTab({ currentTarget: loginTab }, 'login');
                }
            }
        });
    } else {
        console.log('Registration form not found');
    }


// *** Apply Button Logic ***

// Get DOM elements
const startApplicationBtn = document.getElementById('startApplicationBtn');
const updateApplicationBtn = document.getElementById('updateApplicationBtn');  
const cancelApplicationBtn = document.getElementById('cancelApplicationBtn');
const notificationBox = document.getElementById('notificationBox');
const notificationMessage = document.getElementById('notificationMessage');

// Check if the application has already been submitted
checkApplicationStatus();

// Function to check the application status on page load
function checkApplicationStatus() {
    const isSubmitted = localStorage.getItem('applicationSubmitted');
    if (isSubmitted) {
        blockStartApplication();
        showSubmittedStatus();
    }
}

// Function to handle starting the application process
function startApplication() {
    // Redirect to the application page
    window.location.href = 'student-application.html'; 

    // Get the current date and time
    const currentDate = new Date().toLocaleString();

    // Block the update Application button
    updateApplicationBtn.disabled = true;  

    // Store the submission date and time in localStorage
    localStorage.setItem('applicationSubmitted', currentDate);
    
    // Show notification for successful submission
    showNotification(`Application Submitted on ${currentDate}`);
}
// Function to handle updating the application process
function updateApplication() {
    // Redirect to the application page
    window.location.href = 'student-application.html'; 

    // Get the current date and time
    const currentDate = new Date().toLocaleString();
    
    // Store the submission date and time in localStorage
    localStorage.setItem('updateapplicationSubmitted', currentDate);
    
    // Show notification for successful submission
    showNotification(`Updated Application Submitted on ${currentDate}`);
}

// Function to show the submitted status and update the button state
function showSubmittedStatus() {
    const submittedTime = localStorage.getItem('applicationSubmitted');
    startApplicationBtn.disabled = true;  // Block the Start Application button
    showNotification(`Application Submitted on ${submittedTime}`);
}

// Function to block the Start Application button
function blockStartApplication() {
    startApplicationBtn.disabled = true;  // Ensure the button is disabled
}

// Function to cancel the application
function cancelApplication() {
    localStorage.removeItem('applicationSubmitted'); // Remove the submission status
    startApplicationBtn.disabled = false;  // Unblock the Start Application button
    updateApplicationBtn.disabled = true;  // block the update Application button

    // Show notification for cancellation
    showNotification('Application Canceled');
}

// Function to show notifications
function showNotification(message) {
    notificationMessage.textContent = message; // Set the notification message
    notificationBox.classList.remove('hidden');  // Show the notification box

    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
        notificationBox.classList.add('hidden');  // Hide the notification box
    }, 3000);

    // Hide notification if clicked
    notificationBox.onclick = function () {
        notificationBox.classList.add('hidden');
    };
}

// Function to navigate to the student room page
function goToStudentRoom() {
    window.location.href = 'student-room.html';  // Redirect to student room page
}

// Attach functions to the global scope for use in HTML
window.startApplication = startApplication;
window.updateApplication = updateApplication;    
window.cancelApplication = cancelApplication;
window.goToStudentRoom = goToStudentRoom;
     
});
