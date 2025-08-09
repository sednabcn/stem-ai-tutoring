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
