// CARD 8: ANALYTICS DASHBOARD - Complete Functionality
// Copy/Paste this entire block for Card 8

// Analytics Dashboard Variables
let analyticsActive = true;
let analyticsData = {
    sessions: {
        total: 47,
        thisWeek: 12,
        thisMonth: 35,
        completed: 45,
        cancelled: 2
    },
    students: {
        active: 23,
        total: 31,
        newThisMonth: 8,
        returning: 15
    },
    ratings: {
        average: 4.8,
        total: 42,
        breakdown: {
            5: 28,
            4: 11,
            3: 2,
            2: 1,
            1: 0
        }
    },
    earnings: {
        total: 2340,
        thisWeek: 480,
        thisMonth: 1750,
        pending: 240,
        averagePerSession: 52
    },
    subjects: {
        algebra: { sessions: 18, rating: 4.9 },
        geometry: { sessions: 12, rating: 4.7 },
        calculus: { sessions: 8, rating: 4.8 },
        statistics: { sessions: 6, rating: 4.6 },
        other: { sessions: 3, rating: 5.0 }
    },
    performance: {
        onTimeRate: 98,
        completionRate: 96,
        responseTime: 2.3,
        studentRetention: 85
    }
};

let chartData = {
    sessionsChart: [
        { date: '2024-01-01', sessions: 3 },
        { date: '2024-01-08', sessions: 5 },
        { date: '2024-01-15', sessions: 7 },
        { date: '2024-01-22', sessions: 8 },
        { date: '2024-01-29', sessions: 12 }
    ],
    earningsChart: [
        { date: '2024-01-01', earnings: 150 },
        { date: '2024-01-08', earnings: 280 },
        { date: '2024-01-15', earnings: 420 },
        { date: '2024-01-22', earnings: 580 },
        { date: '2024-01-29', earnings: 720 }
    ]
};

// Analytics Dashboard Functions
function viewAnalytics() {
    openAnalyticsDashboard();
}

function openAnalyticsDashboard() {
    const analyticsModal = document.createElement('div');
    analyticsModal.className = 'modal';
    analyticsModal.id = 'analyticsModal';
    analyticsModal.style.display = 'block';
    
    analyticsModal.innerHTML = `
        <div class="modal-content" style="max-width: 1200px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closeAnalyticsModal()">&times;</span>
            <h3>📊 Analytics Dashboard</h3>
            
            <div class="analytics-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div class="date-range-selector">
                    <select id="dateRange" onchange="updateAnalytics()">
                        <option value="7">Last 7 days</option>
                        <option value="30" selected>Last 30 days</option>
                        <option value="90">Last 3 months</option>
                        <option value="365">Last year</option>
                    </select>
                </div>
                <div class="analytics-actions">
                    <button class="btn btn-secondary" onclick="exportAnalytics()">Export Data</button>
                    <button class="btn btn-secondary" onclick="refreshAnalytics()">Refresh</button>
                </div>
            </div>
            
            <!-- Key Metrics Cards -->
            <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                ${generateMetricsCards()}
            </div>
            
            <!-- Charts Section -->
            <div class="charts-section" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div class="chart-container">
                    <h4>📈 Sessions Over Time</h4>
                    <div class="chart-placeholder" style="height: 250px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
                        ${generateSessionsChart()}
                    </div>
                </div>
                
                <div class="chart-container">
                    <h4>💰 Earnings Trend</h4>
                    <div class="chart-placeholder" style="height: 250px; background: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
                        ${generateEarningsChart()}
                    </div>
                </div>
            </div>
            
            <!-- Detailed Analytics Tabs -->
            <div class="analytics-tabs">
                <div class="tab-buttons" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #eee;">
                    <button class="tab-btn active" onclick="switchAnalyticsTab('overview')">Overview</button>
                    <button class="tab-btn" onclick="switchAnalyticsTab('students')">Students</button>
                    <button class="tab-btn" onclick="switchAnalyticsTab('performance')">Performance</button>
                    <button class="tab-btn" onclick="switchAnalyticsTab('subjects')">Subjects</button>
                    <button class="tab-btn" onclick="switchAnalyticsTab('feedback')">Feedback</button>
                </div>
                
                <div class="tab-content" id="analyticsTabContent">
                    ${generateOverviewTab()}
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeAnalyticsModal()">Close</button>
                <button class="btn" onclick="generateReport()">Generate Report</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(analyticsModal);
    
    // Simulate data loading
    setTimeout(() => {
        loadAnalyticsData();
    }, 500);
}

function generateMetricsCards() {
    const metrics = [
        {
            title: 'Total Sessions',
            value: analyticsData.sessions.total,
            change: '+12%',
            positive: true,
            icon: 'fas fa-chalkboard-teacher'
        },
        {
            title: 'Active Students',
            value: analyticsData.students.active,
            change: '+8%',
            positive: true,
            icon: 'fas fa-users'
        },
        {
            title: 'Average Rating',
            value: analyticsData.ratings.average.toFixed(1),
            change: '+0.2',
            positive: true,
            icon: 'fas fa-star'
        },
        {
            title: 'Total Earnings',
            value: `£${analyticsData.earnings.total}`,
            change: '+£340',
            positive: true,
            icon: 'fas fa-pound-sign'
        },
        {
            title: 'Completion Rate',
            value: `${analyticsData.performance.completionRate}%`,
            change: '+2%',
            positive: true,
            icon: 'fas fa-check-circle'
        },
        {
            title: 'Response Time',
            value: `${analyticsData.performance.responseTime}h`,
            change: '-0.5h',
            positive: true,
            icon: 'fas fa-clock'
        }
    ];

    return metrics.map(metric => `
        <div class="metric-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <div>
                    <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">${metric.title}</div>
                    <div style="font-size: 1.8rem; font-weight: 600; color: #333;">${metric.value}</div>
                </div>
                <i class="${metric.icon}" style="font-size: 1.5rem; color: #4CAF50;"></i>
            </div>
            <div style="display: flex; align-items: center; gap: 5px;">
                <span style="color: ${metric.positive ? '#4CAF50' : '#f44336'}; font-size: 0.8rem; font-weight: 500;">
                    ${metric.change}
                </span>
                <span style="color: #999; font-size: 0.8rem;">vs last month</span>
            </div>
        </div>
    `).join('');
}

function generateSessionsChart() {
    const maxSessions = Math.max(...chartData.sessionsChart.map(d => d.sessions));
    const bars = chartData.sessionsChart.map((data, index) => {
        const height = (data.sessions / maxSessions) * 180;
        return `
            <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                <div style="height: 180px; display: flex; align-items: flex-end; width: 100%;">
                    <div style="background: #4CAF50; width: 80%; height: ${height}px; border-radius: 4px 4px 0 0; margin: 0 auto; position: relative;">
                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: #333; font-weight: 500;">
                            ${data.sessions}
                        </div>
                    </div>
                </div>
                <div style="margin-top: 8px; font-size: 0.7rem; color: #666;">
                    Week ${index + 1}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div style="display: flex; align-items: flex-end; gap: 5px; height: 200px; padding: 20px;">
            ${bars}
        </div>
    `;
}

function generateEarningsChart() {
    const maxEarnings = Math.max(...chartData.earningsChart.map(d => d.earnings));
    const bars = chartData.earningsChart.map((data, index) => {
        const height = (data.earnings / maxEarnings) * 180;
        return `
            <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                <div style="height: 180px; display: flex; align-items: flex-end; width: 100%;">
                    <div style="background: #2196F3; width: 80%; height: ${height}px; border-radius: 4px 4px 0 0; margin: 0 auto; position: relative;">
                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: #333; font-weight: 500;">
                            £${data.earnings}
                        </div>
                    </div>
                </div>
                <div style="margin-top: 8px; font-size: 0.7rem; color: #666;">
                    Week ${index + 1}
                </div>
            </div>
        `;
    }).join('');

    return `
        <div style="display: flex; align-items: flex-end; gap: 5px; height: 200px; padding: 20px;">
            ${bars}
        </div>
    `;
}

function generateOverviewTab() {
    return `
        <div class="overview-content">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                    <h4>📈 Performance Highlights</h4>
                    <div class="performance-list">
                        <div class="performance-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Sessions Completed</span>
                            <strong>${analyticsData.sessions.completed}</strong>
                        </div>
                        <div class="performance-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Student Retention Rate</span>
                            <strong>${analyticsData.performance.studentRetention}%</strong>
                        </div>
                        <div class="performance-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>On-Time Rate</span>
                            <strong>${analyticsData.performance.onTimeRate}%</strong>
                        </div>
                        <div class="performance-item" style="display: flex; justify-content: space-between; padding: 10px 0;">
                            <span>Average Session Rating</span>
                            <strong>${analyticsData.ratings.average}/5.0</strong>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4>💰 Earnings Breakdown</h4>
                    <div class="earnings-list">
                        <div class="earnings-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>This Week</span>
                            <strong>£${analyticsData.earnings.thisWeek}</strong>
                        </div>
                        <div class="earnings-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>This Month</span>
                            <strong>£${analyticsData.earnings.thisMonth}</strong>
                        </div>
                        <div class="earnings-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <span>Pending Payout</span>
                            <strong>£${analyticsData.earnings.pending}</strong>
                        </div>
                        <div class="earnings-item" style="display: flex; justify-content: space-between; padding: 10px 0;">
                            <span>Average per Session</span>
                            <strong>£${analyticsData.earnings.averagePerSession}</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px;">
                <h4>📚 Subject Performance</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    ${Object.entries(analyticsData.subjects).map(([subject, data]) => `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
                            <div style="font-weight: 600; text-transform: capitalize; margin-bottom: 5px;">${subject}</div>
                            <div style="font-size: 0.9rem; color: #666;">${data.sessions} sessions</div>
                            <div style="font-size: 0.9rem; color: #4CAF50; margin-top: 5px;">${data.rating.toFixed(1)} ⭐</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function switchAnalyticsTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    const tabContent = document.getElementById('analyticsTabContent');
    
    switch(tabName) {
        case 'overview':
            tabContent.innerHTML = generateOverviewTab();
            break;
        case 'students':
            tabContent.innerHTML = generateStudentsTab();
            break;
        case 'performance':
            tabContent.innerHTML = generatePerformanceTab();
            break;
        case 'subjects':
            tabContent.innerHTML = generateSubjectsTab();
            break;
        case 'feedback':
            tabContent.innerHTML = generateFeedbackTab();
            break;
    }
}

function generateStudentsTab() {
    return `
        <div class="students-content">
            <h4>👥 Student Analytics</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: 600; color: #4CAF50;">${analyticsData.students.total}</div>
                    <div style="color: #666;">Total Students</div>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: 600; color: #2196F3;">${analyticsData.students.active}</div>
                    <div style="color: #666;">Currently Active</div>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: 600; color: #FF9800;">${analyticsData.students.newThisMonth}</div>
                    <div style="color: #666;">New This Month</div>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <div style="font-size: 2rem; font-weight: 600; color: #9C27B0;">${analyticsData.students.returning}</div>
                    <div style="color: #666;">Returning Students</div>
                </div>
            </div>
            <p style="color: #666; font-style: italic;">Student retention rate: ${analyticsData.performance.studentRetention}%</p>
        </div>
    `;
}

function generatePerformanceTab() {
    return `
        <div class="performance-content">
            <h4>⚡ Performance Metrics</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0;">
                <div>
                    <h5>Reliability Metrics</h5>
                    <div class="metric-bar" style="margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>On-Time Rate</span>
                            <span>${analyticsData.performance.onTimeRate}%</span>
                        </div>
                        <div style="background: #e0e0e0; height: 8px; border-radius: 4px;">
                            <div style="background: #4CAF50; height: 100%; width: ${analyticsData.performance.onTimeRate}%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div class="metric-bar" style="margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Completion Rate</span>
                            <span>${analyticsData.performance.completionRate}%</span>
                        </div>
                        <div style="background: #e0e0e0; height: 8px; border-radius: 4px;">
                            <div style="background: #2196F3; height: 100%; width: ${analyticsData.performance.completionRate}%; border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h5>Response Metrics</h5>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: #333;">${analyticsData.performance.responseTime}h</div>
                        <div style="color: #666;">Average Response Time</div>
                        <div style="margin-top: 10px; font-size: 0.9rem; color: #4CAF50;">↓ 0.5h faster than last month</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateSubjectsTab() {
    return `
        <div class="subjects-content">
            <h4>📚 Subject Performance</h4>
            <div style="margin: 20px 0;">
                ${Object.entries(analyticsData.subjects).map(([subject, data]) => `
                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h5 style="margin: 0; text-transform: capitalize;">${subject}</h5>
                                <div style="color: #666; margin-top: 5px;">${data.sessions} sessions completed</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 1.2rem; font-weight: 600; color: #4CAF50;">${data.rating.toFixed(1)}/5</div>
                                <div style="color: #666; font-size: 0.9rem;">Average Rating</div>
                            </div>
                        </div>
                        <div style="margin-top: 15px;">
                            <div style="background: #e0e0e0; height: 6px; border-radius: 3px;">
                                <div style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: ${(data.rating / 5) * 100}%; border-radius: 3px;"></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateFeedbackTab() {
    const recentFeedback = [
        { student: "Sarah M.", rating: 5, comment: "Excellent explanation of calculus concepts. Very patient and helpful!", date: "2 days ago" },
        { student: "James L.", rating: 5, comment: "Made algebra finally click for me. Great teaching style!", date: "1 week ago" },
        { student: "Emma R.", rating: 4, comment: "Good session, helped me understand geometry proofs better.", date: "1 week ago" },
        { student: "David K.", rating: 5, comment: "Amazing tutor! Helped me improve my statistics grade significantly.", date: "2 weeks ago" }
    ];

    return `
        <div class="feedback-content">
            <h4>💬 Recent Student Feedback</h4>
            <div style="margin: 20px 0;">
                ${recentFeedback.map(feedback => `
                    <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div>
                                <strong>${feedback.student}</strong>
                                <div style="color: #FF9800; margin-top: 5px;">
                                    ${'⭐'.repeat(feedback.rating)}
                                </div>
                            </div>
                            <div style="color: #666; font-size: 0.9rem;">${feedback.date}</div>
                        </div>
                        <p style="color: #333; margin: 0; line-height: 1.5;">"${feedback.comment}"</p>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h5>📊 Rating Distribution</h5>
                ${Object.entries(analyticsData.ratings.breakdown).reverse().map(([stars, count]) => `
                    <div style="display: flex; align-items: center; margin: 10px 0;">
                        <div style="width: 60px;">${stars} stars</div>
                        <div style="flex: 1; background: #e0e0e0; height: 8px; border-radius: 4px; margin: 0 15px;">
                            <div style="background: #FF9800; height: 100%; width: ${(count / analyticsData.ratings.total) * 100}%; border-radius: 4px;"></div>
                        </div>
                        <div style="width: 30px; text-align: right;">${count}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function closeAnalyticsModal() {
    const modal = document.getElementById('analyticsModal');
    if (modal) {
        modal.remove();
    }
}

function updateAnalytics() {
    const dateRange = document.getElementById('dateRange').value;
    showNotification(`Analytics updated for last ${dateRange} days`, 'success');
}

function refreshAnalytics() {
    showNotification('Analytics data refreshed', 'success');
    loadAnalyticsData();
}

function exportAnalytics() {
    showNotification('Analytics data exported to CSV', 'success');
}

function generateReport() {
    showNotification('Comprehensive report generated and emailed', 'success');
}

function loadAnalyticsData() {
    // Simulate loading animation
    const metricsCards = document.querySelectorAll('.metric-card');
    metricsCards.forEach(card => {
        card.style.animation = 'fadeIn 0.5s ease-in-out';
    });
}
