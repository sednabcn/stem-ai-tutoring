document.addEventListener('DOMContentLoaded', function () {
    console.log('Help.js is loaded and DOM is ready');

    // *** Modal Handling ***
    function openModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';  // Show the modal
            console.log('Modal opened');
        } else {
            console.error('Modal element not found');
        }
    }

    function closeModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';  // Hide the modal
            console.log('Modal closed');
        } else {
            console.error('Modal element not found');
        }
    }

    window.openModal = openModal;
    window.closeModal = closeModal;

    // *** Login Form Submission ***
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            console.log('Attempting to log in with:', email, password);

            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = registeredUsers.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                alert('Login successful! Redirecting...');
                window.location.href = 'mathtutor.html';
            } else {
                alert('Incorrect email or password');
                console.warn('Login failed for:', email);
            }
        });
    } else {
        console.error('Login form element not found');
    }

    // *** Registration Form Submission ***
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();

            console.log('Registering new user:', name, email);

            const registeredUsers = JSON.parse(localStorage.getItem('users')) || [];

            if (registeredUsers.some(u => u.email === email)) {
                alert('User already exists. Please log in.');
                console.warn('Registration failed: user already exists', email);
            } else {
                registeredUsers.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(registeredUsers));
                alert('Registration successful. Please log in.');
                console.log('User registered successfully:', email);
            }
        });
    } else {
        console.error('Registration form element not found');
    }

    // Helper function for dynamic content (if needed)
    function displayTaskContent(contentId) {
        console.log(`Displaying content for: ${contentId}`);
        const contentSections = document.querySelectorAll('.dynamic-content-section');
        contentSections.forEach(section => {
            section.style.display = (section.id === contentId) ? 'block' : 'none';
        });
    }
});
