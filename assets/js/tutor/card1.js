// CARD 1: FREELANCE AGREEMENT - Complete Functionality
// This file works with onboarding-01.js main file

// ============================================================================
// CARD 1 SPECIFIC VARIABLES (avoid conflicts with main file)
// ============================================================================

// Use the global variables from onboarding-01.js instead of redefining
// agreementSigned and agreementStepProgress are already defined in main file

// ============================================================================
// AGREEMENT MODAL FUNCTIONS
// ============================================================================
if (!window.cards) window.cards = {};
   window.cards['card1'] = {
       id: 'card1',
       title: 'Temporary test card',
       render: () => console.log('Rendering card1')
   };

function signAgreement() {
    const modal = document.getElementById('agreementModal');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Set today's date automatically
    const today = new Date().toISOString().split('T')[0];
    const dateField = document.getElementById('signatureDate');
    if (dateField) {
        dateField.value = today;
    }
    
    // Track interaction (using main file's function)
    if (typeof trackInteraction === 'function') {
        trackInteraction('agreement_modal_opened');
    }
}

function downloadAgreement() {
    // Create a temporary download link
    const link = document.createElement('a');
    const agreementContent = `
FREELANCE MATH TUTOR AGREEMENT

This is a sample agreement document that would be downloaded as PDF.

TERMS AND CONDITIONS:
1. Independent contractor status
2. Payment terms: 85% of session fees
3. Professional conduct requirements
4. Background check compliance
    `;
    
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(agreementContent);
    link.download = 'Freelance_Math_Tutor_Agreement.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Use main file's notification function
    if (typeof showNotification === 'function') {
        showNotification('Agreement PDF downloaded successfully!', 'success');
    }
    
    if (typeof trackInteraction === 'function') {
        trackInteraction('agreement_downloaded');
    }
}

function viewAgreementPreview() {
    // Create preview modal content
    const previewContent = `
        <div style="max-height: 400px; overflow-y: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            <h3>📋 Agreement Preview</h3>
            <h4>FREELANCE MATH TUTOR AGREEMENT</h4>
            <p><strong>Effective Date:</strong> ${new Date().toLocaleDateString()}</p>
            
            <h5>1. INDEPENDENT CONTRACTOR STATUS</h5>
            <p>You will provide math tutoring services as an independent contractor, not as an employee.</p>
            
            <h5>2. PAYMENT TERMS</h5>
            <ul>
                <li>You receive 85% of session fees</li>
                <li>Platform retains 15% service fee</li>
                <li>Weekly direct deposit payments</li>
                <li>Minimum payout threshold: £25</li>
            </ul>
            
            <h5>3. RESPONSIBILITIES</h5>
            <ul>
                <li>Provide quality math tutoring services</li>
                <li>Maintain professional conduct</li>
                <li>Protect student privacy and data</li>
                <li>Give 24-hour cancellation notice</li>
            </ul>
            
            <h5>4. REQUIREMENTS</h5>
            <ul>
                <li>Valid teaching credentials or math degree</li>
                <li>Clean background check (DBS)</li>
                <li>Reliable internet connection</li>
                <li>Professional tutoring environment</li>
            </ul>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close Preview</button>
                <button class="btn" onclick="this.closest('.modal').remove(); signAgreement();">Proceed to Sign</button>
            </div>
        </div>
    `;
    
    // Create and show preview modal
    showCustomModal('Agreement Preview', previewContent);
}

function submitAgreement() {
    const agreeTerms = document.getElementById('agreeTerms');
    const signature = document.getElementById('digitalSignature');
    const date = document.getElementById('signatureDate');
    
    // Check if elements exist
    if (!agreeTerms || !signature || !date) {
        if (typeof showNotification === 'function') {
            showNotification('Form elements not found. Please refresh the page.', 'error');
        }
        return;
    }
    
    // Validation
    if (!agreeTerms.checked) {
        if (typeof showNotification === 'function') {
            showNotification('Please check the agreement terms checkbox', 'error');
        }
        return;
    }
    
    const signatureValue = signature.value.trim();
    if (!signatureValue || signatureValue.length < 3) {
        if (typeof showNotification === 'function') {
            showNotification('Please enter your full legal name', 'error');
        }
        return;
    }
    
    if (!date.value) {
        if (typeof showNotification === 'function') {
            showNotification('Please select the signature date', 'error');
        }
        return;
    }
    
    // Store signature data
    const signatureData = {
        fullName: signatureValue,
        date: date.value,
        timestamp: new Date().toISOString(),
        ipAddress: 'xxx.xxx.xxx.xxx' // Would be actual IP in real app
    };
    
    // Save to localStorage (in real app would be sent to server)
    try {
        localStorage.setItem('agreementSignature', JSON.stringify(signatureData));
    } catch (e) {
        console.warn('Could not save signature data:', e);
    }
    
    // Close modal using main file's function
    if (typeof closeModal === 'function') {
        closeModal('agreementModal');
    }
    
    // Mark agreement as complete
    markAgreementSignatureComplete();
    
    // Show success notification
    if (typeof showNotification === 'function') {
        showNotification('Agreement signed successfully!', 'success');
    }
    
    // Track the completion
    if (typeof trackInteraction === 'function') {
        trackInteraction('agreement_signed', { fullName: signatureValue });
    }
    
    // Ask if they want to proceed to interview
    setTimeout(() => {
        if (typeof showAdvancedNotification === 'function') {
            showAdvancedNotification(
                'Great! Would you like to complete the interview questions now?',
                'info',
                8000,
                [
                    {
                        text: 'Yes, Continue',
                        callback: () => proceedToInterview()
                    },
                    {
                        text: 'Later',
                        callback: () => {}
                    }
                ]
            );
        } else if (confirm('Would you like to proceed to the tutor interview questions now?')) {
            proceedToInterview();
        }
    }, 1500);
}

function proceedToInterview() {
    if (typeof closeModal === 'function') {
        closeModal('agreementModal');
    }
    
    const interviewModal = document.getElementById('interviewModal');
    if (interviewModal) {
        interviewModal.style.display = 'block';
    }
    
    if (typeof trackInteraction === 'function') {
        trackInteraction('interview_started');
    }
}

function submitInterview() {
    const questions = ['question1', 'question2', 'question3', 'question4', 'question5', 'question6'];
    const answers = {};
    let allAnswered = true;
    let totalCharacters = 0;
    
    // Collect all answers
    questions.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            const answer = element.value.trim();
            if (answer.length < 50) { // Minimum 50 characters as per main file
                allAnswered = false;
            }
            answers[`question_${index + 1}`] = answer;
            totalCharacters += answer.length;
        } else {
            allAnswered = false;
        }
    });
    
    if (!allAnswered) {
        if (typeof showNotification === 'function') {
            showNotification('Please provide detailed answers to all questions (minimum 50 characters each)', 'error');
        }
        return;
    }
    
    // Save interview responses
    const interviewData = {
        answers: answers,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        totalCharacters: totalCharacters
    };
    
    try {
        localStorage.setItem('interviewResponses', JSON.stringify(interviewData));
    } catch (e) {
        console.warn('Could not save interview data:', e);
    }
    
    // Close modal
    if (typeof closeModal === 'function') {
        closeModal('interviewModal');
    }
    
    // Mark interview as complete
    markInterviewComplete();
    
    if (typeof showNotification === 'function') {
        showNotification('Interview responses submitted for review!', 'success');
    }
    
    if (typeof trackInteraction === 'function') {
        trackInteraction('interview_completed', { 
            totalCharacters: totalCharacters,
            questionsAnswered: questions.length 
        });
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function markAgreementSignatureComplete() {
    // Update global variables from main file
    if (typeof agreementStepProgress !== 'undefined') {
        agreementStepProgress.signature = true;
        
        // Check if both signature and interview are complete
        if (agreementStepProgress.signature && agreementStepProgress.interview) {
            window.agreementSigned = true;
        }
    }
    
    // Update card status using main file's function
    if (typeof updateCardStatus === 'function') {
        if (agreementStepProgress && agreementStepProgress.interview) {
            updateCardStatus('agreementCard', 'complete', 'Completed');
        } else {
            updateCardStatus('agreementCard', 'in-progress', 'Interview Pending');
        }
    }
    
    // Update overall progress
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
    
    // Save progress
    if (typeof saveProgressToStorage === 'function') {
        saveProgressToStorage();
    }
}

function markInterviewComplete() {
    // Update global variables
    if (typeof agreementStepProgress !== 'undefined') {
        agreementStepProgress.interview = true;
        
        // Check if both signature and interview are complete
        if (agreementStepProgress.signature && agreementStepProgress.interview) {
            window.agreementSigned = true;
        }
    }
    
    // Update card status
    if (typeof updateCardStatus === 'function') {
        updateCardStatus('agreementCard', 'complete', 'Completed');
    }
    
    // Update overall progress
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
    
    // Save progress
    if (typeof saveProgressToStorage === 'function') {
        saveProgressToStorage();
    }
}

function showCustomModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h3>${title}</h3>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================================================================
// INITIALIZATION FOR CARD 1
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for main file to initialize
    setTimeout(() => {
        // Check if agreement was previously signed
        try {
            const savedSignature = localStorage.getItem('agreementSignature');
            if (savedSignature) {
                const signatureData = JSON.parse(savedSignature);
                markAgreementSignatureComplete();
                console.log('Agreement previously signed by:', signatureData.fullName);
            }
            
            // Check if interview was completed
            const savedInterview = localStorage.getItem('interviewResponses');
            if (savedInterview) {
                const interviewData = JSON.parse(savedInterview);
                if (interviewData.status === 'submitted') {
                    markInterviewComplete();
                    console.log('Interview previously completed');
                }
            }
        } catch (e) {
            console.warn('Error loading saved agreement data:', e);
        }
        
        console.log('✅ Card 1 (Agreement) initialized');
    }, 100);
});

// ============================================================================
// EXPORT FUNCTIONS (if needed by other cards)
// ============================================================================

// Make card 1 functions available globally if needed
window.signAgreement = signAgreement;
window.downloadAgreement = downloadAgreement;
window.viewAgreementPreview = viewAgreementPreview;
window.submitAgreement = submitAgreement;
window.proceedToInterview = proceedToInterview;
window.submitInterview = submitInterview;
