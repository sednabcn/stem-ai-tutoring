// document-manager.js - Enhanced for Developer Mode Integration
class DocumentManager {
  constructor() {
    // Your document paths - works with your existing file structure
    this.documents = {
      agreements: {
        'freelance_math_tutor_agreement.pdf': {
          path: '../../documents/agreements/freelance_math_tutor_agreement.pdf',
          type: 'application/pdf',
          name: 'Freelance Math Tutor Agreement (English)',
          required: true,
          category: 'legal'
        },
        'freelance_math_tutor_agreement_bilingual.docx': {
          path: '../../documents/agreements/freelance_math_tutor_agreement_bilingual.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          name: 'Freelance Math Tutor Agreement (Bilingual)',
          required: false,
          category: 'legal'
        },
        'freelance_math_tutor_agreement.docx': {
          path: '../../documents/agreements/freelance_math_tutor_agreement.docx',
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          name: 'Freelance Math Tutor Agreement (Original)',
          required: false,
          category: 'legal'
        }
      },
      forms: {
        'tutor_application_form.html': {
            path: '../../documents/forms/tutor_application_form.html',
          type: 'text/html',
          name: 'Tutor Application Form',
          required: true,
          category: 'application'
        }
      },
      packages: {
        'math_tutor_recruitment_package.zip': {
          path: '../../documents/packages/math_tutor_recruitment_package.zip',
          type: 'application/zip',
          name: 'Complete Recruitment Package',
          required: false,
          category: 'resources'
        }
      }
    };
  }

 // Get document URL - works in both developer and production mode
getDocumentUrl(documentKey, category = 'agreements') {
  const doc = this.documents[category]?.[documentKey];
  if (!doc) {
    console.error(`Document not found: ${documentKey} in ${category}`);
    return null;
  }
  
  // Use your smart environment detection
  if (window.ENV?.TEST_MODE === true) {
    // Developer/Test mode - use relative paths to your local documents folder
    console.log(`📁 Dev Mode: Loading document from local path: ${doc.path}`);
    return doc.path; // e.g., 'documents/agreements/freelance_math_tutor_agreement.pdf'
  } else {
    // Production mode - use Firebase Storage URLs
    const firebaseProject = window.ENV?.FIREBASE_CONFIG?.projectId || 'math-tutor-prod';
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseProject}/o/${encodeURIComponent(doc.path)}?alt=media`;
    console.log(`🔥 Prod Mode: Loading document from Firebase: ${url}`);
    return url;
  }
}


    
  // Download document - enhanced for developer mode
  async downloadDocument(documentKey, category = 'agreements') {
    const doc = this.documents[category]?.[documentKey];
    const url = this.getDocumentUrl(documentKey, category);
    
    if (!url) {
      showNotification('Document not found', 'error');
      return false;
    }

    try {
      // In developer mode, check if file exists
      if (window.ENV?.TEST_MODE === true) {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          showNotification(`Document not found: ${doc.name}. Please check the file exists at: ${url}`, 'error');
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
      showNotification(`${doc.name} downloaded successfully!`, 'success');
      
      // Track the download
      if (window.trackInteraction) {
        window.trackInteraction('document_download', {
          document: documentKey,
          category: category,
          mode: window.ENV?.TEST_MODE ? 'development' : 'production'
        });
      }
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('Download failed. Please check your internet connection.', 'error');
      return false;
    }
  }

  // Preview document in modal - enhanced for developer mode
  async previewDocument(documentKey, category = 'agreements') {
    const doc = this.documents[category]?.[documentKey];
    const url = this.getDocumentUrl(documentKey, category);
    
    if (!url) {
      showNotification('Document not found', 'error');
      return;
    }

    // In developer mode, check if file exists first
    if (window.ENV?.TEST_MODE === true) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          showNotification(`Document not found: ${doc.name}. Please place the file at: ${url}`, 'error');
          return;
        }
      } catch (error) {
        showNotification(`Cannot access document: ${doc.name}. Please check the file path: ${url}`, 'error');
        return;
      }
    }

    // Create preview modal
    const modal = document.createElement('div');
    modal.className = 'modal document-preview-modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
      <div class="modal-content document-preview" style="max-width: 900px; height: 80vh;">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0;">📄 ${doc.name}</h3>
          <span class="close" onclick="this.closest('.modal').remove()" style="font-size: 24px; cursor: pointer; padding: 5px;">&times;</span>
        </div>
        <div class="document-viewer" style="flex: 1; padding: 20px; overflow: auto;">
          ${this.getDocumentViewer(doc, url)}
        </div>
        <div class="modal-actions" style="padding: 20px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
          <button class="btn" onclick="documentManager.downloadDocument('${documentKey}', '${category}')">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Track the preview
    if (window.trackInteraction) {
      window.trackInteraction('document_preview', {
        document: documentKey,
        category: category,
        mode: window.ENV?.TEST_MODE ? 'development' : 'production'
      });
    }
  }

// Get appropriate viewer for document type
getDocumentViewer(doc, url) {
  const envInfo = window.ENV?.TEST_MODE ? 
    `<div style="background: #e3f2fd; padding: 12px; margin-bottom: 15px; border-radius: 6px; font-size: 0.9rem; border-left: 4px solid #2196F3;">
      <strong>🧪 ${window.ENV.IS_LOCAL ? 'Local Dev' : 'Test'} Mode:</strong> 
      Loading from: <code style="background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 3px;">${url}</code><br>
      <small>Host: ${window.ENV.HOSTNAME} | Force Test: ${window.ENV.FORCE_TEST ? 'Yes' : 'No'}</small>
    </div>` : '';

  switch (doc.type) {
    case 'application/pdf':
      return `
        ${envInfo}
        <iframe src="${url}" width="100%" height="500px" style="border: none; border-radius: 4px;"></iframe>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
          <i class="fas fa-info-circle"></i> If the PDF doesn't load, try downloading it directly.
          ${window.ENV?.TEST_MODE ? '<br><strong>Dev Tip:</strong> Make sure the PDF file exists in your documents/ folder.' : ''}
        </p>
      `;
    
    case 'text/html':
      return `
        ${envInfo}
        <iframe src="${url}" width="100%" height="500px" style="border: 1px solid #ddd; border-radius: 4px;"></iframe>
      `;
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return `
        ${envInfo}
        <div class="document-info" style="text-align: center; padding: 40px;">
          <i class="fas fa-file-word" style="font-size: 48px; color: #2B579A; margin-bottom: 15px;"></i>
          <h4>${doc.name}</h4>
          <p>This is a Microsoft Word document. Click download to view the full content.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left;">
            <strong>File Details:</strong><br>
            📄 Type: Word Document (.docx)<br>
            📁 ${window.ENV?.TEST_MODE ? 'Local Path' : 'Firebase URL'}: <code style="word-break: break-all; font-size: 0.8rem;">${url}</code><br>
            💾 Category: ${doc.category}<br>
            🏠 Environment: ${window.ENV?.TEST_MODE ? (window.ENV.IS_LOCAL ? 'Local Development' : 'Test Mode') : 'Production'}
          </div>
        </div>
      `;
    
    case 'application/zip':
      return `
        ${envInfo}
        <div class="document-info" style="text-align: center; padding: 40px;">
          <i class="fas fa-file-archive" style="font-size: 48px; color: #FF6B35; margin-bottom: 15px;"></i>
          <h4>${doc.name}</h4>
          <p>This is a compressed archive file. Download to extract the contents.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: left;">
            <strong>Archive Contents:</strong><br>
            📋 Complete recruitment package<br>
            📄 All agreement documents<br>
            📝 Application forms<br>
            📚 Additional resources<br><br>
            <strong>Environment:</strong> ${window.ENV?.TEST_MODE ? (window.ENV.IS_LOCAL ? 'Local Development' : 'Test Mode') : 'Production'}
          </div>
        </div>
      `;
    
    default:
      return `
        ${envInfo}
        <div class="document-info" style="text-align: center; padding: 40px;">
          <i class="fas fa-file" style="font-size: 48px; color: #666; margin-bottom: 15px;"></i>
          <h4>${doc.name}</h4>
          <p>Preview not available for this file type. Click download to access the file.</p>
        </div>
      `;
  }
}
  
    
  // List all available documents - useful for debugging in developer mode
  listDocuments() {
    console.log('📋 Available Documents:');
    Object.keys(this.documents).forEach(category => {
      console.log(`\n📁 ${category.toUpperCase()}:`);
      Object.keys(this.documents[category]).forEach(key => {
        const doc = this.documents[category][key];
        const url = this.getDocumentUrl(key, category);
        console.log(`  📄 ${doc.name}`);
        console.log(`     Key: ${key}`);
        console.log(`     Path: ${url}`);
        console.log(`     Required: ${doc.required ? '✅' : '❌'}`);
      });
    });
  }

  // Test all document links - useful for developer mode setup
  async testAllDocuments() {
    console.log('🧪 Testing all document links...');
    let results = { success: 0, failed: 0, details: [] };

    for (const category in this.documents) {
      for (const key in this.documents[category]) {
        const doc = this.documents[category][key];
        const url = this.getDocumentUrl(key, category);
        
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            results.success++;
            results.details.push({ doc: doc.name, status: '✅', url });
          } else {
            results.failed++;
            results.details.push({ doc: doc.name, status: '❌', url, error: `HTTP ${response.status}` });
          }
        } catch (error) {
          results.failed++;
          results.details.push({ doc: doc.name, status: '❌', url, error: error.message });
        }
      }
    }

    console.log(`\n📊 Test Results: ${results.success} success, ${results.failed} failed`);
    results.details.forEach(result => {
      console.log(`${result.status} ${result.doc}`);
      if (result.error) console.log(`    Error: ${result.error}`);
      console.log(`    URL: ${result.url}`);
    });

    return results;
  }
}

// Initialize document manager
const documentManager = new DocumentManager();

// Enhanced functions for your onboarding-01.js integration
window.downloadAgreement = async function() {
  const success = await documentManager.downloadDocument('freelance_math_tutor_agreement.pdf');
  if (!success && window.ENV?.TEST_MODE) {
    showNotification('💡 Developer Mode: Make sure your PDF file is placed at: documents/agreements/freelance_math_tutor_agreement.pdf', 'info');
  }
};

window.viewAgreementPreview = async function() {
  await documentManager.previewDocument('freelance_math_tutor_agreement.pdf');
};

// Developer mode helpers - available in console
if (window.ENV?.TEST_MODE === true) {
  // Add to global scope for debugging
  window.documentManager = documentManager;
  
  // Auto-test documents on load
  window.addEventListener('load', async () => {
    const envType = window.ENV.IS_LOCAL ? 'Local Development' : 
                   window.ENV.FORCE_TEST ? 'Forced Test Mode' : 'Test Environment';
    
    console.log(`🔧 ${envType} Active`);
    console.log(`🏠 Host: ${window.ENV.HOSTNAME}`);
    console.log(`⚙️ Test Mode: ${window.ENV.TEST_MODE}`);
    console.log(`📁 GitHub Pages: ${window.ENV.IS_GITHUB}`);
    console.log('');
    console.log('💡 Available commands:');
    console.log('  - documentManager.listDocuments()');
    console.log('  - documentManager.testAllDocuments()');
    console.log('  - downloadAgreement()');
    console.log('  - viewAgreementPreview()');
    
    // Test documents after a short delay
    setTimeout(async () => {
      const results = await documentManager.testAllDocuments();
      if (results.failed > 0) {
        showNotification(
          `⚠️ ${results.failed} document(s) not found. Check console for details.`, 
          'warning', 
          8000
        );
        console.log(`\n💡 Quick Fix for ${window.ENV.IS_LOCAL ? 'Local Dev' : 'Test Mode'}:`);
        console.log('1. Create a "documents" folder in your project root');
        console.log('2. Add your PDF/DOCX files to the appropriate subfolders');
        console.log('3. Refresh the page');
      } else {
        showNotification(
          `✅ All ${results.success} documents are accessible in ${envType}!`, 
          'success'
        );
      }
    }, 2000);
  });
}
// === FIXES - Add this to the END of document-manager.js ===

// Create showNotification function if it doesn't exist
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message, type = 'info', duration = 5000) {
        console.log(`🔔 Notification [${type.toUpperCase()}]: ${message}`);
        
        // Create notification element if it doesn't exist
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
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
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

// Create trackInteraction function if it doesn't exist
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
                url: window.location.href
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

// Patch DocumentManager to handle missing functions gracefully
if (window.documentManager) {
    // Override methods that use showNotification to ensure they work
    const originalDownloadDocument = window.documentManager.downloadDocument;
    const originalPreviewDocument = window.documentManager.previewDocument;
    
    window.documentManager.downloadDocument = async function(documentKey, category = 'agreements') {
        try {
            return await originalDownloadDocument.call(this, documentKey, category);
        } catch (error) {
            console.error('Download failed:', error);
            if (window.showNotification) {
                showNotification('Download failed. Please check your internet connection.', 'error');
            } else {
                alert('Download failed. Please check your internet connection.');
            }
            return false;
        }
    };
    
    window.documentManager.previewDocument = async function(documentKey, category = 'agreements') {
        try {
            return await originalPreviewDocument.call(this, documentKey, category);
        } catch (error) {
            console.error('Preview failed:', error);
            if (window.showNotification) {
                showNotification('Preview failed. Please check your internet connection.', 'error');
            } else {
                alert('Preview failed. Please check your internet connection.');
            }
        }
    };
    
    console.log('✅ DocumentManager patched for missing dependencies');
}

// Test notifications
console.log('🧪 Testing notification system...');
setTimeout(() => {
    if (window.showNotification) {
        showNotification('Document Manager notification system is working!', 'success', 3000);
    }
}, 1000);
// Export for use in other modules
window.DocumentManager = DocumentManager;
window.documentManager = documentManager;
