function scriptsLoading() {
  // Detect TEST_MODE from ENV or URL
  const urlParams = new URLSearchParams(window.location.search);
  const forceTest = urlParams.get("testmode") === "1" || urlParams.get("testmode") === "true";
  const testMode = window.ENV?.TEST_MODE || forceTest;

  if (!testMode) {
    console.log("🚀 Production mode: debug scripts not loaded");
    return;
  }

  console.log("🧪 TEST_MODE active: loading debug scripts...");

  // Get comma-separated scripts from URL if any
  const debugParam = urlParams.get("debug"); 
  const requestedScripts = debugParam ? debugParam.split(",").map(s => s.trim()) : null;

  // List of all debug scripts
  const debugScripts = [
   //"/assets/js/debug/quick-debug-unique.js",
  //    "/assets/js/debug/quick-debug-UIStateManager.js",
  //  "/assets/js/debug/quick-debug-users-dev.js",
  //  "/assets/js/debug/quick-debug-users-production.js"
    // Add more scripts as needed
  ];

  // Determine which scripts to load
  const scriptsToLoad = requestedScripts 
    ? debugScripts.filter(src => requestedScripts.some(r => src.includes(r)))
    : debugScripts;

  if (scriptsToLoad.length === 0) {
    console.warn("⚠️ No matching debug scripts found to load");
  }

  // Inject scripts dynamically
  scriptsToLoad.forEach(src => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false; // preserve order
    script.onload = () => console.log(`✅ Debug script loaded: ${src}`);
    script.onerror = () => console.error(`❌ Failed to load debug script: ${src}`);
    document.head.appendChild(script);
  });
}

// Automatically load scripts when the browser parses HTML
document.addEventListener("DOMContentLoaded", scriptsLoading);
