// CARD 3: IDENTITY VERIFICATION - Complete Functionality
// Copy/Paste this entire block for Card 3

// Identity Verification Card Variables
let card3_identityVerified = false;
let card3_identityStepProgress = {
    identity: false
};

let card3_verificationData = {
    videoRecorded: false,
    idUploaded: false,
    verificationComplete: false
};

let card3_mediaRecorder;
let card3_recordedChunks = [];
let card3_isRecording = false;

// Identity Verification Functions
function startVideoVerification() {
    openVideoVerificationModal();
}

function uploadIdOnly() {
    openIdUploadModal();
}

function openVideoVerificationModal() {
    const videoModal = document.createElement('div');
    videoModal.className = 'modal';
    videoModal.id = 'videoVerificationModal';
    videoModal.style.display = 'block';
    
    videoModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="close" onclick="closeVideoModal()">&times;</span>
            <h3>🎥 Video Identity Verification</h3>
            <p>Please record a short video (15-30 seconds) following these steps:</p>
            
            <div class="verification-steps" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h4>📋 Verification Steps:</h4>
                <ol style="line-height: 1.8; margin: 10px 0;">
                    <li><strong>Hold your ID document</strong> (passport, driving license, or national ID) clearly visible</li>
                    <li><strong>State your full name</strong> exactly as it appears on the ID</li>
                    <li><strong>Say today's date</strong> and "I am applying to be a math tutor"</li>
                    <li><strong>Hold the ID steady</strong> for at least 3 seconds at the end</li>
                </ol>
            </div>
            
            <div class="video-container" style="text-align: center; margin: 20px 0;">
                <video id="videoPreview" width="400" height="300" style="border: 2px solid #ddd; border-radius: 8px; background: #000;"></video>
                <div id="recordingStatus" style="margin: 10px 0; font-weight: bold; color: #666;">Camera not started</div>
            </div>
            
            <div class="verification-controls" style="text-align: center; margin: 20px 0;">
                <button class="btn btn-secondary" onclick="startCamera()" id="startCameraBtn">📹 Start Camera</button>
                <button class="btn" onclick="startRecording()" id="recordBtn" disabled>🔴 Start Recording</button>
                <button class="btn btn-secondary" onclick="stopRecording()" id="stopBtn" disabled>⏹️ Stop Recording</button>
                <button class="btn" onclick="submitVideoVerification()" id="submitVideoBtn" disabled>✅ Submit Video</button>
            </div>
            
            <div class="recording-tips" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>💡 Recording Tips:</h5>
                <ul style="margin: 10px 0; line-height: 1.6;">
                    <li>Ensure good lighting on your face and ID document</li>
                    <li>Speak clearly and at normal pace</li>
                    <li>Keep the camera steady during recording</li>
                    <li>Make sure your ID text is readable in the video</li>
                    <li>Recording will automatically stop after 45 seconds</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeVideoModal()">Cancel</button>
                <button class="btn btn-secondary" onclick="openIdUploadModal(); closeVideoModal();">Upload ID Only</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(videoModal);
}

function openIdUploadModal() {
    const idModal = document.createElement('div');
    idModal.className = 'modal';
    idModal.id = 'idUploadModal';
    idModal.style.display = 'block';
    
    idModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeIdModal()">&times;</span>
            <h3>🆔 Upload ID Document</h3>
            <p>Upload a clear photo of your government-issued ID document.</p>
            
            <div class="id-requirements" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h4>📋 Accepted Documents:</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
                    <div>
                        <h5>✅ Primary Documents:</h5>
                        <ul style="line-height: 1.6;">
                            <li>Passport (photo page)</li>
                            <li>Driving License (both sides)</li>
                            <li>National ID Card</li>
                        </ul>
                    </div>
                    <div>
                        <h5>📋 Requirements:</h5>
                        <ul style="line-height: 1.6;">
                            <li>Clear, high-resolution image</li>
                            <li>All text must be readable</li>
                            <li>Document must be current/valid</li>
                            <li>No screenshots or photocopies</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="upload-section" style="margin: 20px 0;">
                <div class="file-upload-area" style="border: 2px dashed #ccc; border-radius: 8px; padding: 40px; text-align: center; background: #fafafa;">
                    <div style="font-size: 48px; margin-bottom: 15px;">📄</div>
                    <p style="margin: 10px 0; font-size: 18px; color: #666;">Click to upload or drag and drop your ID</p>
                    <input type="file" id="idFileInput" accept="image/*,.pdf" style="display: none;" onchange="handleIdUpload(this)">
                    <button class="btn" onclick="document.getElementById('idFileInput').click()">Choose File</button>
                </div>
                
                <div id="idPreview" style="margin: 20px 0; text-align: center; display: none;">
                    <h5>Uploaded Document:</h5>
                    <img id="idPreviewImage" style="max-width: 100%; max-height: 300px; border: 1px solid #ddd; border-radius: 8px;">
                    <div id="idFileName" style="margin: 10px 0; font-weight: bold;"></div>
                </div>
            </div>
            
            <div class="verification-checklist" style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>✅ Before Submitting, Check:</h5>
                <div id="checklistItems">
                    <label><input type="checkbox" id="check1"> Document is clearly visible and readable</label><br>
                    <label><input type="checkbox" id="check2"> All corners of the document are shown</label><br>
                    <label><input type="checkbox" id="check3"> Photo and text are not blurry</label><br>
                    <label><input type="checkbox" id="check4"> Document is current and not expired</label><br>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeIdModal()">Cancel</button>
                <button class="btn" onclick="submitIdDocument()" id="submitIdBtn" disabled>Submit Document</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(idModal);
}

// Video Recording Functions
function startCamera() {
    navigator.mediaDevices.getUserMedia({ 
        video: { width: 400, height: 300 }, 
        audio: true 
    })
    .then(stream => {
        const video = document.getElementById('videoPreview');
        video.srcObject = stream;
        video.play();
        
        document.getElementById('recordingStatus').textContent = 'Camera ready';
        document.getElementById('startCameraBtn').disabled = true;
        document.getElementById('recordBtn').disabled = false;
        
        // Prepare MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            video.srcObject = null;
            video.src = url;
            video.controls = true;
            
            document.getElementById('recordingStatus').textContent = 'Recording complete - Review your video';
            document.getElementById('submitVideoBtn').disabled = false;
        };
    })
    .catch(err => {
        console.error('Camera access denied:', err);
        showNotification('❌ Camera access is required for video verification', 'error');
    });
}

function startRecording() {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
        recordedChunks = [];
        mediaRecorder.start();
        isRecording = true;
        
        document.getElementById('recordingStatus').textContent = 'Recording... Speak clearly!';
        document.getElementById('recordBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        
        // Auto-stop after 45 seconds
        setTimeout(() => {
            if (isRecording) {
                stopRecording();
            }
        }, 45000);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        isRecording = false;
        
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('recordingStatus').textContent = 'Processing recording...';
        
        // Stop camera stream
        const video = document.getElementById('videoPreview');
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}

function submitVideoVerification() {
    if (recordedChunks.length === 0) {
        showNotification('❌ Please record a video first', 'error');
        return;
    }
    
    // Save verification data
    const videoData = {
        recorded: true,
        recordedAt: new Date().toISOString(),
        duration: recordedChunks.length,
        status: 'submitted'
    };
    
    localStorage.setItem('videoVerification', JSON.stringify(videoData));
    verificationData.videoRecorded = true;
    
    closeVideoModal();
    showNotification('🎥 Video verification submitted successfully!', 'success');
    
    // Check if both video and ID are complete
    checkIdentityCompletion();
}

// ID Upload Functions
function handleIdUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('❌ File size must be less than 10MB', 'error');
        input.value = '';
        return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showNotification('❌ Please upload a valid image or PDF file', 'error');
        input.value = '';
        return;
    }
    
    // Show preview for images
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('idPreview');
            const image = document.getElementById('idPreviewImage');
            const fileName = document.getElementById('idFileName');
            
            image.src = e.target.result;
            fileName.textContent = file.name;
            preview.style.display = 'block';
            
            updateIdCheckboxes();
        };
        reader.readAsDataURL(file);
    } else {
        // For PDF files
        const preview = document.getElementById('idPreview');
        const fileName = document.getElementById('idFileName');
        const image = document.getElementById('idPreviewImage');
        
        image.style.display = 'none';
        fileName.textContent = file.name + ' (PDF Document)';
        preview.style.display = 'block';
        
        updateIdCheckboxes();
    }
}

function updateIdCheckboxes() {
    const checkboxes = ['check1', 'check2', 'check3', 'check4'];
    const submitBtn = document.getElementById('submitIdBtn');
    
    function checkAllBoxes() {
        const allChecked = checkboxes.every(id => document.getElementById(id).checked);
        submitBtn.disabled = !allChecked;
    }
    
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.onchange = checkAllBoxes;
    });
}

function submitIdDocument() {
    const fileInput = document.getElementById('idFileInput');
    if (!fileInput.files[0]) {
        showNotification('❌ Please upload an ID document first', 'error');
        return;
    }
    
    const checkboxes = ['check1', 'check2', 'check3', 'check4'];
    const allChecked = checkboxes.every(id => document.getElementById(id).checked);
    
    if (!allChecked) {
        showNotification('❌ Please confirm all checklist items', 'error');
        return;
    }
    
    // Save ID data
    const idData = {
        uploaded: true,
        fileName: fileInput.files[0].name,
        fileSize: fileInput.files[0].size,
        uploadedAt: new Date().toISOString(),
        status: 'submitted'
    };
    
    localStorage.setItem('idVerification', JSON.stringify(idData));
    verificationData.idUploaded = true;
    
    closeIdModal();
    showNotification('🆔 ID document uploaded successfully!', 'success');
    
    // Check if both video and ID are complete
    checkIdentityCompletion();
}

function checkIdentityCompletion() {
    // Check if both components are complete
    const videoData = localStorage.getItem('videoVerification');
    const idData = localStorage.getItem('idVerification');
    
    if (videoData && idData) {
        markIdentityReview();
        
        // Simulate verification process
        setTimeout(() => {
            markIdentityComplete();
            showNotification('✅ Identity verification complete!', 'success');
        }, 5000);
    } else {
        // Update progress
        const card = document.getElementById('identityCard');
        const counterText = card.querySelector('.counter-text');
        const completed = (videoData ? 1 : 0) + (idData ? 1 : 0);
        counterText.textContent = `Steps: ${completed} / 2 Complete`;
    }
}

function markIdentityReview() {
    const card = document.getElementById('identityCard');
    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator status-review';
    statusIndicator.innerHTML = '<div class="status-dot"></div><span>Under Review</span>';
    
    // Update document statuses
    const docStatuses = card.querySelectorAll('.document-status');
    docStatuses.forEach(status => {
        status.textContent = 'Review';
        status.className = 'document-status doc-pending';
    });
}

function markIdentityComplete() {
    identityStepProgress.identity = true;
    identityVerified = true;
    
    const card = document.getElementById('identityCard');
    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator status-complete';
    statusIndicator.innerHTML = '<div class="status-dot"></div><span>Complete</span>';
    
    // Update document statuses
    const docStatuses = card.querySelectorAll('.document-status');
    docStatuses.forEach(status => {
        status.textContent = 'Verified';
        status.className = 'document-status doc-approved';
    });
    
    // Update counter
    const counterText = card.querySelector('.counter-text');
    counterText.textContent = 'Steps: 2 / 2 Complete';
    
    // Update global progress
    updateOverallProgress();
}

// Modal close functions
function closeVideoModal() {
    const modal = document.getElementById('videoVerificationModal');
    if (modal) {
        // Stop camera if active
        const video = document.getElementById('videoPreview');
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        modal.remove();
    }
}

function closeIdModal() {
    const modal = document.getElementById('idUploadModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize Identity Card on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved verification data
    const savedVideo = localStorage.getItem('videoVerification');
    const savedId = localStorage.getItem('idVerification');
    
    if (savedVideo) {
        verificationData.videoRecorded = true;
    }
    
    if (savedId) {
        verificationData.idUploaded = true;
    }
    
    // Update UI based on saved data
    if (savedVideo && savedId) {
        markIdentityComplete();
    } else if (savedVideo || savedId) {
        checkIdentityCompletion();
    }
});
