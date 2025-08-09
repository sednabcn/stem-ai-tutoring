// CARD 2: CREDENTIALS & BACKGROUND CHECK - Complete Functionality
// Copy/Paste this entire block for Card 2

// Credentials Card Variables
let card2_credentialsUploaded = false;
let card2_credentialsStepProgress = {
    credentials: false
};

let card2_uploadedDocuments = {
    cv: false,
    teachingCerts: false,
    degrees: false,
    references: false,
    dbs: false,
    portfolio: false,
    other: false
};

let card2_documentsData = [];
let card2_totalRequiredDocs = 7;
let card2_uploadedCount = 0;

// Credentials Card Functions
function uploadDocuments() {
    openCredentialsUploadModal();
}

function viewRequirements() {
    const requirementsContent = `
        <div style="max-height: 400px; overflow-y: auto; padding: 15px;">
            <h4>📋 Required Documents Checklist</h4>
            
            <div style="margin: 20px 0;">
                <h5>🔸 Essential Documents (Required)</h5>
                <ul style="line-height: 1.8;">
                    <li><strong>CV/Resume:</strong> Up-to-date curriculum vitae highlighting teaching experience</li>
                    <li><strong>Teaching Certificates:</strong> PGCE, QTS, or equivalent teaching qualifications</li>
                    <li><strong>Degree Certificates:</strong> Mathematics or related field (minimum Bachelor's)</li>
                    <li><strong>DBS Certificate:</strong> Enhanced DBS check (must be less than 3 years old)</li>
                    <li><strong>References:</strong> 2 professional references from previous employers/colleagues</li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h5>🔸 Additional Documents (Recommended)</h5>
                <ul style="line-height: 1.8;">
                    <li><strong>Teaching Portfolio:</strong> Examples of lesson plans, student work, testimonials</li>
                    <li><strong>Continuing Education:</strong> Recent training certificates, workshops attended</li>
                </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>📌 Important Notes:</h5>
                <ul style="margin: 10px 0; line-height: 1.6;">
                    <li>All documents must be in English or officially translated</li>
                    <li>File formats: PDF, JPG, PNG (max 5MB per file)</li>
                    <li>DBS certificate must be Enhanced level and current</li>
                    <li>References must include contact information</li>
                    <li>Verification process takes 3-5 business days</li>
                </ul>
            </div>
            
            <div style="background: #f1f8e9; padding: 15px; border-radius: 8px;">
                <strong>💡 Pro Tip:</strong> Having all documents ready speeds up verification significantly!
            </div>
        </div>
    `;
    
    showCustomModal('Document Requirements', requirementsContent);
}

function openCredentialsUploadModal() {
    const uploadModal = document.createElement('div');
    uploadModal.className = 'modal';
    uploadModal.id = 'credentialsUploadModal';
    uploadModal.style.display = 'block';
    
    uploadModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeCredentialsModal()">&times;</span>
            <h3>📄 Upload Credentials & Documents</h3>
            <p>Upload all required documents for verification. Each file should be clear and readable.</p>
            
            <div class="upload-sections">
                <div class="upload-section">
                    <h4>📋 Essential Documents</h4>
                    
                    <div class="file-upload-item">
                        <label for="cvUpload">CV/Resume *</label>
                        <input type="file" id="cvUpload" accept=".pdf,.doc,.docx" onchange="handleFileUpload('cv', this)">
                        <div class="upload-status" id="cvStatus">Not uploaded</div>
                    </div>
                    
                    <div class="file-upload-item">
                        <label for="certUpload">Teaching Certificates *</label>
                        <input type="file" id="certUpload" accept=".pdf,.jpg,.png" multiple onchange="handleFileUpload('teachingCerts', this)">
                        <div class="upload-status" id="certStatus">Not uploaded</div>
                    </div>
                    
                    <div class="file-upload-item">
                        <label for="degreeUpload">Degree Certificates *</label>
                        <input type="file" id="degreeUpload" accept=".pdf,.jpg,.png" multiple onchange="handleFileUpload('degrees', this)">
                        <div class="upload-status" id="degreeStatus">Not uploaded</div>
                    </div>
                    
                    <div class="file-upload-item">
                        <label for="dbsUpload">DBS Certificate *</label>
                        <input type="file" id="dbsUpload" accept=".pdf,.jpg,.png" onchange="handleFileUpload('dbs', this)">
                        <div class="upload-status" id="dbsStatus">Not uploaded</div>
                    </div>
                    
                    <div class="file-upload-item">
                        <label for="refUpload">Professional References *</label>
                        <input type="file" id="refUpload" accept=".pdf,.doc,.docx" multiple onchange="handleFileUpload('references', this)">
                        <div class="upload-status" id="refStatus">Not uploaded</div>
                    </div>
                </div>
                
                <div class="upload-section">
                    <h4>📚 Optional Documents</h4>
                    
                    <div class="file-upload-item">
                        <label for="portfolioUpload">Teaching Portfolio</label>
                        <input type="file" id="portfolioUpload" accept=".pdf,.zip" onchange="handleFileUpload('portfolio', this)">
                        <div class="upload-status" id="portfolioStatus">Not uploaded</div>
                    </div>
                    
                    <div class="file-upload-item">
                        <label for="otherUpload">Other Certificates</label>
                        <input type="file" id="otherUpload" accept=".pdf,.jpg,.png" multiple onchange="handleFileUpload('other', this)">
                        <div class="upload-status" id="otherStatus">Not uploaded</div>
                    </div>
                </div>
            </div>
            
            <div class="upload-progress" style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Upload Progress:</span>
                    <span id="uploadCounter">${uploadedCount} / ${totalRequiredDocs} Required</span>
                </div>
                <div style="background: #f0f0f0; border-radius: 10px; height: 8px;">
                    <div id="uploadProgressBar" style="background: linear-gradient(90deg, #4caf50, #8bc34a); height: 100%; border-radius: 10px; width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeCredentialsModal()">Save & Close</button>
                <button class="btn" onclick="submitAllDocuments()" id="submitDocsBtn" disabled>Submit for Review</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(uploadModal);
    updateUploadProgress();
}

function handleFileUpload(docType, fileInput) {
    const files = fileInput.files;
    if (files.length === 0) return;
    
    // Validate file size (5MB limit)
    for (let file of files) {
        if (file.size > 5 * 1024 * 1024) {
            showNotification('❌ File size must be less than 5MB: ' + file.name, 'error');
            fileInput.value = '';
            return;
        }
    }
    
    // Mark document as uploaded
    uploadedDocuments[docType] = true;
    
    // Store file information
    const docInfo = {
        type: docType,
        files: Array.from(files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
        }))
    };
    
    // Update or add to documentsData
    const existingIndex = documentsData.findIndex(doc => doc.type === docType);
    if (existingIndex >= 0) {
        documentsData[existingIndex] = docInfo;
    } else {
        documentsData.push(docInfo);
    }
    
    // Update UI
    const statusElement = document.getElementById(docType + 'Status');
    if (statusElement) {
        statusElement.textContent = `✅ ${files.length} file(s) uploaded`;
        statusElement.style.color = '#4caf50';
        statusElement.style.fontWeight = 'bold';
    }
    
    updateUploadProgress();
    showNotification(`📄 ${files.length} file(s) uploaded for ${getDocumentTypeName(docType)}`, 'success');
}

function updateUploadProgress() {
    uploadedCount = Object.values(uploadedDocuments).filter(Boolean).length;
    const progressBar = document.getElementById('uploadProgressBar');
    const counter = document.getElementById('uploadCounter');
    const submitBtn = document.getElementById('submitDocsBtn');
    
    if (progressBar) {
        const percentage = (uploadedCount / totalRequiredDocs) * 100;
        progressBar.style.width = percentage + '%';
    }
    
    if (counter) {
        counter.textContent = `${uploadedCount} / ${totalRequiredDocs} Required`;
    }
    
    if (submitBtn) {
        const requiredDocs = ['cv', 'teachingCerts', 'degrees', 'dbs', 'references'];
        const allRequiredUploaded = requiredDocs.every(doc => uploadedDocuments[doc]);
        
        submitBtn.disabled = !allRequiredUploaded;
        if (allRequiredUploaded) {
            submitBtn.textContent = 'Submit for Review';
            submitBtn.style.background = 'linear-gradient(135deg, #4caf50, #388e3c)';
        }
    }
    
    // Update main card counter
    const mainCounter = document.querySelector('#credentialsCard .counter-text');
    if (mainCounter) {
        mainCounter.textContent = `Documents: ${uploadedCount} / 7 Uploaded`;
    }
}

function submitAllDocuments() {
    const requiredDocs = ['cv', 'teachingCerts', 'degrees', 'dbs', 'references'];
    const allRequiredUploaded = requiredDocs.every(doc => uploadedDocuments[doc]);
    
    if (!allRequiredUploaded) {
        showNotification('❌ Please upload all required documents first', 'error');
        return;
    }
    
    // Save submission data
    const submissionData = {
        documents: documentsData,
        submittedAt: new Date().toISOString(),
        status: 'submitted_for_review'
    };
    
    localStorage.setItem('credentialsSubmission', JSON.stringify(submissionData));
    
    closeCredentialsModal();
    markCredentialsReview();
    
    showNotification('📋 Documents submitted for review! We\'ll notify you within 3-5 business days.', 'success');
    
    // Simulate review process
    simulateReviewProcess();
}

function simulateReviewProcess() {
    // Mark as under review
    setTimeout(() => {
        showNotification('🔍 Your documents are being reviewed...', 'info');
    }, 2000);
    
    // Simulate approval after 8 seconds
    setTimeout(() => {
        markCredentialsComplete();
        showNotification('✅ Credentials approved! Background check verified.', 'success');
    }, 8000);
}

function markCredentialsReview() {
    const card = document.getElementById('credentialsCard');
    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator status-review';
    statusIndicator.innerHTML = '<div class="status-dot"></div><span>Under Review</span>';
    
    // Update document statuses in card
    const docStatuses = card.querySelectorAll('.document-status');
    docStatuses.forEach(status => {
        status.textContent = 'Review';
        status.className = 'document-status doc-pending';
    });
}

function markCredentialsComplete() {
    credentialsStepProgress.credentials = true;
    credentialsUploaded = true;
    
    const card = document.getElementById('credentialsCard');
    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator status-complete';
    statusIndicator.innerHTML = '<div class="status-dot"></div><span>Complete</span>';
    
    // Update document statuses in card
    const docStatuses = card.querySelectorAll('.document-status');
    docStatuses.forEach(status => {
        status.textContent = 'Approved';
        status.className = 'document-status doc-approved';
    });
    
    // Update global progress
    updateOverallProgress();
}

function closeCredentialsModal() {
    const modal = document.getElementById('credentialsUploadModal');
    if (modal) {
        modal.remove();
    }
}

// Helper Functions for Credentials Card
function getDocumentTypeName(docType) {
    const names = {
        cv: 'CV/Resume',
        teachingCerts: 'Teaching Certificates',
        degrees: 'Degree Certificates',
        dbs: 'DBS Certificate',
        references: 'Professional References',
        portfolio: 'Teaching Portfolio',
        other: 'Other Certificates'
    };
    return names[docType] || docType;
}

// Initialize Credentials Card on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if credentials were previously submitted
    const savedSubmission = localStorage.getItem('credentialsSubmission');
    if (savedSubmission) {
        const submissionData = JSON.parse(savedSubmission);
        if (submissionData.status === 'submitted_for_review') {
            markCredentialsReview();
            // Check if enough time has passed for "approval"
            const submittedTime = new Date(submissionData.submittedAt).getTime();
            const now = new Date().getTime();
            if (now - submittedTime > 30000) { // 30 seconds for demo
                markCredentialsComplete();
            }
        }
    }
    
    // Add upload modal styles
    const uploadStyles = document.createElement('style');
    uploadStyles.textContent = `
        .upload-sections {
            max-height: 400px;
            overflow-y: auto;
            margin: 20px 0;
        }
        .upload-section {
            margin-bottom: 30px;
            padding: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }
        .file-upload-item {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background: white;
        }
        .file-upload-item label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        .file-upload-item input[type="file"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
        }
        .upload-status {
            margin-top: 5px;
            font-size: 0.9rem;
            color: #666;
        }
    `;
    document.head.appendChild(uploadStyles);
});
