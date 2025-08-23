// Card 4: Course Registration

if (!window.cards) window.cards = {};
   window.cards['card4'] = {
       id: 'card4',
       title: 'Course Registration',
       render: () => console.log('Rendering card1')
   };

function startRegistration() {
  openModal("registrationModal");
}

function viewPricing() {
  showNotification("Showing pricing options...", "info");
}

function submitRegistration() {
  const formData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    educationLevel: document.getElementById("educationLevel").value
  };
  const { isValid, errors } = validateForm(formData);

  if (!isValid) {
    showNotification(errors.join(", "), "error");
    return;
  }

  localStorage.setItem("registrationDone", "true");
  updateCardStatus("registrationCard", "complete", "Registered");
  closeModal("registrationModal");

  trackInteractionGeneric("registration_completed", formData, "student");
  showAdvancedNotification("📝 Registration complete", "success", 6000);
}
