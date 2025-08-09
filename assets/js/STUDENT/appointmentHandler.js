// appointmentHandler.js
export const scheduleAppointment = (form, confirmationMessage, applyButton) => {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default submission action

        confirmationMessage.textContent = "Appointment successfully scheduled!";
        confirmationMessage.style.display = "block";  // Show the confirmation message
        applyButton.style.display = "block";  // Show the apply button
    });
};

export const handleApplyButtonClick = (applyButton) => {
    applyButton.addEventListener("click", function() {
        window.location.href = "student-room.html";  // Redirect to student room
    });
};


    // Function to show the appointment section
export  function showAppointmentSection() {
        appointmentSection.style.display = 'block';
    }
