// formSubmission.js

export function handleFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission

    const formId = event.target.id; // Get the ID of the form that triggered the event
    console.log(`${formId} submitted`);

    const successMessages = {
        'register-form': 'Registration successful!',
        'subscription-form': 'Subscription successful!',
        'appointment-form': 'Appointment scheduled successfully!',
        'cancel-subscription-form': 'Subscription canceled successfully!',
        'messages-form': 'Message sent successfully!',
        'feedback-form': 'Feedback submitted successfully!',
        'statistics-form': 'Statistics updated successfully!',
        'payment-history-form': 'Payment history updated successfully!',
        'user-preferences-form': 'Preferences saved successfully!'
    };

    alert(successMessages[formId] || 'Form submitted!'); // Show success message

    const formSection = event.target.closest('section');
    if (formSection) {
        formSection.style.display = 'none'; // Hide the section after form submission
    } else {
        console.error(`Form section not found for form ID: ${formId}`);
    }
}
 function handleFormSubmission(event) {
        // Add your form submission logic here
        console.log("Form submitted");
        // You can access form data using FormData API
        const formData = new FormData(event.target);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        // Add AJAX submission or other logic as needed
    }
