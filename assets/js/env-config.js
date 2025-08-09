// env-config.js
(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const testParam = urlParams.get("testmode");
  const forceTest = testParam === "1" || testParam === "true";
  const hostname = window.location.hostname.toLowerCase();
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const isGithubPages = hostname.includes("github.io");
  const TEST_MODE = forceTest || isLocal || hostname.includes("test") || !isGithubPages;
  
  // Attach to global scope
  window.ENV = {
    TEST_MODE,
    IS_LOCAL: isLocal,
    HOSTNAME: hostname,
    FORCE_TEST: forceTest,
    IS_GITHUB: isGithubPages,
    
    // Firebase config based on environment
    FIREBASE_CONFIG: TEST_MODE ? {
        // Test environment
        apiKey: "test-api-key",
        authDomain: "math-tutor-test.firebaseapp.com",
        projectId: "math-tutor-test",
        storageBucket: "math-tutor-test.appspot.com"
    } : {
        // Production environment  
        apiKey: "prod-api-key",
        authDomain: "math-tutor-prod.firebaseapp.com", 
        projectId: "math-tutor-prod",
        storageBucket: "math-tutor-prod.appspot.com"
    }
  };
  
  console.log(`🧪 ENV.TEST_MODE = ${TEST_MODE} (host: ${hostname})`);
})();
