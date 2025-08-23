// ==========================
// UIStateManager.js (DOM-sync-safe)
// ==========================

class UIStateManager {
    constructor() {
        this.state = {
            notificationOpen: false,
            avatarOpen: false,
        };

        this.notificationPanel = document.getElementById('notificationPanel');
        this.notificationBell = document.getElementById('notificationBell');
        this.avatarMenu = document.querySelector('.avatar-menu');
        this.avatarTrigger = document.getElementById('avatarButton') ||
                             document.querySelector('.avatar-container');

        this._bindEvents();
        this._syncStateWithDOM(); // initial sync
    }

    // ====== STATE SYNC ======
    _syncStateWithDOM() {
        if (this.notificationPanel) {
            this.state.notificationOpen = this.notificationPanel.classList.contains('active');
        }
        if (this.avatarMenu) {
            this.state.avatarOpen = this.avatarMenu.classList.contains('show');
        }
    }

    // ====== NOTIFICATION PANEL ======
    openNotification() {
        if (!this.notificationPanel) return;
        this.closeAvatar();
        this.notificationPanel.classList.add('active');
        this.state.notificationOpen = true;
        if (window.notificationCenter) window.notificationCenter.isOpen = true;
    }

    closeNotification() {
        if (!this.notificationPanel) return;
        this.notificationPanel.classList.remove('active');
        this.state.notificationOpen = false;
        if (window.notificationCenter) window.notificationCenter.isOpen = false;
    }

    toggleNotification(e) {
        if (e) e.stopPropagation();
        this._syncStateWithDOM(); // sync before toggling
        if (this.state.notificationOpen) {
            this.closeNotification();
        } else {
            this.openNotification();
        }
    }

    // ====== AVATAR MENU ======
    openAvatar() {
        if (!this.avatarMenu) return;
        this.closeNotification();
        this.avatarMenu.classList.add('show');
        this.state.avatarOpen = true;
    }

    closeAvatar() {
        if (!this.avatarMenu) return;
        this.avatarMenu.classList.remove('show');
        this.state.avatarOpen = false;
    }

    toggleAvatar(e) {
        if (e) e.stopPropagation();
        this._syncStateWithDOM(); // sync before toggling
        if (this.state.avatarOpen) {
            this.closeAvatar();
        } else {
            this.openAvatar();
        }
    }

    // ====== EVENT BINDINGS ======
    _bindEvents() {
        if (this.notificationBell) {
            this.notificationBell.addEventListener('click', (e) => this.toggleNotification(e));
        }
        if (this.avatarTrigger) {
            this.avatarTrigger.addEventListener('click', (e) => this.toggleAvatar(e));
        }

        document.addEventListener('click', (e) => {
            const clickedNotif = this.notificationPanel?.contains(e.target);
            const clickedBell = this.notificationBell?.contains(e.target);
            const clickedAvatar = this.avatarMenu?.contains(e.target);
            const clickedTrigger = this.avatarTrigger?.contains(e.target);

            // Close notification if open and click outside
            this._syncStateWithDOM();
            if (this.state.notificationOpen && !clickedNotif && !clickedBell) {
                this.closeNotification();
            }

            // Close avatar if open and click outside
            if (this.state.avatarOpen && !clickedAvatar && !clickedTrigger) {
                this.closeAvatar();
            }
        });
    }
}

// Initialize globally
window.uiStateManager = new UIStateManager();
