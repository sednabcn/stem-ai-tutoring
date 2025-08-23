// CARD 4: SET YOUR SCHEDULE - Complete Functionality
// Copy/Paste this entire block for Card 4
if (!window.cards) window.cards = {};
   window.cards['card4'] = {
       id: 'card4',
       title: 'Set your Schedule',
       render: () => console.log('Rendering card1')
   };
// Schedule Card Variables
let card4_scheduleSet = false;
let card4_scheduleStepProgress = {
    schedule: false
};

let card4_tutorSchedule = {
    timezone: 'GMT+0',
    weekdays: {},
    weekends: {},
    breaks: [],
    preferences: {
        minSessionLength: 60,
        maxSessionLength: 120,
        bufferTime: 15,
        autoAccept: false
    }
};

// Schedule Card Functions
function setSchedule() {
    openScheduleModal();
}

function viewTemplate() {
    showScheduleTemplate();
}

function openScheduleModal() {
    const scheduleModal = document.createElement('div');
    scheduleModal.className = 'modal';
    scheduleModal.id = 'scheduleModal';
    scheduleModal.style.display = 'block';
    
    scheduleModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeScheduleModal()">&times;</span>
            <h3>📅 Set Your Tutoring Schedule</h3>
            <p>Configure your availability to start receiving student requests.</p>
            
            <div class="schedule-tabs" style="display: flex; border-bottom: 2px solid #eee; margin-bottom: 20px;">
                <button class="tab-btn active" onclick="showScheduleTab('availability')" id="availabilityTab">⏰ Availability</button>
                <button class="tab-btn" onclick="showScheduleTab('preferences')" id="preferencesTab">⚙️ Preferences</button>
                <button class="tab-btn" onclick="showScheduleTab('breaks')" id="breaksTab">☕ Breaks</button>
            </div>
            
            <!-- Availability Tab -->
            <div id="availabilitySection" class="schedule-section">
                <div class="timezone-selector" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <label for="timezoneSelect"><strong>🌍 Your Timezone:</strong></label>
                    <select id="timezoneSelect" onchange="updateTimezone()" style="width: 100%; padding: 8px; margin-top: 5px;">
                        <option value="GMT+0">GMT+0 (London, Dublin)</option>
                        <option value="GMT+1">GMT+1 (Paris, Berlin, Rome)</option>
                        <option value="GMT+2">GMT+2 (Athens, Cairo)</option>
                        <option value="GMT-5">GMT-5 (New York, Toronto)</option>
                        <option value="GMT-8">GMT-8 (Los Angeles, Vancouver)</option>
                        <option value="GMT+10">GMT+10 (Sydney, Melbourne)</option>
                    </select>
                </div>
                
                <div class="schedule-grid">
                    <h4>📋 Weekly Schedule</h4>
                    <div class="days-container" style="display: grid; gap: 15px;">
                        ${generateDayScheduleHTML()}
                    </div>
                </div>
                
                <div class="quick-actions" style="margin: 20px 0; text-align: center;">
                    <button class="btn btn-secondary" onclick="setMorningSchedule()">🌅 Morning Person (8AM-12PM)</button>
                    <button class="btn btn-secondary" onclick="setAfternoonSchedule()">☀️ Afternoon (12PM-6PM)</button>
                    <button class="btn btn-secondary" onclick="setEveningSchedule()">🌙 Evening (6PM-10PM)</button>
                    <button class="btn btn-secondary" onclick="clearAllSchedule()">🗑️ Clear All</button>
                </div>
            </div>
            
            <!-- Preferences Tab -->
            <div id="preferencesSection" class="schedule-section" style="display: none;">
                <h4>⚙️ Session Preferences</h4>
                
                <div class="preferences-grid" style="display: grid; gap: 20px; margin: 20px 0;">
                    <div class="pref-item">
                        <label for="minSession"><strong>Minimum Session Length:</strong></label>
                        <select id="minSession" onchange="updatePreference('minSessionLength', this.value)">
                            <option value="30">30 minutes</option>
                            <option value="60" selected>1 hour</option>
                            <option value="90">1.5 hours</option>
                        </select>
                    </div>
                    
                    <div class="pref-item">
                        <label for="maxSession"><strong>Maximum Session Length:</strong></label>
                        <select id="maxSession" onchange="updatePreference('maxSessionLength', this.value)">
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120" selected>2 hours</option>
                            <option value="180">3 hours</option>
                        </select>
                    </div>
                    
                    <div class="pref-item">
                        <label for="bufferTime"><strong>Buffer Time Between Sessions:</strong></label>
                        <select id="bufferTime" onchange="updatePreference('bufferTime', this.value)">
                            <option value="0">No buffer</option>
                            <option value="15" selected>15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                        </select>
                    </div>
                    
                    <div class="pref-item">
                        <label>
                            <input type="checkbox" id="autoAccept" onchange="updatePreference('autoAccept', this.checked)">
                            <strong>Auto-accept requests that match your availability</strong>
                        </label>
                        <small style="color: #666;">Automatically accept student requests during your available hours</small>
                    </div>
                </div>
            </div>
            
            <!-- Breaks Tab -->
            <div id="breaksSection" class="schedule-section" style="display: none;">
                <h4>☕ Break Times & Unavailable Periods</h4>
                
                <div class="breaks-container" style="margin: 20px 0;">
                    <button class="btn btn-secondary" onclick="addBreakPeriod()">+ Add Break Period</button>
                    
                    <div id="breaksList" style="margin: 20px 0;">
                        <!-- Break periods will be added here -->
                    </div>
                </div>
                
                <div class="break-templates" style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h5>🚀 Quick Templates:</h5>
                    <button class="btn btn-secondary" onclick="addLunchBreak()">🍽️ Lunch Break (12-1 PM)</button>
                    <button class="btn btn-secondary" onclick="addDinnerBreak()">🍽️ Dinner Break (6-7 PM)</button>
                    <button class="btn btn-secondary" onclick="addWeekendMorning()">😴 Weekend Mornings Off</button>
                </div>
            </div>
            
            <div class="schedule-summary" style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h5>📊 Schedule Summary:</h5>
                <div id="scheduleSummary">Configure your availability above to see summary</div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeScheduleModal()">Cancel</button>
                <button class="btn btn-secondary" onclick="saveAsDraft()">Save Draft</button>
                <button class="btn" onclick="saveSchedule()" id="saveScheduleBtn">💾 Save Schedule</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(scheduleModal);
    loadSavedSchedule();
    updateScheduleSummary();
}

function generateDayScheduleHTML() {
    const days = [
        { key: 'monday', name: 'Monday', emoji: '📅' },
        { key: 'tuesday', name: 'Tuesday', emoji: '📅' },
        { key: 'wednesday', name: 'Wednesday', emoji: '📅' },
        { key: 'thursday', name: 'Thursday', emoji: '📅' },
        { key: 'friday', name: 'Friday', emoji: '📅' },
        { key: 'saturday', name: 'Saturday', emoji: '📅' },
        { key: 'sunday', name: 'Sunday', emoji: '📅' }
    ];
    
    return days.map(day => `
        <div class="day-schedule" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: white;">
            <div class="day-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="${day.key}Enabled" onchange="toggleDay('${day.key}')" style="margin-right: 8px;">
                    <strong>${day.emoji} ${day.name}</strong>
                </label>
                <button class="btn btn-secondary" onclick="copyFromPreviousDay('${day.key}')" style="font-size: 0.8rem;">📋 Copy Previous</button>
            </div>
            
            <div class="time-slots" id="${day.key}Slots" style="display: none;">
                <div class="time-slot" style="display: flex; gap: 10px; align-items: center; margin: 5px 0;">
                    <span>From:</span>
                    <input type="time" id="${day.key}Start" value="09:00" onchange="updateDaySchedule('${day.key}')">
                    <span>To:</span>
                    <input type="time" id="${day.key}End" value="17:00" onchange="updateDaySchedule('${day.key}')">
                </div>
                
                <div class="split-option" style="margin: 10px 0;">
                    <label>
                        <input type="checkbox" id="${day.key}Split" onchange="toggleSplitDay('${day.key}')">
                        Split into morning/evening sessions
                    </label>
                    
                    <div id="${day.key}SplitTimes" style="display: none; margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                        <div style="display: flex; gap: 10px; align-items: center; margin: 5px 0;">
                            <span>Morning:</span>
                            <input type="time" id="${day.key}Morning1" value="09:00">
                            <span>-</span>
                            <input type="time" id="${day.key}Morning2" value="12:00">
                        </div>
                        <div style="display: flex; gap: 10px; align-items: center; margin: 5px 0;">
                            <span>Evening:</span>
                            <input type="time" id="${day.key}Evening1" value="14:00">
                            <span>-</span>
                            <input type="time" id="${day.key}Evening2" value="18:00">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Schedule Tab Functions
function showScheduleTab(tabName) {
    // Hide all sections
    document.getElementById('availabilitySection').style.display = 'none';
    document.getElementById('preferencesSection').style.display = 'none';
    document.getElementById('breaksSection').style.display = 'none';
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected section and activate tab
    document.getElementById(tabName + 'Section').style.display = 'block';
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Day Schedule Functions
function toggleDay(day) {
    const checkbox = document.getElementById(day + 'Enabled');
    const slots = document.getElementById(day + 'Slots');
    
    if (checkbox.checked) {
        slots.style.display = 'block';
        updateDaySchedule(day);
    } else {
        slots.style.display = 'none';
        delete tutorSchedule.weekdays[day];
        updateScheduleSummary();
    }
}

function toggleSplitDay(day) {
    const splitCheckbox = document.getElementById(day + 'Split');
    const splitTimes = document.getElementById(day + 'SplitTimes');
    
    if (splitCheckbox.checked) {
        splitTimes.style.display = 'block';
    } else {
        splitTimes.style.display = 'none';
    }
    
    updateDaySchedule(day);
}

function updateDaySchedule(day) {
    const enabled = document.getElementById(day + 'Enabled').checked;
    if (!enabled) return;
    
    const splitEnabled = document.getElementById(day + 'Split').checked;
    
    if (splitEnabled) {
        const morning1 = document.getElementById(day + 'Morning1').value;
        const morning2 = document.getElementById(day + 'Morning2').value;
        const evening1 = document.getElementById(day + 'Evening1').value;
        const evening2 = document.getElementById(day + 'Evening2').value;
        
        tutorSchedule.weekdays[day] = {
            enabled: true,
            split: true,
            morning: { start: morning1, end: morning2 },
            evening: { start: evening1, end: evening2 }
        };
    } else {
        const start = document.getElementById(day + 'Start').value;
        const end = document.getElementById(day + 'End').value;
        
        tutorSchedule.weekdays[day] = {
            enabled: true,
            split: false,
            start: start,
            end: end
        };
    }
    
    updateScheduleSummary();
}

function copyFromPreviousDay(currentDay) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentIndex = days.indexOf(currentDay);
    
    if (currentIndex === 0) {
        showNotification('ℹ️ No previous day to copy from', 'info');
        return;
    }
    
    const previousDay = days[currentIndex - 1];
    const previousSchedule = tutorSchedule.weekdays[previousDay];
    
    if (!previousSchedule || !previousSchedule.enabled) {
        showNotification('ℹ️ Previous day has no schedule to copy', 'info');
        return;
    }
    
    // Enable current day
    document.getElementById(currentDay + 'Enabled').checked = true;
    toggleDay(currentDay);
    
    // Copy schedule
    if (previousSchedule.split) {
        document.getElementById(currentDay + 'Split').checked = true;
        toggleSplitDay(currentDay);
        document.getElementById(currentDay + 'Morning1').value = previousSchedule.morning.start;
        document.getElementById(currentDay + 'Morning2').value = previousSchedule.morning.end;
        document.getElementById(currentDay + 'Evening1').value = previousSchedule.evening.start;
        document.getElementById(currentDay + 'Evening2').value = previousSchedule.evening.end;
    } else {
        document.getElementById(currentDay + 'Start').value = previousSchedule.start;
        document.getElementById(currentDay + 'End').value = previousSchedule.end;
    }
    
    updateDaySchedule(currentDay);
    showNotification('📋 Schedule copied from previous day!', 'success');
}

// Quick Schedule Templates
function setMorningSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        document.getElementById(day + 'Enabled').checked = true;
        toggleDay(day);
        document.getElementById(day + 'Start').value = '08:00';
        document.getElementById(day + 'End').value = '12:00';
        updateDaySchedule(day);
    });
    showNotification('🌅 Morning schedule applied to weekdays!', 'success');
}

function setAfternoonSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        document.getElementById(day + 'Enabled').checked = true;
        toggleDay(day);
        document.getElementById(day + 'Start').value = '12:00';
        document.getElementById(day + 'End').value = '18:00';
        updateDaySchedule(day);
    });
    showNotification('☀️ Afternoon schedule applied to weekdays!', 'success');
}

function setEveningSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        document.getElementById(day + 'Enabled').checked = true;
        toggleDay(day);
        document.getElementById(day + 'Start').value = '18:00';
        document.getElementById(day + 'End').value = '22:00';
        updateDaySchedule(day);
    });
    showNotification('🌙 Evening schedule applied to all days!', 'success');
}

function clearAllSchedule() {
    if (confirm('Are you sure you want to clear all schedule data?')) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            document.getElementById(day + 'Enabled').checked = false;
            toggleDay(day);
        });
        tutorSchedule.weekdays = {};
        tutorSchedule.breaks = [];
        updateScheduleSummary();
        showNotification('🗑️ All schedule data cleared', 'info');
    }
}

// Preferences Functions
function updatePreference(key, value) {
    tutorSchedule.preferences[key] = value;
    updateScheduleSummary();
}

function updateTimezone() {
    const timezone = document.getElementById('timezoneSelect').value;
    tutorSchedule.timezone = timezone;
    updateScheduleSummary();
}

// Break Functions
function addBreakPeriod() {
    const breakId = 'break_' + Date.now();
    const breakHTML = `
        <div class="break-item" id="${breakId}" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 10px 0; background: #fafafa;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h6>🚫 Break Period</h6>
                <button class="btn btn-secondary" onclick="removeBreak('${breakId}')" style="font-size: 0.8rem;">❌ Remove</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <label>Break Name:</label>
                    <input type="text" id="${breakId}_name" placeholder="e.g., Lunch break" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label>Days:</label>
                    <select id="${breakId}_days" style="width: 100%; padding: 5px;">
                        <option value="daily">Every day</option>
                        <option value="weekdays">Weekdays only</option>
                        <option value="weekends">Weekends only</option>
                        <option value="custom">Custom days</option>
                    </select>
                </div>
                <div>
                    <label>Start Time:</label>
                    <input type="time" id="${breakId}_start" style="width: 100%; padding: 5px;">
                </div>
                <div>
                    <label>End Time:</label>
                    <input type="time" id="${breakId}_end" style="width: 100%; padding: 5px;">
                </div>
            </div>
            
            <div id="${breakId}_custom" style="display: none; margin-top: 10px;">
                <label>Select Days:</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 5px;">
                    ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => 
                        `<label><input type="checkbox" id="${breakId}_day${index}"> ${day}</label>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('breaksList').insertAdjacentHTML('beforeend', breakHTML);
    
    // Add event listener for days dropdown
    document.getElementById(breakId + '_days').addEventListener('change', function() {
        const customDiv = document.getElementById(breakId + '_custom');
        customDiv.style.display = this.value === 'custom' ? 'block' : 'none';
    });
}

function removeBreak(breakId) {
    document.getElementById(breakId).remove();
    updateScheduleSummary();
}

function addLunchBreak() {
    addBreakPeriod();
    const breaks = document.querySelectorAll('.break-item');
    const lastBreak = breaks[breaks.length - 1];
    const breakId = lastBreak.id;
    
    document.getElementById(breakId + '_name').value = 'Lunch Break';
    document.getElementById(breakId + '_days').value = 'weekdays';
    document.getElementById(breakId + '_start').value = '12:00';
    document.getElementById(breakId + '_end').value = '13:00';
}

function addDinnerBreak() {
    addBreakPeriod();
    const breaks = document.querySelectorAll('.break-item');
    const lastBreak = breaks[breaks.length - 1];
    const breakId = lastBreak.id;
    
    document.getElementById(breakId + '_name').value = 'Dinner Break';
    document.getElementById(breakId + '_days').value = 'daily';
    document.getElementById(breakId + '_start').value = '18:00';
    document.getElementById(breakId + '_end').value = '19:00';
}

function addWeekendMorning() {
    addBreakPeriod();
    const breaks = document.querySelectorAll('.break-item');
    const lastBreak = breaks[breaks.length - 1];
    const breakId = lastBreak.id;
    
    document.getElementById(breakId + '_name').value = 'Weekend Morning Off';
    document.getElementById(breakId + '_days').value = 'weekends';
    document.getElementById(breakId + '_start').value = '08:00';
    document.getElementById(breakId + '_end').value = '12:00';
}

// Schedule Summary and Save Functions
function updateScheduleSummary() {
    const summaryDiv = document.getElementById('scheduleSummary');
    if (!summaryDiv) return;
    
    let summary = '';
    const enabledDays = Object.keys(tutorSchedule.weekdays).filter(day => tutorSchedule.weekdays[day].enabled);
    
    if (enabledDays.length === 0) {
        summary = 'No availability set yet.';
    } else {
        summary += `📅 Available ${enabledDays.length} days per week<br>`;
        summary += `🌍 Timezone: ${tutorSchedule.timezone}<br>`;
        summary += `⏱️ Session length: ${tutorSchedule.preferences.minSessionLength}-${tutorSchedule.preferences.maxSessionLength} minutes<br>`;
        summary += `🔄 Buffer time: ${tutorSchedule.preferences.bufferTime} minutes<br>`;
        
        const totalHours = calculateTotalWeeklyHours();
        summary += `⏰ Total weekly availability: ~${totalHours} hours`;
    }
    
    summaryDiv.innerHTML = summary;
}

function calculateTotalWeeklyHours() {
    let totalMinutes = 0;
    
    Object.values(tutorSchedule.weekdays).forEach(day => {
        if (!day.enabled) return;
        
        if (day.split) {
            const morning = calculateMinutes(day.morning.start, day.morning.end);
            const evening = calculateMinutes(day.evening.start, day.evening.end);
            totalMinutes += morning + evening;
        } else {
            totalMinutes += calculateMinutes(day.start, day.end);
        }
    });
    
    return Math.round(totalMinutes / 60);
}

function calculateMinutes(start, end) {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    
    return endTotal - startTotal;
}

function saveAsDraft() {
    localStorage.setItem('scheduleDraft', JSON.stringify(tutorSchedule));
    showNotification('💾 Schedule saved as draft', 'info');
}

function saveSchedule() {
    const enabledDays = Object.keys(tutorSchedule.weekdays).filter(day => tutorSchedule.weekdays[day].enabled);
    
    if (enabledDays.length === 0) {
        showNotification('❌ Please set availability for at least one day', 'error');
        return;
    }
    
    // Collect break data
    const breaks = [];
    document.querySelectorAll('.break-item').forEach(breakItem => {
        const breakId = breakItem.id;
        const name = document.getElementById(breakId + '_name').value;
        const days = document.getElementById(breakId + '_days').value;
        const start = document.getElementById(breakId + '_start').value;
        const end = document.getElementById(breakId + '_end').value;
        
        if (name && start && end) {
            breaks.push({ name, days, start, end });
        }
    });
    
    tutorSchedule.breaks = breaks;
    tutorSchedule.savedAt = new Date().toISOString();
    
    // Save to storage
    localStorage.setItem('tutorSchedule', JSON.stringify(tutorSchedule));
    
    closeScheduleModal();
    markScheduleComplete();
    
    showNotification('📅 Schedule saved successfully!', 'success');
}

function loadSavedSchedule() {
    const savedSchedule = localStorage.getItem('tutorSchedule') || localStorage.getItem('scheduleDraft');
    
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        tutorSchedule = { ...tutorSchedule, ...schedule };
        
        // Load timezone
        document.getElementById('timezoneSelect').value = schedule.timezone || 'GMT+0';
        
        // Load preferences
        if (schedule.preferences) {
            document.getElementById('minSession').value = schedule.preferences.minSessionLength || 60;
            document.getElementById('maxSession').value = schedule.preferences.maxSessionLength || 120;
            document.getElementById('bufferTime').value = schedule.preferences.bufferTime || 15;
            document.getElementById('autoAccept').checked = schedule.preferences.autoAccept || false;
        }
        
        // Load day schedules
        Object.keys(schedule.weekdays || {}).forEach(day => {
            const daySchedule = schedule.weekdays[day];
            if (daySchedule.enabled) {
                document.getElementById(day + 'Enabled').checked = true;
                toggleDay(day);
                
                if (daySchedule.split) {
                    document.getElementById(day + 'Split').checked = true;
                    toggleSplitDay(day);
                    document.getElementById(day + 'Morning1').value = daySchedule.morning.start;
                    document.getElementById(day + 'Morning2').value = daySchedule.morning.end;
                    document.getElementById(day + 'Evening1').value = daySchedule.evening.start;
                    document.getElementById(day + 'Evening2').value = daySchedule.evening.end;
                } else {
                    document.getElementById(day + 'Start').value = daySchedule.start;
                    document.getElementById(day + 'End').value = daySchedule.end;
                }
            }
        });
        
        // Load breaks
        if (schedule.breaks) {
            schedule.breaks.forEach(breakData => {
                addBreakPeriod();
                const breaks = document.querySelectorAll('.break-item');
                const lastBreak = breaks[breaks.length - 1];
                const breakId = lastBreak.id;
                
                document.getElementById(breakId + '_name').value = breakData.name;
                document.getElementById(breakId + '_days').value = breakData.days;
                document.getElementById(breakId + '_start').value = breakData.start;
                document.getElementById(breakId + '_end').value = breakData.end;
            });
        }
    }
}

function showScheduleTemplate() {
    const templateContent = `
        <div style="max-height: 400px; overflow-y: auto; padding: 15px;">
            <h4>📋 Schedule Templates</h4>
            
            <div class="template-grid" style="display: grid; gap: 20px; margin: 20px 0;">
                <div class="template-item" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                    <h5>🎓 Academic Tutor Schedule</h5>
                    <ul style="line-height: 1.6;">
                        <li><strong>Weekdays:</strong> 4:00 PM - 8:00 PM (after school)</li>
                        <li><strong>Saturdays:</strong> 9:00 AM - 5:00 PM (full day)</li>
                        <li><strong>Sundays:</strong> 2:00 PM - 6:00 PM (afternoon only)</li>
                        <li><strong>Breaks:</strong> 6:00-7:00 PM dinner break</li>
                    </ul>
                </div>
                
                <div class="template-item" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                    <h5>🏢 Professional Schedule</h5>
                    <ul style="line-height: 1.6;">
                        <li><strong>Weekday Evenings:</strong> 6:00 PM - 10:00 PM</li>
                        <li><strong>Weekend Mornings:</strong> 8:00 AM - 12:00 PM</li>
                        <li><strong>Weekend Afternoons:</strong> 2:00 PM - 6:00 PM</li>
                        <li><strong>Breaks:</strong> 8:00-9:00 PM break</li>
                    </ul>
                </div>
                
                <div class="template-item" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                    <h5>🌅 Early Bird Schedule</h5>
                    <ul style="line-height: 1.6;">
                        <li><strong>Weekdays:</strong> 7:00 AM - 11:00 AM</li>
                        <li><strong>Weekends:</strong> 8:00 AM - 2:00 PM</li>
                        <li><strong>Perfect for:</strong> Students in different timezones</li>
                        <li><strong>Breaks:</strong> 9:30-10:00 AM coffee break</li>
                    </ul>
                </div>
                
                <div class="template-item" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                    <h5>🦉 Night Owl Schedule</h5>
                    <ul style="line-height: 1.6;">
                        <li><strong>All Days:</strong> 7:00 PM - 11:00 PM</li>
                        <li><strong>Perfect for:</strong> International students</li>
                        <li><strong>Ideal timezone coverage:</strong> GMT+8 to GMT-5</li>
                        <li><strong>Breaks:</strong> 9:00-9:15 PM quick break</li>
                    </ul>
                </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h5>💡 Pro Tips:</h5>
                <ul style="line-height: 1.6;">
                    <li>Start with 20-25 hours per week as a new tutor</li>
                    <li>Block similar times daily for consistency</li>
                    <li>Leave buffer time between sessions</li>
                    <li>Consider your target students' schedules</li>
                    <li>Review and adjust based on booking patterns</li>
                </ul>
            </div>
        </div>
    `;
    
    showCustomModal('Schedule Templates', templateContent);
}

function markScheduleComplete() {
    scheduleStepProgress.schedule = true;
    scheduleSet = true;
    
    const card = document.getElementById('scheduleCard');
    const statusIndicator = card.querySelector('.status-indicator');
    statusIndicator.className = 'status-indicator status-complete';
    statusIndicator.innerHTML = '<div class="status-dot"></div><span>Complete</span>';
    
    // Update counter
    const counterText = card.querySelector('.counter-text');
    const totalHours = calculateTotalWeeklyHours();
    counterText.textContent = `Availability: ${totalHours} hours/week configured`;
    
    // Update global progress
    updateOverallProgress();
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.remove();
    }
}

// Initialize Schedule Card on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved schedule
    const savedSchedule = localStorage.getItem('tutorSchedule');
    if (savedSchedule) {
        const schedule = JSON.parse(savedSchedule);
        tutorSchedule = { ...tutorSchedule, ...schedule };
        markScheduleComplete();
    }
    
    // Add schedule modal styles
    const scheduleStyles = document.createElement('style');
    scheduleStyles.textContent = `
        .schedule-section {
            animation: fadeIn 0.3s ease;
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
        .day-schedule {
            transition: all 0.3s ease;
        }
        .day-schedule:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .pref-item {
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            background: white;
        }
        .pref-item label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .pref-item select, .pref-item input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(scheduleStyles);
});
