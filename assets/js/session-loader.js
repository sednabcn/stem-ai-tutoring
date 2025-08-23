// session-loader.js - Smart Loader
// Automatically loads dev or prod version based on environment

(function() {
    'use strict';
    
    // Environment detection
    const ENV_CONFIG = {
        isDevelopment: window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.port !== '' ||
                      window.location.search.includes('debug=true'),
        
        isGitHubPages: window.location.hostname.includes('github.io'),
        
        isProduction: !window.location.hostname.includes('localhost') && 
                     !window.location.hostname.includes('github.io') && 
                     !window.location.hostname.includes('127.0.0.1') &&
                     window.location.port === '' &&
                     !window.location.search.includes('debug=true')
    };

    // Allow manual override via URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const forceMode = urlParams.get('mode'); // ?mode=dev or ?mode=prod
    
    let useDevVersion = ENV_CONFIG.isDevelopment;
    
    if (forceMode === 'dev') {
        useDevVersion = true;
        console.log('🔧 Forced to development mode via URL parameter');
    } else if (forceMode === 'prod') {
        useDevVersion = false;
        console.log('🚀 Forced to production mode via URL parameter');
    }

    // Determine script to load
    const scriptToLoad = useDevVersion ? 
        '../assets/js/session-loader-dev.js' : 
        '../assets/js/session-loader-prod.js';
    
    const environment = useDevVersion ? 'DEVELOPMENT' : 'PRODUCTION';
    
    // Early console output (before main script loads)
    console.log(`🎯 Environment: ${environment}`);
    console.log(`📄 Loading: ${scriptToLoad}`);
    
    // Create and load the appropriate script
    const script = document.createElement('script');
    script.src = scriptToLoad;
    script.async = false; // Maintain load order
    
    // Success handler
    script.onload = function() {
        console.log(`✅ Successfully loaded ${environment} session loader`);
        
        // Expose environment info to loaded script
        if (window.sessionLoader) {
            window.sessionLoader.environmentInfo = {
                mode: environment,
                autoDetected: forceMode === null,
                originalScript: scriptToLoad
            };
        }
    };
    
    // Error handler with fallback
    script.onerror = function() {
        console.error(`❌ Failed to load: ${scriptToLoad}`);
        
        // Fallback strategy
        const fallbackScript = useDevVersion ? 
            '../assets/js/session-loader-prod.js' : 
            '../assets/js/session-loader-dev.js';
            
        console.log(`🔄 Attempting fallback: ${fallbackScript}`);
        
        const fallback = document.createElement('script');
        fallback.src = fallbackScript;
        fallback.async = false;
        
        fallback.onload = function() {
            console.log(`✅ Fallback successful: ${fallbackScript}`);
            if (window.sessionLoader) {
                window.sessionLoader.environmentInfo = {
                    mode: 'FALLBACK',
                    originalScript: scriptToLoad,
                    fallbackScript: fallbackScript
                };
            }
        };
        
        fallback.onerror = function() {
            console.error(`💥 Both scripts failed to load!`);
            
            // Ultimate fallback - show user-friendly error
            document.addEventListener('DOMContentLoaded', function() {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    background: #f44336; 
                    color: white; 
                    padding: 15px; 
                    border-radius: 5px; 
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    max-width: 300px;
                `;
                errorDiv.innerHTML = `
                    <strong>⚠️ Loading Error</strong><br>
                    Session management failed to load.<br>
                    <small>Please refresh the page or contact support.</small>
                `;
                document.body.appendChild(errorDiv);
                
                // Auto-remove after 10 seconds
                setTimeout(() => {
                    if (document.body.contains(errorDiv)) {
                        document.body.removeChild(errorDiv);
                    }
                }, 10000);
            });
        };
        
        document.head.appendChild(fallback);
    };
    
    // Load the main script
    document.head.appendChild(script);
    
    // Expose environment detection globally for other scripts
    window.SMART_LOADER_ENV = {
        isDevelopment: useDevVersion,
        isProduction: !useDevVersion,
        detectedEnvironment: ENV_CONFIG,
        loadedScript: scriptToLoad,
        forceMode: forceMode
    };
    
})();
