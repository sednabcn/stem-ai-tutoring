// document-manager.js - Enhanced for Developer Mode Integration with Full Student Role Support
class DocumentManager {
  constructor() {
    // Initialize role first
    this.currentRole = 'tutor'; // Default role
    this.initialized = false;
    this.timers = new Set();

   // Your document paths - using root directory structure
this.documents = {
  tutor: {
    agreements: {
      'freelance_math_tutor_agreement.pdf': {
        path: '/documents/tutor/agreements/freelance_math_tutor_agreement.pdf',
        type: 'application/pdf',
        name: 'Freelance Math Tutor Agreement (English)',
        required: true,
        category: 'legal',
        description: 'Main agreement document for tutoring services'
      },
      'freelance_math_tutor_agreement_bilingual.docx': {
        path: '/documents/tutor/agreements/freelance_math_tutor_agreement_bilingual.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: 'Freelance Math Tutor Agreement (Bilingual)',
        required: false,
        category: 'legal',
        description: 'Bilingual version of the tutor agreement'
      },
      'freelance_math_tutor_agreement.docx': {
        path: '/documents/tutor/agreements/freelance_math_tutor_agreement.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: 'Freelance Math Tutor Agreement (Original)',
        required: false,
        category: 'legal',
        description: 'Original Word format of the tutor agreement'
      }
    },
    forms: {
	'tutor_application_form.html': {
        path: '/documents/tutor/forms/tutor_application_form.html',
        type: 'text/html',
        name: 'Tutor Application Form',
        required: true,
        category: 'application',
        description: 'Complete application form for prospective tutors'
      },
      'tutor_profile_pdf_form.html': {
        path: '/documents/tutor/forms/tutor_profile_pdf_form.html',
        type: 'text/pdf/html',
        name: 'Tutor Profile Setup Form',
        required: true,
        category: 'profile',
        description: 'Form to set up tutor profile and preferences'
      },
      'confidentiality_agreement_pdf_form.html': {
        path: '/documents/tutor/forms/confidentiality_agreement_pdf_form.html',
        type: 'application/pdf/html',
        name: 'Confidentiality Form',
        required: true,
        category: 'legal',
        description: 'Form for tutors to agree to confidentiality terms'
      }
    },
    packages: {
      'math_tutor_recruitment_package.zip': {
        path: '/documents/tutor/packages/math_tutor_recruitment_package.zip',
        type: 'application/zip',
        name: 'Complete Recruitment Package',
        required: false,
        category: 'resources',
        description: 'Complete package with all tutor onboarding materials'
      },
      'payment_package_pdf.html': {
        path: '/documents/tutor/packages/payment_package_pdf.html',
        type: 'application/pdf/html',
        name: 'Payment Package',
        required: true,
        category: 'resources',
        description: 'Details of payment terms, rates, and schedules'
      }
    },
    resources: {
      'tutor_handbook.pdf': {
        path: '/documents/tutor/resources/tutor_handbook.pdf',
        type: 'application/pdf',
        name: 'Tutor Handbook',
        required: true,
        category: 'training',
        description: 'Comprehensive guide for new tutors'
      },
      'curriculum_guide.pdf': {
        path: '/documents/tutor/resources/curriculum_guide.pdf',
        type: 'application/pdf',
        name: 'Curriculum Guide',
        required: true,
        category: 'training',
        description: 'Detailed curriculum and teaching guidelines'
      },
      'requirements_online_tutors.pdf': {
        path: '/documents/tutor/resources/requirements_online_tutors.pdf',
        type: 'application/pdf',
        name: 'Requirements for Online Tutors',
        required: true,
        category: 'requirements',
        description: 'Minimal requirements for tutors delivering online lessons'
      },
      'requirements_face_to_face_tutors.pdf': {
        path: '/documents/tutor/resources/requirements_face_to_face_tutors.pdf',
        type: 'application/pdf',
        name: 'Requirements for Face-to-Face Tutors',
        required: true,
        category: 'requirements',
        description: 'Minimal requirements for in-person tutoring sessions'
      },
      'requirements_ai_tutors.pdf': {
        path: '/documents/tutor/resources/requirements_ai_tutors.pdf',
        type: 'application/pdf',
        name: 'Requirements for AI Tutors',
        required: true,
        category: 'requirements',
        description: 'Minimal requirements for tutors using AI-assisted methods'
      },
      'requirements_home_based_tutors.pdf': {
        path: '/documents/tutor/resources/requirements_home_based_tutors.pdf',
        type: 'application/pdf',
        name: 'Requirements for Home-Based Tutors',
        required: true,
        category: 'requirements',
        description: 'Minimal requirements for tutors offering lessons from home'
      },
      'requirements_tutors_companies.pdf': {
        path: '/documents/tutor/resources/requirements_tutors_companies.pdf',
        type: 'application/pdf',
        name: 'Requirements for Tutors to Companies',
        required: true,
        category: 'requirements',
        description: 'Minimal requirements for tutors providing training to companies'
      }
    }
  },
 student: {
    agreements: {
      'student_terms_of_service.pdf': {
        path: '/documents/student/agreements/student_terms_of_service.pdf',
        type: 'application/pdf',
        name: 'Student Terms of Service',
        required: true,
        category: 'legal',
        description: 'Terms and conditions for student platform usage'
      },
      'privacy_policy.pdf': {
        path: '/documents/student/agreements/privacy_policy.pdf',
        type: 'application/pdf',
        name: 'Privacy Policy',
        required: true,
        category: 'legal',
        description: 'How we protect and use student data'
      },
      'parent_consent_form.pdf': {
        path: '/documents/student/agreements/parent_consent_form.pdf',
        type: 'application/pdf',
        name: 'Parent Consent Form (Under 18)',
        required: false,
        category: 'legal',
        description: 'Required for students under 18 years old'
      },
      'data_protection_agreement.pdf': {
        path: '/documents/student/agreements/data_protection_agreement.pdf',
        type: 'application/pdf',
        name: 'Data Protection Agreement',
        required: true,
        category: 'legal',
        description: 'Agreement ensuring compliance with data protection laws'
      },
      'safeguarding_agreement.pdf': {
        path: '/documents/student/agreements/safeguarding_agreement.pdf',
        type: 'application/pdf',
        name: 'Safeguarding Agreement',
        required: true,
        category: 'legal',
        description: 'Commitment to safeguarding and child protection standards'
      },
      'code_of_conduct.pdf': {
        path: '/documents/student/agreements/code_of_conduct.pdf',
        type: 'application/pdf',
        name: 'Code of Conduct',
        required: true,
        category: 'legal',
        description: 'Expected behavior and rules for students'
      }
    },
    forms: {
      'student_registration_form.html': {
        path: '/documents/student/forms/student_registration_form.html',
        type: 'text/html',
        name: 'Student Registration Form',
        required: true,
        category: 'registration',
        description: 'Initial registration form for new students'
      },
      'learning_preferences_assessment.pdf': {
        path: '/documents/student/forms/learning_preferences_assessment.pdf',
        type: 'application/pdf',
        name: 'Learning Preferences Assessment',
        required: true,
        category: 'assessment',
        description: 'Assessment to understand student learning style and needs'
      },
      'academic_goal_setting_worksheet.pdf': {
        path: '/documents/student/forms/academic_goal_setting_worksheet.pdf',
        type: 'application/pdf',
        name: 'Academic Goal Setting Worksheet',
        required: false,
        category: 'planning',
        description: 'Worksheet for setting and tracking learning goals'
      }
    },
    packages: {
      'Forms_Pack.zip': {
        path: '/documents/student/packages/Forms_Pack.zip',
        type: 'application/zip',
        name: 'Forms Pack',
        required: false,
        category: 'resources',
        description: 'Bundle of student forms in one package'
      },
      'student_legal_agreements.zip': {
        path: '/documents/student/packages/student_legal_agreements.zip',
        type: 'application/zip',
        name: 'Student Legal Agreements',
        required: false,
        category: 'resources',
        description: 'All student legal agreements in a single archive'
      },
      'ZIP3_Extra_Useful_Docs.zip': {
        path: '/documents/student/packages/ZIP3_Extra_Useful_Docs.zip',
        type: 'application/zip',
        name: 'Extra Useful Documents',
        required: false,
        category: 'resources',
        description: 'Additional student resources and guides'
      }
    },
    resources: {
      'welcome_letter.pdf': {
        path: '/documents/student/resources/welcome_letter.pdf',
        type: 'application/pdf',
        name: 'Welcome Letter',
        required: true,
        category: 'guide',
        description: 'Introduction and welcome note for students'
      },
      'Quick_Start_Guide.pdf': {
        path: '/documents/student/resources/Quick_Start_Guide.pdf',
        type: 'application/pdf',
        name: 'Quick Start Guide',
        required: true,
        category: 'guide',
        description: 'Step-by-step guide to getting started on the platform'
      },
      'safeguarding_policy_summary.pdf': {
        path: '/documents/student/resources/safeguarding_policy_summary.pdf',
        type: 'application/pdf',
        name: 'Safeguarding Policy Summary',
        required: false,
        category: 'guide',
        description: 'Summary of safeguarding policy for quick reference'
      },
      'Study_Planner.xlsx': {
        path: '/documents/student/resources/Study_Planner.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: 'Study Planner (Excel)',
        required: false,
        category: 'planning',
        description: 'Excel sheet to help students plan their study schedule'
      },
      'Study_Planner.ods': {
        path: '/documents/student/resources/Study_Planner.ods',
        type: 'application/vnd.oasis.opendocument.spreadsheet',
        name: 'Study Planner (LibreOffice)',
        required: false,
        category: 'planning',
        description: 'OpenDocument format study planner for LibreOffice users'
      }
    }
  }
};

this.init();

      
  // Initialize the document manager
  async init() {
    if (this.initialized) {
      console.log('📚 DocumentManager already initialized');
      return;
    }
    
    try {
      console.log('📚 Initializing DocumentManager...');
      
      // Set up role detection
      this.detectUserRole();
      
      // Validate document structure
      this.validateDocumentStructure();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.initialized = true;
      console.log('✅ DocumentManager initialized successfully');
      
    } catch (error) {
      console.error('❌ DocumentManager initialization failed:', error);
      throw error;
    }
  }

  // Enhanced role management
  setRole(role) {
    const validRoles = ['student', 'tutor'];
    
    if (!validRoles.includes(role)) {
      console.warn(`🚨 Invalid role: ${role}. Defaulting to tutor.`);
      this.currentRole = 'tutor';
      return;
    }
    
    const previousRole = this.currentRole;
    this.currentRole = role;
    
    console.log(`👤 Role changed: ${previousRole} → ${this.currentRole}`);
    
    // Dispatch role change event
    window.dispatchEvent(new CustomEvent('roleChanged', {
      detail: { 
        previous: previousRole, 
        current: this.currentRole,
        availableDocuments: this.getAllRoleDocuments()
      }
    }));
    
    // Update UI if needed
    this.updateRoleBasedUI();
  }

  detectUserRole() {
    // Try to detect role from various sources
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    
    if (roleFromUrl) {
      this.setRole(roleFromUrl);
      return;
    }
    
    // Check session data
    const sessionRole = sessionStorage.getItem('userRole');
    if (sessionRole) {
      this.setRole(sessionRole);
      return;
    }
    
    // Check page context
    const bodyClass = document.body.className;
    if (bodyClass.includes('student')) {
      this.setRole('student');
      return;
    }
    
    // Default to tutor
    console.log('👤 No role detected, defaulting to tutor');
    this.setRole('tutor');
  }

  getCurrentRole() {
    return this.currentRole;
  }

  getRoleDocuments(category) {
    if (!this.currentRole) {
      console.warn('DocumentManager: role not set, defaulting to tutor.');
      this.currentRole = 'tutor';
    }
    
    const roleDocuments = this.documents[this.currentRole];
    
    if (!roleDocuments) {
      console.error(`No documents found for role: ${this.currentRole}`);
      return {};
    }
    
    return category ? (roleDocuments[category] || {}) : roleDocuments;
  }

  getAllRoleDocuments() {
    return this.documents[this.currentRole] || {};
  }

  getAvailableCategories() {
    const roleDocuments = this.getAllRoleDocuments();
    return Object.keys(roleDocuments);
  }

  getRequiredDocuments() {
    const allDocs = this.getAllRoleDocuments();
    const required = {};
    
    Object.keys(allDocs).forEach(category => {
      Object.keys(allDocs[category]).forEach(key => {
        if (allDocs[category][key].required) {
          if (!required[category]) required[category] = {};
          required[category][key] = allDocs[category][key];
        }
      });
    });
    
    return required;
  }

  // Enhanced document URL generation with root directory paths
  getDocumentUrl(documentKey, category = 'agreements') {
    const doc = this.getRoleDocuments(category)?.[documentKey];
    
    if (!doc) {
      console.error(`Document not found: ${documentKey} in ${category} for role: ${this.currentRole}`);
      return null;
    }
    
    // Use smart environment detection
    if (window.ENV?.TEST_MODE === true) {
      // Developer/Test mode - use root directory paths
      console.log(`🔧 Dev Mode: Loading document from root path: ${doc.path}`);
      return doc.path; // e.g., '/documents/tutor/agreements/file.pdf'
    } else {
      // Production mode - use Firebase Storage URLs
      const firebaseProject = window.ENV?.FIREBASE_CONFIG?.projectId || 'math-tutor-prod';
      // Remove leading slash for Firebase encoding
      const cleanPath = doc.path.startsWith('/') ? doc.path.substring(1) : doc.path;
      const encodedPath = encodeURIComponent(cleanPath);
      const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseProject}/o/${encodedPath}?alt=media`;
      console.log(`🔥 Prod Mode: Loading document from Firebase: ${url}`);
      return url;
    }
  }

  // Enhanced download with role-specific logic
  async downloadDocument(documentKey, category = 'agreements') {
    const doc = this.getRoleDocuments(category)?.[documentKey];
    const url = this.getDocumentUrl(documentKey, category);
    
    if (!url || !doc) {
      this.showNotification(`Document not found: ${documentKey}`, 'error');
      return false;
    }

    try {
      // In developer mode, check if file exists
      if (window.ENV?.TEST_MODE === true) {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          this.showNotification(
            `Document not found: ${doc.name}. Please check the file exists at: ${url}`, 
            'error'
          );
          return false;
        }
      }

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      link.target = '_blank';
      
      // For developer mode, add additional attributes
      if (window.ENV?.TEST_MODE === true) {
        link.rel = 'noopener noreferrer';
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success notification
      this.showNotification(`✅ ${doc.name} downloaded successfully!`, 'success');
      
      // Track the download
      this.trackInteraction('document_download', {
        document: documentKey,
        category: category,
        role: this.currentRole,
        mode: window.ENV?.TEST_MODE ? 'development' : 'production'
      });
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      this.showNotification('❌ Download failed. Please check your internet connection.', 'error');
      return false;
    }
  }

  // Enhanced preview with role-specific content
  async previewDocument(documentKey, category = 'agreements') {
    const doc = this.getRoleDocuments(category)?.[documentKey];
    const url = this.getDocumentUrl(documentKey, category);
    
    if (!url || !doc) {
      this.showNotification(`Document not found: ${documentKey}`, 'error');
      return;
    }

    // In developer mode, check if file exists first
    if (window.ENV?.TEST_MODE === true) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          this.showNotification(
            `📁 Document not found: ${doc.name}. Please place the file at: ${url}`, 
            'error'
          );
          return;
        }
      } catch (error) {
        this.showNotification(
          `🚨 Cannot access document: ${doc.name}. Please check the file path: ${url}`, 
          'error'
        );
        return;
      }
    }

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'modal document-preview-modal';
    modal.style.display = 'block';
    
    // Role-specific modal styling
    const roleIcon = this.currentRole === 'student' ? '🎓' : '👨‍🏫';
    const roleColor = this.currentRole === 'student' ? '#4CAF50' : '#2196F3';
    
    modal.innerHTML = `
      <div class="modal-content document-preview" style="max-width: 900px; height: 80vh;">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee; background: ${roleColor}; color: white;">
          <div>
            <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
              ${roleIcon} ${doc.name}
              <span style="font-size: 0.7em; opacity: 0.8; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 12px;">
                ${this.currentRole.toUpperCase()}
              </span>
            </h3>
            <p style="margin: 5px 0 0 0; font-size: 0.9em; opacity: 0.9;">${doc.description}</p>
          </div>
          <span class="close" onclick="this.closest('.modal').remove()" style="font-size: 24px; cursor: pointer; padding: 5px; border-radius: 50%; background: rgba(255,255,255,0.2);">&times;</span>
        </div>
        <div class="document-viewer" style="flex: 1; padding: 20px; overflow: auto;">
          ${this.getDocumentViewer(doc, url)}
        </div>
        <div class="modal-actions" style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: space-between;">
          <div class="document-meta" style="font-size: 0.85em; color: #666; display: flex; align-items: center; gap: 15px;">
            <span>📂 ${category}</span>
            <span>🏷️ ${doc.category}</span>
            ${doc.required ? '<span style="color: #f44336;">⚠️ Required</span>' : '<span style="color: #4CAF50;">📋 Optional</span>'}
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
            <button class="btn" onclick="documentManager.downloadDocument('${documentKey}', '${category}')" style="background: ${roleColor}; color: white;">
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Track the preview
    this.trackInteraction('document_preview', {
      document: documentKey,
      category: category,
      role: this.currentRole,
      mode: window.ENV?.TEST_MODE ? 'development' : 'production'
    });
  }

  // Enhanced document viewer with role context
  getDocumentViewer(doc, url) {
    const roleContext = this.currentRole === 'student' ? 
      'As a student, this document contains important information about your learning experience.' :
      'As a tutor, this document contains essential information for your role.';
      
    const envInfo = window.ENV?.TEST_MODE ? 
      `<div style="background: #e3f2fd; padding: 12px; margin-bottom: 15px; border-radius: 6px; font-size: 0.9rem; border-left: 4px solid #2196F3;">
        <strong>🧪 ${window.ENV.IS_LOCAL ? 'Local Dev' : 'Test'} Mode:</strong> 
        Loading from: <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 3px;">${url}</code><br>
        <small>Host: ${window.ENV.HOSTNAME} | Force Test: ${window.ENV.FORCE_TEST ? 'Yes' : 'No'} | Role: ${this.currentRole}</small>
      </div>` : '';

    const roleInfo = `
      <div style="background: ${this.currentRole === 'student' ? '#e8f5e8' : '#e3f2fd'}; padding: 12px; margin-bottom: 15px; border-radius: 6px; font-size: 0.9rem; border-left: 4px solid ${this.currentRole === 'student' ? '#4CAF50' : '#2196F3'};">
        <strong>${this.currentRole === 'student' ? '🎓' : '👨‍🏫'} ${this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1)} Document:</strong> 
        ${roleContext}
      </div>
    `;

    switch (doc.type) {
      case 'application/pdf':
        return `
          ${envInfo}
          ${roleInfo}
          <iframe src="${url}" width="100%" height="500px" style="border: none; border-radius: 4px;"></iframe>
          <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
            <i class="fas fa-info-circle"></i> If the PDF doesn't load, try downloading it directly.
            ${window.ENV?.TEST_MODE ? '<br><strong>Dev Tip:</strong> Make sure the PDF file exists in your documents/ folder.' : ''}
          </p>
        `;
      
      case 'text/html':
        return `
          ${envInfo}
          ${roleInfo}
          <iframe src="${url}" width="100%" height="500px" style="border: 1px solid #ddd; border-radius: 4px;"></iframe>
        `;
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return `
          ${envInfo}
          ${roleInfo}
          <div class="document-info" style="text-align: center; padding: 40px;">
            <i class="fas fa-file-word" style="font-size: 48px; color: #2B579A; margin-bottom: 15px;"></i>
            <h4>${doc.name}</h4>
            <p>This is a Microsoft Word document. Click download to view the full content.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left;">
              <strong>File Details:</strong><br>
              📄 Type: Word Document (.docx)<br>
              🔗 ${window.ENV?.TEST_MODE ? 'Local Path' : 'Firebase URL'}: <code style="word-break: break-all; font-size: 0.8rem;">${url}</code><br>
              👤 Role: ${this.currentRole}<br>
              💾 Category: ${doc.category}<br>
              🏠 Environment: ${window.ENV?.TEST_MODE ? (window.ENV.IS_LOCAL ? 'Local Development' : 'Test Mode') : 'Production'}
            </div>
          </div>
        `;
      
      case 'application/zip':
        return `
          ${envInfo}
          ${roleInfo}
          <div class="document-info" style="text-align: center; padding: 40px;">
            <i class="fas fa-file-archive" style="font-size: 48px; color: #FF6B35; margin-bottom: 15px;"></i>
            <h4>${doc.name}</h4>
            <p>This is a compressed archive file. Download to extract the contents.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left;">
              <strong>Archive Contents:</strong><br>
              ${this.getArchiveContents(doc)}<br>
              <strong>Role:</strong> ${this.currentRole}<br>
              <strong>Environment:</strong> ${window.ENV?.TEST_MODE ? (window.ENV.IS_LOCAL ? 'Local Development' : 'Test Mode') : 'Production'}
            </div>
          </div>
        `;
      
      default:
        return `
          ${envInfo}
          ${roleInfo}
          <div class="document-info" style="text-align: center; padding: 40px;">
            <i class="fas fa-file" style="font-size: 48px; color: #666; margin-bottom: 15px;"></i>
            <h4>${doc.name}</h4>
            <p>Preview not available for this file type. Click download to access the file.</p>
          </div>
        `;
    }
  }

  getArchiveContents(doc) {
    if (this.currentRole === 'student') {
      return `
        📋 Student orientation materials<br>
        📚 Platform usage guides<br>
        📝 Registration templates<br>
        🎯 Goal-setting resources<br>
        📖 Study technique guides
      `;
    } else {
      return `
        📋 Complete recruitment package<br>
        📄 All agreement documents<br>
        📝 Application forms<br>
        📚 Training resources<br>
        🎯 Curriculum guidelines
      `;
    }
  }

  // Validate document structure
  validateDocumentStructure() {
    const issues = [];
    
    Object.keys(this.documents).forEach(role => {
      if (!this.documents[role] || typeof this.documents[role] !== 'object') {
        issues.push(`Invalid structure for role: ${role}`);
        return;
      }
      
      Object.keys(this.documents[role]).forEach(category => {
        const docs = this.documents[role][category];
        
        Object.keys(docs).forEach(key => {
          const doc = docs[key];
          
          if (!doc.path || !doc.type || !doc.name) {
            issues.push(`Missing required fields for ${role}/${category}/${key}`);
          }
          
          if (doc.required === undefined) {
            console.warn(`Missing 'required' field for ${role}/${category}/${key}, defaulting to false`);
            doc.required = false;
          }
        });
      });
    });
    
    if (issues.length > 0) {
      console.error('🚨 Document structure validation failed:', issues);
      throw new Error(`Document structure validation failed: ${issues.join(', ')}`);
    }
    
    console.log('✅ Document structure validation passed');
  }

  // Set up event listeners
  setupEventListeners() {
    // Listen for role changes
    window.addEventListener('roleChanged', (event) => {
      console.log('👤 Role change detected:', event.detail);
      this.updateRoleBasedUI();
    });
    
    // Listen for session changes
    window.addEventListener('sessionChanged', (event) => {
      const sessionData = event.detail;
      if (sessionData.role && sessionData.role !== this.currentRole) {
        this.setRole(sessionData.role);
      }
    });
  }

  // Update UI based on current role
  updateRoleBasedUI() {
    // Update document lists in the UI
    this.updateDocumentLists();
    
    // Update role indicators
    this.updateRoleIndicators();
    
    // Update navigation if needed
    this.updateRoleNavigation();
  }

  updateDocumentLists() {
    // Update any document list elements in the DOM
    const documentLists = document.querySelectorAll('[data-document-list]');
    
    documentLists.forEach(listElement => {
      const category = listElement.dataset.documentList;
      const docs = this.getRoleDocuments(category);
      
      if (Object.keys(docs).length > 0) {
        this.renderDocumentList(listElement, docs, category);
      }
    });
  }

  updateRoleIndicators() {
    // Update role indicators in the UI
    const roleIndicators = document.querySelectorAll('[data-role-indicator]');
    
    roleIndicators.forEach(indicator => {
      const roleIcon = this.currentRole === 'student' ? '🎓' : '👨‍🏫';
      const roleName = this.currentRole.charAt(0).toUpperCase() + this.currentRole.slice(1);
      
      indicator.innerHTML = `${roleIcon} ${roleName}`;
      indicator.className = `role-indicator role-${this.currentRole}`;
    });
  }

  updateRoleNavigation() {
    // Update navigation based on role
    const navElements = document.querySelectorAll('[data-role-nav]');
    
    navElements.forEach(nav => {
      if (nav.dataset.roleNav === this.currentRole) {
        nav.style.display = 'block';
      } else {
        nav.style.display = 'none';
      }
    });
  }

  renderDocumentList(container, docs, category) {
    const docEntries = Object.keys(docs).map(key => {
      const doc = docs[key];
      const requiredBadge = doc.required ? 
        '<span class="badge badge-required" style="background: #f44336; color: white; font-size: 0.7em; padding: 2px 6px; border-radius: 10px; margin-left: 8px;">Required</span>' : 
        '<span class="badge badge-optional" style="background: #4CAF50; color: white; font-size: 0.7em; padding: 2px 6px; border-radius: 10px; margin-left: 8px;">Optional</span>';
      
      return `
        <div class="document-item" style="padding: 12px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: between; align-items: center;">
            <div style="flex: 1;">
              <h5 style="margin: 0 0 4px 0; display: flex; align-items: center;">
                📄 ${doc.name}
                ${requiredBadge}
              </h5>
              <p style="margin: 0; font-size: 0.9em; color: #666;">${doc.description}</p>
            </div>
            <div style="display: flex; gap: 8px; margin-left: 15px;">
              <button class="btn btn-sm btn-outline" onclick="documentManager.previewDocument('${key}', '${category}')" 
                      style="padding: 6px 12px; font-size: 0.8em;">
                👁️ Preview
              </button>
              <button class="btn btn-sm" onclick="documentManager.downloadDocument('${key}', '${category}')"
                      style="padding: 6px 12px; font-size: 0.8em;">
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = docEntries;
  }

  // List all available documents with role context
  listDocuments() {
    console.log(`📋 Available Documents for ${this.currentRole.toUpperCase()}:`);
    
    const roleDocuments = this.getAllRoleDocuments();
    
    Object.keys(roleDocuments).forEach(category => {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      Object.keys(roleDocuments[category]).forEach(key => {
        const doc = roleDocuments[category][key];
        const url = this.getDocumentUrl(key, category);
        console.log(`  📄 ${doc.name}`);
        console.log(`     Key: ${key}`);
        console.log(`     Path: ${url}`);
        console.log(`     Required: ${doc.required ? '✅' : '❌'}`);
        console.log(`     Category: ${doc.category}`);
        console.log(`     Description: ${doc.description}`);
      });
    });
    
    // Show summary
    const totalDocs = this.getTotalDocumentCount();
    const requiredDocs = this.getRequiredDocumentCount();
    console.log(`\n📊 Summary: ${totalDocs.total} total documents (${requiredDocs} required, ${totalDocs.total - requiredDocs} optional)`);
  }

  getTotalDocumentCount() {
    const roleDocuments = this.getAllRoleDocuments();
    let total = 0;
    
    Object.keys(roleDocuments).forEach(category => {
      total += Object.keys(roleDocuments[category]).length;
    });
    
    return { total, role: this.currentRole };
  }

  getRequiredDocumentCount() {
    const roleDocuments = this.getAllRoleDocuments();
    let required = 0;
    
    Object.keys(roleDocuments).forEach(category => {
      Object.keys(roleDocuments[category]).forEach(key => {
        if (roleDocuments[category][key].required) {
          required++;
        }
      });
    });
    
    return required;
  }

  // Test all document links with role-specific validation
  async testAllDocuments() {
    console.log(`🧪 Testing all document links for ${this.currentRole.toUpperCase()} role...`);
    let results = { success: 0, failed: 0, details: [], role: this.currentRole };

    const roleDocuments = this.getAllRoleDocuments();
    
    for (const category in roleDocuments) {
      for (const key in roleDocuments[category]) {
        const doc = roleDocuments[category][key];
        const url = this.getDocumentUrl(key, category);
        
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            results.success++;
            results.details.push({ 
              doc: doc.name, 
              status: '✅', 
              url, 
              category,
              required: doc.required,
              role: this.currentRole
            });
          } else {
            results.failed++;
            results.details.push({ 
              doc: doc.name, 
              status: '❌', 
              url, 
              category,
              required: doc.required,
              role: this.currentRole,
              error: `HTTP ${response.status}` 
            });
          }
        } catch (error) {
          results.failed++;
          results.details.push({ 
            doc: doc.name, 
            status: '❌', 
            url, 
            category,
            required: doc.required,
            role: this.currentRole,
            error: error.message 
          });
        }
      }
    }

    console.log(`\n📊 Test Results for ${this.currentRole.toUpperCase()}: ${results.success} success, ${results.failed} failed`);
    
    // Group by category for better reporting
    const byCategory = {};
    results.details.forEach(result => {
      if (!byCategory[result.category]) byCategory[result.category] = [];
      byCategory[result.category].push(result);
    });
    
    Object.keys(byCategory).forEach(category => {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      byCategory[category].forEach(result => {
        const requiredText = result.required ? ' (REQUIRED)' : ' (optional)';
        console.log(`${result.status} ${result.doc}${requiredText}`);
        if (result.error) console.log(`    Error: ${result.error}`);
        console.log(`    URL: ${result.url}`);
      });
    });

    return results;
  }

  // Role switching with validation
  switchRole(newRole) {
    if (!['student', 'tutor'].includes(newRole)) {
      console.error(`🚨 Invalid role: ${newRole}`);
      return false;
    }
    
    if (newRole === this.currentRole) {
      console.log(`👤 Already in ${newRole} role`);
      return true;
    }
    
    console.log(`🔄 Switching role: ${this.currentRole} → ${newRole}`);
    
    // Store previous role for potential rollback
    const previousRole = this.currentRole;
    
    try {
      this.setRole(newRole);
      
      // Save to session storage
      sessionStorage.setItem('userRole', newRole);
      
      // Show confirmation
      this.showNotification(
        `✅ Switched to ${newRole} role. Documents updated.`, 
        'success'
      );
      
      return true;
      
    } catch (error) {
      console.error('❌ Role switch failed:', error);
      this.setRole(previousRole); // Rollback
      this.showNotification('❌ Failed to switch roles', 'error');
      return false;
    }
  }

  // Get role-specific welcome package
  getWelcomePackage() {
    if (this.currentRole === 'student') {
      return this.getRoleDocuments('packages')['student_welcome_package.zip'];
    } else {
      return this.getRoleDocuments('packages')['math_tutor_recruitment_package.zip'];
    }
  }

  // Show notification helper
  showNotification(message, type = 'info', duration = 5000) {
    if (window.showNotification) {
      window.showNotification(message, type, duration);
    } else {
      console.log(`🔔 Notification [${type.toUpperCase()}]: ${message}`);
    }
  }

  // Track interaction helper
  trackInteraction(action, data = {}) {
    if (window.trackInteraction) {
      window.trackInteraction(action, { ...data, documentManagerRole: this.currentRole });
    } else {
      console.log(`📊 Track Interaction: ${action}`, { ...data, documentManagerRole: this.currentRole });
    }
  }

  // Cleanup method
  cleanup() {
    console.log('🧹 Cleaning up DocumentManager...');
    
    // Clear timers
    this.timers.forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.timers.clear();
    
    // Remove event listeners
    window.removeEventListener('roleChanged', this.updateRoleBasedUI);
    window.removeEventListener('sessionChanged', this.handleSessionChange);
    
    // Reset state
    this.initialized = false;
    
    console.log('✅ DocumentManager cleanup completed');
  }

  // Get document statistics
  getDocumentStats() {
    const roleDocuments = this.getAllRoleDocuments();
    const stats = {
      role: this.currentRole,
      totalCategories: Object.keys(roleDocuments).length,
      totalDocuments: 0,
      requiredDocuments: 0,
      optionalDocuments: 0,
      byCategory: {},
      byType: {}
    };
    
    Object.keys(roleDocuments).forEach(category => {
      const categoryDocs = roleDocuments[category];
      const categoryCount = Object.keys(categoryDocs).length;
      
      stats.byCategory[category] = {
        total: categoryCount,
        required: 0,
        optional: 0
      };
      
      Object.keys(categoryDocs).forEach(key => {
        const doc = categoryDocs[key];
        stats.totalDocuments++;
        
        if (doc.required) {
          stats.requiredDocuments++;
          stats.byCategory[category].required++;
        } else {
          stats.optionalDocuments++;
          stats.byCategory[category].optional++;
        }
        
        // Count by type
        if (!stats.byType[doc.type]) {
          stats.byType[doc.type] = 0;
        }
        stats.byType[doc.type]++;
      });
    });
    
    return stats;
  }
}

// Initialize document manager
let documentManagerInstance = null;

function initializeDocumentManager(role = 'tutor') {
  if (documentManagerInstance) {
    console.log('📚 DocumentManager already initialized');
    return documentManagerInstance;
  }
  
  try {
    documentManagerInstance = new DocumentManager();
    documentManagerInstance.setRole(role);
    
    // Make globally available
    window.documentManager = documentManagerInstance;
    
    console.log('✅ DocumentManager initialized successfully');
    return documentManagerInstance;
    
  } catch (error) {
    console.error('❌ DocumentManager initialization failed:', error);
    throw error;
  }
}

// Enhanced functions for integration with session systems
window.downloadAgreement = async function() {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager();
  }
  
  const agreementKey = documentManagerInstance.currentRole === 'student' ? 
    'student_terms_of_service.pdf' : 
    'freelance_math_tutor_agreement.pdf';
    
  const success = await documentManagerInstance.downloadDocument(agreementKey);
  
  if (!success && window.ENV?.TEST_MODE) {
    documentManagerInstance.showNotification(
      `💡 Developer Mode: Make sure your PDF file is placed at: /documents/${documentManagerInstance.currentRole}/agreements/${agreementKey}`, 
      'info',
      8000
    );
  }
  
  return success;
};

window.viewAgreementPreview = async function() {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager();
  }
  
  const agreementKey = documentManagerInstance.currentRole === 'student' ? 
    'student_terms_of_service.pdf' : 
    'freelance_math_tutor_agreement.pdf';
    
  await documentManagerInstance.previewDocument(agreementKey);
};

// Role-specific download functions
window.downloadStudentHandbook = async function() {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager('student');
  }
  
  return await documentManagerInstance.downloadDocument('student_handbook.pdf', 'resources');
};

window.downloadTutorHandbook = async function() {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager('tutor');
  }
  
  return await documentManagerInstance.downloadDocument('tutor_handbook.pdf', 'resources');
};

window.downloadWelcomePackage = async function() {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager();
  }
  
  const packageKey = documentManagerInstance.currentRole === 'student' ? 
    'student_welcome_package.zip' : 
    'math_tutor_recruitment_package.zip';
    
  return await documentManagerInstance.downloadDocument(packageKey, 'packages');
};

// Role switching function
window.switchDocumentRole = function(role) {
  if (!documentManagerInstance) {
    documentManagerInstance = initializeDocumentManager(role);
    return true;
  }
  
  return documentManagerInstance.switchRole(role);
};

// Developer mode helpers - available in console
if (window.ENV?.TEST_MODE === true) {
  // Auto-initialize and test
  window.addEventListener('load', async () => {
    const envType = window.ENV.IS_LOCAL ? 'Local Development' : 
                   window.ENV.FORCE_TEST ? 'Forced Test Mode' : 'Test Environment';
    
    console.log(`🔧 ${envType} Active - DocumentManager`);
    console.log(`👤 Default Role: ${documentManagerInstance?.currentRole || 'tutor'}`);
    console.log('');
    console.log('💡 Available commands:');
    console.log('  - documentManager.listDocuments()');
    console.log('  - documentManager.testAllDocuments()');
    console.log('  - documentManager.switchRole("student" | "tutor")');
    console.log('  - downloadAgreement()');
    console.log('  - viewAgreementPreview()');
    console.log('  - downloadStudentHandbook()');
    console.log('  - downloadTutorHandbook()');
    console.log('  - downloadWelcomePackage()');
    
    // Initialize if not already done
    if (!documentManagerInstance) {
      documentManagerInstance = initializeDocumentManager();
    }
    
    // Test documents after a short delay
    const testTimer = setTimeout(async () => {
      console.log('🧪 Running automatic document tests...');
      
      const results = await documentManagerInstance.testAllDocuments();
      const stats = documentManagerInstance.getDocumentStats();
      
      console.log('\n📊 Document Statistics:', stats);
      
      if (results.failed > 0) {
        const missingRequired = results.details.filter(d => d.status === '❌' && d.required).length;
        
        if (missingRequired > 0) {
          documentManagerInstance.showNotification(
            `⚠️ ${missingRequired} required document(s) missing for ${results.role} role!`, 
            'error', 
            10000
          );
        } else {
          documentManagerInstance.showNotification(
            `⚠️ ${results.failed} optional document(s) not found. Check console for details.`, 
            'warning', 
            8000
          );
        }
        
        console.log(`\n💡 Quick Fix for ${window.ENV.IS_LOCAL ? 'Local Dev' : 'Test Mode'}:`);
        console.log('1. Create appropriate folders in your project root directory:');
        console.log('   - /documents/tutor/agreements/');
        console.log('   - /documents/tutor/forms/');
        console.log('   - /documents/tutor/packages/');
        console.log('   - /documents/tutor/resources/');
        console.log('   - /documents/student/agreements/');
        console.log('   - /documents/student/forms/');
        console.log('   - /documents/student/packages/');
        console.log('   - /documents/student/resources/');
        console.log('2. Add your PDF/DOCX/HTML files to the appropriate folders');
        console.log('3. Refresh the page');
      } else {
        documentManagerInstance.showNotification(
          `✅ All ${results.success} documents accessible in ${envType}!`, 
          'success'
        );
      }
    }, 2000);
    
    documentManagerInstance.timers.add(testTimer);
    
    // Test role switching
    setTimeout(() => {
      console.log('\n🔄 Testing role switching functionality...');
      
      const originalRole = documentManagerInstance.currentRole;
      const testRole = originalRole === 'student' ? 'tutor' : 'student';
      
      console.log(`Testing switch to ${testRole}...`);
      documentManagerInstance.switchRole(testRole);
      
      setTimeout(() => {
        console.log(`Testing switch back to ${originalRole}...`);
        documentManagerInstance.switchRole(originalRole);
        console.log('✅ Role switching test completed');
      }, 1000);
      
    }, 4000);
  });
}

// Create missing utility functions if they don't exist
if (typeof showNotification === 'undefined') {
  window.showNotification = function(message, type = 'info', duration = 5000) {
    console.log(`🔔 Notification [${type.toUpperCase()}]: ${message}`);
    
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notification-container';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
      `;
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      background: ${type === 'success' ? '#4CAF50' : 
                  type === 'error' ? '#f44336' : 
                  type === 'warning' ? '#FF9800' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      margin-bottom: 10px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      pointer-events: auto;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 350px;
      word-wrap: break-word;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    // Add icon based on type
    const icons = {
      success: '✅',
      error: '❌',  
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    notification.innerHTML = `
      <span style="font-size: 16px;">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after duration
    const removeTimer = setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
      clearTimeout(removeTimer);
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
  };
  
  console.log('✅ showNotification function created');
}

if (typeof trackInteraction === 'undefined') {
  window.trackInteraction = function(action, data = {}) {
    console.log(`📊 Track Interaction: ${action}`, data);
    
    // Store in sessionStorage for debugging
    try {
      const interactions = JSON.parse(sessionStorage.getItem('interactions') || '[]');
      interactions.push({
        action,
        data,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      });
      
      // Keep only last 50 interactions
      if (interactions.length > 50) {
        interactions.splice(0, interactions.length - 50);
      }
      
      sessionStorage.setItem('interactions', JSON.stringify(interactions));
    } catch (error) {
      console.warn('Could not store interaction data:', error);
    }
  };
  
  console.log('✅ trackInteraction function created');
}

// Auto-initialize document manager
(function autoInit() {
  try {
    // Detect initial role from various sources
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get('role') || 
                       sessionStorage.getItem('userRole') || 
                       (document.body.className.includes('student') ? 'student' : 'tutor');
    
    documentManagerInstance = initializeDocumentManager(initialRole);
    
    console.log('🚀 DocumentManager auto-initialized successfully');
    
  } catch (error) {
    console.error('❌ DocumentManager auto-initialization failed:', error);
    
    // Retry after DOM is ready
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        try {
          documentManagerInstance = initializeDocumentManager();
          console.log('🔄 DocumentManager initialized after DOM ready');
        } catch (retryError) {
          console.error('❌ DocumentManager retry initialization failed:', retryError);
        }
      });
    }
  }
})();

// Export for use in other modules
window.DocumentManager = DocumentManager;
window.initializeDocumentManager = initializeDocumentManager;

// Debug helpers
window.documentManagerDebug = {
  getInstance: () => documentManagerInstance,
  getStats: () => documentManagerInstance?.getDocumentStats(),
  testDocuments: () => documentManagerInstance?.testAllDocuments(),
  listDocuments: () => documentManagerInstance?.listDocuments(),
  switchRole: (role) => documentManagerInstance?.switchRole(role),
  getCurrentRole: () => documentManagerInstance?.getCurrentRole(),
  getAvailableRoles: () => ['student', 'tutor'],
  reinitialize: (role) => {
    if (documentManagerInstance) {
      documentManagerInstance.cleanup();
      documentManagerInstance = null;
    }
    return initializeDocumentManager(role);
  }
};

console.log('📚 DocumentManager script loaded successfully');
