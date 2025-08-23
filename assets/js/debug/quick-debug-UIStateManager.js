if (window.ENV?.TEST_MODE) {
  console.log("🧪 Debug logic active");
// ==========================
// quick-debug-UIStateManager.js (FINAL COMPLETE VERSION)
// ==========================

// 1️⃣ Initialize UIStateManager
window.uiStateManager = new UIStateManager();

// 2️⃣ Initialize testUI if missing
window.testUI = window.testUI || {};

// 3️⃣ Track metrics
window.testUI.metrics = {
    totalClicks: 0,
    notificationOpened: 0,
    notificationClosed: 0,
    avatarOpened: 0,
    avatarClosed: 0,
    outsideClicks: 0,
    stuckNotifications: 0,
    stuckAvatars: 0
};

// 4️⃣ Patch simulate functions
window.testUI.simulate = {
    clickNotification(times = 1) {
        const bell = document.getElementById('notificationBell');
        if (!bell) return;
        for (let i = 0; i < times; i++) {
            bell.click();
            window.testUI.metrics.totalClicks++;
            if (window.uiStateManager.state.notificationOpen) {
                window.testUI.metrics.notificationOpened++;
            } else {
                window.testUI.metrics.notificationClosed++;
            }
            // Check stuck state
            if ((window.uiStateManager.state.notificationOpen && !document.getElementById('notificationPanel').classList.contains('active')) ||
                (!window.uiStateManager.state.notificationOpen && document.getElementById('notificationPanel').classList.contains('active'))) {
                window.testUI.metrics.stuckNotifications++;
            }
        }
    },
    clickAvatar(times = 1) {
        const trigger = document.getElementById('avatarButton') ||
                        document.querySelector('.avatar-container');
        const menu = document.querySelector('.avatar-menu');
        if (!trigger || !menu) return;
        for (let i = 0; i < times; i++) {
            trigger.click();
            window.testUI.metrics.totalClicks++;
            if (window.uiStateManager.state.avatarOpen) {
                window.testUI.metrics.avatarOpened++;
            } else {
                window.testUI.metrics.avatarClosed++;
            }
            // Check stuck state
            if ((window.uiStateManager.state.avatarOpen && !menu.classList.contains('show')) ||
                (!window.uiStateManager.state.avatarOpen && menu.classList.contains('show'))) {
                window.testUI.metrics.stuckAvatars++;
            }
        }
    },
    clickOutside(times = 1) {
        for (let i = 0; i < times; i++) {
            const evt = new MouseEvent('click', { bubbles: true });
            document.body.dispatchEvent(evt);
            window.testUI.metrics.outsideClicks++;
        }
    },
    report() {
        console.table({
            "Total Clicks": window.testUI.metrics.totalClicks,
            "Notification Opened": window.testUI.metrics.notificationOpened,
            "Notification Closed": window.testUI.metrics.notificationClosed,
            "Avatar Opened": window.testUI.metrics.avatarOpened,
            "Avatar Closed": window.testUI.metrics.avatarClosed,
            "Outside Clicks": window.testUI.metrics.outsideClicks,
            "Stuck Notifications": window.testUI.metrics.stuckNotifications,
            "Stuck Avatars": window.testUI.metrics.stuckAvatars
        });
    },
    stressTest(iterations = 100) {
        const actions = ['clickNotification', 'clickAvatar', 'clickOutside'];
        for (let i = 0; i < iterations; i++) {
            const action = actions[Math.floor(Math.random() * actions.length)];
            const times = Math.floor(Math.random() * 3) + 1; // 1–3 clicks per action
            this[action](times);
        }
        this.report();
    }
};

// 5️⃣ Run the automated stress test
window.testUI.simulate.stressTest(1000); // 200 random iterations for heavy load
}
