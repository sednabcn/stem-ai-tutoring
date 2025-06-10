document.getElementById("newsletter-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  // Elements
  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();
  const successMsg = document.getElementById("success");
  const errorMsg = document.getElementById("error");
  const loadingMsg = document.getElementById("loading");

  // Reset messages
  successMsg.style.display = "none";
  errorMsg.style.display = "none";

  // Email validation (basic regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMsg.textContent = "❌ Invalid email format.";
    errorMsg.style.display = "block";
    return;
  }

  // Show loading
  loadingMsg.style.display = "block";

  try {
    // Example: call PHP or GitHub API (change this endpoint as needed)
    const res = await fetch("/.netlify/functions/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "email=" + encodeURIComponent(email)
    });

    const result = await res.text();
    loadingMsg.style.display = "none";

    if (result === "success") {
      successMsg.style.display = "block";
      emailInput.value = ""; // clear input
    } else {
      errorMsg.textContent = "❌ Submission failed.";
      errorMsg.style.display = "block";
    }

  } catch (err) {
    loadingMsg.style.display = "none";
    errorMsg.textContent = "❌ Network error.";
    errorMsg.style.display = "block";
  }
});
