function subscribeNewsletter(event) {
  event.preventDefault();

  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("errorMessage").style.display = "block";
    return;
  }

  sessionStorage.setItem("preFilledEmail", email);
  window.location.href = "/pages/about-us.html?group=about&section=support";
}
