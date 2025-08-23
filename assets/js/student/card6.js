// Card 6: Find Your Tutor

if (!window.cards) window.cards = {};
   window.cards['card6'] = {
       id: 'card6',
       title: 'Find Your Tutor',
       render: () => console.log('Rendering card1')
   };

function browseTutors() {
  trackInteractionGeneric("browse_tutors", {}, "student");
  showNotification("Loading tutor directory...", "info");
}

function scheduleDemo() {
  updateCardStatus("tutorCard", "in-progress", "Demo Booked");
  trackInteractionGeneric("demo_booked", {}, "student");
  showAdvancedNotification("👨‍🏫 Demo lesson booked!", "success");
}
