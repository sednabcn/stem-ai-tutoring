// ============================================================================
// ONBOARDING-CORE.JS  — shared utilities for both Tutor & Student flows
// (pulled from your onboarding-main.js: notifications, storage helpers,
// modal handlers, animations, keyboard handlers, autosave hooks, etc.)
// ============================================================================

(function () {
  if (window.OnboardingCoreLoaded) return;
  window.OnboardingCoreLoaded = true;

  // ---------- Notifications (basic + advanced with actions) ----------
  function showNotification(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `notification notification-${type}`;
    el.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 15px 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
      color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000; font-weight: 500; max-width: 350px; animation: slideIn 0.3s ease-out;
    `;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
        <button style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;margin-left:auto;" onclick="this.closest('.notification')?.remove()">&times;</button>
      </div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
  // (based on your original implementation) :contentReference[oaicite:10]{index=10}

  function showAdvancedNotification(message, type = 'info', duration = 5000, actions = []) {
    const colors = {
      success: '#4CAF50', error: '#f44336', warning: '#FF9800', info: '#2196F3',
      premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.style.cssText = `
      position: fixed; right: 20px; padding: 15px 20px; color: white;
      border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 10000;
      font-weight: 500; max-width: 350px; animation: slideIn 0.3s ease-out; transform: translateX(100%);
      background: ${colors[type] || colors.info};
    `;

    const content = document.createElement('div');
    content.style.cssText = 'display:flex;align-items:center;gap:10px;';
    content.innerHTML = `
      <span>${{success:'✅',error:'❌',warning:'⚠️',info:'ℹ️',premium:'⭐'}[type] || 'ℹ️'}</span>
      <span style="flex:1">${message}</span>
      <button style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;margin-left:auto;">&times;</button>
    `;
    content.lastElementChild.onclick = () => removeNotification(n);
    n.appendChild(content);

    if (actions?.length) {
      const row = document.createElement('div');
      row.style.cssText = 'margin-top:10px;display:flex;gap:10px;';
      actions.forEach(a => {
        const b = document.createElement('button');
        b.textContent = a.text;
        b.style.cssText = 'background:rgba(255,255,255,0.2);border:none;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:.9rem;';
        b.onclick = () => { try { a.callback?.(); } finally { removeNotification(n); } };
        row.appendChild(b);
      });
      n.appendChild(row);
    }

    const existing = document.querySelectorAll('.notification');
    const topOffset = 20 + (existing.length * 80);
    n.style.top = `${topOffset}px`;
    document.body.appendChild(n);
    setTimeout(() => { n.style.transform = 'translateX(0)'; }, 10);

    if (duration > 0) setTimeout(() => removeNotification(n), duration);
    return n;

    function removeNotification(node) {
      node.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => { node.remove(); repositionNotifications(); }, 300);
    }
    function repositionNotifications() {
      document.querySelectorAll('.notification').forEach((node, i) => {
        node.style.top = `${20 + (i * 80)}px`;
      });
    }
  }
  // (ported with the same behavior & styling) :contentReference[oaicite:11]{index=11}

  // Quick toast alias (compatible with student flow)
  function showToast(msg, type = 'success') { showNotification(msg, type === 'error' ? 'error' : 'success'); }

  // ---------- Modals ----------
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // ---------- Loading spinner ----------
  function showLoading() { document.getElementById('loadingSpinner')?.style && (document.getElementById('loadingSpinner').style.display = 'flex'); }
  function hideLoading() { document.getElementById('loadingSpinner')?.style && (document.getElementById('loadingSpinner').style.display = 'none'); }

  // ---------- Card status update ----------
  function updateCardStatus(cardId, status, statusText) {
    const card = document.getElementById(cardId); if (!card) return;
    const indicator = card.querySelector('.status-indicator'); if (!indicator) return;
    const dot = indicator.querySelector('.status-dot'); const span = indicator.querySelector('span');
    indicator.classList.remove('status-complete', 'status-incomplete', 'status-in-progress');
    indicator.classList.add(`status-${status}`); if (span) span.textContent = statusText;
    const colors = { 'complete': '#4CAF50', 'in-progress': '#FF9800', 'incomplete': '#f44336' };
    if (dot && colors[status]) dot.style.background = colors[status];
  }
  // (same logic as your helper) :contentReference[oaicite:12]{index=12}

  // ---------- Utils used by cards ----------
  function simulateFileUpload(_fileName, cb) {
    return new Promise((resolve) => setTimeout(() => { cb?.(); resolve(true); }, Math.random() * 2000 + 1000));
  }
  function validateForm(formData) {
    const errors = [];
    Object.keys(formData).forEach(k => { if (!formData[k] || formData[k].trim() === '') errors.push(`${k} is required`); });
    return { isValid: errors.length === 0, errors };
  }
  // :contentReference[oaicite:13]{index=13} :contentReference[oaicite:14]{index=14}

  // ---------- Tracking (generic) ----------
  function trackInteraction(action, details = {}, role = 'generic', progress = null) {
    const p = progress ?? (role === 'tutor' ? window.TutorState?.currentProgress : window.StudentState?.currentProgress);
    const data = { action, details, role, timestamp: new Date().toISOString(), progress: p, session: Date.now() };
    try {
      const key = 'onboardingInteractions';
      const arr = JSON.parse(localStorage.getItem(key) || '[]'); arr.push(data);
      if (arr.length > 100) arr.splice(0, arr.length - 100);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch {}
    // dev log
    console.log('Interaction tracked:', data);
  }
  // (tutor-specific version exists in your file; this generic one complements it) :contentReference[oaicite:15]{index=15}

  // ---------- Milestones (generic store per role) ----------
  function triggerMilestones(progress, milestones, role = 'generic') {
    try {
      const key = `achievedMilestones:${role}`;
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      milestones.forEach(m => {
        if (progress >= m.progress && !saved.includes(m.progress)) {
          showAdvancedNotification(m.message, 'success', 7000);
          saved.push(m.progress);
          trackInteraction('milestone_achieved', { progress: m.progress }, role, progress);
        }
      });
      localStorage.setItem(key, JSON.stringify(saved));
    } catch (e) { console.warn('Milestones error', e); }
  }
  // (mirrors tutor milestone logic) :contentReference[oaicite:16]{index=16}

  // ---------- Global event handlers ----------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal[style*="display: block"]').forEach(m => m.style.display = 'none'); // :contentReference[oaicite:17]{index=17}
    if (e.ctrlKey && e.key === 's') { // save
      e.preventDefault();
      if (typeof window.saveProgressToStorage === 'function') {
        window.saveProgressToStorage();
        showNotification('Progress saved!', 'success');
      }
    }
  });
  document.addEventListener('click', (e) => { if (e.target.classList?.contains('modal')) e.target.style.display = 'none'; }); // :contentReference[oaicite:18]{index=18}
  window.addEventListener('beforeunload', () => { if (typeof window.saveProgressToStorage === 'function') window.saveProgressToStorage(); }); // :contentReference[oaicite:19]{index=19}

  // ---------- CSS animations / hover (once) ----------
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes slideOut { from{transform:translateX(0);opacity:1} to{transform:translateX(100%);opacity:0} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
    .category-box, .upload-box, .tool-card, .student-card {
      cursor:pointer; transition:all .3s ease; border:1px solid #e0e0e0; border-radius:8px; padding:20px; text-align:center; background:white;
    }
    .category-box:hover, .upload-box:hover, .tool-card:hover, .student-card:hover {
      transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); border-color:#4CAF50;
    }
    .status-premium { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:white; }
    .modal{ backdrop-filter: blur(5px); background: rgba(0,0,0,.5); }
    .modal-content{ animation: fadeIn .3s ease-out; }
    .btn{ transition:all .2s ease; } .btn:hover{ transform: translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.15); }
  `;
  document.head.appendChild(style); // :contentReference[oaicite:20]{index=20}

  // ---------- Exports ----------
  window.showNotification = showNotification;
  window.showAdvancedNotification = showAdvancedNotification;
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
  window.updateCardStatus = updateCardStatus;
  window.simulateFileUpload = simulateFileUpload;
  window.validateForm = validateForm;
  window.trackInteractionGeneric = trackInteraction;
  window.triggerMilestones = triggerMilestones;

  console.log('✅ Onboarding core loaded');
})();
