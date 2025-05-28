// helperSections.js

export function hideAllSections() {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.style.display = 'none'; // Hide each form section
    });
}

export function displayTaskContent(task) {
    hideAllSections(); // Hide all forms before showing the selected one

    const sectionIdMap = {
        'registration': "registration-section",
        'subscription': "subscription-section",
        'appointment': "appointment-section",
        'cancel-subscription': "cancel-subscription-section",
        'Library-Shop': "library-shop-section",
        'messages': "messages-form",
        'feedback': "feedback-form",
        'statistics': "statistics-form",
        'payment-history': "payment-history-form",
        'User-Design-Preferences': "user-preferences-form"
    };

    const sectionToShow = sectionIdMap[task]; // Get the ID of the section to show
    if (sectionToShow) {
        const section = document.getElementById(sectionToShow);
        if (section) {
            section.style.display = 'block'; // Show the selected form section
            const firstInput = section.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus(); // Focus on the first input element
            }
        } else {
            console.error("Section not found: " + sectionToShow);
        }
    } else {
        console.error("Unknown task: " + task);
    }
}
