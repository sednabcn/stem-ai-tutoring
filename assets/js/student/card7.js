// Card 7: Learning Resources

if (!window.cards) window.cards = {};
   window.cards['card7'] = {
       id: 'card7',
       title: 'Learning Resources',
       render: () => console.log('Rendering card1')
   };

function accessResources() {
  let viewed = parseInt(localStorage.getItem("resourcesViewed") || "0");
  viewed++;
  localStorage.setItem("resourcesViewed", viewed);

  trackInteractionGeneric("resource_accessed", { totalViewed: viewed }, "student");
  showAdvancedNotification(`📚 You’ve accessed ${viewed} resources`, "success");
}
