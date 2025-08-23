// Card 2: Academic Student Profile


if (!window.cards) window.cards = {};
   window.cards['card2'] = {
       id: 'card2',
       title: 'Academic Student Profile',
       render: () => console.log('Rendering card1')
   };

function createProfile() {
  let progress = parseInt(localStorage.getItem("profileProgress") || "0");
  progress = Math.min(progress + 25, 100);

  document.querySelector("#profileProgress").value = progress;
  document.querySelector("#profileProgressLabel").innerText = `${progress}% Complete`;
  localStorage.setItem("profileProgress", progress);

  if (progress === 100) {
    updateCardStatus("profileCard", "complete", "Complete");
    showAdvancedNotification("🎓 Profile completed!", "success");
  } else {
    updateCardStatus("profileCard", "in-progress", "In Progress");
    showNotification("Profile updated", "info");
  }

  trackInteractionGeneric("profile_updated", { progress }, "student", progress);
}

function viewSample() {
  showNotification("Showing sample profile...", "info");
}
