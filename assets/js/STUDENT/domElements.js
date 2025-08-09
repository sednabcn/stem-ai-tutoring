// domElements.js
export const getDOMElements = () => {
    return {
        appointmentForm: document.getElementById("appointment-form"),
        appointmentSection: document.getElementById("appointment-section"),
        confirmationMessage: document.getElementById("confirmation-message"),
        applyButton: document.getElementById("apply-button"),
        slots: document.querySelectorAll(".slot")
    };
};
