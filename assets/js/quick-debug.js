(function() {
    'use strict';

    function log(msg, type = 'info') {
        const icon = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${msg}`);
    }

    function waitForSessionLoaderReady(callback) {
        const interval = setInterval(() => {
            if (window.ENV_CONFIG && window.sessionLoader?.initialized) {
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

        const BASE_URL = window.ENV_CONFIG?.baseURL || '.';
        const EXPECTED_CARD_SCRIPTS = [
            `${BASE_URL}/assets/js/tutor/card1.js`,
            `${BASE_URL}/assets/js/tutor/card2.js`,
            `${BASE_URL}/assets/js/tutor/card3.js`,
            `${BASE_URL}/assets/js/tutor/card4.js`,
            `${BASE_URL}/assets/js/tutor/card5.js`,
            `${BASE_URL}/assets/js/tutor/card6.js`,
            `${BASE_URL}/assets/js/tutor/card7.js`,
            `${BASE_URL}/assets/js/tutor/card8.js`,
            `${BASE_URL}/assets/js/tutor/card9.js`,
            `${BASE_URL}/assets/js/onboarding-main.js`
        ];

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
        if (window.cards && typeof window.cards === 'object') {
            console.log('  🃏 Found window.cards:', Object.keys(window.cards));
        } else {
            console.log('  ❌ No window.cards object found');
        }

        const globalCards = [];
        for (let i = 1; i <= 9; i++) {
            if (window[`Card${i}`]) globalCards.push(`Card${i}`);
        }
	// console.log('  🌍 Global Card objects:', globalCards.length ? globalCards : 'None found');
	console.log("🌍 Card objects in window.cards:");
	Object.entries(window.cards || {}).forEach(([key, val]) => {
	    if (val?.missingExport) {
		console.warn(`⚠️ ${key} loaded but no export found`);
	    } else {
		console.log(`✅ ${key} loaded`);
	    }
	});

        console.log('\n✅ Diagnostic complete.');
    }

    waitForSessionLoaderReady(runDiagnostic);
    window.runDiagnostic = runDiagnostic;

    console.log('🔧 quick-debug.js loaded - use runDiagnostic() in console to re-run checks.');
})();
