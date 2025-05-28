// Function to handle sending student messages
document.getElementById('sendMessageBtn').addEventListener('click', function() {
    let studentMessage = document.getElementById('messageToTutor').value;
    
    if (studentMessage.trim() !== "") {
        appendMessage('student', studentMessage);
        document.getElementById('messageToTutor').value = ''; // Clear the textarea
        
        // Here you would send the message to the server or backend
        // Simulate a tutor response for demo purposes
        setTimeout(function() {
            appendMessage('tutor', "This is a sample response from the tutor.");
        }, 1000); // Simulated delay for tutor's response
    }
});

// Function to append messages to the chat box
function appendMessage(sender, message) {
    let chatBox = document.getElementById('chatBox');
    let messageElement = document.createElement('div');
    
    // Differentiate between student and tutor messages
    if (sender === 'student') {
        messageElement.classList.add('student-message');
        messageElement.textContent = "You: " + message;
    } else if (sender === 'tutor') {
        messageElement.classList.add('tutor-message');
        messageElement.textContent = "Tutor: " + message;
    }

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Automatically scroll to the bottom
}
