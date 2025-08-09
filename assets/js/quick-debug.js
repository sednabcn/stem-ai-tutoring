// 🔧 Fixed Debug Script - Console Only (No DOM Dependencies)
(function() {
    'use strict';
    
    const CONFIG = {
        requiredFunctions: [
            'signAgreement', 'uploadDocuments', 'startVideoVerification', 
            'setSchedule', 'browseStudents', 'uploadResources', 'exploreTool',
            'viewAnalytics', 'upgradePremium', 'switchTab', 'filterSessions',
            'debugSessionLoader', 'verifyTutor'
        ],
        requiredObjects: [
            'notificationCenter', 'forumSystem', 'sessionLoader'
        ]
    };

    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    function quickDiagnostic() {
        console.clear();
        log('🚀 Running Enhanced Diagnostic...', 'success');
        console.log('==================================================');
        
        // 1. Check SessionLoader first
        checkSessionLoader();
        
        // 2. Check functions
        const functionResults = checkFunctions();
        
        // 3. Check objects
        const objectResults = checkObjects();
        
        // 4. Check scripts
        checkScripts();
        
        // 5. Generate report
        generateReport(functionResults, objectResults);
        
        console.log('==================================================');
        log('🏁 Enhanced diagnostic complete!', 'success');
        
        return {
            sessionLoaderOK: typeof window.sessionLoader !== 'undefined',
            functionsOK: functionResults.missing.length === 0,
            objectsOK: objectResults.missing.length === 0,
            summary: {
                functions: `${functionResults.available.length}/${CONFIG.requiredFunctions.length}`,
                objects: `${objectResults.available.length}/${CONFIG.requiredObjects.length}`
            }
        };
    }

    function checkSessionLoader() {
        log('🔧 Checking SessionLoader Status...');
        
        if (typeof window.sessionLoader === 'undefined') {
            log('❌ CRITICAL: SessionLoader not found on window!', 'error');
            log('💡 This explains missing functions', 'warning');
            return false;
        }

        log('✅ SessionLoader found', 'success');
        
        // Check SessionLoader properties
        const sl = window.sessionLoader;
        const props = Object.getOwnPropertyNames(sl);
        console.log(`📋 SessionLoader has ${props.length} properties/methods:`);
        
        const methods = props.filter(prop => typeof sl[prop] === 'function');
        const objects = props.filter(prop => typeof sl[prop] === 'object' && sl[prop] !== null);
        
        console.log(`   🔧 Methods (${methods.length}):`, methods.slice(0, 10)); // Show first 10
        console.log(`   📦 Objects (${objects.length}):`, objects.slice(0, 5));  // Show first 5
        
        // Try to get debug info
        if (typeof sl.debugInfo === 'function') {
            try {
                const debugInfo = sl.debugInfo();
                log('🔍 SessionLoader debug info available', 'success');
                console.log('Debug Info:', debugInfo);
            } catch (error) {
                log(`❌ Error calling debugInfo: ${error.message}`, 'error');
            }
        }

        // Check if SessionLoader has error handler
        if (sl.errorHandler) {
            const errorSummary = sl.errorHandler.getErrorSummary();
            if (errorSummary.total > 0) {
                log(`⚠️ ${errorSummary.total} errors detected in SessionLoader`, 'warning');
                console.log('Error Summary:', errorSummary);
            } else {
                log('✅ No errors in SessionLoader error handler', 'success');
            }
        }

        return true;
    }

    function checkFunctions() {
        log('📦 Checking Required Functions...');
        
        const available = [];
        const missing = [];
        const details = {};

        CONFIG.requiredFunctions.forEach(funcName => {
            const isAvailable = typeof window[funcName] === 'function';
            details[funcName] = {
                available: isAvailable,
                type: typeof window[funcName],
                source: isAvailable ? getFunctionSource(funcName) : 'N/A'
            };
            
            if (isAvailable) {
                available.push(funcName);
            } else {
                missing.push(funcName);
            }
        });

        log(`✅ Available (${available.length}): ${available.join(', ')}`);
        if (missing.length > 0) {
            log(`❌ Missing (${missing.length}): ${missing.join(', ')}`, 'error');
        }

        return { available, missing, details };
    }

    function checkObjects() {
        log('🏠 Checking Required Objects...');
        
        const available = [];
        const missing = [];
        const details = {};

        CONFIG.requiredObjects.forEach(objName => {
            const obj = window[objName];
            const isAvailable = typeof obj !== 'undefined';
            
            details[objName] = {
                available: isAvailable,
                type: typeof obj,
                constructor: isAvailable ? obj.constructor.name : 'N/A',
                properties: isAvailable ? Object.getOwnPropertyNames(obj).length : 0
            };
            
            if (isAvailable) {
                available.push(objName);
            } else {
                missing.push(objName);
            }
        });

        log(`✅ Available (${available.length}): ${available.join(', ')}`);
        if (missing.length > 0) {
            log(`❌ Missing (${missing.length}): ${missing.join(', ')}`, 'error');
        }

        // Show details for available objects
        available.forEach(objName => {
            const obj = window[objName];
            console.log(`📋 ${objName}:`, {
                type: typeof obj,
                constructor: obj.constructor.name,
                properties: Object.getOwnPropertyNames(obj).length,
                methods: Object.getOwnPropertyNames(obj).filter(prop => typeof obj[prop] === 'function').length
            });
        });

        return { available, missing, details };
    }

    function checkScripts() {
        log('📜 Checking Script Loading...');
        
        const scripts = Array.from(document.scripts);
        const relevantScripts = scripts.filter(s => 
            s.src.includes('session-loader') || 
            s.src.includes('env-config') || 
            s.src.includes('document-manager') ||
            s.src.includes('tutor') ||
            s.src.includes('onboard')
        );

        console.log(`📊 Total scripts: ${scripts.length}, Relevant: ${relevantScripts.length}`);
        
        relevantScripts.forEach((script, index) => {
            const status = script.readyState || 'loaded';
            const hasError = script.onerror !== null;
            log(`   ${index + 1}. ${script.src} (${status}) ${hasError ? '❌' : '✅'}`);
        });

        // Check for script errors
        const errorScripts = relevantScripts.filter(s => s.onerror !== null);
        if (errorScripts.length > 0) {
            log(`⚠️ ${errorScripts.length} scripts have errors`, 'warning');
        }
    }

    function getFunctionSource(funcName) {
        try {
            const func = window[funcName];
            if (typeof func === 'function') {
                const funcStr = func.toString();
                if (funcStr.includes('sessionLoader') || funcStr.includes('SessionLoader')) {
                    return 'SessionLoader';
                } else if (funcStr.includes('native code')) {
                    return 'Native';
                } else {
                    return 'Custom';
                }
            }
            return 'Unknown';
        } catch (error) {
            return 'Error checking source';
        }
    }

    function generateReport(functionResults, objectResults) {
        log('📊 Generating Diagnostic Report...', 'info');
        
        const report = {
            timestamp: new Date().toISOString(),
            sessionLoader: {
                available: typeof window.sessionLoader !== 'undefined',
                initialized: window.sessionLoader?.initialized || 'unknown'
            },
            functions: {
                total: CONFIG.requiredFunctions.length,
                available: functionResults.available.length,
                missing: functionResults.missing.length,
                percentage: Math.round((functionResults.available.length / CONFIG.requiredFunctions.length) * 100)
            },
            objects: {
                total: CONFIG.requiredObjects.length,
                available: objectResults.available.length,
                missing: objectResults.missing.length,
                percentage: Math.round((objectResults.available.length / CONFIG.requiredObjects.length) * 100)
            },
            environment: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                isDevelopment: window.location.hostname === 'localhost'
            }
        };

        console.log('📊 DIAGNOSTIC REPORT:');
        console.table({
            'Functions': `${report.functions.available}/${report.functions.total} (${report.functions.percentage}%)`,
            'Objects': `${report.objects.available}/${report.objects.total} (${report.objects.percentage}%)`,
            'SessionLoader': report.sessionLoader.available ? '✅ Available' : '❌ Missing'
        });

        // Troubleshooting recommendations
        if (functionResults.missing.length > 0 || objectResults.missing.length > 0) {
            log('🔧 TROUBLESHOOTING RECOMMENDATIONS:', 'warning');
            
            if (!report.sessionLoader.available) {
                console.log('1. ❌ SessionLoader is missing - check if session-loader.js loaded correctly');
                console.log('   - Check Network tab for 404 errors');
                console.log('   - Verify file path: ./assets/js/session-loader.js');
            } else {
                console.log('1. ✅ SessionLoader is available');
                
                if (functionResults.missing.length > 0) {
                    console.log('2. ⚠️ Functions missing - SessionLoader may not have finished initialization');
                    console.log('   - Try: window.sessionLoader.debugInfo()');
                    console.log('   - Wait a few seconds and run diagnostic again');
                }
            }

            console.log('3. 🔄 Manual fixes to try:');
            console.log('   - window.sessionLoader?.init?.()');
            console.log('   - setTimeout(() => quickDiagnostic(), 3000)');
            console.log('   - Check browser console for JavaScript errors');
        } else {
            log('🎉 All components available! System is working correctly.', 'success');
        }

        return report;
    }

    // Enhanced testing functions
    function testFunctions() {
        log('🧪 Testing Available Functions...', 'info');
        
        CONFIG.requiredFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try {
                    // Test if function can be called (some might require parameters)
                    console.log(`✅ ${funcName}: callable`);
                } catch (error) {
                    console.log(`⚠️ ${funcName}: exists but may need parameters`);
                }
            } else {
                console.log(`❌ ${funcName}: not available`);
            }
        });
    }

    function showAllWindowFunctions() {
        const allFunctions = Object.getOwnPropertyNames(window).filter(key => 
            typeof window[key] === 'function' && (
                key.includes('sign') || key.includes('upload') || key.includes('start') ||
                key.includes('set') || key.includes('browse') || key.includes('explore') ||
                key.includes('view') || key.includes('upgrade') || key.includes('switch') ||
                key.includes('filter') || key.includes('debug') || key.includes('verify') ||
                key.includes('tutor') || key.includes('session')
            )
        );
        
        console.log('🔍 All relevant functions found on window:', allFunctions);
        return allFunctions;
    }

    // Wait for DOM and SessionLoader, then auto-run
    function initDiagnostics() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(quickDiagnostic, 1000);
            });
        } else {
            setTimeout(quickDiagnostic, 1000);
        }
    }

    // Expose globally
    window.quickDiagnostic = quickDiagnostic;
    window.testFunctions = testFunctions;
    window.showAllWindowFunctions = showAllWindowFunctions;
    window.checkSessionLoader = checkSessionLoader;

    log('🔧 Enhanced diagnostic system loaded');
    console.log('💡 Available commands:');
    console.log('  - quickDiagnostic()      // Run full diagnostic');
    console.log('  - testFunctions()        // Test function calls');
    console.log('  - showAllWindowFunctions() // Show all relevant functions');
    console.log('  - checkSessionLoader()   // Check SessionLoader status');

    // Auto-initialize
    initDiagnostics();

})();

// ====================================================================
// ENHANCED SESSIONLOADER DEBUG SCRIPT
// Add this to debug_functions.js and load at end of HTML
// ====================================================================

(function() {
    'use strict';
    
    // Wait for DOM and SessionLoader to be available
    function waitForSessionLoader(callback, maxAttempts = 50) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window.sessionLoader || attempts >= maxAttempts) {
                clearInterval(checkInterval);
                callback(window.sessionLoader);
            }
        }, 100);
    }
    
    // Enhanced diagnostic function
    window.enhancedDiagnostic = function() {
        console.log('🔍 ENHANCED SESSIONLOADER DIAGNOSTIC');
        console.log('=====================================');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // 1. Basic info
        console.log('📊 Basic Info:');
        const debugInfo = window.sessionLoader.debugInfo ? window.sessionLoader.debugInfo() : null;
        if (debugInfo) {
            console.log('  Environment:', debugInfo.environment);
            console.log('  Session:', debugInfo.session);
            console.log('  Error Count:', debugInfo.errorCount);
            console.log('  Profile Completion:', debugInfo.profileCompletion + '%');
            console.log('  Loaded Scripts:', debugInfo.loadedScripts?.length || 0);
        }
        
        // 2. Function analysis
        console.log('\n🔧 Function Analysis:');
        const allKeys = Object.keys(window.sessionLoader);
        const functions = allKeys.filter(key => typeof window.sessionLoader[key] === 'function');
        const objects = allKeys.filter(key => typeof window.sessionLoader[key] === 'object' && window.sessionLoader[key] !== null);
        
        console.log('  Total functions:', functions.length);
        console.log('  Total objects:', objects.length);
        console.log('  Functions:', functions);
        console.log('  Objects:', objects);
        
        // 3. Card-specific analysis
        console.log('\n🎴 Card Analysis:');
        
        // Check global Card objects
        const globalCards = [];
        for (let i = 1; i <= 9; i++) {
            const cardName = `Card${i}`;
            if (window[cardName]) {
                globalCards.push(cardName);
            }
        }
        console.log('  Global Card objects:', globalCards.length ? globalCards : 'None found');
        
        // Check sessionLoader Card methods
        const sessionLoaderCards = [];
        const cardMethods = functions.filter(f => f.toLowerCase().includes('card'));
        console.log('  SessionLoader card methods:', cardMethods.length ? cardMethods : 'None found');
        
        // Check for card-related properties
        const cardProperties = allKeys.filter(k => k.toLowerCase().includes('card'));
        console.log('  Card-related properties:', cardProperties.length ? cardProperties : 'None found');
        
        // 4. Script loading analysis
        console.log('\n📜 Script Analysis:');
        if (debugInfo?.loadedScripts) {
            debugInfo.loadedScripts.forEach((script, index) => {
                console.log(`  ${index + 1}. ${script}`);
            });
        }
        
        // 5. Error analysis
        console.log('\n❌ Error Analysis:');
        if (debugInfo?.errorCount > 0) {
            console.log('  Error count:', debugInfo.errorCount);
            if (window.sessionLoader.errors) {
                console.log('  Errors:', window.sessionLoader.errors);
            }
            if (window.sessionLoader.getErrors) {
                console.log('  Error details:', window.sessionLoader.getErrors());
            }
        }
        
        // 6. Manual script check
        console.log('\n🔍 Manual Script Verification:');
        const expectedScripts = [
            '../assets/js/tutor/card1.js',
            '../assets/js/tutor/card2.js', 
            '../assets/js/tutor/card3.js',
            '../assets/js/tutor/card4.js',
            '../assets/js/tutor/card5.js',
            '../assets/js/tutor/card6.js',
            '../assets/js/tutor/card7.js',
            '../assets/js/tutor/card8.js',
            '../assets/js/tutor/card9.js'
        ];
        
        expectedScripts.forEach(script => {
            const scriptElement = document.querySelector(`script[src="${script}"]`);
            console.log(`  ${script}: ${scriptElement ? '✅ DOM element found' : '❌ DOM element missing'}`);
        });
        
        console.log('\n=====================================');
        return {
            functions: functions.length,
            objects: objects.length,
            globalCards: globalCards.length,
            sessionLoaderCardMethods: cardMethods.length,
            errorCount: debugInfo?.errorCount || 0
        };
    };
    
    // Force reload specific scripts
    window.forceReloadCards = function() {
        console.log('🔄 Force reloading card scripts...');
        
        const cardScripts = [
            '../assets/js/tutor/card1.js',
            '../assets/js/tutor/card2.js',
            '../assets/js/tutor/card3.js',
            '../assets/js/tutor/card4.js',
            '../assets/js/tutor/card5.js',
            '../assets/js/tutor/card6.js',
            '../assets/js/tutor/card7.js',
            '../assets/js/tutor/card8.js',
            '../assets/js/tutor/card9.js'
        ];
        
        // Remove existing script tags
        cardScripts.forEach(src => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                existing.remove();
                console.log('  Removed:', src);
            }
        });
        
        // Add them back with cache busting
        cardScripts.forEach((src, index) => {
            setTimeout(() => {
                const script = document.createElement('script');
                script.src = src + '?reload=' + Date.now();
                script.onload = () => console.log('  ✅ Reloaded:', src);
                script.onerror = () => console.error('  ❌ Failed to reload:', src);
                document.head.appendChild(script);
            }, index * 100); // Stagger loading
        });
    };
    
    // Test card functionality
    window.testCardFunctions = function() {
        console.log('🧪 Testing Card Functions:');
        
        // Test global cards
        for (let i = 1; i <= 9; i++) {
            const cardName = `Card${i}`;
            if (window[cardName]) {
                console.log(`  ✅ ${cardName} exists globally`);
                if (typeof window[cardName].init === 'function') {
                    console.log(`    - Has init method`);
                }
                if (typeof window[cardName].show === 'function') {
                    console.log(`    - Has show method`);
                }
            } else {
                console.log(`  ❌ ${cardName} not found globally`);
            }
        }
        
        // Test sessionLoader methods
        if (window.sessionLoader) {
            const cardMethods = Object.keys(window.sessionLoader).filter(k => 
                k.toLowerCase().includes('card') && typeof window.sessionLoader[k] === 'function'
            );
            
            if (cardMethods.length > 0) {
                console.log('  SessionLoader card methods:');
                cardMethods.forEach(method => {
                    console.log(`    - ${method}`);
                });
            }
        }
    };
    
    // Auto-run enhanced diagnostic when script loads
    document.addEventListener('DOMContentLoaded', () => {
        waitForSessionLoader((sessionLoader) => {
            if (sessionLoader) {
                console.log('🚀 Debug script loaded - SessionLoader detected');
                console.log('Available debug commands:');
                console.log('  - enhancedDiagnostic() - Full diagnostic');
                console.log('  - forceReloadCards() - Reload card scripts');
                console.log('  - testCardFunctions() - Test card availability');
                
                // Auto-run diagnostic after a short delay
                setTimeout(() => {
                    console.log('\n🔍 Auto-running enhanced diagnostic...');
                    enhancedDiagnostic();
                }, 1000);
            } else {
                console.warn('⚠️ SessionLoader not found after waiting');
            }
        });
    });
    
    // If DOM already loaded, run immediately
    if (document.readyState === 'loading') {
        // DOM hasn't loaded yet
    } else {
        // DOM already loaded
        waitForSessionLoader((sessionLoader) => {
            if (sessionLoader) {
                console.log('🚀 Debug script loaded (DOM ready) - SessionLoader detected');
                setTimeout(() => enhancedDiagnostic(), 500);
            }
        });
    }
})();
// ====================================================================
// SCRIPTLOADER DEPENDENCIES FIXER
// Creates missing AsyncWrapper and ENV_CONFIG that ScriptLoader needs
// ====================================================================

(function() {
    'use strict';
    
    // Create missing AsyncWrapper class
    if (!window.AsyncWrapper) {
        window.AsyncWrapper = {
            async withRetry(fn, retries = 3, delay = 1000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        console.log(`🔄 Retry ${i + 1}/${retries} for function`);
                    }
                }
            },
            
            async timeout(promise, ms = 15000) {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
                    )
                ]);
            }
        };
        console.log('✅ Created AsyncWrapper');
    }
    
    // Create missing ENV_CONFIG
    if (!window.ENV_CONFIG) {
        window.ENV_CONFIG = {
            isDevelopment: true // Enable development logging
        };
        console.log('✅ Created ENV_CONFIG');
    }
    
    // Enhanced diagnostic function
    window.enhancedDiagnostic = function() {
        console.log('🔍 ENHANCED SESSIONLOADER DIAGNOSTIC');
        console.log('=====================================');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // 1. Dependencies check
        console.log('🔗 Dependencies Check:');
        console.log('  AsyncWrapper:', !!window.AsyncWrapper);
        console.log('  ENV_CONFIG:', !!window.ENV_CONFIG);
        console.log('  PerformanceManager:', !!window.sessionLoader?.scriptLoader?.performanceManager);
        
        // 2. Basic info
        console.log('\n📊 Basic Info:');
        const debugInfo = window.sessionLoader.debugInfo ? window.sessionLoader.debugInfo() : null;
        if (debugInfo) {
            console.log('  Environment:', debugInfo.environment);
            console.log('  Session:', debugInfo.session);
            console.log('  Error Count:', debugInfo.errorCount);
            console.log('  Profile Completion:', debugInfo.profileCompletion + '%');
            console.log('  Loaded Scripts:', debugInfo.loadedScripts?.length || 0);
        }
        
        // 3. Function analysis
        console.log('\n🔧 Function Analysis:');
        const allKeys = Object.keys(window.sessionLoader);
        const functions = allKeys.filter(key => typeof window.sessionLoader[key] === 'function');
        const objects = allKeys.filter(key => typeof window.sessionLoader[key] === 'object' && window.sessionLoader[key] !== null);
        
        console.log('  Total functions:', functions.length);
        console.log('  Functions:', functions);
        
        // 4. ScriptLoader analysis
        console.log('\n📜 ScriptLoader Status:');
        if (window.sessionLoader.scriptLoader) {
            const sl = window.sessionLoader.scriptLoader;
            console.log('  ScriptLoader type:', sl.constructor.name);
            console.log('  Loaded scripts count:', sl.loadedScripts?.size || 0);
            console.log('  Loading scripts count:', sl.loadingScripts?.size || 0);
            console.log('  Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sl))
                .filter(name => typeof sl[name] === 'function' && name !== 'constructor'));
        }
        
        // 5. Card analysis
        console.log('\n🎴 Card Analysis:');
        const globalCards = [];
        for (let i = 1; i <= 10; i++) {
            if (window[`Card${i}`]) globalCards.push(`Card${i}`);
        }
        console.log('  Global Cards:', globalCards.length ? globalCards : 'None found');
        
        console.log('\n=====================================');
        return {
            dependenciesOk: !!(window.AsyncWrapper && window.ENV_CONFIG),
            functions: functions.length,
            scriptLoaderWorking: !!(window.sessionLoader.scriptLoader?.loadScript),
            globalCards: globalCards.length,
            errorCount: debugInfo?.errorCount || 0
        };
    };
    
    // Fix ScriptLoader by recreating it with proper dependencies
    window.fixScriptLoader = function() {
        console.log('🔧 FIXING SCRIPTLOADER...');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // Ensure dependencies exist
        if (!window.AsyncWrapper || !window.ENV_CONFIG) {
            console.error('❌ Missing dependencies - run this script first to create them');
            return;
        }
        
        // Get current state
        const currentLoader = window.sessionLoader.scriptLoader;
        const loadedScripts = currentLoader?.loadedScripts || new Set();
        const performanceManager = currentLoader?.performanceManager || window.sessionLoader.performanceManager;
        
        console.log('📊 Current state:');
        console.log('  Loaded scripts:', loadedScripts.size);
        console.log('  Performance manager:', !!performanceManager);
        
        // Create new ScriptLoader with original code
        class FixedScriptLoader {
            constructor() {
                this.loadedScripts = loadedScripts; // Preserve existing state
                this.loadingScripts = new Map();
                this.performanceManager = performanceManager || { 
                    mark: () => {}, 
                    measure: () => 0 
                };
            }

            async checkFileExists(url) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    return response.ok;
                } catch (error) {
                    return false;
                }
            }
            
            async loadScript(src) {
                // Return existing promise if script is already loading
                if (this.loadingScripts.has(src)) {
                    return this.loadingScripts.get(src);
                }
            
                // Return immediately if script is already loaded
                if (this.loadedScripts.has(src)) {
                    return Promise.resolve();
                }
            
                // Check if script already exists in DOM
                const existingScript = document.querySelector(`script[src="${src}"]`);
                if (existingScript) {
                    this.loadedScripts.add(src);
                    return Promise.resolve();
                }
            
                const loadPromise = AsyncWrapper.withRetry(async () => {
                    return AsyncWrapper.timeout(new Promise((resolve, reject) => {
                        this.performanceManager.mark(`script-load-start-${src}`);
                    
                        // Remove any failed attempts first
                        const failedScripts = document.querySelectorAll(`script[src="${src}"]`);
                        failedScripts.forEach(s => s.remove());
                    
                        const script = document.createElement('script');
                        script.src = src;
                        script.async = false;
                        script.defer = false;
                    
                        script.onload = () => {
                            this.loadedScripts.add(src);
                            this.loadingScripts.delete(src);
                    
                            this.performanceManager.mark(`script-load-end-${src}`);
                            const duration = this.performanceManager.measure ? 
                                this.performanceManager.measure(
                                    `script-load-${src}`,
                                    `script-load-start-${src}`,
                                    `script-load-end-${src}`
                                ) : 0;
                    
                            if (ENV_CONFIG.isDevelopment) {
                                console.log(`📊 Script loaded in ${duration.toFixed(2)}ms: ${src}`);
                            }
                            resolve();
                        };
                    
                        script.onerror = () => {
                            this.loadingScripts.delete(src);
                            script.remove();
                            reject(new Error(`Failed to load script: ${src}`));
                        };
                    
                        document.head.appendChild(script);
                    }), 15000);
                }, 3, 1000);
            
                this.loadingScripts.set(src, loadPromise);
            
                try {
                    await loadPromise;
                } catch (error) {
                    this.loadingScripts.delete(src);
                    throw error;
                }
            
                return loadPromise;
            }

            async forceLoadScript(src) {
                return new Promise((resolve, reject) => {
                    // Remove any existing script tags
                    const existingScripts = document.querySelectorAll(`script[src="${src}"]`);
                    existingScripts.forEach(script => script.remove());
                    
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = false;
                    script.defer = false;
                    
                    const timeout = setTimeout(() => {
                        script.remove();
                        reject(new Error(`Force load timeout: ${src}`));
                    }, 15000);
                    
                    script.onload = () => {
                        clearTimeout(timeout);
                        this.loadedScripts.add(src);
                        this.loadingScripts.delete(src);
                        console.log(`✅ Force loaded: ${src}`);
                        resolve();
                    };
                    
                    script.onerror = (event) => {
                        clearTimeout(timeout);
                        this.loadingScripts.delete(src);
                        script.remove();
                        reject(new Error(`Failed to force load script: ${src}`));
                    };
                    
                    document.head.appendChild(script);
                });
            }
        }
        
        // Replace the broken scriptLoader
        window.sessionLoader.scriptLoader = new FixedScriptLoader();
        console.log('✅ ScriptLoader fixed and replaced');
        
        return window.sessionLoader.scriptLoader;
    };
    
    // Force reload all scripts that should be loaded
    window.forceReloadAllScripts = function() {
        console.log('🚀 FORCE RELOADING ALL SCRIPTS...');
        
        const scripts = [
            '../assets/js/tutor/card1.js',
            '../assets/js/tutor/card2.js', 
            '../assets/js/tutor/card3.js',
            '../assets/js/tutor/card4.js',
            '../assets/js/tutor/card5.js',
            '../assets/js/tutor/card6.js',
            '../assets/js/tutor/card7.js',
            '../assets/js/tutor/card8.js',
            '../assets/js/tutor/card9.js',
            '../assets/js/onboarding-main.js'
        ];
        
        if (!window.sessionLoader?.scriptLoader?.forceLoadScript) {
            console.error('❌ ScriptLoader not available - run fixScriptLoader() first');
            return;
        }
        
        // Clear the "loaded" status to force actual reloading
        scripts.forEach(src => {
            window.sessionLoader.scriptLoader.loadedScripts.delete(src);
        });
        
        // Force load each script
        scripts.forEach((src, index) => {
            setTimeout(() => {
                window.sessionLoader.scriptLoader.forceLoadScript(src)
                    .then(() => {
                        console.log(`✅ Reloaded: ${src}`);
                        // Check if Cards are now available
                        if (src.includes('card') && !src.includes('onboarding')) {
                            const cardNum = src.match(/card(\d+)/)[1];
                            if (window[`Card${cardNum}`]) {
                                console.log(`🎯 Card${cardNum} object created!`);
                            }
                        }
                    })
                    .catch(err => console.error(`❌ Failed to reload: ${src}`, err));
            }, index * 200);
        });
    };
    
    console.log('🚀 ScriptLoader fixer loaded!');
    console.log('📋 Available commands:');
    console.log('  - enhancedDiagnostic() - Full diagnostic');
    console.log('  - fixScriptLoader() - Fix broken ScriptLoader'); 
    console.log('  - forceReloadAllScripts() - Force reload all scripts');
    
})();
// ====================================================================
// SCRIPTLOADER DEPENDENCIES FIXER
// Creates missing AsyncWrapper and ENV_CONFIG that ScriptLoader needs
// ====================================================================

(function() {
    'use strict';
    
    // Create missing AsyncWrapper class
    if (!window.AsyncWrapper) {
        window.AsyncWrapper = {
            async withRetry(fn, retries = 3, delay = 1000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        console.log(`🔄 Retry ${i + 1}/${retries} for function`);
                    }
                }
            },
            
            async timeout(promise, ms = 15000) {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
                    )
                ]);
            }
        };
        console.log('✅ Created AsyncWrapper');
    }
    
    // Create missing ENV_CONFIG
    if (!window.ENV_CONFIG) {
        window.ENV_CONFIG = {
            isDevelopment: true // Enable development logging
        };
        console.log('✅ Created ENV_CONFIG');
    }
    
    // Enhanced diagnostic function
    window.enhancedDiagnostic = function() {
        console.log('🔍 ENHANCED SESSIONLOADER DIAGNOSTIC');
        console.log('=====================================');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // 1. Dependencies check
        console.log('🔗 Dependencies Check:');
        console.log('  AsyncWrapper:', !!window.AsyncWrapper);
        console.log('  ENV_CONFIG:', !!window.ENV_CONFIG);
        console.log('  PerformanceManager:', !!window.sessionLoader?.scriptLoader?.performanceManager);
        
        // 2. Basic info
        console.log('\n📊 Basic Info:');
        const debugInfo = window.sessionLoader.debugInfo ? window.sessionLoader.debugInfo() : null;
        if (debugInfo) {
            console.log('  Environment:', debugInfo.environment);
            console.log('  Session:', debugInfo.session);
            console.log('  Error Count:', debugInfo.errorCount);
            console.log('  Profile Completion:', debugInfo.profileCompletion + '%');
            console.log('  Loaded Scripts:', debugInfo.loadedScripts?.length || 0);
        }
        
        // 3. Function analysis
        console.log('\n🔧 Function Analysis:');
        const allKeys = Object.keys(window.sessionLoader);
        const functions = allKeys.filter(key => typeof window.sessionLoader[key] === 'function');
        const objects = allKeys.filter(key => typeof window.sessionLoader[key] === 'object' && window.sessionLoader[key] !== null);
        
        console.log('  Total functions:', functions.length);
        console.log('  Functions:', functions);
        
        // 4. ScriptLoader analysis
        console.log('\n📜 ScriptLoader Status:');
        if (window.sessionLoader.scriptLoader) {
            const sl = window.sessionLoader.scriptLoader;
            console.log('  ScriptLoader type:', sl.constructor.name);
            console.log('  Loaded scripts count:', sl.loadedScripts?.size || 0);
            console.log('  Loading scripts count:', sl.loadingScripts?.size || 0);
            console.log('  Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sl))
                .filter(name => typeof sl[name] === 'function' && name !== 'constructor'));
        }
        
        // 5. Card analysis
        console.log('\n🎴 Card Analysis:');
        const globalCards = [];
        for (let i = 1; i <= 10; i++) {
            if (window[`Card${i}`]) globalCards.push(`Card${i}`);
        }
        console.log('  Global Cards:', globalCards.length ? globalCards : 'None found');
        
        console.log('\n=====================================');
        return {
            dependenciesOk: !!(window.AsyncWrapper && window.ENV_CONFIG),
            functions: functions.length,
            scriptLoaderWorking: !!(window.sessionLoader.scriptLoader?.loadScript),
            globalCards: globalCards.length,
            errorCount: debugInfo?.errorCount || 0
        };
    };
    
    // Fix ScriptLoader by recreating it with proper dependencies
    window.fixScriptLoader = function() {
        console.log('🔧 FIXING SCRIPTLOADER...');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // Ensure dependencies exist
        if (!window.AsyncWrapper || !window.ENV_CONFIG) {
            console.error('❌ Missing dependencies - run this script first to create them');
            return;
        }
        
        // Get current state
        const currentLoader = window.sessionLoader.scriptLoader;
        const loadedScripts = currentLoader?.loadedScripts || new Set();
        const performanceManager = currentLoader?.performanceManager || window.sessionLoader.performanceManager;
        
        console.log('📊 Current state:');
        console.log('  Loaded scripts:', loadedScripts.size);
        console.log('  Performance manager:', !!performanceManager);
        
        // Create new ScriptLoader with original code
        class FixedScriptLoader {
            constructor() {
                this.loadedScripts = loadedScripts; // Preserve existing state
                this.loadingScripts = new Map();
                this.performanceManager = performanceManager || { 
                    mark: () => {}, 
                    measure: () => 0 
                };
            }

            async checkFileExists(url) {
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    return response.ok;
                } catch (error) {
                    return false;
                }
            }
            
            async loadScript(src) {
                // Return existing promise if script is already loading
                if (this.loadingScripts.has(src)) {
                    return this.loadingScripts.get(src);
                }
            
                // Return immediately if script is already loaded
                if (this.loadedScripts.has(src)) {
                    return Promise.resolve();
                }
            
                // Check if script already exists in DOM
                const existingScript = document.querySelector(`script[src="${src}"]`);
                if (existingScript) {
                    this.loadedScripts.add(src);
                    return Promise.resolve();
                }
            
                const loadPromise = AsyncWrapper.withRetry(async () => {
                    return AsyncWrapper.timeout(new Promise((resolve, reject) => {
                        this.performanceManager.mark(`script-load-start-${src}`);
                    
                        // Remove any failed attempts first
                        const failedScripts = document.querySelectorAll(`script[src="${src}"]`);
                        failedScripts.forEach(s => s.remove());
                    
                        const script = document.createElement('script');
                        script.src = src;
                        script.async = false;
                        script.defer = false;
                    
                        script.onload = () => {
                            this.loadedScripts.add(src);
                            this.loadingScripts.delete(src);
                    
                            this.performanceManager.mark(`script-load-end-${src}`);
                            const duration = this.performanceManager.measure ? 
                                this.performanceManager.measure(
                                    `script-load-${src}`,
                                    `script-load-start-${src}`,
                                    `script-load-end-${src}`
                                ) : 0;
                    
                            if (ENV_CONFIG.isDevelopment) {
                                console.log(`📊 Script loaded in ${duration.toFixed(2)}ms: ${src}`);
                            }
                            resolve();
                        };
                    
                        script.onerror = () => {
                            this.loadingScripts.delete(src);
                            script.remove();
                            reject(new Error(`Failed to load script: ${src}`));
                        };
                    
                        document.head.appendChild(script);
                    }), 15000);
                }, 3, 1000);
            
                this.loadingScripts.set(src, loadPromise);
            
                try {
                    await loadPromise;
                } catch (error) {
                    this.loadingScripts.delete(src);
                    throw error;
                }
            
                return loadPromise;
            }

            async forceLoadScript(src) {
                return new Promise((resolve, reject) => {
                    // Remove any existing script tags
                    const existingScripts = document.querySelectorAll(`script[src="${src}"]`);
                    existingScripts.forEach(script => script.remove());
                    
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = false;
                    script.defer = false;
                    
                    const timeout = setTimeout(() => {
                        script.remove();
                        reject(new Error(`Force load timeout: ${src}`));
                    }, 15000);
                    
                    script.onload = () => {
                        clearTimeout(timeout);
                        this.loadedScripts.add(src);
                        this.loadingScripts.delete(src);
                        console.log(`✅ Force loaded: ${src}`);
                        resolve();
                    };
                    
                    script.onerror = (event) => {
                        clearTimeout(timeout);
                        this.loadingScripts.delete(src);
                        script.remove();
                        reject(new Error(`Failed to force load script: ${src}`));
                    };
                    
                    document.head.appendChild(script);
                });
            }
        }
        
        // Replace the broken scriptLoader
        window.sessionLoader.scriptLoader = new FixedScriptLoader();
        console.log('✅ ScriptLoader fixed and replaced');
        
        return window.sessionLoader.scriptLoader;
    };
    
    // Safe script loader that handles variable conflicts
    window.loadScriptsSafely = async function() {
        console.log('🛡️ LOADING SCRIPTS SAFELY (avoiding variable conflicts)...');
        
        const scripts = [
            '../assets/js/tutor/card1.js',
            '../assets/js/tutor/card2.js', 
            '../assets/js/tutor/card3.js',
            '../assets/js/tutor/card4.js',
            '../assets/js/tutor/card5.js',
            '../assets/js/tutor/card6.js',
            '../assets/js/tutor/card7.js',
            '../assets/js/tutor/card8.js',
            '../assets/js/tutor/card9.js',
            '../assets/js/onboarding-main.js'
        ];
        
        // Load and modify each script to avoid variable conflicts
        for (const src of scripts) {
            try {
                console.log(`📥 Fetching and modifying: ${src}`);
                
                // Fetch the script content
                const response = await fetch(src);
                if (!response.ok) {
                    console.warn(`⚠️ Could not fetch ${src}: ${response.status}`);
                    continue;
                }
                
                let scriptContent = await response.text();
                
                // Modify variable declarations to be conditional
                const variablePatterns = [
                    'const card2_credentialsUploaded',
                    'const card3_identityVerified', 
                    'const card4_scheduleSet',
                    'const studentsSearched',
                    'const card6_resourcesUploaded',
                    'const toolsExplored',
                    'const analyticsActive', 
                    'const crd9_premiumActive',
                    'let card2_credentialsUploaded',
                    'let card3_identityVerified',
                    'let card4_scheduleSet',
                    'let studentsSearched',
                    'let card6_resourcesUploaded',
                    'let toolsExplored',
                    'let analyticsActive',
                    'let crd9_premiumActive'
                ];
                
                // Replace problematic declarations with safe ones
                variablePatterns.forEach(pattern => {
                    const varName = pattern.split(' ')[1];
                    const safeDeclaration = `if (typeof ${varName} === 'undefined') { var ${varName}`;
                    scriptContent = scriptContent.replace(new RegExp(pattern, 'g'), safeDeclaration);
                });
                
                // Add closing braces for the conditional blocks
                const varNames = [
                    'card2_credentialsUploaded', 'card3_identityVerified', 'card4_scheduleSet',
                    'studentsSearched', 'card6_resourcesUploaded', 'toolsExplored', 
                    'analyticsActive', 'crd9_premiumActive'
                ];
                
                varNames.forEach(varName => {
                    if (scriptContent.includes(`if (typeof ${varName} === 'undefined')`)) {
                        // Find the end of the variable declaration and add closing brace
                        scriptContent = scriptContent.replace(
                            new RegExp(`(if \\(typeof ${varName} === 'undefined'\\) \\{ var ${varName}[^;]*;)`, 'g'),
                            '$1 }'
                        );
                    }
                });
                
                // Execute the modified script
                console.log(`🔄 Executing modified script: ${src}`);
                eval(scriptContent);
                
                console.log(`✅ Successfully executed: ${src}`);
                
                // Check if Card object was created
                if (src.includes('card') && !src.includes('onboarding')) {
                    const cardNum = src.match(/card(\d+)/)?.[1];
                    if (cardNum && window[`Card${cardNum}`]) {
                        console.log(`🎯 Card${cardNum} object created!`);
                    }
                }
                
            } catch (error) {
                console.error(`❌ Failed to load ${src}:`, error);
            }
        }
        
        console.log('🏁 Safe script loading complete!');
    };
    
    // Nuclear option - complete page state reset
    window.nuclearReset = function() {
        console.log('💥 NUCLEAR RESET - Complete JavaScript environment cleanup');
        
        // Clear all card-related variables
        const cardVars = [
            'card2_credentialsUploaded', 'card3_identityVerified', 'card4_scheduleSet',
            'studentsSearched', 'card6_resourcesUploaded', 'toolsExplored', 
            'analyticsActive', 'crd9_premiumActive'
        ];
        
        cardVars.forEach(varName => {
            try {
                delete window[varName];
                console.log(`🗑️ Cleared: ${varName}`);
            } catch(e) {
                console.log(`⚠️ Cannot clear: ${varName} (const/let)`);
            }
        });
        
        // Clear Card objects
        for(let i = 1; i <= 10; i++) {
            try {
                delete window[`Card${i}`];
                console.log(`🗑️ Cleared: Card${i}`);
            } catch(e) {
                // Ignore
            }
        }
        
        // Remove all card script tags
        document.querySelectorAll('script[src*="card"]').forEach(script => {
            script.remove();
            console.log(`🗑️ Removed script tag: ${script.src}`);
        });
        
        // Clear SessionLoader's loaded scripts tracking
        if (window.sessionLoader?.scriptLoader?.loadedScripts) {
            window.sessionLoader.scriptLoader.loadedScripts.clear();
            console.log('🗑️ Cleared SessionLoader tracking');
        }
        
        console.log('💥 Nuclear reset complete - ready for fresh loading');
    };
    
    console.log('🚀 ScriptLoader fixer loaded!');
    console.log('📋 Available commands:');
    console.log('  - enhancedDiagnostic() - Full diagnostic');
    console.log('  - fixScriptLoader() - Fix broken ScriptLoader'); 
    console.log('  - forceReloadAllScripts() - Force reload all scripts');
    
})();

// ====================================================================
// ENHANCED VARIABLE-SAFE SCRIPT LOADER
// Handles const/let redeclaration conflicts when reloading scripts
// ====================================================================

(function() {
    'use strict';
    
    // Create missing dependencies if needed
    if (!window.AsyncWrapper) {
        window.AsyncWrapper = {
            async withRetry(fn, retries = 3, delay = 1000) {
                for (let i = 0; i < retries; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        console.log(`🔄 Retry ${i + 1}/${retries} for function`);
                    }
                }
            },
            
            async timeout(promise, ms = 15000) {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
                    )
                ]);
            }
        };
        console.log('✅ Created AsyncWrapper');
    }
    
    if (!window.ENV_CONFIG) {
        window.ENV_CONFIG = {
            isDevelopment: true
        };
        console.log('✅ Created ENV_CONFIG');
    }

    // Enhanced diagnostic with better error detection
    window.enhancedDiagnostic = function() {
        console.log('🔍 ENHANCED SESSIONLOADER DIAGNOSTIC');
        console.log('=====================================');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return;
        }
        
        // 1. Dependencies check
        console.log('🔗 Dependencies Check:');
        console.log('  AsyncWrapper:', !!window.AsyncWrapper);
        console.log('  ENV_CONFIG:', !!window.ENV_CONFIG);
        console.log('  SessionLoader type:', window.sessionLoader.constructor.name);
        
        // 2. Script loading state
        console.log('\n📜 Script Loading State:');
        if (window.sessionLoader.scriptLoader) {
            const sl = window.sessionLoader.scriptLoader;
            console.log('  ScriptLoader available:', true);
            console.log('  Loaded scripts:', sl.loadedScripts?.size || 0);
            console.log('  Loading scripts:', sl.loadingScripts?.size || 0);
            
            if (sl.loadedScripts?.size > 0) {
                console.log('  Loaded script list:', Array.from(sl.loadedScripts));
            }
        } else {
            console.log('  ScriptLoader available:', false);
        }
        
        // 3. Card object analysis
        console.log('\n🎴 Card Object Analysis:');
        const globalCards = [];
        const cardFunctions = [];
        
        for (let i = 1; i <= 10; i++) {
            const cardName = `Card${i}`;
            if (window[cardName]) {
                globalCards.push(cardName);
                const methods = Object.getOwnPropertyNames(window[cardName])
                    .filter(prop => typeof window[cardName][prop] === 'function');
                if (methods.length > 0) {
                    cardFunctions.push(`${cardName}: [${methods.join(', ')}]`);
                }
            }
        }
        
        console.log('  Global Cards found:', globalCards.length ? globalCards : 'None');
        if (cardFunctions.length > 0) {
            console.log('  Card methods:');
            cardFunctions.forEach(cf => console.log(`    ${cf}`));
        }
        
        // 4. SessionLoader function analysis
        console.log('\n🔧 SessionLoader Functions:');
        const slKeys = Object.keys(window.sessionLoader);
        const slFunctions = slKeys.filter(key => typeof window.sessionLoader[key] === 'function');
        console.log('  Total functions:', slFunctions.length);
        console.log('  Function names:', slFunctions);
        
        // 5. Error analysis
        console.log('\n❌ Error Analysis:');
        const debugInfo = window.sessionLoader.debugInfo ? window.sessionLoader.debugInfo() : null;
        if (debugInfo) {
            console.log('  Error count:', debugInfo.errorCount || 0);
            if (debugInfo.errorCount > 0 && window.sessionLoader.getErrors) {
                console.log('  Error details:', window.sessionLoader.getErrors());
            }
        }
        
        console.log('\n=====================================');
        return {
            scriptLoaderOk: !!window.sessionLoader.scriptLoader,
            globalCards: globalCards.length,
            sessionLoaderFunctions: slFunctions.length,
            errorCount: debugInfo?.errorCount || 0
        };
    };

    // Nuclear reset - completely clears everything
    window.nuclearReset = function() {
        console.log('💣 NUCLEAR RESET - Clearing everything...');
        
        // Clear all Card objects
        for (let i = 1; i <= 10; i++) {
            if (window[`Card${i}`]) {
                delete window[`Card${i}`];
                console.log(`🗑️ Cleared Card${i}`);
            }
        }
        
        // Clear SessionLoader script tracking
        if (window.sessionLoader?.scriptLoader) {
            window.sessionLoader.scriptLoader.loadedScripts?.clear();
            window.sessionLoader.scriptLoader.loadingScripts?.clear();
            console.log('🗑️ Cleared script loading state');
        }
        
        // Remove all script tags
        const scripts = document.querySelectorAll('script[src*="card"], script[src*="onboarding"]');
        scripts.forEach((script, index) => {
            script.remove();
            console.log(`🗑️ Removed script ${index + 1}: ${script.src}`);
        });
        
        // Clear any cached variables that might conflict
        const potentialVars = ['tutorSignup', 'uploadArea', 'verificationContainer'];
        potentialVars.forEach(varName => {
            if (window[varName]) {
                delete window[varName];
                console.log(`🗑️ Cleared global variable: ${varName}`);
            }
        });
        
        console.log('💥 Nuclear reset complete!');
    };

    // Safe script loader that handles variable conflicts
    window.loadScriptsSafely = async function() {
        console.log('🛡️ LOADING SCRIPTS SAFELY (avoiding variable conflicts)...');
        
        const scripts = [
            '../assets/js/tutor/card1.js',
            '../assets/js/tutor/card2.js',
            '../assets/js/tutor/card3.js',
            '../assets/js/tutor/card4.js',
            '../assets/js/tutor/card5.js',
            '../assets/js/tutor/card6.js',
            '../assets/js/tutor/card7.js',
            '../assets/js/tutor/card8.js',
            '../assets/js/tutor/card9.js',
            '../assets/js/onboarding-main.js'
        ];
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const scriptPath of scripts) {
            try {
                console.log(`📥 Fetching: ${scriptPath}`);
                
                // Fetch script content
                const response = await fetch(scriptPath + '?v=' + Date.now());
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                let scriptContent = await response.text();
                console.log(`📝 Fetched ${scriptContent.length} characters from ${scriptPath}`);
                
                // Make variable declarations safe by making them conditional
                scriptContent = scriptContent
                    // Convert const declarations to conditional assignments
                    .replace(/^(\s*)const\s+(\w+)\s*=/gm, '$1if (typeof $2 === "undefined") var $2; $2 =')
                    // Convert let declarations to conditional assignments  
                    .replace(/^(\s*)let\s+(\w+)\s*=/gm, '$1if (typeof $2 === "undefined") var $2; $2 =')
                    // Handle object destructuring
                    .replace(/^(\s*)const\s*\{([^}]+)\}\s*=/gm, (match, indent, vars) => {
                        const varNames = vars.split(',').map(v => v.trim().split(':')[0].trim());
                        const declarations = varNames.map(v => `if (typeof ${v} === "undefined") var ${v};`).join(' ');
                        return `${indent}${declarations} {${vars}} =`;
                    });
                
                // Add script identification comment
                scriptContent = `// SAFELY LOADED: ${scriptPath}\n${scriptContent}`;
                
                // Execute the modified script
                console.log(`⚡ Executing modified script: ${scriptPath}`);
                eval(scriptContent);
                
                // Check if Card object was created (for card scripts)
                const cardMatch = scriptPath.match(/card(\d+)\.js/);
                if (cardMatch) {
                    const cardNum = cardMatch[1];
                    const cardName = `Card${cardNum}`;
                    if (window[cardName]) {
                        console.log(`🎯 ${cardName} object created successfully!`);
                        
                        // Test basic functionality
                        if (typeof window[cardName].init === 'function') {
                            console.log(`  ✅ ${cardName}.init() available`);
                        }
                        if (typeof window[cardName].show === 'function') {
                            console.log(`  ✅ ${cardName}.show() available`);
                        }
                    } else {
                        console.log(`⚠️ ${cardName} object not found after execution`);
                    }
                }
                
                successCount++;
                console.log(`✅ Successfully loaded: ${scriptPath}`);
                
                // Small delay between scripts
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                errorCount++;
                console.error(`❌ Failed to load ${scriptPath}:`, error.message);
                console.error('Full error:', error);
            }
        }
        
        console.log(`\n📊 LOADING SUMMARY:`);
        console.log(`  ✅ Successful: ${successCount}/${scripts.length}`);
        console.log(`  ❌ Failed: ${errorCount}/${scripts.length}`);
        
        // Update SessionLoader state if available
        if (window.sessionLoader?.scriptLoader) {
            scripts.forEach(script => {
                if (successCount > 0) {
                    window.sessionLoader.scriptLoader.loadedScripts?.add(script);
                }
            });
        }
        
        return { successCount, errorCount, totalScripts: scripts.length };
    };

    // Fix SessionLoader with enhanced error handling
    window.fixSessionLoader = function() {
        console.log('🔧 FIXING SESSIONLOADER...');
        
        if (!window.sessionLoader) {
            console.error('❌ SessionLoader not available');
            return false;
        }
        
        // Create enhanced ScriptLoader
        class EnhancedScriptLoader {
            constructor() {
                this.loadedScripts = new Set();
                this.loadingScripts = new Map();
                this.performanceManager = window.sessionLoader.performanceManager || { 
                    mark: () => {}, 
                    measure: () => 0 
                };
            }

            async loadScript(src) {
                if (this.loadingScripts.has(src)) {
                    return this.loadingScripts.get(src);
                }
                
                if (this.loadedScripts.has(src)) {
                    return Promise.resolve();
                }
                
                const loadPromise = this.createLoadPromise(src);
                this.loadingScripts.set(src, loadPromise);
                
                try {
                    await loadPromise;
                    this.loadedScripts.add(src);
                } catch (error) {
                    console.error(`Failed to load ${src}:`, error);
                } finally {
                    this.loadingScripts.delete(src);
                }
                
                return loadPromise;
            }
            
            createLoadPromise(src) {
                return new Promise((resolve, reject) => {
                    // Remove existing failed attempts
                    const existing = document.querySelector(`script[src="${src}"]`);
                    if (existing) existing.remove();
                    
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = false;
                    script.defer = false;
                    
                    const timeout = setTimeout(() => {
                        script.remove();
                        reject(new Error(`Timeout loading: ${src}`));
                    }, 15000);
                    
                    script.onload = () => {
                        clearTimeout(timeout);
                        console.log(`✅ Loaded: ${src}`);
                        resolve();
                    };
                    
                    script.onerror = () => {
                        clearTimeout(timeout);
                        script.remove();
                        reject(new Error(`Failed to load: ${src}`));
                    };
                    
                    document.head.appendChild(script);
                });
            }
        }
        
        window.sessionLoader.scriptLoader = new EnhancedScriptLoader();
        console.log('✅ SessionLoader fixed with enhanced script loader');
        return true;
    };

    // Complete system test
    window.completeSystemTest = async function() {
        console.log('🧪 RUNNING COMPLETE SYSTEM TEST...');
        
        // 1. Nuclear reset
        console.log('\n1️⃣ Nuclear Reset:');
        nuclearReset();
        
        // 2. Fix SessionLoader
        console.log('\n2️⃣ Fix SessionLoader:');
        const fixResult = fixSessionLoader();
        if (!fixResult) {
            console.error('❌ Cannot proceed - SessionLoader fix failed');
            return;
        }
        
        // 3. Load scripts safely
        console.log('\n3️⃣ Load Scripts Safely:');
        const loadResult = await loadScriptsSafely();
        
        // 4. Run diagnostic
        console.log('\n4️⃣ Final Diagnostic:');
        const diagnosticResult = enhancedDiagnostic();
        
        // 5. Summary
        console.log('\n🏁 COMPLETE SYSTEM TEST SUMMARY:');
        console.log('=====================================');
        console.log(`Scripts loaded: ${loadResult.successCount}/${loadResult.totalScripts}`);
        console.log(`Global Cards found: ${diagnosticResult.globalCards}`);
        console.log(`SessionLoader functions: ${diagnosticResult.sessionLoaderFunctions}`);
        console.log(`Error count: ${diagnosticResult.errorCount}`);
        
        const overallSuccess = loadResult.successCount > 0 && diagnosticResult.globalCards > 0;
        console.log(`Overall result: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS MORE WORK'}`);
        
        return {
            success: overallSuccess,
            scriptsLoaded: loadResult.successCount,
            cardsFound: diagnosticResult.globalCards,
            errors: loadResult.errorCount + diagnosticResult.errorCount
        };
    };

    console.log('🚀 Enhanced Variable-Safe Script Loader ready!');
    console.log('📋 Available commands:');
    console.log('  - enhancedDiagnostic() - Full system diagnostic');
    console.log('  - nuclearReset() - Clear everything and start fresh');
    console.log('  - loadScriptsSafely() - Load scripts avoiding variable conflicts');
    console.log('  - fixSessionLoader() - Fix/recreate SessionLoader');
    console.log('  - completeSystemTest() - Run full test sequence');
    
    console.log('\n🎯 RECOMMENDED SEQUENCE:');
    console.log('1. completeSystemTest() // Runs everything automatically');
    console.log('   OR manually:');
    console.log('2. nuclearReset()');
    console.log('3. fixSessionLoader()'); 
    console.log('4. loadScriptsSafely()');
    console.log('5. enhancedDiagnostic()');

})();
