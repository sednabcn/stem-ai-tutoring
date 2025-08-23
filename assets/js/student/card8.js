// Card 8: Progress Tracking

if (!window.cards) window.cards = {};
   window.cards['card8'] = {
       id: 'card8',
       title: 'Analytics',
       render: () => console.log('Rendering card1')
   };

function viewProgress() {
  showNotification("Opening analytics dashboard...", "info");
  trackInteractionGeneric("progress_viewed", {}, "student");

  const ctx = document.getElementById("progressChart");
  if (ctx && window.Chart) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Week 1", "Week 2", "Week 3"],
        datasets: [{ label: "Math Score", data: [50, 65, 80], borderWidth: 2 }]
      },
      options: { responsive: true }
    });
  }
}
