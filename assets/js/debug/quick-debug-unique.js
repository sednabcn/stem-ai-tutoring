if (window.ENV?.TEST_MODE) {
  console.log("🧪 Debug logic active");
// =====================================================
// UNIFIED DEBUG SCRIPT - debug-quick.js
// Complete debugging and fixing solution for SessionLoader
// =====================================================

(function() {
    'use strict';

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    function log(msg, type = 'info') {
        const icons = {
            'info': 'ℹ️',
            'warn': '⚠️',
            'error': '❌',
            'success': '✅'
        };
        const icon = icons[type] || 'ℹ️';
        console.log(`${icon} ${msg}`);
    }

    function safeGetStyle(el) {
        return el ? getComputedStyle(el) : {};
    }

    function waitForSessionLoaderReady(callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (window.ENV_CONFIG && window.sessionLoader?.initialized) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                log('SessionLoader ready timeout', 'warn');
                callback(); // Run anyway
            }
        }, 200);
    }

    // ========================================
    // STATE TRACKING FOR NOTIFICATION PANEL
    // ========================================
    
    let isNotificationToggling = false;

    // ========================================
    // NOTIFICATION PANEL FIXES
    // ========================================

    function toggleNotificationPanel(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        if (isNotificationToggling) {
            log('Toggle already in progress, ignoring click', 'warn');
            return;
        }
        
        log('toggleNotificationPanel called');
        
        const notificationPanel = document.getElementById('notificationPanel');
        if (!notificationPanel) {
            log('Notification panel element not found', 'error');
            return;
        }
        
        isNotificationToggling = true;
        
        const hasActiveClass = notificationPanel.classList.contains('active');
        log(`Currently open: ${hasActiveClass}`);
        
        // Close avatar menu first
        const avatarMenu = document.querySelector('.avatar-menu') || document.getElementById('avatarMenu');
        if (avatarMenu) {
            avatarMenu.classList.remove('show');
        }
        
        if (hasActiveClass) {
            closeNotificationPanel();
            setTimeout(() => { isNotificationToggling = false; }, 50);
        } else {
            closeNotificationPanel();
            setTimeout(() => {
                openNotificationPanel();
                setTimeout(() => { isNotificationToggling = false; }, 50);
            }, 10);
        }
    }

    function toggleNotificationPanelSync(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        if (isNotificationToggling) return;
        isNotificationToggling = true;
        
        const notificationPanel = document.getElementById('notificationPanel');
        if (!notificationPanel) {
            isNotificationToggling = false;
            return;
        }
        
        const avatarMenu = document.querySelector('.avatar-menu') || document.getElementById('avatarMenu');
        if (avatarMenu) {
            avatarMenu.classList.remove('show');
        }
        
        const isOpen = notificationPanel.classList.contains('active');
        
        if (isOpen) {
            notificationPanel.classList.remove('active');
            log('Notification panel closed (sync)');
        } else {
            notificationPanel.classList.add('active');
            log('Notification panel opened (sync)');
        }
        
        // FIX: Use requestAnimationFrame for proper CSS timing
        requestAnimationFrame(() => {
            isNotificationToggling = false;
        });
    }

    function resetNotificationToggleState() {
        isNotificationToggling = false;
        log('Notification toggle state reset');
    }

    // ========================================
    // DIAGNOSTIC TESTS
    // ========================================

    function testElementsExistence() {
        console.log("\n=== TEST 1: ELEMENT EXISTENCE ===");
        
        const elements = {
            notificationPanel: document.getElementById('notificationPanel'),
            avatarMenu: document.getElementById('avatarMenu'),
            notificationBell: document.getElementById('notificationBell'),
            onboarding: document.getElementById('onboarding'),
            tutor: document.getElementById('tutor'),
            defaultView: document.getElementById('defaultView')
        };

        Object.entries(elements).forEach(([name, el]) => {
            console.log(`${name}:`, {
                exists: !!el,
                classes: el?.className || 'N/A',
                style: el?.style.cssText || 'N/A',
                display: el ? getComputedStyle(el).display : 'N/A'
            });
        });
    }

    function testSessionLoaderState() {
        console.log("\n=== TEST 2: SESSION LOADER STATE ===");
        
        const sessionLoader = window.sessionLoader;
        console.log("SessionLoader exists:", !!sessionLoader);
        
        if (sessionLoader) {
            console.log("Initialized:", sessionLoader.initialized);
            console.log("NotificationCenter exists:", !!sessionLoader.notificationCenter);
            console.log("Current session:", sessionLoader.sessionManager?.currentSession);
            console.log("Tutor verified:", sessionLoader.sessionManager?.tutorData?.isVerified);
            
            if (sessionLoader.notificationCenter) {
                console.log("NotificationCenter state:", {
                    isOpen: sessionLoader.notificationCenter.isOpen,
                    notificationCount: sessionLoader.notificationCenter.notifications?.length || 0
                });
            }
        }
    }

    function testGlobalFunctions() {
        console.log("\n=== TEST 3: GLOBAL FUNCTIONS ===");
        
        const functions = [
            'toggleNotificationPanel',
            'toggleAvatarMenu',
            'showDashboard',
            'showOnboarding',
            'switchTab',
            'openNotificationPanel',
            'closeNotificationPanel'
        ];

        functions.forEach(funcName => {
            console.log(`${funcName}:`, {
                exists: typeof window[funcName] === 'function',
                type: typeof window[funcName]
            });
        });
    }

    function testScriptLoading() {
        console.log("\n=== TEST 4: SCRIPT LOADING ===");
        
        const BASE_URL = window.ENV_CONFIG?.baseURL || '.';
        const expectedScripts = [
            `${BASE_URL}/assets/js/tutor/card1.js`,
            `${BASE_URL}/assets/js/tutor/card2.js`,
            `${BASE_URL}/assets/js/tutor/card3.js`,
            `${BASE_URL}/assets/js/tutor/card4.js`,
            `${BASE_URL}/assets/js/tutor/card5.js`,
            `${BASE_URL}/assets/js/tutor/card6.js`,
            `${BASE_URL}/assets/js/tutor/card7.js`,
            `${BASE_URL}/assets/js/tutor/card8.js`,
            `${BASE_URL}/assets/js/tutor/card9.js`,
            `${BASE_URL}/assets/js/onboarding-main.js`,
            `${BASE_URL}/assets/js/tutor-dashboard.js`
        ];

        if (window.sessionLoader?.debugInfo) {
            const info = window.sessionLoader.debugInfo();
            console.log('Environment:', info.environment);
            console.log('Current Session:', info.session);
            console.log('Error Count:', info.errorCount);
            console.log('Profile Completion:', info.profileCompletion + '%');
            console.log('Loaded scripts:', info.loadedScripts?.length || 0);
            console.log('Loading scripts:', info.loadingScripts?.length || 0);

            const missingScripts = expectedScripts.filter(s => 
                !info.loadedScripts?.includes(s)
            );
            
            if (missingScripts.length > 0) {
                log('Missing scripts found', 'warn');
                console.table(missingScripts);
            } else {
                log('All expected scripts loaded', 'success');
            }
        }

        // Check card objects
        console.log('\n🎴 Card Detection:');
        if (window.cards && typeof window.cards === 'object') {
            console.log('Card objects in window.cards:');
            Object.entries(window.cards).forEach(([key, val]) => {
                if (val?.missingExport) {
                    console.warn(`⚠️ ${key} loaded but no export found`);
                } else {
                    console.log(`✅ ${key} loaded`);
                }
            });
        } else {
            console.log('❌ No window.cards object found');
        }
    }

    function testFunctionality() {
        console.log("\n=== TEST 5: FUNCTIONALITY TEST ===");
        
        // Test notification panel
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            console.log("🔔 Notification panel before toggle:", panel.className);
            panel.classList.toggle('active');
            console.log("After toggle:", panel.className, "Display:", getComputedStyle(panel).display);
            panel.classList.toggle('active'); // Toggle back
        }

        // Test avatar menu
        const menu = document.getElementById('avatarMenu');
        if (menu) {
            console.log("👤 Avatar menu before toggle:", menu.className);
            menu.classList.toggle('show');
            console.log("After toggle:", menu.className, "Display:", getComputedStyle(menu).display);
            menu.classList.toggle('show'); // Toggle back
        }
    }

    function testCSSRules() {
        console.log("\n=== TEST 6: CSS RULES ===");
        
        const panel = document.getElementById('notificationPanel');
        const menu = document.getElementById('avatarMenu');

        if (panel) {
            const s = getComputedStyle(panel);
            console.log("📱 Notification Panel computed styles:", {
                position: s.position, display: s.display, visibility: s.visibility,
                opacity: s.opacity, zIndex: s.zIndex, top: s.top, right: s.right,
                transform: s.transform
            });
        }

        if (menu) {
            const s = getComputedStyle(menu);
            console.log("👤 Avatar Menu computed styles:", {
                position: s.position, display: s.display, visibility: s.visibility,
                opacity: s.opacity, zIndex: s.zIndex, transform: s.transform
            });
        }
    }

    function runAllDiagnostics() {
        console.clear();
        console.log('🚀 Running Complete SessionLoader Diagnostic');
        console.log('===========================================');
        
        testElementsExistence();
        testSessionLoaderState();
        testGlobalFunctions();
        testScriptLoading();
        testFunctionality();
        testCSSRules();
        
        console.log("\n✅ DIAGNOSTIC TESTS COMPLETED");
        console.log("📋 Check the results above to identify issues");
    }

    // ========================================
    // FORCE FIX FUNCTIONS
    // ========================================

    function forceShowNotificationPanel() {
        log('Force showing notification panel...');
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            // Apply emergency styles
            Object.assign(panel.style, {
                display: 'block',
                position: 'fixed',
                top: '60px',
                right: '20px',
                zIndex: '9999',
                background: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            });
            panel.classList.add('active');
            log('Notification panel forced to show', 'success');
        } else {
            log('Panel not found', 'error');
        }
    }

    function forceToggleAvatarMenu() {
        log('Force toggling avatar menu...');
        const menu = document.getElementById('avatarMenu');
        if (menu) {
            const isVisible = menu.classList.contains('show') || 
                             getComputedStyle(menu).display !== 'none';
            
            if (isVisible) {
                menu.classList.remove('show');
                menu.style.display = 'none';
                log('Menu hidden', 'success');
            } else {
                menu.classList.add('show');
                Object.assign(menu.style, {
                    display: 'block',
                    position: 'absolute',
                    zIndex: '9999'
                });
                log('Menu shown', 'success');
            }
        } else {
            log('Menu not found', 'error');
        }
    }

    function forceOnboardingSession() {
        log('Force showing onboarding session...');
        
        // Hide all sections
        document.querySelectorAll('.session-container, .dashboard-section').forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
        
        // Show onboarding
        const onboarding = document.getElementById('onboarding');
        if (onboarding) {
            onboarding.style.display = 'block';
            onboarding.classList.remove('hidden');
            log('Onboarding forced to show', 'success');
        } else {
            log('Onboarding section not found', 'error');
        }
        
        // Hide default view
        const defaultView = document.getElementById('defaultView');
        if (defaultView) {
            defaultView.style.display = 'none';
            defaultView.classList.add('hidden');
        }
    }

    // ========================================
    // QUICK TESTS
    // ========================================

    function quickToggleTest() {
        log('🧪 QUICK NOTIFICATION TOGGLE TEST');
        
        resetNotificationToggleState();
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('active'); // Ensure closed
        }
        
        console.log('1. Toggle open:');
        toggleNotificationPanel();
        
        setTimeout(() => {
            console.log('Panel state:', panel?.className);
            
            console.log('2. Toggle close:');
            toggleNotificationPanel();
            
            setTimeout(() => {
                console.log('Final state:', panel?.className);
                log('Quick test complete', 'success');
            }, 100);
        }, 100);
    }

    function rapidClickTest() {
        log('🔥 RAPID CLICK TEST');
        
        resetNotificationToggleState();
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.classList.remove('active');
        }
        
        console.log('Firing 5 rapid toggles:');
        for (let i = 0; i < 5; i++) {
            setTimeout(() => toggleNotificationPanel(), i * 10);
        }
        
        setTimeout(() => {
            console.log('Final panel state:', panel?.className);
            log('Rapid click test complete', 'success');
        }, 300);
    }

    // ========================================
    // MAIN INTERFACE
    // ========================================

    const debugAPI = {
        // Main diagnostics
        runAllTests: runAllDiagnostics,
        runDiagnostic: runAllDiagnostics, // Alias
        
        // Individual tests
        testElements: testElementsExistence,
        testSessionLoader: testSessionLoaderState,
        testFunctions: testGlobalFunctions,
        testScripts: testScriptLoading,
        testCSS: testCSSRules,
        
        // Force fixes
        forceNotificationPanel: forceShowNotificationPanel,
        forceAvatarMenu: forceToggleAvatarMenu,
        forceOnboarding: forceOnboardingSession,
        
        // Toggle functions (fixed versions)
        toggleNotificationPanel,
        toggleNotificationPanelSync,
        resetToggleState: resetNotificationToggleState,
        
        // Quick tests
        quickTest: quickToggleTest,
        rapidTest: rapidClickTest
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    // Expose to global scope
    window.debugSessionLoader = debugAPI;
    window.runDiagnostic = runAllDiagnostics; // Quick alias

    // Override global functions if they exist (for fixing)
    if (window.toggleNotificationPanel) {
        window.toggleNotificationPanel = toggleNotificationPanel;
        log('Global toggleNotificationPanel function overridden with fixed version');
    }

    console.log("🔧 UNIFIED DEBUG TOOLS LOADED!");
    console.log("📋 Available commands:");
    console.log("  runDiagnostic() - Run all diagnostic tests");
    console.log("  debugSessionLoader.quickTest() - Quick toggle test");
    console.log("  debugSessionLoader.rapidTest() - Rapid click test");
    console.log("  debugSessionLoader.forceNotificationPanel() - Emergency show panel");
    console.log("  debugSessionLoader.forceAvatarMenu() - Force toggle menu");
    console.log("  debugSessionLoader.forceOnboarding() - Show onboarding");
    console.log("  debugSessionLoader.resetToggleState() - Reset if stuck");

    // Auto-run diagnostics when ready
   waitForSessionLoaderReady(() => {
        setTimeout(runAllDiagnostics, 10000);
    });

})();
}
