(function() {
    'use strict';

    const EXPECTED_CARD_SCRIPTS = [
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card1.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card2.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card3.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card4.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card5.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card6.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card7.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card8.js`,
        `${ENV_CONFIG.baseURL}/assets/js/tutor/card9.js`,
        `${ENV_CONFIG.baseURL}/assets/js/onboarding-main.js`
    ];

    function log(msg, type = 'info') {
        const icon = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${msg}`);
    }

    function waitForSessionLoaderReady(callback) {
        const interval = setInterval(() => {
            if (window.sessionLoader?.initialized) {
                clearInterval(interval);
                callback();
            }
        }, 200);
    }

    function runDiagnostic() {
        console.clear();
        console.log('🚀 Running Enhanced SessionLoader Diagnostic');
        console.log('===========================================');

        if (!window.sessionLoader) {
            log('SessionLoader not found!', 'error');
            return;
        }

        // Use the new debugInfo method
        const info = typeof window.sessionLoader.debugInfo === 'function' 
            ? window.sessionLoader.debugInfo()
            : {};

        console.log('📊 Environment:', info.environment);
        console.log('📍 Current Session:', info.session);
        console.log('❌ Error Count:', info.errorCount);
        console.log('📈 Profile Completion:', info.profileCompletion + '%');

        console.log('\n📜 ScriptLoader:');
        console.log('  Loaded scripts:', info.loadedScripts?.length || 0);
        console.log('  Loading scripts:', info.loadingScripts?.length || 0);

        const missingFromSet = EXPECTED_CARD_SCRIPTS.filter(s => 
            !info.loadedScripts?.includes(s)
        );
        if (missingFromSet.length > 0) {
            log('Missing from loadedScripts:', 'warn');
            console.table(missingFromSet);
        } else {
            log('All expected scripts are loaded!', 'success');
        }

        console.log('\n🎴 Card Detection:');
        // Check window.cards object
        if (window.cards && typeof window.cards === 'object') {
            console.log('  🃏 Found window.cards:', Object.keys(window.cards));
        } else {
            console.log('  ❌ No window.cards object found');
        }

        // Also check Card1–Card9 globals
        const globalCards = [];
        for (let i = 1; i <= 9; i++) {
            if (window[`Card${i}`]) globalCards.push(`Card${i}`);
        }
        console.log('  🌍 Global Card objects:', globalCards.length ? globalCards : 'None found');

        console.log('\n✅ Diagnostic complete.');
    }

    // Auto-run after SessionLoader is ready
    waitForSessionLoaderReady(runDiagnostic);

    // Make it callable anytime
    window.runDiagnostic = runDiagnostic;

    console.log('🔧 quick-debug.js loaded - use runDiagnostic() in console to re-run checks.');
})();
