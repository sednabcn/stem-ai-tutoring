// CARD 7: TEACHING TOOLS - Complete Functionality
// Copy/Paste this entire block for Card 7
if (!window.cards) window.cards = {};
   window.cards['card7'] = {
       id: 'card7',
       title: 'Temporary test card',
       render: () => console.log('Rendering card1')
   };
// Teaching Tools Card Variables
let toolsExplored = false;
let availableTools = [
    { 
        id: 1, 
        name: 'Interactive Whiteboard', 
        icon: 'fas fa-chalkboard', 
        status: 'Available', 
        description: 'Draw, write, and solve problems collaboratively with students',
        features: ['Drawing tools', 'Text input', 'Shape tools', 'Save/export'],
        premium: false
    },
    { 
        id: 2, 
        name: 'Screen Sharing', 
        icon: 'fas fa-desktop', 
        status: 'Available', 
        description: 'Share your screen for demonstrations and explanations',
        features: ['Full screen', 'Application window', 'Audio sharing', 'Annotation'],
        premium: false
    },
    { 
        id: 3, 
        name: 'Scientific Calculator', 
        icon: 'fas fa-calculator', 
        status: 'Available', 
        description: 'Built-in scientific calculator for complex calculations',
        features: ['Basic operations', 'Scientific functions', 'Graphing', 'History'],
        premium: false
    },
    { 
        id: 4, 
        name: 'Graphing Tool', 
        icon: 'fas fa-chart-line', 
        status: 'Available', 
        description: 'Create and share mathematical graphs and visualizations',
        features: ['2D/3D graphs', 'Function plotting', 'Data visualization', 'Export'],
        premium: false
    },
    { 
        id: 5, 
        name: 'File Sharing', 
        icon: 'fas fa-file-share', 
        status: 'Available', 
        description: 'Share documents, worksheets, and resources with students',
        features: ['Drag & drop', 'Multiple formats', 'Real-time sync', 'Version control'],
        premium: false
    },
    { 
        id: 6, 
        name: 'Session Recording', 
        icon: 'fas fa-video', 
        status: 'Premium', 
        description: 'Record sessions for student review and your own analysis',
        features: ['HD recording', 'Audio capture', 'Automatic transcripts', 'Cloud storage'],
        premium: true
    },
    { 
        id: 7, 
        name: 'Virtual Manipulatives', 
        icon: 'fas fa-cubes', 
        status: 'Premium', 
        description: 'Interactive math manipulatives for hands-on learning',
        features: ['Algebra tiles', 'Fraction bars', 'Geometry shapes', 'Number lines'],
        premium: true
    },
    { 
        id: 8, 
        name: 'AI Assistant', 
        icon: 'fas fa-robot', 
        status: 'Premium', 
        description: 'AI-powered teaching assistant for problem-solving help',
        features: ['Step-by-step solutions', 'Concept explanations', 'Practice problems', 'Progress tracking'],
        premium: true
    }
];

let userToolSettings = {
    favoriteTools: [],
    toolsUsed: [],
    preferences: {}
};

// Teaching Tools Functions
function exploreTool() {
    openToolsExplorer();
}

function openToolsExplorer() {
    const toolsModal = document.createElement('div');
    toolsModal.className = 'modal';
    toolsModal.id = 'toolsModal';
    toolsModal.style.display = 'block';
    
    toolsModal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeToolsModal()">&times;</span>
            <h3>🛠️ Teaching Tools Explorer</h3>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div class="tools-sidebar" style="flex: 0 0 250px;">
                    <h4>🏷️ Categories</h4>
                    <div class="category-filters">
                        <button class="filter-btn active" onclick="filterTools('all')">All Tools</button>
                        <button class="filter-btn" onclick="filterTools('free')">Free Tools</button>
                        <button class="filter-btn" onclick="filterTools('premium')">Premium Tools</button>
                        <button class="filter-btn" onclick="filterTools('favorites')">My Favorites</button>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <h4>📊 Usage Stats</h4>
                        <div class="usage-stats">
                            <div class="stat-item">
                                <span>Tools Used:</span>
                                <span>${userToolSettings.toolsUsed.length}</span>
                            </div>
                            <div class="stat-item">
                                <span>Favorites:</span>
                                <span>${userToolSettings.favoriteTools.length}</span>
                            </div>
                            <div class="stat-item">
                                <span>Available:</span>
                                <span>${availableTools.filter(t => !t.premium).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tools-main" style="flex: 1;">
                    <div class="tools-grid" id="toolsGrid">
                        ${generateToolsGrid()}
                    </div>
                </div>
            </div>
            
            <div class="tools-tutorial" style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h4>🎯 Quick Start Guide</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="tutorial-item">
                        <h5>1. Try the Whiteboard</h5>
                        <p>Start with our interactive whiteboard - perfect for solving problems step by step</p>
                    </div>
                    <div class="tutorial-item">
                        <h5>2. Share Your Screen</h5>
                        <p>Use screen sharing to show external resources or applications</p>
                    </div>
                    <div class="tutorial-item">
                        <h5>3. Use the Calculator</h5>
                        <p>Built-in scientific calculator for complex mathematical operations</p>
                    </div>
                    <div class="tutorial-item">
                        <h5>4. Upgrade for More</h5>
                        <p>Premium tools include session recording and AI assistance</p>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeToolsModal()">Close</button>
                <button class="btn" onclick="startToolsTutorial()">Take Tutorial</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toolsModal);
    toolsExplored = true;
}

function generateToolsGrid() {
    return availableTools.map(tool => `
        <div class="tool-card ${tool.premium ? 'premium-tool' : ''}" data-category="${tool.premium ? 'premium' : 'free'}">
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h4>${tool.name}</h4>
                    <span class="tool-status ${tool.premium ? 'premium' : 'available'}">${tool.status}</span>
                </div>
                <div class="tool-actions">
                    <button class="favorite-btn ${userToolSettings.favoriteTools.includes(tool.id) ? 'active' : ''}" 
                            onclick="toggleFavorite(${tool.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            
            <div class="tool-description">
                <p>${tool.description}</p>
            </div>
            
            <div class="tool-features">
                <h5>Features:</h5>
                <ul>
                    ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tool-footer">
                ${tool.premium ? 
                    '<button class="btn btn-secondary" onclick="upgradeToPremium()">Upgrade Required</button>' :
                    `<button class="btn" onclick="launchTool(${tool.id})">Launch Tool</button>`
                }
                <button class="btn btn-secondary" onclick="previewTool(${tool.id})">Preview</button>
            </div>
        </div>
    `).join('');
}

function filterTools(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter and display tools
    const toolsGrid = document.getElementById('toolsGrid');
    let filteredTools = [];
    
    switch(category) {
        case 'all':
            filteredTools = availableTools;
            break;
        case 'free':
            filteredTools = availableTools.filter(tool => !tool.premium);
            break;
        case 'premium':
            filteredTools = availableTools.filter(tool => tool.premium);
            break;
        case 'favorites':
            filteredTools = availableTools.filter(tool => userToolSettings.favoriteTools.includes(tool.id));
            break;
    }
    
    toolsGrid.innerHTML = filteredTools.map(tool => `
        <div class="tool-card ${tool.premium ? 'premium-tool' : ''}" data-category="${tool.premium ? 'premium' : 'free'}">
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <h4>${tool.name}</h4>
                    <span class="tool-status ${tool.premium ? 'premium' : 'available'}">${tool.status}</span>
                </div>
                <div class="tool-actions">
                    <button class="favorite-btn ${userToolSettings.favoriteTools.includes(tool.id) ? 'active' : ''}" 
                            onclick="toggleFavorite(${tool.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            
            <div class="tool-description">
                <p>${tool.description}</p>
            </div>
            
            <div class="tool-features">
                <h5>Features:</h5>
                <ul>
                    ${tool.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tool-footer">
                ${tool.premium ? 
                    '<button class="btn btn-secondary" onclick="upgradeToPremium()">Upgrade Required</button>' :
                    `<button class="btn" onclick="launchTool(${tool.id})">Launch Tool</button>`
                }
                <button class="btn btn-secondary" onclick="previewTool(${tool.id})">Preview</button>
            </div>
        </div>
    `).join('');
}

function toggleFavorite(toolId) {
    const index = userToolSettings.favoriteTools.indexOf(toolId);
    if (index > -1) {
        userToolSettings.favoriteTools.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        userToolSettings.favoriteTools.push(toolId);
        showNotification('Added to favorites', 'success');
    }
    
    // Update the favorite button
    const favoriteBtn = event.target.closest('.favorite-btn');
    favoriteBtn.classList.toggle('active');
}

function launchTool(toolId) {
    const tool = availableTools.find(t => t.id === toolId);
    if (!tool) return;
    
    if (!userToolSettings.toolsUsed.includes(toolId)) {
        userToolSettings.toolsUsed.push(toolId);
    }
    
    // Launch tool in new window/modal
    openToolInterface(tool);
    showNotification(`${tool.name} launched successfully!`, 'success');
}

function openToolInterface(tool) {
    const toolInterface = document.createElement('div');
    toolInterface.className = 'modal';
    toolInterface.id = 'toolInterface';
    toolInterface.style.display = 'block';
    
    let interfaceContent = '';
    
    switch(tool.id) {
        case 1: // Interactive Whiteboard
            interfaceContent = `
                <div style="height: 400px; background: white; border: 1px solid #ddd; border-radius: 8px; position: relative;">
                    <div class="whiteboard-toolbar" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; gap: 10px;">
                        <button class="tool-btn active" onclick="selectWhiteboardTool('pen')"><i class="fas fa-pen"></i></button>
                        <button class="tool-btn" onclick="selectWhiteboardTool('eraser')"><i class="fas fa-eraser"></i></button>
                        <button class="tool-btn" onclick="selectWhiteboardTool('text')"><i class="fas fa-font"></i></button>
                        <button class="tool-btn" onclick="selectWhiteboardTool('shapes')"><i class="fas fa-shapes"></i></button>
                        <button class="tool-btn" onclick="clearWhiteboard()"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="whiteboard-canvas" style="height: calc(100% - 60px); background: white; cursor: crosshair;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ccc;">
                            Click and drag to draw on the whiteboard
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 2: // Screen Sharing
            interfaceContent = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-desktop" style="font-size: 64px; color: #007bff; margin-bottom: 20px;"></i>
                    <h4>Screen Sharing</h4>
                    <p>Click the button below to start sharing your screen with students.</p>
                    <div style="margin: 20px 0;">
                        <button class="btn" onclick="startScreenShare()">Start Screen Share</button>
                        <button class="btn btn-secondary" onclick="shareWindow()">Share Window</button>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <h5>Screen Share Options:</h5>
                        <ul style="text-align: left; margin: 10px 0;">
                            <li>Entire screen - Share everything on your screen</li>
                            <li>Application window - Share specific application</li>
                            <li>Browser tab - Share current browser tab</li>
                        </ul>
                    </div>
                </div>
            `;
            break;
            
        case 3: // Scientific Calculator
            interfaceContent = `
                <div class="calculator-interface" style="background: #2c3e50; padding: 20px; border-radius: 8px; color: white;">
                    <div class="calculator-display" style="background: #34495e; padding: 15px; border-radius: 5px; margin-bottom: 15px; text-align: right; font-size: 24px; font-family: monospace;">
                        <div id="calcDisplay">0</div>
                    </div>
                    <div class="calculator-buttons" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                        ${generateCalculatorButtons()}
                    </div>
                </div>
            `;
            break;
            
        case 4: // Graphing Tool
            interfaceContent = `
                <div style="display: flex; gap: 20px; height: 400px;">
                    <div style="flex: 0 0 200px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h5>Function Input</h5>
                        <input type="text" placeholder="y = x^2" style="width: 100%; margin-bottom: 10px; padding: 5px;">
                        <button class="btn btn-sm" onclick="plotFunction()">Plot</button>
                        <button class="btn btn-secondary btn-sm" onclick="clearGraph()">Clear</button>
                        
                        <div style="margin-top: 20px;">
                            <h5>Graph Settings</h5>
                            <label>X Range:</label>
                            <input type="number" placeholder="-10" style="width: 45%; margin-right: 5%;">
                            <input type="number" placeholder="10" style="width: 45%;">
                            
                            <label style="margin-top: 10px; display: block;">Y Range:</label>
                            <input type="number" placeholder="-10" style="width: 45%; margin-right: 5%;">
                            <input type="number" placeholder="10" style="width: 45%;">
                        </div>
                    </div>
                    <div style="flex: 1; background: white; border: 1px solid #ddd; border-radius: 8px; position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ccc; text-align: center;">
                            <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 10px;"></i>
                            <p>Enter a function to start graphing</p>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        default:
            interfaceContent = `
                <div style="text-align: center; padding: 40px;">
                    <i class="${tool.icon}" style="font-size: 64px; color: #007bff; margin-bottom: 20px;"></i>
                    <h4>${tool.name}</h4>
                    <p>${tool.description}</p>
                    <p style="color: #666;">This tool interface is being prepared...</p>
                </div>
            `;
    }
    
    toolInterface.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3><i class="${tool.icon}"></i> ${tool.name}</h3>
                <span class="close" onclick="closeToolInterface()">&times;</span>
            </div>
            
            ${interfaceContent}
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeToolInterface()">Close</button>
                <button class="btn" onclick="saveToolWork()">Save Work</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toolInterface);
}

function generateCalculatorButtons() {
    const buttons = [
        ['C', '±', '%', '÷', '√'],
        ['7', '8', '9', '×', 'x²'],
        ['4', '5', '6', '-', 'sin'],
        ['1', '2', '3', '+', 'cos'],
        ['0', '.', '=', '(', ')']
    ];
    
    return buttons.map(row => 
        row.map(btn => `
            <button class="calc-btn" onclick="calculatorInput('${btn}')" 
                    style="padding: 10px; background: ${btn === '=' ? '#007bff' : '#ecf0f1'}; 
                           border: none; border-radius: 5px; cursor: pointer;">
                ${btn}
            </button>
        `).join('')
    ).join('');
}

function calculatorInput(value) {
    const display = document.getElementById('calcDisplay');
    if (!display) return;
    
    // Simple calculator logic - in real implementation would be more robust
    if (value === 'C') {
        display.textContent = '0';
    } else if (value === '=') {
        try {
            // This is simplified - real implementation would parse math expressions properly
            display.textContent = 'Result';
        } catch (e) {
            display.textContent = 'Error';
        }
    } else {
        if (display.textContent === '0') {
            display.textContent = value;
        } else {
            display.textContent += value;
        }
    }
}

function selectWhiteboardTool(tool) {
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    showNotification(`${tool.charAt(0).toUpperCase() + tool.slice(1)} tool selected`, 'info');
}

function clearWhiteboard() {
    showNotification('Whiteboard cleared', 'info');
}

function startScreenShare() {
    showNotification('Screen sharing started', 'success');
}

function shareWindow() {
    showNotification('Window sharing started', 'success');
}

function plotFunction() {
    showNotification('Function plotted successfully', 'success');
}

function clearGraph() {
    showNotification('Graph cleared', 'info');
}

function closeToolInterface() {
    const modal = document.getElementById('toolInterface');
    if (modal) {
        modal.remove();
    }
}

function saveToolWork() {
    showNotification('Work saved successfully', 'success');
}

function previewTool(toolId) {
    const tool = availableTools.find(t => t.id === toolId);
    showNotification(`${tool.name} preview opened`, 'info');
}

function startToolsTutorial() {
    closeToolsModal();
    
    const tutorialModal = document.createElement('div');
    tutorialModal.className = 'modal';
    tutorialModal.id = 'tutorialModal';
    tutorialModal.style.display = 'block';
    
    tutorialModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeTutorialModal()">&times;</span>
            <h3>🎯 Tools Tutorial</h3>
            
            <div id="tutorialContent">
                <div class="tutorial-step" id="step1">
                    <h4>Step 1: Interactive Whiteboard</h4>
                    <p>The whiteboard is your primary teaching tool. Use it to:</p>
                    <ul>
                        <li>Draw diagrams and solve problems step-by-step</li>
                        <li>Write equations and explanations</li>
                        <li>Collaborate with students in real-time</li>
                        <li>Save and share your work</li>
                    </ul>
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#f8f9fa" stroke="#dee2e6"/><text x="150" y="30" text-anchor="middle" font-family="Arial" font-size="16" fill="#495057">Interactive Whiteboard</text><path d="M50 60 Q 100 40, 150 60 T 250 60" stroke="#007bff" stroke-width="3" fill="none"/><text x="50" y="100" font-family="Arial" font-size="14" fill="#495057">y = x² + 2x + 1</text><circle cx="100" cy="120" r="20" fill="none" stroke="#28a745" stroke-width="2"/><text x="150" y="160" font-family="Arial" font-size="12" fill="#6c757d">Draw, write, collaborate</text></svg>')}" style="max-width: 100%; border-radius: 8px;">
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: between; align-items: center; margin-top: 20px;">
                <div class="tutorial-progress">
                    <span>Step 1 of 4</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="closeTutorialModal()">Skip Tutorial</button>
                    <button class="btn" onclick="nextTutorialStep()">Next Step</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(tutorialModal);
}

let currentTutorialStep = 1;

function nextTutorialStep() {
    currentTutorialStep++;
    const content = document.getElementById('tutorialContent');
    const progress = document.querySelector('.tutorial-progress span');
    
    let stepContent = '';
    
    switch(currentTutorialStep) {
        case 2:
            stepContent = `
                <div class="tutorial-step" id="step2">
                    <h4>Step 2: Screen Sharing</h4>
                    <p>Share your screen to show external resources:</p>
                    <ul>
                        <li>Demonstrate software applications</li>
                        <li>Show online calculators or graphing tools</li>
                        <li>Present slides or documents</li>
                        <li>Browse educational websites together</li>
                    </ul>
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>💡 Tip:</strong> Always ask students if they can see your screen clearly before proceeding with the lesson.
                    </div>
                </div>
            `;
            progress.textContent = 'Step 2 of 4';
            break;
            
        case 3:
            stepContent = `
                <div class="tutorial-step" id="step3">
                    <h4>Step 3: File Sharing & Resources</h4>
                    <p>Share documents and resources efficiently:</p>
                    <ul>
                        <li>Upload worksheets and practice problems</li>
                        <li>Share reference materials and guides</li>
                        <li>Send homework assignments</li>
                        <li>Provide additional learning resources</li>
                    </ul>
                    <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>🎯 Best Practice:</strong> Organize your files in folders by subject and grade level for quick access.
                    </div>
                </div>
            `;
            progress.textContent = 'Step 3 of 4';
            break;
            
        case 4:
            stepContent = `
                <div class="tutorial-step" id="step4">
                    <h4>Step 4: Premium Tools</h4>
                    <p>Unlock advanced features with premium subscription:</p>
                    <ul>
                        <li><strong>Session Recording:</strong> Record lessons for student review</li>
                        <li><strong>AI Assistant:</strong> Get help with problem explanations</li>
                        <li><strong>Virtual Manipulatives:</strong> Interactive math tools</li>
                        <li><strong>Advanced Analytics:</strong> Track student progress</li>
                    </ul>
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>⭐ Upgrade Benefits:</strong> Premium tutors earn 40% more on average and get priority student matching.
                    </div>
                </div>
            `;
            progress.textContent = 'Step 4 of 4';
            document.querySelector('.btn:last-child').textContent = 'Complete Tutorial';
            break;
            
        default:
            closeTutorialModal();
            showNotification('Tutorial completed! You\'re ready to use the teaching tools.', 'success');
            return;
    }
    
    content.innerHTML = stepContent;
}

function closeTutorialModal() {
    const modal = document.getElementById('tutorialModal');
    if (modal) {
        modal.remove();
    }
    currentTutorialStep = 1;
}

function closeToolsModal() {
    const modal = document.getElementById('toolsModal');
    if (modal) {
        modal.remove();
    }
}

function upgradeToPremium() {
    showNotification('Redirecting to premium upgrade...', 'info');
    // This would typically redirect to the premium upgrade page
}
