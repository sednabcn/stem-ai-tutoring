if (window.ENV?.TEST_MODE) {
  console.log("🧪 Debug logic active");
// debug-quick-users.js - Comprehensive UI Load Testing for 100+ Concurrent Users
// Usage: Include this file in your project or paste into browser console

console.log('👥 quick-debug-users-dev.js loaded');
// ========================================
// CONFIGURATION
// ========================================
const TEST_CONFIG = {
    DEFAULT_USERS: 100,
    DEFAULT_CLICKS_PER_USER: 10,
    TEST_DURATION: 60000, // 60 seconds
    MONITORING_INTERVAL: 100, // 100ms
    MEMORY_THRESHOLD: 100, // 100MB
    ERROR_RATE_THRESHOLD: 0.05, // 5%
    MAX_STUCK_STATES: 5,
     AUTO_RUN: true,           // Enable auto-run
    AUTO_TEST: 'light',       // Which test to run
    AUTO_DELAY: 5000,         // Delay before auto-run (5s)
    DEVELOPMENT_ONLY: true,    // Only auto-run in development
    
    // Test scenarios
    scenarios: {
        light: { users: 50, clicks: 5, duration: 30000 },
        normal: { users: 100, clicks: 10, duration: 60000 },
        heavy: { users: 200, clicks: 15, duration: 120000 },
        chaos: { users: 500, clicks: 20, duration: 180000 }
    }
};

// ========================================
// PERFORMANCE MONITOR CLASS
// ========================================
class PerformanceMonitor {
    constructor() {
        this.clickCounts = new Map();
        this.errorCounts = new Map();
        this.stateChecks = [];
        this.startTime = performance.now();
        this.isRunning = false;
        this.interval = null;
        this.memoryWarnings = 0;
        this.stuckStateCount = 0;
        
        console.log('📊 PerformanceMonitor initialized');
    }
    
    startMonitoring(duration = TEST_CONFIG.TEST_DURATION) {
        if (this.isRunning) {
            console.warn('⚠️  Monitor already running');
            return;
        }
        
        this.isRunning = true;
        this.startTime = performance.now();
        
        console.log(`🔍 Starting monitoring for ${duration/1000}s...`);
        
        // Monitor system health every 100ms
        this.interval = setInterval(() => {
            this.checkSystemHealth();
        }, TEST_CONFIG.MONITORING_INTERVAL);
        
        // Generate final report
        setTimeout(() => {
            this.stopMonitoring();
        }, duration);
    }
    
    stopMonitoring() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        this.generateReport();
    }
    
    checkSystemHealth() {
        const issues = [];
        const timestamp = performance.now();
        
        // Check notification system health
        const notifPanel = document.getElementById('notificationPanel');
        if (notifPanel) {
            const hasActiveClass = notifPanel.classList.contains('active');
            const computedStyle = getComputedStyle(notifPanel);
            const displayStyle = computedStyle.display;
            const opacity = computedStyle.opacity;
            
            // Detect stuck states
            if ((displayStyle !== 'none' || opacity !== '0') && !hasActiveClass) {
                issues.push('Notification panel stuck visible');
                this.stuckStateCount++;
            }
            
            // Check for CSS conflicts
            if (notifPanel.style.display && notifPanel.style.display !== computedStyle.display) {
                issues.push('Notification panel CSS conflict');
            }
        }
        
        // Check avatar menu health
        const avatarMenu = document.querySelector('.avatar-menu');
        if (avatarMenu) {
            const hasShowClass = avatarMenu.classList.contains('show');
            const computedStyle = getComputedStyle(avatarMenu);
            const opacity = computedStyle.opacity;
            const visibility = computedStyle.visibility;
            
            // Detect stuck states
            if ((opacity !== '0' && visibility !== 'hidden') && !hasShowClass) {
                issues.push('Avatar menu stuck visible');
                this.stuckStateCount++;
            }
            
            // Check for CSS conflicts
            if (avatarMenu.style.opacity && avatarMenu.style.opacity !== computedStyle.opacity) {
                issues.push('Avatar menu CSS conflict');
            }
        }
        
        // Memory usage check
        let memoryMB = 0;
        if (performance.memory) {
            memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
            if (memoryMB > TEST_CONFIG.MEMORY_THRESHOLD) {
                issues.push(`High memory usage: ${memoryMB.toFixed(2)}MB`);
                this.memoryWarnings++;
            }
        }
        
        // Check for DOM leaks
        const elementsCount = document.getElementsByTagName('*').length;
        if (elementsCount > 10000) {
            issues.push(`High DOM element count: ${elementsCount}`);
        }
        
        // Event listener leak detection
        const eventListenerCount = this.estimateEventListeners();
        if (eventListenerCount > 1000) {
            issues.push(`Possible event listener leak: ~${eventListenerCount}`);
        }
        
        // Log issues immediately for debugging
        if (issues.length > 0) {
            console.warn('🚨 System issues detected:', issues);
        }
        
        // Store health snapshot
        this.stateChecks.push({
            timestamp,
            issues: issues.length,
            memoryMB,
            elementsCount,
            eventListenerCount,
            issuesList: issues
        });
    }
    
    estimateEventListeners() {
        // Rough estimation based on common patterns
        let count = 0;
        document.querySelectorAll('[onclick]').forEach(() => count++);
        document.querySelectorAll('button, a, input').forEach(() => count++);
        return count;
    }
    
    trackClick(component, metadata = {}) {
        const count = this.clickCounts.get(component) || 0;
        this.clickCounts.set(component, count + 1);
        
        // Track click timing for performance analysis
        if (!this.clickTimings) this.clickTimings = [];
        this.clickTimings.push({
            component,
            timestamp: performance.now(),
            ...metadata
        });
    }
    
    trackError(component, error, context = {}) {
        const count = this.errorCounts.get(component) || 0;
        this.errorCounts.set(component, count + 1);
        
        console.error(`${component} error:`, error, context);
        
        // Store error details for analysis
        if (!this.errorDetails) this.errorDetails = [];
        this.errorDetails.push({
            component,
            error: error.message || error.toString(),
            timestamp: performance.now(),
            stack: error.stack,
            context
        });
    }
    
    generateReport() {
        const duration = (performance.now() - this.startTime) / 1000;
        const totalClicks = Array.from(this.clickCounts.values()).reduce((a, b) => a + b, 0);
        const totalErrors = Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0);
        const errorRate = totalClicks > 0 ? totalErrors / totalClicks : 0;
        const clicksPerSecond = totalClicks / duration;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 COMPREHENSIVE LOAD TEST REPORT');
        console.log('='.repeat(60));
        
        // Basic metrics
        console.log(`📈 PERFORMANCE METRICS:`);
        console.log(`   Duration: ${duration.toFixed(2)}s`);
        console.log(`   Total Clicks: ${totalClicks}`);
        console.log(`   Clicks/Second: ${clicksPerSecond.toFixed(2)}`);
        console.log(`   Total Errors: ${totalErrors}`);
        console.log(`   Error Rate: ${(errorRate * 100).toFixed(2)}%`);
        
        // Component breakdown
        console.log(`\n🎯 COMPONENT BREAKDOWN:`);
        this.clickCounts.forEach((count, component) => {
            const errors = this.errorCounts.get(component) || 0;
            const componentErrorRate = count > 0 ? (errors / count * 100).toFixed(2) : '0.00';
            console.log(`   ${component}: ${count} clicks, ${errors} errors (${componentErrorRate}%)`);
        });
        
        // System health analysis
        const totalIssues = this.stateChecks.reduce((sum, check) => sum + check.issues, 0);
        const maxMemory = this.stateChecks.length > 0 ? 
            Math.max(...this.stateChecks.map(c => c.memoryMB)) : 0;
        const avgMemory = this.stateChecks.length > 0 ?
            this.stateChecks.reduce((sum, c) => sum + c.memoryMB, 0) / this.stateChecks.length : 0;
        
        console.log(`\n🔍 SYSTEM HEALTH:`);
        console.log(`   Total UI Issues: ${totalIssues}`);
        console.log(`   Stuck States: ${this.stuckStateCount}`);
        console.log(`   Memory Warnings: ${this.memoryWarnings}`);
        console.log(`   Peak Memory: ${maxMemory.toFixed(2)}MB`);
        console.log(`   Avg Memory: ${avgMemory.toFixed(2)}MB`);
        
        // Issue frequency analysis
        if (this.stateChecks.length > 0) {
            const issueTypes = {};
            this.stateChecks.forEach(check => {
                check.issuesList.forEach(issue => {
                    issueTypes[issue] = (issueTypes[issue] || 0) + 1;
                });
            });
            
            if (Object.keys(issueTypes).length > 0) {
                console.log(`\n⚠️  ISSUE BREAKDOWN:`);
                Object.entries(issueTypes).forEach(([issue, count]) => {
                    console.log(`   ${issue}: ${count} occurrences`);
                });
            }
        }
        
        // Performance analysis
        if (this.clickTimings && this.clickTimings.length > 0) {
            const responseTimes = this.clickTimings.map((click, index) => {
                if (index === 0) return 0;
                return click.timestamp - this.clickTimings[index - 1].timestamp;
            }).filter(time => time > 0);
            
            if (responseTimes.length > 0) {
                const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
                const maxResponseTime = Math.max(...responseTimes);
                
                console.log(`\n⚡ RESPONSE TIME ANALYSIS:`);
                console.log(`   Avg Response: ${avgResponseTime.toFixed(2)}ms`);
                console.log(`   Max Response: ${maxResponseTime.toFixed(2)}ms`);
            }
        }
        
        // Final verdict
        console.log(`\n🏁 FINAL VERDICT:`);
        const passed = this.evaluateTestResults(errorRate, totalIssues);
        console.log(`   Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
        
        if (!passed) {
            console.log(`   Reasons for failure:`);
            if (errorRate > TEST_CONFIG.ERROR_RATE_THRESHOLD) {
                console.log(`     - Error rate too high: ${(errorRate * 100).toFixed(2)}% > ${(TEST_CONFIG.ERROR_RATE_THRESHOLD * 100)}%`);
            }
            if (this.stuckStateCount > TEST_CONFIG.MAX_STUCK_STATES) {
                console.log(`     - Too many stuck states: ${this.stuckStateCount} > ${TEST_CONFIG.MAX_STUCK_STATES}`);
            }
            if (totalIssues > 50) {
                console.log(`     - Too many UI issues: ${totalIssues} > 50`);
            }
        }
        
        console.log('='.repeat(60) + '\n');
        
        return {
            passed,
            duration,
            totalClicks,
            totalErrors,
            errorRate,
            clicksPerSecond,
            totalIssues,
            stuckStateCount: this.stuckStateCount,
            memoryWarnings: this.memoryWarnings,
            maxMemory,
            avgMemory
        };
    }
    
    evaluateTestResults(errorRate, totalIssues) {
        return (
            errorRate <= TEST_CONFIG.ERROR_RATE_THRESHOLD &&
            this.stuckStateCount <= TEST_CONFIG.MAX_STUCK_STATES &&
            totalIssues <= 50 &&
            this.memoryWarnings < 10
        );
    }
}

// ========================================
// MULTI-USER SIMULATOR CLASS
// ========================================
class MultiUserSimulator {
    constructor() {
        this.users = [];
        this.isRunning = false;
        this.monitor = new PerformanceMonitor();
        this.scenarios = TEST_CONFIG.scenarios;
        
        console.log('👥 MultiUserSimulator initialized');
        this.setupOriginalFunctions();
    }
    
    setupOriginalFunctions() {
        // Store original functions and wrap them with monitoring
        if (window.toggleNotificationPanel) {
            this.originalNotifToggle = window.toggleNotificationPanel;
            window.toggleNotificationPanel = (...args) => {
                this.monitor.trackClick('notification', { timestamp: performance.now() });
                try {
                    return this.originalNotifToggle.apply(window, args);
                } catch (error) {
                    this.monitor.trackError('notification', error, { args });
                    throw error;
                }
            };
        }
        
        if (window.toggleAvatarMenu) {
            this.originalAvatarToggle = window.toggleAvatarMenu;
            window.toggleAvatarMenu = (...args) => {
                this.monitor.trackClick('avatar', { timestamp: performance.now() });
                try {
                    return this.originalAvatarToggle.apply(window, args);
                } catch (error) {
                    this.monitor.trackError('avatar', error, { args });
                    throw error;
                }
            };
        }
        
        console.log('🔧 Function monitoring wrappers installed');
    }
    
    async simulateUsers(userCount = TEST_CONFIG.DEFAULT_USERS, clicksPerUser = TEST_CONFIG.DEFAULT_CLICKS_PER_USER, options = {}) {
        if (this.isRunning) {
            console.warn('⚠️  Simulation already running');
            return;
        }
        
        const {
            duration = TEST_CONFIG.TEST_DURATION,
            randomDelay = true,
            componentMix = { notification: 0.5, avatar: 0.5 },
            scenario = null
        } = options;
        
        // Apply scenario if specified
        if (scenario && this.scenarios[scenario]) {
            const scenarioConfig = this.scenarios[scenario];
            userCount = scenarioConfig.users;
            clicksPerUser = scenarioConfig.clicks;
        }
        
        this.isRunning = true;
        this.users = [];
        
        console.log(`🚀 Starting simulation:`);
        console.log(`   Users: ${userCount}`);
        console.log(`   Clicks per user: ${clicksPerUser}`);
        console.log(`   Duration: ${duration/1000}s`);
        console.log(`   Component mix:`, componentMix);
        
        // Start monitoring
        this.monitor.startMonitoring(duration);
        
        // Create user simulation promises
        const userPromises = [];
        for (let userId = 0; userId < userCount; userId++) {
            userPromises.push(this.simulateUser(userId, clicksPerUser, {
                duration,
                randomDelay,
                componentMix
            }));
        }
        
        try {
            // Run all users concurrently
            const results = await Promise.allSettled(userPromises);
            
            // Analyze user results
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            console.log(`👥 User simulation completed:`);
            console.log(`   Successful users: ${successful}`);
            console.log(`   Failed users: ${failed}`);
            
            if (failed > 0) {
                console.warn('⚠️  Failed user details:');
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.error(`   User ${index}: ${result.reason}`);
                    }
                });
            }
            
        } catch (error) {
            console.error('💥 Simulation failed:', error);
        } finally {
            this.isRunning = false;
        }
    }
    
    async simulateUser(userId, clicksPerUser, options) {
        const { duration, randomDelay, componentMix } = options;
        const user = { id: userId, clicks: 0, errors: 0 };
        this.users[userId] = user;
        
        const endTime = Date.now() + duration;
        const clickInterval = duration / clicksPerUser;
        
        try {
            while (Date.now() < endTime && user.clicks < clicksPerUser) {
                // Determine which component to click
                const useNotification = Math.random() < componentMix.notification;
                
                try {
                    if (useNotification && window.toggleNotificationPanel) {
                        await this.executeClick('notification', userId);
                    } else if (window.toggleAvatarMenu) {
                        await this.executeClick('avatar', userId);
                    }
                    
                    user.clicks++;
                    
                } catch (error) {
                    user.errors++;
                    console.error(`User ${userId} click error:`, error.message);
                }
                
                // Random or fixed delay between clicks
                if (randomDelay) {
                    const delay = Math.random() * clickInterval * 2;
                    await this.sleep(delay);
                } else {
                    await this.sleep(clickInterval);
                }
            }
            
            return user;
            
        } catch (error) {
            console.error(`User ${userId} simulation failed:`, error);
            throw error;
        }
    }
    
    async executeClick(component, userId) {
        return new Promise((resolve, reject) => {
            try {
                // Add slight random delay to simulate real user behavior
                const humanDelay = Math.random() * 50; // 0-50ms
                
                setTimeout(() => {
                    if (component === 'notification') {
                        window.toggleNotificationPanel();
                    } else if (component === 'avatar') {
                        window.toggleAvatarMenu();
                    }
                    resolve();
                }, humanDelay);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Scenario runners
    async runLightTest() {
        console.log('🟢 Running LIGHT test scenario...');
        await this.simulateUsers(0, 0, { scenario: 'light' });
    }
    
    async runNormalTest() {
        console.log('🟡 Running NORMAL test scenario...');
        await this.simulateUsers(0, 0, { scenario: 'normal' });
    }
    
    async runHeavyTest() {
        console.log('🟠 Running HEAVY test scenario...');
        await this.simulateUsers(0, 0, { scenario: 'heavy' });
    }
    
    async runChaosTest() {
        console.log('🔴 Running CHAOS test scenario...');
        await this.simulateUsers(0, 0, { scenario: 'chaos' });
    }
    
    stop() {
        this.isRunning = false;
        this.monitor.stopMonitoring();
        console.log('⏹️  Simulation stopped');
    }
}

// ========================================
// QUICK TEST FUNCTIONS
// ========================================

// Immediate chaos test - rapid random clicking
function runChaosTest(seconds = 10) {
    console.log(`🔥 Starting ${seconds}s chaos test...`);
    
    let clickCount = 0;
    const chaosInterval = setInterval(() => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                try {
                    if (Math.random() > 0.5 && window.toggleNotificationPanel) {
                        window.toggleNotificationPanel();
                    } else if (window.toggleAvatarMenu) {
                        window.toggleAvatarMenu();
                    }
                    clickCount++;
                } catch (error) {
                    console.error('Chaos test error:', error);
                }
            }, Math.random() * 100);
        }
    }, 50);
    
    setTimeout(() => {
        clearInterval(chaosInterval);
        console.log(`🏁 Chaos test completed: ${clickCount} clicks in ${seconds}s`);
    }, seconds * 1000);
    
    return chaosInterval;
}

// Stress test with specific patterns
function runStressTest(pattern = 'alternating', duration = 30000) {
    console.log(`⚡ Running ${pattern} stress test for ${duration/1000}s...`);
    
    const startTime = Date.now();
    let clickCount = 0;
    
    const patterns = {
        alternating: () => {
            if (clickCount % 2 === 0) {
                window.toggleNotificationPanel && window.toggleNotificationPanel();
            } else {
                window.toggleAvatarMenu && window.toggleAvatarMenu();
            }
        },
        
        burst: () => {
            // 10 rapid clicks then pause
            const burstSize = 10;
            const burstInterval = 1000;
            
            if (clickCount % (burstSize + 10) < burstSize) {
                window.toggleNotificationPanel && window.toggleNotificationPanel();
                window.toggleAvatarMenu && window.toggleAvatarMenu();
            }
        },
        
        random: () => {
            if (Math.random() > 0.5) {
                window.toggleNotificationPanel && window.toggleNotificationPanel();
            } else {
                window.toggleAvatarMenu && window.toggleAvatarMenu();
            }
        }
    };
    
    const testInterval = setInterval(() => {
        if (Date.now() - startTime >= duration) {
            clearInterval(testInterval);
            console.log(`✅ Stress test completed: ${clickCount} clicks`);
            return;
        }
        
        try {
            patterns[pattern]();
            clickCount++;
        } catch (error) {
            console.error('Stress test error:', error);
        }
    }, 50);
    
    return testInterval;
}

// ========================================
// INITIALIZATION AND GLOBAL SETUP
// ========================================

// Create global instances
window.multiUserSimulator = new MultiUserSimulator();
window.perfMonitor = window.multiUserSimulator.monitor;

// Global convenience functions
window.testUI = {
    // Quick tests
    chaos: (seconds = 10) => runChaosTest(seconds),
    stress: (pattern = 'alternating', duration = 30000) => runStressTest(pattern, duration),
    
    // Multi-user scenarios  
    light: () => window.multiUserSimulator.runLightTest(),
    normal: () => window.multiUserSimulator.runNormalTest(),
    heavy: () => window.multiUserSimulator.runHeavyTest(),
    chaosMode: () => window.multiUserSimulator.runChaosTest(),
    
    // Custom simulation
    simulate: (users, clicks, options) => window.multiUserSimulator.simulateUsers(users, clicks, options),
    
    // Control
    stop: () => window.multiUserSimulator.stop(),
    
    // Reporting
    report: () => window.perfMonitor.generateReport(),
    health: () => window.perfMonitor.checkSystemHealth()
};

// ========================================
// CONSOLE INSTRUCTIONS
// ========================================
console.log('\n' + '='.repeat(60));
console.log('🧪 DEBUG QUICK USERS - UI LOAD TESTING TOOLKIT');
console.log('='.repeat(60));
console.log('Available test commands:');
console.log('');
console.log('🔥 QUICK TESTS:');
console.log('   window.testUI.chaos(10)        - 10s chaos clicking');
console.log('   window.testUI.stress()         - 30s alternating pattern');
console.log('');
console.log('👥 MULTI-USER SCENARIOS:');
console.log('   window.testUI.light()          - 50 users, 5 clicks each');
console.log('   window.testUI.normal()         - 100 users, 10 clicks each');  
console.log('   window.testUI.heavy()          - 200 users, 15 clicks each');
console.log('   window.testUI.chaosMode()      - 500 users, 20 clicks each');
console.log('');
console.log('🎯 CUSTOM TESTS:');
console.log('   window.testUI.simulate(100, 10) - Custom user/click count');
console.log('');
console.log('📊 MONITORING:');
console.log('   window.testUI.report()         - Generate detailed report');
console.log('   window.testUI.health()         - Check current system health');
console.log('   window.testUI.stop()           - Stop all running tests');
console.log('');
console.log('Example: window.testUI.normal() // Run standard 100-user test');
console.log('='.repeat(60) + '\n');

// Auto-run a light test if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔬 Development mode detected. Run window.testUI.light() to start...');
}


// Auto-run based on config
// Auto-run based on config
if (TEST_CONFIG.AUTO_RUN) {
    const shouldAutoRun = !TEST_CONFIG.DEVELOPMENT_ONLY || 
                         (window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1');
    
    if (shouldAutoRun) {
        setTimeout(() => {
            if (window.testUI[TEST_CONFIG.AUTO_TEST]) {
                console.log(`🤖 Auto-running ${TEST_CONFIG.AUTO_TEST} test...`);
                window.testUI[TEST_CONFIG.AUTO_TEST]();
            }
        }, 6000); // Run at 6s - AFTER diagnostics finish
    }
}

/* ============================================================
   🔒 DEVTOOLS ANCHORING
   These lines prevent Chrome/Firefox from dropping the script
   ============================================================ */

// Safeguard global
window.__keepQuickDebugUsersDev = true;

// Named anchor function (forces script retention in Sources)
function QuickDebugUsersDevAnchor() {
    console.log("📌 quick-debug-users-dev.js anchored");
    return "anchored";
}
window.quickDebugUsersDevAnchor = QuickDebugUsersDevAnchor;

// Frozen namespace object (pins simulator + monitor in memory)
window.quickDebugUsersDevNS = Object.freeze({
    version: "1.0.0",
    simulator: window.multiUserSimulator,
    monitor: window.perfMonitor,
    testUI: window.testUI
});

// Log once to keep file in Sources
console.log("📌 quick-debug-users-dev.js pinned via quickDebugUsersDevNS");

 // Complete HeavyTesterPanel class with auto-hide functionality
class HeavyTesterPanel {
    constructor(monitor, autoHideDelay = 5000) {
        this.monitor = monitor;
        this.updateInterval = null;
        this.autoHideTimer = null;
        
        this.createPanel();
        this.startLiveUpdates();
        
        // Auto-hide after specified delay (default 5 seconds)
        if (autoHideDelay > 0) {
            this.autoHide(autoHideDelay);
        }
        
        console.log("🔊 Heavy Tester Panel initialized with auto-hide");
    }
    
    createPanel() {
        // Create container panel
        this.panel = document.createElement('div');
        Object.assign(this.panel.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            width: '360px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '12px',
            padding: '12px',
            borderRadius: '8px',
            zIndex: '9999',
            maxHeight: '50vh',
            overflowY: 'auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            opacity: '1',
            transform: 'translateX(0)'
        });

        // Title with close button
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.justifyContent = 'space-between';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.marginBottom = '8px';
        
        const title = document.createElement('h4');
        title.textContent = '🔥 Heavy UI Tester';
        Object.assign(title.style, { 
            margin: '0',
            color: '#ff6b35'
        });
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        Object.assign(closeBtn.style, {
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '0 5px'
        });
        closeBtn.onclick = () => this.hide();
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(closeBtn);

        // Status indicator
        this.statusIndicator = document.createElement('div');
        Object.assign(this.statusIndicator.style, {
            fontSize: '10px',
            color: '#4ade80',
            marginBottom: '5px'
        });
        this.statusIndicator.textContent = '● Running';

        // Output area
        this.output = document.createElement('pre');
        this.output.id = 'heavyTesterOutput';
        Object.assign(this.output.style, {
            margin: '0',
            whiteSpace: 'pre-wrap',
            fontSize: '11px',
            lineHeight: '1.4'
        });

        // Control buttons
        const controls = document.createElement('div');
        controls.style.marginTop = '8px';
        controls.style.display = 'flex';
        controls.style.gap = '5px';
        
        const stopBtn = this.createButton('Stop', () => {
            window.testUI?.stop();
            this.statusIndicator.textContent = '● Stopped';
            this.statusIndicator.style.color = '#ef4444';
        });
        
        const reportBtn = this.createButton('Report', () => {
            window.testUI?.report();
        });
        
        controls.appendChild(stopBtn);
        controls.appendChild(reportBtn);

        // Assemble panel
        this.panel.appendChild(titleContainer);
        this.panel.appendChild(this.statusIndicator);
        this.panel.appendChild(this.output);
        this.panel.appendChild(controls);
        
        // Add to DOM
        document.body.appendChild(this.panel);
    }
    
    createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            padding: '4px 8px',
            fontSize: '10px',
            borderRadius: '4px',
            cursor: 'pointer'
        });
        btn.onclick = onClick;
        
        // Hover effects
        btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.2)';
        btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.1)';
        
        return btn;
    }
    
    log(msg) {
        if (this.output) {
            this.output.textContent = msg;
        } else {
            console.log(msg);
        }
    }
    
    updateLive() {
        if (!this.monitor) return;
        
        const clicks = Array.from(this.monitor.clickCounts.values()).reduce((a, b) => a + b, 0);
        const errors = Array.from(this.monitor.errorCounts.values()).reduce((a, b) => a + b, 0);
        const avgMemory = this.monitor.stateChecks.length > 0
            ? (this.monitor.stateChecks.reduce((s, c) => s + c.memoryMB, 0) / this.monitor.stateChecks.length).toFixed(2)
            : '0.00';
        
        const runtime = this.monitor.startTime 
            ? ((performance.now() - this.monitor.startTime) / 1000).toFixed(1)
            : '0.0';

        this.log(`⏱️  Runtime: ${runtime}s
🖱️  Total Clicks: ${clicks}
❌ Total Errors: ${errors}
💾 Avg Memory: ${avgMemory} MB
⚠️  Stuck States: ${this.monitor.stuckStateCount || 0}
🔥 Memory Warnings: ${this.monitor.memoryWarnings || 0}

📊 Component Breakdown:`);
        
        // Add component breakdown
        if (this.monitor.clickCounts.size > 0) {
            let breakdown = '';
            this.monitor.clickCounts.forEach((count, component) => {
                const componentErrors = this.monitor.errorCounts.get(component) || 0;
                breakdown += `   ${component}: ${count} clicks, ${componentErrors} errors\n`;
            });
            this.output.textContent += '\n' + breakdown;
        }
    }
    
    startLiveUpdates() {
        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateLive();
        }, 1000);
    }
    
    stopLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    autoHide(delay = 5000) {
        console.log(`⏰ Panel will auto-hide in ${delay/1000} seconds...`);
        
        this.autoHideTimer = setTimeout(() => {
            this.hide();
        }, delay);
    }
    
    cancelAutoHide() {
        if (this.autoHideTimer) {
            clearTimeout(this.autoHideTimer);
            this.autoHideTimer = null;
            console.log('⏰ Auto-hide cancelled');
        }
    }
    
    hide() {
        if (!this.panel) return;
        
        console.log('👋 Hiding Heavy Tester Panel...');
        
        // Stop updates
        this.stopLiveUpdates();
        
        // Cancel auto-hide timer if running
        this.cancelAutoHide();
        
        // Animate out
        this.panel.style.opacity = '0';
        this.panel.style.transform = 'translateX(100%)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (this.panel && this.panel.parentNode) {
                this.panel.parentNode.removeChild(this.panel);
                this.panel = null;
                console.log('🗑️  Heavy Tester Panel removed');
            }
        }, 1000);
    }
    
    show() {
        if (this.panel) {
            this.panel.style.opacity = '1';
            this.panel.style.transform = 'translateX(0)';
            this.startLiveUpdates();
        }
    }
    
    // Extend auto-hide time (useful for keeping panel open longer)
    extendAutoHide(additionalTime = 5000) {
        this.cancelAutoHide();
        this.autoHide(additionalTime);
        console.log(`⏰ Auto-hide extended by ${additionalTime/1000} seconds`);
    }
    
    destroy() {
        this.stopLiveUpdates();
        this.cancelAutoHide();
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
    }
}
// Paste the HeavyTesterPanel class first (from your document), then run this:

// STEP 1: First, destroy any existing panel
if (window.heavyTesterPanel) {
    console.log("🗑️ Removing existing Heavy Tester Panel...");
    
    // Try multiple removal methods
    try {
        if (window.heavyTesterPanel.destroy) {
            window.heavyTesterPanel.destroy();
        } else if (window.heavyTesterPanel.panel) {
            window.heavyTesterPanel.panel.remove();
        }
    } catch (e) {
        console.log("Standard removal failed, trying force removal...");
    }
    
    // Force remove any existing panels
    document.querySelectorAll('div').forEach(div => {
        const text = div.textContent || '';
        if (text.includes('Heavy UI Tester') || text.includes('Heavy Tester') ||
            (text.includes('Clicks:') && text.includes('Errors:'))) {
            div.remove();
            console.log("Force removed existing panel");
        }
    });
    
    delete window.heavyTesterPanel;
}

// STEP 2: Create new panel with auto-hide
if (window.perfMonitor || window.multiUserSimulator?.monitor) {
    const monitor = window.perfMonitor || window.multiUserSimulator.monitor;
    
    console.log("✨ Creating new Heavy Tester Panel with 5-second auto-hide...");
    window.heavyTesterPanel = new HeavyTesterPanel(monitor, 5000);
    
    console.log("🔄 Heavy Tester Panel upgraded with auto-hide functionality");
    console.log("⏰ Panel will automatically disappear in 5 seconds");
} else {
    console.warn("❌ Monitor not found. Cannot create Heavy Tester Panel.");
    
    // Fallback: Just remove any existing panels
    setTimeout(() => {
        document.querySelectorAll('div').forEach(div => {
            const text = div.textContent || '';
            const style = div.getAttribute('style') || '';
            
            if ((text.includes('Heavy') && text.includes('Tester')) ||
                (text.includes('Clicks:') && text.includes('Errors:')) ||
                (style.includes('position: fixed') && style.includes('z-index: 9999'))) {
                div.remove();
                console.log("🗑️ Fallback: Removed test panel");
            }
        });
    }, 5000);
}
// Usage examples:
// 
// 1. Create panel that auto-hides after 5 seconds (default)
// const panel = new HeavyTesterPanel(window.perfMonitor);
//
// 2. Create panel that auto-hides after 10 seconds
// const panel = new HeavyTesterPanel(window.perfMonitor, 10000);
//
// 3. Create panel that never auto-hides
// const panel = new HeavyTesterPanel(window.perfMonitor, 0);
//
// 4. Control the panel
// panel.hide();           // Hide immediately
// panel.show();           // Show again
// panel.cancelAutoHide(); // Cancel auto-hide
// panel.extendAutoHide(5000); // Extend auto-hide by 5 seconds
// panel.destroy();        // Completely remove and cleanup

// Integration with existing system
if (window.multiUserSimulator && window.perfMonitor) {
    // Replace existing panel with new auto-hiding version
    if (window.heavyTesterPanel) {
        window.heavyTesterPanel.destroy?.();
    }
    
    window.heavyTesterPanel = new HeavyTesterPanel(window.perfMonitor, 5000);
    console.log("🔄 Heavy Tester Panel upgraded with auto-hide functionality");
}   
// Attach after MultiUserSimulator is created
if (window.multiUserSimulator) {
    window.heavyTesterPanel = new HeavyTesterPanel(window.perfMonitor);

    // Update panel every second
    setInterval(() => {
        window.heavyTesterPanel.updateLive();
    }, 1000);
}

// --- PANEL INTEGRATION ---
if (window.multiUserSimulator) {
    window.heavyTesterPanel = new HeavyTesterPanel(window.perfMonitor);
    setInterval(() => {
        window.heavyTesterPanel.updateLive();
    }, 1000);
}

// quick-debug-appointments.js - Adds Appointment/Calendar testing to Heavy Tester
(function() {
    if (!window.multiUserSimulator) {
        console.warn("⚠️ MultiUserSimulator not found. Load quick-debug-users-dev.js first.");
        return;
    }

    const monitor = window.perfMonitor;

    // Component finders
    function getAppointmentPanel() {
        return document.querySelector('#appointment-section') || document.querySelector('.appointment-panel');
    }

    function getCalendar() {
        return document.querySelector('#calendar') || document.querySelector('.calendar-widget');
    }

    // Simulated toggles
    window.toggleAppointmentPanel = function() {
        const panel = getAppointmentPanel();
        if (panel) {
            panel.style.display = (panel.style.display === 'none' ? 'block' : 'none');
            monitor.trackClick('appointment');
        } else {
            monitor.trackError('appointment', new Error('Appointment panel not found'));
        }
    };

    window.toggleCalendar = function() {
        const cal = getCalendar();
        if (cal) {
            cal.style.display = (cal.style.display === 'none' ? 'block' : 'none');
            monitor.trackClick('calendar');
        } else {
            monitor.trackError('calendar', new Error('Calendar not found'));
        }
    };

    // Extend simulator to add new mix
    const sim = window.multiUserSimulator;
    sim.originalSimulateUser = sim.simulateUser;

    sim.simulateUser = async function(userId, clicksPerUser, options) {
        const { duration, randomDelay, componentMix } = options;
        const extendedMix = { notification: 0.3, avatar: 0.3, appointment: 0.2, calendar: 0.2, ...componentMix };

        const user = { id: userId, clicks: 0, errors: 0 };
        const endTime = Date.now() + duration;
        const clickInterval = duration / clicksPerUser;

        while (Date.now() < endTime && user.clicks < clicksPerUser) {
            const rand = Math.random();
            try {
                if (rand < extendedMix.notification && window.toggleNotificationPanel) {
                    await this.executeClick('notification', userId);
                } else if (rand < extendedMix.notification + extendedMix.avatar && window.toggleAvatarMenu) {
                    await this.executeClick('avatar', userId);
                } else if (rand < extendedMix.notification + extendedMix.avatar + extendedMix.appointment) {
                    window.toggleAppointmentPanel();
                } else {
                    window.toggleCalendar();
                }
                user.clicks++;
            } catch (err) {
                user.errors++;
                monitor.trackError('user', err, { userId });
            }
            await this.sleep(randomDelay ? Math.random() * clickInterval * 2 : clickInterval);
        }
        return user;
    };

    console.log("📅 Appointment & Calendar testing added to Heavy Tester");
})();

//Run instant tests:
//window.testUI.chaos(10)     // 10-second chaos test
//window.testUI.normal()      // 100 users standard test
//window.testUI.heavy()    
//window.testUI.report()



//debugger; // forces Chrome to stop with this file open
}
