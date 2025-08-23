// Card 3: Age Verification

if (!window.cards) window.cards = {};
   window.cards['card3'] = {
       id: 'card3',
       title: 'Age Verification',
       render: () => console.log('Rendering card1')
   };

function verifyAge() {
  const fileInput = document.getElementById("idUpload");
  if (!fileInput || !fileInput.files.length) {
    showNotification("Please upload an ID document.", "error");
    return;
  }

  showLoading();
  simulateFileUpload(fileInput.files[0].name, () => {
    hideLoading();
    updateCardStatus("identityCard", "complete", "Verified");
    trackInteractionGeneric("age_verified", { file: fileInput.files[0].name }, "student");
    showAdvancedNotification("✅ ID verified successfully!", "success", 6000);
  });
}

function parentConsent() {
  updateCardStatus("identityCard", "in-progress", "Awaiting Consent");
  trackInteractionGeneric("parent_consent_requested", {}, "student");
  showNotification("Parent consent email sent.", "info");
}
