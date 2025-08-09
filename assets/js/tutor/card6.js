// CARD 6: UPLOAD TEACHING RESOURCES - Complete Functionality
// Copy/Paste this entire block for Card 6

// Teaching Resources Card Variables
let resourcesUploaded = false;
let resourcesStepProgress = {
    resources: false
};
let uploadedResources = [];
let resourceCategories = {
    worksheets: [],
    lessonPlans: [],
    presentations: [],
    assessments: [],
    examples: [],
    games: [],
    other: []
};
const maxResources = 10;

// Teaching Resources Functions
function uploadResources() {
    openResourcesUploadModal();
}

function viewExamples() {
    showResourceExamples();
}

function createResource() {
    openResourceCreator();
}

function openResourcesUploadModal() {
    const resourcesModal = document.createElement('div');
    resourcesModal.className = 'modal';
    resourcesModal.id = 'resourcesModal';
    resourcesModal.style.display = 'block';
    
    resourcesModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeResourcesModal()">&times;</span>
            <h3>📚 Upload Teaching Resources</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4>📁 Resource Categories</h4>
                    <div class="category-list">
                        <div class="category-item">
                            <i class="fas fa-file-alt"></i>
                            <span>Worksheets</span>
                            <span class="count">(${resourceCategories.worksheets.length})</span>
                        </div>
                        <div class="category-item">
                            <i class="fas fa-clipboard-list"></i>
                            <span>Lesson Plans</span>
                            <span class="count">(${resourceCategories.lessonPlans.length})</span>
                        </div>
                        <div class="category-item">
                            <i class="fas fa-presentation"></i>
                            <span>Presentations</span>
                            <span class="count">(${resourceCategories.presentations.length})</span>
                        </div>
                        <div class="category-item">
                            <i class="fas fa-tasks"></i>
                            <span>Assessments</span>
                            <span class="count">(${resourceCategories.assessments.length})</span>
                        </div>
                        <div class="category-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>Examples</span>
                            <span class="count">(${resourceCategories.examples.length})</span>
                        </div>
                        <div class="category-item">
                            <i class="fas fa-gamepad"></i>
                            <span>Games</span>
                            <span class="count">(${resourceCategories.games.length})</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4>📊 Upload Progress</h4>
                    <div class="upload-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(uploadedResources.length / maxResources) * 100}%"></div>
                        </div>
                        <p>${uploadedResources.length} / ${maxResources} Resources Uploaded</p>
                    </div>
                    
                    <div class="resource-quality-tips" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <h5>💡 Quality Tips:</h5>
                        <ul style="margin: 5px 0; padding-left: 20px; font-size: 0.9rem;">
                            <li>Clear, readable content</li>
                            <li>Grade-level appropriate</li>
                            <li>Include answer keys</li>
                            <li>Use professional formatting</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="upload-area" style="border: 2px dashed #ccc; padding: 40px; text-align: center; border-radius: 8px; margin: 20px 0; cursor: pointer;" onclick="selectResourceFiles()">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                <h4>Drag & Drop Files Here</h4>
                <p>or <button class="btn btn-secondary" onclick="selectResourceFiles()">Choose Files</button></p>
                <input type="file" id="resourceFileInput" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" style="display: none;" onchange="handleResourceUpload(this)">
                <p style="margin-top: 15px; color: #666; font-size: 0.9rem;">
                    Accepted formats: PDF, DOC, PPT, Images • Max 5MB per file
                </p>
            </div>
            
            <div class="uploaded-resources" id="uploadedResourcesList">
                <h4>📎 Uploaded Resources</h4>
                <div id="resourcesContainer">
                    ${generateUploadedResourcesList()}
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeResourcesModal()">Close</button>
                <button class="btn" onclick="createNewResource()">Create New Resource</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(resourcesModal);
}

function selectResourceFiles() {
    document.getElementById('resourceFileInput').click();
}

function handleResourceUpload(input) {
    if (input.files.length > 0) {
        // Use for...of instead of forEach to support break
        for (const file of Array.from(input.files)) {
            if (uploadedResources.length < maxResources) {
                const resource = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: getResourceType(file.name),
                    uploadDate: new Date().toLocaleDateString()
                };
                
                uploadedResources.push(resource);
                resourceCategories[resource.type].push(resource);
                
                showNotification(`${file.name} uploaded successfully!`, 'success');
            } else {
                showNotification('Maximum resources limit reached', 'warning');
                break; // Now this works!
            }
        }
        
        updateResourcesModal();
        updateResourcesCard();
        
        if (uploadedResources.length >= 3) {
            resourcesStepProgress.resources = true;
            resourcesUploaded = true;
            updateOverallProgress();
        }
    }
}

function getResourceType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'worksheets';
    if (['doc', 'docx'].includes(extension)) return 'lessonPlans';
    if (['ppt', 'pptx'].includes(extension)) return 'presentations';
    if (['jpg', 'png', 'jpeg'].includes(extension)) return 'examples';
    return 'other';
}

function generateUploadedResourcesList() {
    if (uploadedResources.length === 0) {
        return '<p style="text-align: center; color: #666; padding: 20px;">No resources uploaded yet</p>';
    }
    
    return uploadedResources.map(resource => `
        <div class="resource-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border: 1px solid #eee; border-radius: 5px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-file" style="color: #666;"></i>
                <div>
                    <div style="font-weight: 500;">${resource.name}</div>
                    <div style="font-size: 0.8rem; color: #666;">${(resource.size / 1024 / 1024).toFixed(2)} MB • ${resource.uploadDate}</div>
                </div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="btn btn-secondary btn-sm" onclick="previewResource(${resource.id})">Preview</button>
                <button class="btn btn-danger btn-sm" onclick="removeResource(${resource.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateResourcesModal() {
    const container = document.getElementById('resourcesContainer');
    if (container) {
        container.innerHTML = generateUploadedResourcesList();
    }
    
    // Update progress bar
    const progressFill = document.querySelector('#resourcesModal .progress-fill');
    if (progressFill) {
        progressFill.style.width = `${(uploadedResources.length / maxResources) * 100}%`;
    }
    
    // Update counters
    const progressText = document.querySelector('#resourcesModal .upload-progress p');
    if (progressText) {
        progressText.textContent = `${uploadedResources.length} / ${maxResources} Resources Uploaded`;
    }
}

function removeResource(resourceId) {
    const index = uploadedResources.findIndex(r => r.id === resourceId);
    if (index > -1) {
        const resource = uploadedResources[index];
        uploadedResources.splice(index, 1);
        
        // Remove from category
        const categoryIndex = resourceCategories[resource.type].findIndex(r => r.id === resourceId);
        if (categoryIndex > -1) {
            resourceCategories[resource.type].splice(categoryIndex, 1);
        }
        
        updateResourcesModal();
        updateResourcesCard();
        showNotification('Resource removed', 'info');
        
        if (uploadedResources.length < 3) {
            resourcesStepProgress.resources = false;
            resourcesUploaded = false;
            updateOverallProgress();
        }
    }
}

function previewResource(resourceId) {
    showNotification('Resource preview opened', 'info');
}

function createNewResource() {
    openResourceCreator();
}

function openResourceCreator() {
    closeResourcesModal();
    
    const creatorModal = document.createElement('div');
    creatorModal.className = 'modal';
    creatorModal.id = 'resourceCreatorModal';
    creatorModal.style.display = 'block';
    
    creatorModal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <span class="close" onclick="closeResourceCreatorModal()">&times;</span>
            <h3>✨ Create New Teaching Resource</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
                <div>
                    <h4>📝 Resource Details</h4>
                    
                    <div class="form-group">
                        <label for="resourceTitle">Title:</label>
                        <input type="text" id="resourceTitle" placeholder="e.g., Algebra Basics Worksheet">
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceType">Type:</label>
                        <select id="resourceType">
                            <option value="worksheets">Worksheet</option>
                            <option value="lessonPlans">Lesson Plan</option>
                            <option value="presentations">Presentation</option>
                            <option value="assessments">Assessment</option>
                            <option value="examples">Example</option>
                            <option value="games">Game/Activity</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="gradeLevel">Grade Level:</label>
                        <select id="gradeLevel">
                            <option value="elementary">Elementary (K-5)</option>
                            <option value="middle">Middle School (6-8)</option>
                            <option value="high">High School (9-12)</option>
                            <option value="college">College/University</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Subject:</label>
                        <select id="subject">
                            <option value="algebra">Algebra</option>
                            <option value="geometry">Geometry</option>
                            <option value="calculus">Calculus</option>
                            <option value="statistics">Statistics</option>
                            <option value="arithmetic">Arithmetic</option>
                            <option value="trigonometry">Trigonometry</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="difficulty">Difficulty:</label>
                        <select id="difficulty">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="duration">Duration (minutes):</label>
                        <input type="number" id="duration" min="5" max="120" value="30">
                    </div>
                </div>
                
                <div>
                    <h4>📄 Resource Content</h4>
                    
                    <div class="form-group">
                        <label for="resourceDescription">Description:</label>
                        <textarea id="resourceDescription" rows="3" placeholder="Brief description of the resource and its objectives..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="learningObjectives">Learning Objectives:</label>
                        <textarea id="learningObjectives" rows="3" placeholder="What will students learn from this resource?"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="resourceContent">Content/Instructions:</label>
                        <textarea id="resourceContent" rows="8" placeholder="Enter the main content, problems, or instructions here..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="answerKey">Answer Key (if applicable):</label>
                        <textarea id="answerKey" rows="4" placeholder="Provide answers or solutions..."></textarea>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeResourceCreatorModal()">Cancel</button>
                <button class="btn btn-secondary" onclick="saveResourceDraft()">Save Draft</button>
                <button class="btn" onclick="createAndSaveResource()">Create Resource</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(creatorModal);
}

function createAndSaveResource() {
    const title = document.getElementById('resourceTitle').value.trim();
    const type = document.getElementById('resourceType').value;
    const description = document.getElementById('resourceDescription').value.trim();
    const content = document.getElementById('resourceContent').value.trim();
    
    if (!title || !description || !content) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const resource = {
        id: Date.now() + Math.random(),
        name: title + '.pdf',
        size: Math.random() * 1000000, // Simulated size
        type: type,
        uploadDate: new Date().toLocaleDateString(),
        created: true,
        description: description,
        content: content
    };
    
    uploadedResources.push(resource);
    resourceCategories[type].push(resource);
    
    showNotification('Resource created successfully!', 'success');
    closeResourceCreatorModal();
    updateResourcesCard();
    
    if (uploadedResources.length >= 3) {
        resourcesStepProgress.resources = true;
        resourcesUploaded = true;
        updateOverallProgress();
    }
}

function saveResourceDraft() {
    showNotification('Draft saved successfully!', 'success');
}

function closeResourceCreatorModal() {
    const modal = document.getElementById('resourceCreatorModal');
    if (modal) {
        modal.remove();
    }
}

function closeResourcesModal() {
    const modal = document.getElementById('resourcesModal');
    if (modal) {
        modal.remove();
    }
}

function showResourceExamples() {
    const examplesModal = document.createElement('div');
    examplesModal.className = 'modal';
    examplesModal.id = 'examplesModal';
    examplesModal.style.display = 'block';
    
    examplesModal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <span class="close" onclick="closeExamplesModal()">&times;</span>
            <h3>📚 Resource Examples</h3>
            
            <div class="examples-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="example-item">
                    <h4>📄 Algebra Worksheet</h4>
                    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f8f9fa" stroke="#dee2e6"/><text x="100" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#495057">Sample Worksheet</text><text x="20" y="60" font-family="Arial" font-size="12" fill="#6c757d">1. Solve: 2x + 5 = 15</text><text x="20" y="80" font-family="Arial" font-size="12" fill="#6c757d">2. Find x: 3x - 7 = 14</text><text x="20" y="100" font-family="Arial" font-size="12" fill="#6c757d">3. Simplify: 4(x + 3)</text></svg>')}" style="width: 100%; border-radius: 5px;">
                    <p style="font-size: 0.9rem; color: #666;">Basic algebra problems with step-by-step solutions</p>
                </div>
                
                <div class="example-item">
                    <h4>📊 Geometry Guide</h4>
                    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f8f9fa" stroke="#dee2e6"/><text x="100" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#495057">Geometry Reference</text><circle cx="50" cy="70" r="20" fill="none" stroke="#007bff" stroke-width="2"/><rect x="80" y="50" width="40" height="40" fill="none" stroke="#28a745" stroke-width="2"/><polygon points="140,90 160,50 180,90" fill="none" stroke="#dc3545" stroke-width="2"/></svg>')}" style="width: 100%; border-radius: 5px;">
                    <p style="font-size: 0.9rem; color: #666;">Visual geometry reference with shapes and formulas</p>
                </div>
                
                <div class="example-item">
                    <h4>🎮 Math Game</h4>
                    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f8f9fa" stroke="#dee2e6"/><text x="100" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#495057">Math Bingo</text><rect x="40" y="50" width="120" height="80" fill="none" stroke="#6f42c1" stroke-width="2"/><text x="60" y="70" font-family="Arial" font-size="10" fill="#6f42c1">15</text><text x="80" y="70" font-family="Arial" font-size="10" fill="#6f42c1">7</text><text x="100" y="70" font-family="Arial" font-size="10" fill="#6f42c1">23</text><text x="120" y="70" font-family="Arial" font-size="10" fill="#6f42c1">9</text><text x="140" y="70" font-family="Arial" font-size="10" fill="#6f42c1">31</text></svg>')}" style="width: 100%; border-radius: 5px;">
                    <p style="font-size: 0.9rem; color: #666;">Interactive math games for engagement</p>
                </div>
                
                <div class="example-item">
                    <h4>📋 Assessment</h4>
                    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f8f9fa" stroke="#dee2e6"/><text x="100" y="30" text-anchor="middle" font-family="Arial" font-size="14" fill="#495057">Quiz Template</text><text x="20" y="60" font-family="Arial" font-size="12" fill="#6c757d">Q1: Multiple Choice</text><circle cx="30" cy="75" r="3" fill="none" stroke="#6c757d"/><text x="40" y="80" font-family="Arial" font-size="10" fill="#6c757d">A) Option 1</text><text x="20" y="100" font-family="Arial" font-size="12" fill="#6c757d">Q2: Short Answer</text><line x1="20" y1="115" x2="180" y2="115" stroke="#6c757d" stroke-width="1"/></svg>')}" style="width: 100%; border-radius: 5px;">
                    <p style="font-size: 0.9rem; color: #666;">Structured assessments with answer keys</p>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4>💡 Best Practices:</h4>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Include clear instructions and objectives</li>
                    <li>Provide answer keys for all problems</li>
                    <li>Use appropriate difficulty for grade level</li>
                    <li>Add visual elements to enhance understanding</li>
                    <li>Test resources before using with students</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 20px;">
                <button class="btn" onclick="openResourceCreator(); closeExamplesModal();">Create My Resource</button>
                <button class="btn btn-secondary" onclick="closeExamplesModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(examplesModal);
}

function closeExamplesModal() {
    const modal = document.getElementById('examplesModal');
    if (modal) {
        modal.remove();
    }
}

function updateResourcesCard() {
    const card = document.getElementById('resourcesCard');
    const statusIndicator = card.querySelector('.status-indicator');
    const counter = card.querySelector('#resourceCount');
    
    if (counter) {
        counter.textContent = uploadedResources.length;
    }
    
    if (resourcesUploaded && uploadedResources.length >= 3) {
        statusIndicator.className = 'status-indicator status-complete';
        statusIndicator.innerHTML = '<div class="status-dot"></div><span>Active</span>';
        card.classList.add('completed-card');
    } else if (uploadedResources.length > 0) {
        statusIndicator.className = 'status-indicator status-in-progress';
        statusIndicator.innerHTML = '<div class="status-dot"></div><span>In Progress</span>';
    }
}
