// Card 5: Subscription Plans

if (!window.cards) window.cards = {};
   window.cards['card5'] = {
       id: 'card5',
       title: 'Subscription Plans',
       render: () => console.log('Rendering card1')
   };


function choosePlan() {
  const lessons = document.getElementById("lessonRange")?.value || "1";
  localStorage.setItem("planLessons", lessons);

  updateCardStatus("subscriptionCard", "complete", `Plan: ${lessons}/week`);
  trackInteractionGeneric("plan_chosen", { lessons }, "student");

  showAdvancedNotification(`💳 Plan chosen: ${lessons} lessons/week`, "success", 6000);
}

function comparePlans() {
  showNotification("Comparing subscription plans...", "info");
}
