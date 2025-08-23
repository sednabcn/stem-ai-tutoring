// Card 9: Premium Learning

if (!window.cards) window.cards = {};
   window.cards['card9'] = {
       id: 'card9',
       title: 'Premium Learning',
       render: () => console.log('Rendering card1')
   };

let trialTimer;

function startPremiumTrial() {
  openModal("premiumModal");
  startCountdown(7); // 7-day trial
}

function viewPremiumDetails() {
  showNotification("Opening premium details...", "info");
}

function activatePremium() {
  localStorage.setItem("premium", "true");
  updateCardStatus("premiumCard", "complete", "Premium Active");
  closeModal("premiumModal");

  trackInteractionGeneric("premium_activated", {}, "student");
  showAdvancedNotification("⭐ Premium activated!", "success");
}

function startCountdown(days) {
  const target = Date.now() + days * 24 * 60 * 60 * 1000;
  clearInterval(trialTimer);

  trialTimer = setInterval(() => {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      document.getElementById("premiumCountdown").innerText = "Trial expired";
      clearInterval(trialTimer);
      return;
    }
    const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const h = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    document.getElementById("premiumCountdown").innerText = `${d}d ${h}h left`;
  }, 1000);
}
