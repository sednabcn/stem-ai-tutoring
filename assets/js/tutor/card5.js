// CARD 5: FIND STUDENTS - Complete Functionality
// Copy/Paste this entire block for Card 5

// Find Students Card Variables
let studentsSearched = false;
let studentsStepProgress = {
    students: true // Pre-completed as mentioned in original
};

let studentRequests = [];
let appliedRequests = [];
let favoriteRequests = [];
let currentFilters = {
    subject: 'all',
    level: 'all',
    rate: 'all',
    schedule: 'all',
    location: 'all'
};

// Mock student request data
const mockStudentRequests = [
    {
        id: 'req_001',
        studentName: 'Sarah M.',
        subject: 'GCSE Mathematics',
        level: 'GCSE',
        hourlyRate: '£25-30',
        sessionsPerWeek: 2,
        sessionLength: '1 hour',
        preferredTimes: 'Weekday evenings (6-8 PM)',
        location: 'Online',
        description: 'Looking for help with algebra and geometry. Struggling with exam preparation.',
        urgency: 'High',
        postedAgo: '2 hours ago',
        responses: 3,
        studentRating: 4.8,
        verified: true
    },
    {
        id: 'req_002',
        studentName: 'James L.',
        subject: 'A-Level Mathematics',
        level: 'A-Level',
        hourlyRate: '£35-40',
        sessionsPerWeek: 3,
        sessionLength: '1.5 hours',
        preferredTimes: 'Weekend mornings (9-12 PM)',
        location: 'Manchester (or Online)',
        description: 'Need intensive help with calculus and statistics for university applications.',
        urgency: 'Medium',
        postedAgo: '5 hours ago',
        responses: 7,
        studentRating: 4.9,
        verified: true
    },
    {
        id: 'req_003',
        studentName: 'Emma K.',
        subject: 'Primary Mathematics',
        level: 'Primary',
        hourlyRate: '£15-20',
        sessionsPerWeek: 1,
        sessionLength: '45 minutes',
        preferredTimes: 'After school (4-6 PM)',
        location: 'Online',
        description: 'Year 6 student needs help with basic arithmetic and word problems.',
        urgency: 'Low',
        postedAgo: '1 day ago',
        responses: 12,
        studentRating: 4.7,
        verified: true
    },
    {
        id: 'req_004',
        studentName: 'Michael R.',
        subject: 'University Mathematics',
        level: 'University',
        hourlyRate: '£40-50',
        sessionsPerWeek: 2,
        sessionLength: '2 hours',
        preferredTimes: 'Flexible (prefer evenings)',
        location: 'London (or Online)',
        description: 'Masters student struggling with advanced linear algebra and differential equations.',
        urgency: 'High',
        postedAgo: '3 hours ago',
        responses: 5,
        studentRating: 4.6,
        verified: true
    },
    {
        id: 'req_005',
        studentName: 'Lisa P.',
        subject: 'GCSE Mathematics',
        level: 'GCSE',
        hourlyRate: '£22-28',
        sessionsPerWeek: 1,
        sessionLength: '1 hour',
        preferredTimes: 'Saturday afternoons',
        location: 'Birmingham (or Online)',
        description: 'Need help understanding trigonometry and probability for upcoming mocks.',
        urgency: 'Medium',
        postedAgo: '6 hours ago',
        responses: 9,
        studentRating: 4.8,
        verified: false
    }
];

// Find Students Functions
function browseStudents() {
    openStudentBrowser();
}

function openStudentBrowser() {
    const browserModal = document.createElement('div');
    browserModal.className = 'modal';
    browserModal.id = 'studentBrowserModal';
    browserModal.style.display = 'block';
    
    browserModal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeStudentBrowser()">&times;</span>
            <h3>🔍 Find Students - Available Requests</h3>
            <p>Browse and apply to student tutoring requests that match your expertise.</p>
            
            <div class="search-controls" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div class="filters-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label for="subjectFilter"><strong>Subject:</strong></label>
                        <select id="subjectFilter" onchange="applyFilters()" style="width: 100%; padding: 5px;">
                            <option value="all">All Subjects</option>
                            <option value="primary">Primary Maths</option>
                            <option value="gcse">GCSE Maths</option>
                            <option value="alevel">A-Level Maths</option>
                            <option value="university">University Maths</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="rateFilter"><strong>Hourly Rate:</strong></label>
                        <select id="rateFilter" onchange="applyFilters()" style="width: 100%; padding: 5px;">
                            <option value="all">Any Rate</option>
                            <option value="15-25">£15-25</option>
                            <option value="25-35">£25-35</option>
                            <option value="35-45">£35-45</option>
                            <option value="45+">£45+</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="urgencyFilter"><strong>Urgency:</strong></label>
                        <select id="urgencyFilter" onchange="applyFilters()" style="width: 100%; padding: 5px;">
                            <option value="all">All Urgency</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="locationFilter"><strong>Location:</strong></label>
                        <select id="locationFilter" onchange="applyFilters()" style="width: 100%; padding: 5px;">
                            <option value="all">Any Location</option>
                            <option value="online">Online Only</option>
                            <option value="london">London</option>
                            <option value="manchester">Manchester</option>
                            <option value="birmingham">Birmingham</option>
                        </select>
                    </div>
                </div>
                
                <div class="search-row" style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" id="searchInput" placeholder="Search by keywords..." style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <button class="btn btn-secondary" onclick="clearFilters()">🔄 Clear Filters</button>
                    <button class="btn" onclick="applyFilters()">🔍 Search</button>
                </div>
            </div>
            
            <div class="browser-tabs" style="display: flex; border-bottom: 2px solid #eee; margin-bottom: 20px;">
                <button class="tab-btn active" onclick="showBrowserTab('all')" id="allTab">📋 All Requests (24)</button>
                <button class="tab-btn" onclick="showBrowserTab('applied')" id="appliedTab">📤 Applied (${appliedRequests.length})</button>
                <button class="tab-btn" onclick="showBrowserTab('favorites')" id="favoritesTab">⭐ Favorites (${favoriteRequests.length})</button>
                <button class="tab-btn" onclick="showBrowserTab('matches')" id="matchesTab">🎯 Best Matches (8)</button>
            </div>
            
            <div id="requestsContainer" style="max-height: 400px; overflow-y: auto;">
                <!-- Student requests will be populated here -->
            </div>
            
            <div class="browser-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                <div class="results-info">
                    <span id="resultsCount">Showing 5 of 24 requests</span>
                </div>
                <div class="pagination">
                    <button class="btn btn-secondary" onclick="loadMoreRequests()">Load More Requests</button>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeStudentBrowser()">Close</button>
                <button class="btn" onclick="refreshRequests()">🔄 Refresh Requests</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(browserModal);
    
    // Initialize with mock data
    studentRequests = [...mockStudentRequests];
    displayStudentRequests('all');
}

function showBrowserTab(tabType) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to selected tab
    document.getElementById(tabType + 'Tab').classList.add('active');
    
    // Display appropriate requests
    displayStudentRequests(tabType);
}

function displayStudentRequests(tabType) {
    const container = document.getElementById('requestsContainer');
    let requestsToShow = [];
    
    switch (tabType) {
        case 'all':
            requestsToShow = studentRequests;
            break;
        case 'applied':
            requestsToShow = studentRequests.filter(req => appliedRequests.includes(req.id));
            break;
        case 'favorites':
            requestsToShow = studentRequests.filter(req => favoriteRequests.includes(req.id));
            break;
        case 'matches':
            // Show requests that match user's profile (mock best matches)
            requestsToShow = studentRequests.filter(req => 
                req.urgency === 'High' || req.hourlyRate.includes('30') || req.hourlyRate.includes('35')
            );
            break;
    }
    
    if (requestsToShow.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 15px;">📭</div>
                <h4>No requests found</h4>
                <p>${getEmptyMessage(tabType)}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = requestsToShow.map(request => generateRequestCard(request)).join('');
    
    // Update results count
    document.getElementById('resultsCount').textContent = 
        `Showing ${requestsToShow.length} of ${studentRequests.length} requests`;
}

function generateRequestCard(request) {
    const isApplied = appliedRequests.includes(request.id);
    const isFavorite = favoriteRequests.includes(request.id);
    const urgencyColor = {
        'High': '#f44336',
        'Medium': '#ff9800',
        'Low': '#4caf50'
    };
    
    return `
        <div class="request-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 15px; background: white; transition: all 0.3s ease;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
            <div class="request-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #333;">
                        ${request.studentName} - ${request.subject}
                        ${request.verified ? '<span style="color: #4caf50; font-size: 0.8em;">✅ Verified</span>' : ''}
                    </h4>
                    <div style="display: flex; gap: 15px; align-items: center; font-size: 0.9rem; color: #666;">
                        <span>💰 ${request.hourlyRate}/hour</span>
                        <span>📅 ${request.sessionsPerWeek}x/week</span>
                        <span>⏱️ ${request.sessionLength}</span>
                        <span style="color: ${urgencyColor[request.urgency]};">🔥 ${request.urgency} Priority</span>
                    </div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="btn btn-secondary" onclick="toggleFavorite('${request.id}')" style="font-size: 0.8rem; padding: 5px 10px;">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button class="btn btn-secondary" onclick="shareRequest('${request.id}')" style="font-size: 0.8rem; padding: 5px 10px;">📤</button>
                </div>
            </div>
            
            <div class="request-details" style="margin: 15px 0;">
                <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${request.location}</p>
                <p style="margin: 5px 0;"><strong>🕒 Preferred Times:</strong> ${request.preferredTimes}</p>
                <p style="margin: 10px 0; line-height: 1.4;">${request.description}</p>
            </div>
            
            <div class="request-meta" style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; font-size: 0.9rem;">
                <div>
                    <span style="margin-right: 15px;">⭐ ${request.studentRating}/5.0 rating</span>
                    <span style="margin-right: 15px;">👥 ${request.responses} tutors applied</span>
                    <span>🕒 Posted ${request.postedAgo}</span>
                </div>
                <div style="color: ${request.responses > 10 ? '#f44336' : request.responses > 5 ? '#ff9800' : '#4caf50'};">
                    ${request.responses > 10 ? 'High Competition' : request.responses > 5 ? 'Medium Competition' : 'Low Competition'}
                </div>
            </div>
            
            <div class="request-actions" style="display: flex; gap: 10px; margin-top: 15px;">
                ${isApplied ? 
                    '<button class="btn" disabled style="background: #ccc;">✅ Applied</button>' :
                    `<button class="btn" onclick="applyToRequest('${request.id}')">📤 Apply Now</button>`
                }
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">👁️ View Details</button>
                <button class="btn btn-secondary" onclick="messageStudent('${request.id}')">💬 Send Message</button>
            </div>
        </div>
    `;
}

function getEmptyMessage(tabType) {
    const messages = {
        'all': 'No student requests available at the moment. Check back later!',
        'applied': 'You haven\'t applied to any requests yet. Browse the "All Requests" tab to get started!',
        'favorites': 'You haven\'t favorited any requests yet. Click the heart icon on requests you\'re interested in!',
        'matches': 'No matching requests found. Try updating your profile or adjusting filters!'
    };
    return messages[tabType] || 'No requests found.';
}

// Request Action Functions
function applyToRequest(requestId) {
    const request = studentRequests.find(req => req.id === requestId);
    if (!request) return;
    
    openApplicationModal(request);
}

function openApplicationModal(request) {
    const applicationModal = document.createElement('div');
    applicationModal.className = 'modal';
    applicationModal.id = 'applicationModal';
    applicationModal.style.display = 'block';
    
    applicationModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeApplicationModal()">&times;</span>
            <h3>📤 Apply to Tutor ${request.studentName}</h3>
            <p>Send a personalized application to stand out from other tutors.</p>
            
            <div class="request-summary" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>Request Summary:</h5>
                <p><strong>Subject:</strong> ${request.subject}</p>
                <p><strong>Rate:</strong> ${request.hourlyRate}/hour</p>
                <p><strong>Schedule:</strong> ${request.sessionsPerWeek}x/week, ${request.sessionLength} sessions</p>
                <p><strong>Times:</strong> ${request.preferredTimes}</p>
            </div>
            
            <div class="application-form">
                <div class="form-group" style="margin: 15px 0;">
                    <label for="proposedRate"><strong>Your Proposed Rate (£/hour):</strong></label>
                    <input type="number" id="proposedRate" min="10" max="100" value="25" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                    <small style="color: #666;">Student's budget: ${request.hourlyRate}</small>
                </div>
                
                <div class="form-group" style="margin: 15px 0;">
                    <label for="availability"><strong>Your Availability for this request:</strong></label>
                    <textarea id="availability" placeholder="e.g., I'm available on weekday evenings 6-8 PM as requested, and can also offer weekend morning slots if needed..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 60px;"></textarea>
                </div>
                
                <div class="form-group" style="margin: 15px 0;">
                    <label for="personalMessage"><strong>Personal Message:</strong></label>
                    <textarea id="personalMessage" placeholder="Write a compelling message explaining why you're the perfect tutor for this student. Mention your relevant experience, teaching approach, and how you can help them achieve their goals..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; height: 120px;"></textarea>
                </div>
                
                <div class="form-group" style="margin: 15px 0;">
                    <label for="trialOffer"><strong>Trial Session Offer:</strong></label>
                    <select id="trialOffer" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        <option value="none">No trial offer</option>
                        <option value="free30">Free 30-minute consultation</option>
                        <option value="half">50% off first session</option>
                        <option value="money-back">Money-back guarantee on first session</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin: 15px 0;">
                    <label>
                        <input type="checkbox" id="urgentResponse">
                        This is an urgent request - I can start immediately
                    </label>
                </div>
            </div>
            
            <div class="application-tips" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>💡 Application Tips:</h5>
                <ul style="margin: 5px 0; line-height: 1.4;">
                    <li>Personalize your message - mention specific details from their request</li>
                    <li>Highlight relevant experience with similar students</li>
                    <li>Explain your teaching methodology briefly</li>
                    <li>Show enthusiasm and professionalism</li>
                    <li>Respond quickly - first applications get more attention</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeApplicationModal()">Cancel</button>
                <button class="btn btn-secondary" onclick="saveDraftApplication('${request.id}')">Save Draft</button>
                <button class="btn" onclick="submitApplication('${request.id}')">📤 Send Application</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(applicationModal);
    
    // Load any saved draft
    const savedDraft = localStorage.getItem(`draft_${request.id}`);
    if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        document.getElementById('proposedRate').value = draft.rate || 25;
        document.getElementById('availability').value = draft.availability || '';
        document.getElementById('personalMessage').value = draft.message || '';
        document.getElementById('trialOffer').value = draft.trial || 'none';
        document.getElementById('urgentResponse').checked = draft.urgent || false;
    }
}

function submitApplication(requestId) {
    const rate = document.getElementById('proposedRate').value;
    const availability = document.getElementById('availability').value.trim();
    const message = document.getElementById('personalMessage').value.trim();
    const trial = document.getElementById('trialOffer').value;
    const urgent = document.getElementById('urgentResponse').checked;
    
    // Validation
    if (!rate || rate < 10 || rate > 100) {
        showNotification('❌ Please enter a valid hourly rate between £10-100', 'error');
        return;
    }
    
    if (!availability || availability.length < 20) {
        showNotification('❌ Please provide detailed availability information', 'error');
        return;
    }
    
    if (!message || message.length < 50) {
        showNotification('❌ Please write a detailed personal message (minimum 50 characters)', 'error');
        return;
    }
    
    // Save application
    const applicationData = {
        requestId: requestId,
        rate: rate,
        availability: availability,
        message: message,
        trial: trial,
        urgent: urgent,
        appliedAt: new Date().toISOString(),
        status: 'sent'
    };
    
    // Add to applied requests
    appliedRequests.push(requestId);
    
    // Save to storage
    localStorage.setItem('appliedRequests', JSON.stringify(appliedRequests));
    localStorage.setItem(`application_${requestId}`, JSON.stringify(applicationData));
    
    // Remove draft
    localStorage.removeItem(`draft_${requestId}`);
    
    closeApplicationModal();
    
    // Update display
    displayStudentRequests('all');
    showNotification('📤 Application sent successfully!', 'success');
    
    // Update tab counts
    document.getElementById('appliedTab').textContent = `📤 Applied (${appliedRequests.length})`;
}

function saveDraftApplication(requestId) {
    const draftData = {
        rate: document.getElementById('proposedRate').value,
        availability: document.getElementById('availability').value,
        message: document.getElementById('personalMessage').value,
        trial: document.getElementById('trialOffer').value,
        urgent: document.getElementById('urgentResponse').checked,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`draft_${requestId}`, JSON.stringify(draftData));
    showNotification('💾 Application draft saved', 'info');
}

function viewRequestDetails(requestId) {
    const request = studentRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const detailsContent = `
        <div style="max-height: 400px; overflow-y: auto; padding: 15px;">
            <div class="student-profile" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4>👤 Student Profile</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div><strong>Name:</strong> ${request.studentName}</div>
                    <div><strong>Rating:</strong> ⭐ ${request.studentRating}/5.0</div>
                    <div><strong>Verified:</strong> ${request.verified ? '✅ Yes' : '❌ No'}</div>
                    <div><strong>Posted:</strong> ${request.postedAgo}</div>
                </div>
            </div>
            
            <div class="request-details" style="margin: 20px 0;">
                <h4>📋 Request Details</h4>
                <div style="line-height: 1.6;">
                    <p><strong>Subject:</strong> ${request.subject}</p>
                    <p><strong>Level:</strong> ${request.level}</p>
                    <p><strong>Budget:</strong> ${request.hourlyRate}/hour</p>
                    <p><strong>Sessions:</strong> ${request.sessionsPerWeek} per week, ${request.sessionLength} each</p>
                    <p><strong>Schedule:</strong> ${request.preferredTimes}</p>
                    <p><strong>Location:</strong> ${request.location}</p>
                    <p><strong>Priority:</strong> ${request.urgency}</p>
                </div>
            </div>
            
            <div class="description" style="margin: 20px 0;">
                <h4>📝 Student's Message</h4>
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
                    "${request.description}"
                </div>
            </div>
            
            <div class="competition" style="margin: 20px 0;">
                <h4>📊 Competition Analysis</h4>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px;">
                    <p><strong>Tutors Applied:</strong> ${request.responses}</p>
                    <p><strong>Competition Level:</strong> ${request.responses > 10 ? '🔴 High' : request.responses > 5 ? '🟡 Medium' : '🟢 Low'}</p>
                    <p><strong>Success Tip:</strong> ${getSuccessTip(request.responses)}</p>
                </div>
            </div>
        </div>
    `;
    
    showCustomModal(`Request Details - ${request.studentName}`, detailsContent);
}

function getSuccessTip(responses) {
    if (responses > 10) return 'Act fast! Personalize your application and highlight unique value.';
    if (responses > 5) return 'Good timing! Focus on relevant experience and competitive pricing.';
    return 'Great opportunity! You have a good chance - write a compelling application.';
}

function messageStudent(requestId) {
    const request = studentRequests.find(req => req.id === requestId);
    if (!request) return;
    
    showNotification('💬 Direct messaging feature coming soon! Apply to the request to get in touch.', 'info');
}

function toggleFavorite(requestId) {
    const index = favoriteRequests.indexOf(requestId);
    if (index >= 0) {
        favoriteRequests.splice(index, 1);
        showNotification('💔 Removed from favorites', 'info');
    } else {
        favoriteRequests.push(requestId);
        showNotification('❤️ Added to favorites', 'success');
    }
    
    localStorage.setItem('favoriteRequests', JSON.stringify(favoriteRequests));
    
    // Update display
    displayStudentRequests('all');
    
    // Update tab count
    document.getElementById('favoritesTab').textContent = `⭐ Favorites (${favoriteRequests.length})`;
}

function shareRequest(requestId) {
    if (navigator.share) {
        navigator.share({
            title: 'Math Tutoring Opportunity',
            text: 'Check out this tutoring request!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`Math tutoring request ID: ${requestId}`);
        showNotification('📋 Request details copied to clipboard!', 'success');
    }
}

// Filter and Search Functions
function applyFilters() {
    // Get filter values
    currentFilters.subject = document.getElementById('subjectFilter').value;
    currentFilters.rate = document.getElementById('rateFilter').value;
    currentFilters.urgency = document.getElementById('urgencyFilter').value;
    currentFilters.location = document.getElementById('locationFilter').value;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Apply filters
    let filteredRequests = studentRequests.filter(request => {
        // Subject filter
        if (currentFilters.subject !== 'all') {
            const subjectMatch = {
                'primary': request.level === 'Primary',
                'gcse': request.level === 'GCSE',
                'alevel': request.level === 'A-Level',
                'university': request.level === 'University'
            };
            if (!subjectMatch[currentFilters.subject]) return false;
        }
        
        // Rate filter
        if (currentFilters.rate !== 'all') {
            const rateNum = parseInt(request.hourlyRate.match(/\d+/)[0]);
            const rateRanges = {
                '15-25': rateNum >= 15 && rateNum <= 25,
                '25-35': rateNum >= 25 && rateNum <= 35,
                '35-45': rateNum >= 35 && rateNum <= 45,
                '45+': rateNum >= 45
            };
            if (!rateRanges[currentFilters.rate]) return false;
        }
        
        // Urgency filter
        if (currentFilters.urgency !== 'all' && request.urgency.toLowerCase() !== currentFilters.urgency) {
            return false;
        }
        
        // Location filter
        if (currentFilters.location !== 'all') {
            const locationMatch = request.location.toLowerCase().includes(currentFilters.location);
            if (!locationMatch) return false;
        }
        
        // Search term
        if (searchTerm) {
            const searchableText = `${request.subject} ${request.description} ${request.studentName}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }
        
        return true;
    });
    
    // Update display with filtered results
    const container = document.getElementById('requestsContainer');
    container.innerHTML = filteredRequests.map(request => generateRequestCard(request)).join('');
    
    document.getElementById('resultsCount').textContent = 
        `Showing ${filteredRequests.length} of ${studentRequests.length} requests`;
}

function clearFilters() {
    document.getElementById('subjectFilter').value = 'all';
    document.getElementById('rateFilter').value = 'all';
    document.getElementById('urgencyFilter').value = 'all';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    
    currentFilters = {
        subject: 'all',
        rate: 'all',
        urgency: 'all',
        location: 'all'
    };
    
    displayStudentRequests('all');
}

function loadMoreRequests() {
    // Simulate loading more requests
    const additionalStars = ['⭐', '🌟', '✨', '💫', '🔥'];
    const additionalRequests = [
        {
            id: 'req_new_' + Date.now(),
            studentName: 'Alex T.',
            subject: 'GCSE Mathematics',
            level: 'GCSE',
            hourlyRate: '£20-25',
            sessionsPerWeek: 1,
            sessionLength: '1 hour',
            preferredTimes: 'Thursday evenings',
            location: 'Online',
            description: 'Need help with quadratic equations and graph plotting.',
            urgency: 'Medium',
            postedAgo: 'Just now',
            responses: 1,
            studentRating: 4.5,
            verified: true
        }
    ];
    
    studentRequests.push(...additionalRequests);
    displayStudentRequests('all');
    showNotification('📥 New requests loaded!', 'success');
}

function refreshRequests() {
    // Simulate refreshing with new requests
    showNotification('🔄 Refreshing requests...', 'info');
    
    setTimeout(() => {
        // Update posted times
        studentRequests.forEach(req => {
            const hours = Math.floor(Math.random() * 24) + 1;
            req.postedAgo = `${hours} hours ago`;
        });
        
        displayStudentRequests('all');
        showNotification('✅ Requests updated!', 'success');
    }, 1000);
}

// Modal close functions
function closeStudentBrowser() {
    const modal = document.getElementById('studentBrowserModal');
    if (modal) {
        modal.remove();
    }
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize Find Students Card on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data
    const savedApplied = localStorage.getItem('appliedRequests');
    if (savedApplied) {
        appliedRequests = JSON.parse(savedApplied);
    }
    
    const savedFavorites = localStorage.getItem('favoriteRequests');
    if (savedFavorites) {
        favoriteRequests = JSON.parse(savedFavorites);
    }
    
    // Update card counter
    const counterText = document.querySelector('#studentsCard .counter-text');
    if (counterText) {
        counterText.textContent = `Available Requests: ${mockStudentRequests.length}`;
    }
    
    // Add browser styles
    const browserStyles = document.createElement('style');
    browserStyles.textContent = `
        .request-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        .tab-btn {
            padding: 10px 20px;
            border: none;
            background: #f5f5f5;
            cursor: pointer;
            border-radius: 5px 5px 0 0;
            margin-right: 5px;
            transition: all 0.3s ease;
        }
        .tab-btn.active {
            background: #4caf50;
            color: white;
        }
        .tab-btn:hover {
            background: #e8f5e9;
        }
        .tab-btn.active:hover {
            background: #388e3c;
        }
        .form-group label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        .filters-row select {
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .search-row input {
            border: 1px solid #ccc;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(browserStyles);
});
