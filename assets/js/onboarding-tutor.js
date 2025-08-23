// ============================================================================
// ONBOARDING-TUTOR.JS — a clean tutor-only wrapper around your main logic
// Keeps TutorState structure, progress calc, storage, analytics, milestones,
// autosave init, and debug helper exactly as before.
// ============================================================================

(function () {
  if (window.OnboardingTutorLoaded) return;
  window.OnboardingTutorLoaded = true;
  window.ONBOARDING_MAIN_LOADED = true; // legacy flag for safety

  // ----- TutorState (same fields & defaults) -----
  window.TutorState = window.TutorState || {};
  TutorState.currentProgress = TutorState.currentProgress || 25;
  TutorState.agreementSigned = TutorState.agreementSigned || false;
  TutorState.credentialsUploaded = TutorState.credentialsUploaded || false;
  TutorState.identityVerified = TutorState.identityVerified || false;
  TutorState.scheduleSet = TutorState.scheduleSet || false;
  TutorState.resourcesUploaded = TutorState.resourcesUploaded || false;
  TutorState.premiumActive = TutorState.premiumActive || false;

  TutorState.agreementStepProgress   = TutorState.agreementStepProgress   || { signature: false, interview: false };
  TutorState.credentialsStepProgress = TutorState.credentialsStepProgress || { cv: false, certificates: false, dbs: false, references: false };
  TutorState.identityStepProgress    = TutorState.identityStepProgress    || { video: false, idDocument: false };
  TutorState.scheduleStepProgress    = TutorState.scheduleStepProgress    || { availability: false, timezone: false };
  TutorState.resourcesStepProgress   = TutorState.resourcesStepProgress   || { resources: false };

  TutorState.uploadedResources = TutorState.uploadedResources || [];
  TutorState.resourceCategories = TutorState.resourceCategories || {
    worksheets: [], lessonPlans: [], presentations: [], assessments: [], examples: [], games: [], other: []
  };
  TutorState.maxResources = TutorState.maxResources || 10;

  TutorState.availableTools = TutorState.availableTools || [
    { name: 'Interactive Whiteboard', icon: 'fas fa-chalkboard', status: 'Available', description: 'Draw, write, and solve problems collaboratively' },
    { name: 'Screen Sharing',         icon: 'fas fa-desktop',    status: 'Available', description: 'Share your screen for demonstrations' },
    { name: 'Calculator',             icon: 'fas fa-calculator', status: 'Available', description: 'Built-in scientific calculator' },
    { name: 'Graphing Tool',          icon: 'fas fa-chart-line', status: 'Available', description: 'Create and share mathematical graphs' },
    { name: 'File Sharing',           icon: 'fas fa-file-share', status: 'Available', description: 'Share documents and resources' },
    { name: 'Recording',              icon: 'fas fa-video',      status: 'Premium',   description: 'Record sessions for student review' }
  ];
  // (same as your original) :contentReference[oaicite:21]{index=21}

  // ----- Progress (same formula & UI updates) -----
  function updateProgress() {
    const totalSteps = 7;
    let completed = 1; // welcome complete
    if (TutorState.agreementSigned)     completed++;
    if (TutorState.credentialsUploaded) completed++;
    if (TutorState.identityVerified)    completed++;
    if (TutorState.scheduleSet)         completed++;
    if (TutorState.resourcesUploaded)   completed++;
    if (TutorState.premiumActive)       completed++;
    TutorState.currentProgress = Math.round((completed / totalSteps) * 100);

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    const badge = document.getElementById('statusBadge');
    if (fill) { fill.style.width = TutorState.currentProgress + '%'; fill.style.transition = 'width .8s ease-in-out'; }
    if (text) text.textContent = TutorState.currentProgress + '%';
    if (badge) {
      if (TutorState.currentProgress === 100) { badge.textContent = 'Profile Complete'; badge.className = 'status-badge status-complete'; }
      else if (TutorState.currentProgress >= 75) { badge.textContent = 'Almost Ready'; badge.className = 'status-badge status-in-progress'; }
      else if (TutorState.currentProgress >= 50) { badge.textContent = 'In Progress';   badge.className = 'status-badge status-in-progress'; }
      else { badge.textContent = 'New Tutor';     badge.className = 'status-badge status-new'; }
    }
    checkMilestones();
  }
  // (copied from your file) :contentReference[oaicite:22]{index=22}

  // ----- Storage (same structure & key) -----
  function saveProgressToStorage() {
    const data = {
      currentProgress: TutorState.currentProgress,
      agreementSigned: TutorState.agreementSigned,
      credentialsUploaded: TutorState.credentialsUploaded,
      identityVerified: TutorState.identityVerified,
      scheduleSet: TutorState.scheduleSet,
      resourcesUploaded: TutorState.resourcesUploaded,
      premiumActive: TutorState.premiumActive,
      agreementStepProgress: TutorState.agreementStepProgress,
      credentialsStepProgress: TutorState.credentialsStepProgress,
      identityStepProgress: TutorState.identityStepProgress,
      scheduleStepProgress: TutorState.scheduleStepProgress,
      resourcesStepProgress: TutorState.resourcesStepProgress,
      uploadedResources: TutorState.uploadedResources,
      resourceCategories: TutorState.resourceCategories
    };
    try { localStorage.setItem('tutorOnboardingProgress', JSON.stringify(data)); } catch (e) { console.warn('Save failed', e); }
  }

  function loadProgressFromStorage() {
    try {
      const raw = localStorage.getItem('tutorOnboardingProgress'); if (!raw) return false;
      const d = JSON.parse(raw);
      TutorState.currentProgress = d.currentProgress ?? 25;
      TutorState.agreementSigned = !!d.agreementSigned;
      TutorState.credentialsUploaded = !!d.credentialsUploaded;
      TutorState.identityVerified = !!d.identityVerified;
      TutorState.scheduleSet = !!d.scheduleSet;
      TutorState.resourcesUploaded = !!d.resourcesUploaded;
      TutorState.premiumActive = !!d.premiumActive;
      TutorState.agreementStepProgress   = d.agreementStepProgress   || { signature:false, interview:false };
      TutorState.credentialsStepProgress = d.credentialsStepProgress || { cv:false, certificates:false, dbs:false, references:false };
      TutorState.identityStepProgress    = d.identityStepProgress    || { video:false, idDocument:false };
      TutorState.scheduleStepProgress    = d.scheduleStepProgress    || { availability:false, timezone:false };
      TutorState.resourcesStepProgress   = d.resourcesStepProgress   || { resources:false };
      TutorState.uploadedResources = d.uploadedResources || [];
      TutorState.resourceCategories = d.resourceCategories || { worksheets:[], lessonPlans:[], presentations:[], assessments:[], examples:[], games:[], other:[] };
      return true;
    } catch (e) { console.warn('Load failed', e); return false; }
  }
  // :contentReference[oaicite:23]{index=23} :contentReference[oaicite:24]{index=24}

  // ----- Analytics + milestones (same behavior) -----
  function trackTutorInteraction(action, details = {}) {
    const data = { action, details, timestamp: new Date().toISOString(), progress: TutorState.currentProgress, session: Date.now() };
    try {
      const arr = JSON.parse(localStorage.getItem('tutorInteractions') || '[]'); arr.push(data);
      if (arr.length > 100) arr.splice(0, arr.length - 100);
      localStorage.setItem('tutorInteractions', JSON.stringify(arr));
    } catch {}
    console.log('Tutor interaction tracked:', data);
  }
  // :contentReference[oaicite:25]{index=25}

  function checkMilestones() {
    const milestones = [
      { progress: 25, message: 'Welcome! Your onboarding journey has begun 🎉' },
      { progress: 40, message: 'Great progress! You\'re building a strong foundation 💪' },
      { progress: 60, message: 'Halfway there! Your profile is taking shape 🚀' },
      { progress: 80, message: 'Almost complete! You\'re nearly ready to start tutoring 🎯' },
      { progress: 100, message: 'Congratulations! Your profile is complete and ready! 🏆' }
    ];
    window.triggerMilestones?.(TutorState.currentProgress, milestones, 'tutor');
  }
  // (uses core’s generic trigger with the same messages) :contentReference[oaicite:26]{index=26}

  // ----- Global exports for legacy card modules -----
  window.updateProgress = updateProgress;
  window.saveProgressToStorage = saveProgressToStorage;
  window.trackInteraction = trackTutorInteraction;

  // Back-compat accessors (same pattern)
  Object.defineProperty(window, 'currentProgress', { get: () => TutorState.currentProgress, set: v => (TutorState.currentProgress = v) });
  ['agreementSigned','credentialsUploaded','identityVerified','scheduleSet','resourcesUploaded','premiumActive']
    .forEach(k => Object.defineProperty(window, k, { get: () => TutorState[k], set: v => (TutorState[k] = v) }));
  window.agreementStepProgress   = TutorState.agreementStepProgress;
  window.credentialsStepProgress = TutorState.credentialsStepProgress;
  window.identityStepProgress    = TutorState.identityStepProgress;
  window.scheduleStepProgress    = TutorState.scheduleStepProgress;
  window.resourcesStepProgress   = TutorState.resourcesStepProgress;
  window.uploadedResources       = TutorState.uploadedResources;
  window.resourceCategories      = TutorState.resourceCategories;
  window.availableTools          = TutorState.availableTools;
  window.maxResources            = TutorState.maxResources;
  // (same exports list) :contentReference[oaicite:27]{index=27}

  // ----- Init -----
  document.addEventListener('DOMContentLoaded', () => {
    const loaded = loadProgressFromStorage();
    if (loaded) showNotification('Welcome back! Your progress has been restored.', 'info');
    else showNotification('Welcome to your tutoring journey! Let\'s get you set up.', 'success'); // :contentReference[oaicite:28]{index=28}
    updateProgress();

    // autosave (every 30s) + initial analytics
    setInterval(saveProgressToStorage, 30000); // :contentReference[oaicite:29]{index=29}
    trackTutorInteraction('dashboard_initialized', { progress: TutorState.currentProgress, hasStoredProgress: loaded }); // :contentReference[oaicite:30]{index=30}
    console.log('📘 Tutor onboarding initialized');
  });

  // ----- Debug helper -----
  window.debugOnboarding = function () {
    return {
      progress: TutorState.currentProgress,
      steps: {
        agreement: TutorState.agreementSigned,
        credentials: TutorState.credentialsUploaded,
        identity: TutorState.identityVerified,
        schedule: TutorState.scheduleSet,
        resources: TutorState.resourcesUploaded,
        premium: TutorState.premiumActive
      },
      stepProgress: {
        agreement: TutorState.agreementStepProgress,
        credentials: TutorState.credentialsStepProgress,
        identity: TutorState.identityStepProgress,
        schedule: TutorState.scheduleStepProgress,
        resources: TutorState.resourcesStepProgress
      },
      fullState: TutorState
    };
  };
  console.log('🔧 Debug: type debugOnboarding() to inspect tutor state'); // :contentReference[oaicite:31]{index=31}
})();
