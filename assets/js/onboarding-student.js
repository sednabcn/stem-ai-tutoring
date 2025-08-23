// ============================================================================
// ONBOARDING-STUDENT.JS — student flow with persistent state, milestones,
// progress bar + status badge, actions from your pasted code,
// and the same UX helpers from core.
// ============================================================================

(function () {
  if (window.OnboardingStudentLoaded) return;
  window.OnboardingStudentLoaded = true;

  // ----- Student state -----
  window.StudentState = window.StudentState || {
    currentProgress: 0,
    agreementAccepted: false,
    profileCreated: false,
    identityVerified: false,
    registrationSubmitted: false,
    subscriptionChosen: false,
    browsedTutors: false,
    resourcesAccessed: false,
    analyticsViewed: false,
    premiumActivated: false
  };

  // ----- Progress (9 steps incl. visit) -----
  function computeCompleted() {
    let count = 1; // visiting page
    const S = StudentState;
    ['agreementAccepted','profileCreated','identityVerified','registrationSubmitted','subscriptionChosen','browsedTutors','resourcesAccessed','analyticsViewed','premiumActivated']
      .forEach(k => { if (S[k]) count++; });
    return Math.min(count, 9);
  }

  function updateStudentProgress() {
    const total = 10; // 1 visit + 9 actions (we clamp above)
    const completed = computeCompleted();
    const pct = Math.round((completed / total) * 100);
    StudentState.currentProgress = pct;

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const badge = document.getElementById('statusBadge');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = pct + '%';

    if (badge) {
      if (pct < 50) { badge.textContent = 'New Student';         badge.className = 'status-badge status-new'; }
      else if (pct < 100) { badge.textContent = 'Getting Started'; badge.className = 'status-badge status-new'; }
      else { badge.textContent = 'Ready to Learn';                 badge.className = 'status-badge status-complete'; }
    }

    checkStudentMilestones();
  }

  function markStepComplete(cardId, stateKey = null) {
    const card = document.getElementById(cardId);
    const status = card?.querySelector('.status-indicator');
    if (status) {
      status.className = 'status-indicator status-complete';
      status.innerHTML = '<div class="status-dot"></div><span>Complete</span>';
    }
    if (stateKey) StudentState[stateKey] = true;
    updateStudentProgress();
    showToast('Step completed successfully!', 'success');
    saveProgressToStorage();
  }

  // ----- Student actions (mapped from your snippet) -----
  window.reviewAgreement    = () => openModal('agreementModal');
  window.downloadPolicy     = () => showToast('Policy PDF download started', 'success');
  window.acceptAgreement    = () => {
    const a = document.getElementById('agreeData')?.checked;
    const b = document.getElementById('agreeSafeguarding')?.checked;
    if (!a || !b) return showToast('Please accept both agreements to continue', 'error');
    showLoading();
    setTimeout(() => { hideLoading(); closeModal('agreementModal'); markStepComplete('agreementCard', 'agreementAccepted'); }, 1500);
  };

  window.createProfile      = () => { showToast('Profile creation started - redirecting to form', 'success'); setTimeout(() => markStepComplete('profileCard', 'profileCreated'), 2000); };
  window.viewSample         = () => showToast('Sample profile opened in new tab', 'success');
  window.verifyAge          = () => { showToast('Age verification process started', 'success'); setTimeout(() => markStepComplete('identityCard', 'identityVerified'), 2000); };
  window.parentConsent      = () => showToast('Parent consent form sent via email', 'success');

  window.startRegistration  = () => openModal('registrationModal');
  window.viewPricing        = () => showToast('Pricing information displayed', 'success');
  window.submitRegistration = () => {
    const fullName = document.getElementById('fullName')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const educationLevel = document.getElementById('educationLevel')?.value || '';
    const frequency = document.getElementById('frequency')?.value || '';
    const v = validateForm({ fullName, email, educationLevel, frequency });
    if (!v.isValid) return showToast('Please fill in all required fields', 'error');
    showLoading();
    setTimeout(() => { hideLoading(); closeModal('registrationModal'); markStepComplete('registrationCard', 'registrationSubmitted'); }, 2000);
  };

  window.choosePlan         = () => { showToast('Redirecting to subscription plans', 'success'); setTimeout(() => markStepComplete('subscriptionCard', 'subscriptionChosen'), 1500); };
  window.comparePlans       = () => showToast('Plan comparison opened', 'success');
  window.browseTutors       = () => { showToast('Opening tutor directory', 'success'); setTimeout(() => markStepComplete('tutorCard', 'browsedTutors'), 1500); };
  window.scheduleDemo       = () => showToast('Demo session booking opened', 'success');
  window.accessResources    = () => { showToast('Learning resources accessed', 'success'); setTimeout(() => markStepComplete('resourcesCard', 'resourcesAccessed'), 1000); };
  window.viewProgress       = () => { showToast('Progress dashboard opened', 'success'); setTimeout(() => markStepComplete('analyticsCard', 'analyticsViewed'), 1000); };

  window.viewPremiumDetails = () => openModal('premiumModal');
  window.startPremiumTrial  = () => { showToast('Premium trial activated! Welcome to premium features.', 'success'); setTimeout(() => markStepComplete('premiumCard', 'premiumActivated'), 1500); };
  window.activatePremium    = () => {
    showLoading();
    setTimeout(() => { hideLoading(); closeModal('premiumModal'); markStepComplete('premiumCard', 'premiumActivated'); showToast('Premium trial activated! Enjoy 7 days free.', 'success'); }, 2000);
  };

  // Back to home
  document.getElementById('back-home-student')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave? Your progress will be saved.')) {
      showToast('Progress saved. Returning to home.', 'success');
      setTimeout(() => { window.location.href = '/'; }, 1500);
    }
  });

  // ----- Storage (student key) -----
  function saveProgressToStorage() {
    try { localStorage.setItem('studentOnboardingProgress', JSON.stringify(StudentState)); } catch (e) { console.warn('Student save failed', e); }
  }
  function loadProgressFromStorage() {
    try {
      const raw = localStorage.getItem('studentOnboardingProgress'); if (!raw) return false;
      const d = JSON.parse(raw);
      Object.assign(StudentState, d || {});
      return true;
    } catch (e) { console.warn('Student load failed', e); return false; }
  }
  window.saveProgressToStorage = saveProgressToStorage; // so Ctrl+S & beforeunload work

  // ----- Milestones (student flavour) -----
  function checkStudentMilestones() {
    const milestones = [
      { progress: 20, message: 'Nice start! Your student setup has begun 🎉' },
      { progress: 50, message: 'Halfway to your first lesson! 📚' },
      { progress: 80, message: 'Almost there — just a couple more steps! 💫' },
      { progress: 100, message: 'Ready to learn! Enjoy your lessons 🎓' }
    ];
    window.triggerMilestones?.(StudentState.currentProgress, milestones, 'student');
  }

  // ----- Init -----
  document.addEventListener('DOMContentLoaded', () => {
    const restored = loadProgressFromStorage();
    showNotification(restored ? 'Welcome back! Your progress has been restored.' : 'Welcome! Let’s get you ready to learn.', restored ? 'info' : 'success');

    // Initial progress + some “ready” statuses exactly like your snippet
    updateStudentProgress();
    setTimeout(() => {
      const ts = document.querySelector('#tutorCard .status-indicator');
      const rs = document.querySelector('#resourcesCard .status-indicator');
      const as = document.querySelector('#analyticsCard .status-indicator');
      if (ts) { ts.className = 'status-indicator status-complete'; ts.innerHTML = '<div class="status-dot"></div><span>Ready to Browse</span>'; }
      if (rs) { rs.className = 'status-indicator status-complete'; rs.innerHTML = '<div class="status-dot"></div><span>Available</span>'; }
      if (as) { as.className = 'status-indicator status-complete'; as.innerHTML = '<div class="status-dot"></div><span>Ready</span>'; }
    }, 500);

    // Hover effects on cards (matches your UX)
    document.querySelectorAll('.card').forEach(c => {
      c.addEventListener('mouseenter', function(){ this.style.transform = 'translateY(-10px) scale(1.02)'; });
      c.addEventListener('mouseleave', function(){ this.style.transform = 'translateY(0) scale(1)'; });
    });

    // Autosave & analytics
    setInterval(saveProgressToStorage, 30000);
    window.trackInteractionGeneric?.('dashboard_initialized', { role: 'student', progress: StudentState.currentProgress }, 'student', StudentState.currentProgress);

    console.log('🎓 Student onboarding initialized');
  });

  // ----- Export student updater for templates if needed -----
  window.updateStudentProgress = updateStudentProgress;

  // ----- Debug helper -----
  window.debugStudentOnboarding = () => JSON.parse(JSON.stringify(StudentState));
})();
