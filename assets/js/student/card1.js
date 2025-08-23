// Card 1: Data Protection Agreement

if (!window.cards) window.cards = {};
   window.cards['card1'] = {
       id: 'card1',
       title: 'Data Protection Agreement',
       render: () => console.log('Rendering card1')
   };


function reviewAgreement() {
  openModal("agreementModal");
}

function downloadPolicy() {
  showNotification("Downloading Data Protection Policy...", "info");
}

function acceptAgreement() {
  const agreeData = document.getElementById("agreeData").checked;
  const agreeSafeguarding = document.getElementById("agreeSafeguarding").checked;

  if (!agreeData || !agreeSafeguarding) {
    showNotification("Please agree to both policies!", "error");
    return;
  }

  const parentEmail = document.getElementById("parentEmail").value;
  if (parentEmail && !parentEmail.includes("@")) {
    showNotification("Enter a valid parent email!", "error");
    return;
  }

  localStorage.setItem("agreementAccepted", "true");
  updateCardStatus("agreementCard", "complete", "Agreed");
  closeModal("agreementModal");

  trackInteractionGeneric("agreement_accepted", { parentEmail }, "student");
  showAdvancedNotification("✅ Agreement accepted", "success", 6000);
}
