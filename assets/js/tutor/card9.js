// CARD 9: PREMIUM FEATURES - Complete Functionality
// Copy/Paste this entire block for Card 9

// Premium Features Variables
let premiumActive = false;
let premiumFeatures = {
    visibility: {
        priorityPlacement: false,
        premiumBadge: false,
        featuredRecommendations: false,
        profileCustomization: false
    },
    analytics: {
        detailedMetrics: false,
        engagementInsights: false,
        optimizationTips: false,
        competitionAnalysis: false
    },
    earnings: {
        reducedFee: false, // 10% vs 15%
        premiumPricing: false,
        bonusMatches: false,
        earlyAccess: false
    },
    matching: {
        aiMatching: false,
        compatibilityScoring: false,
        autoProposals: false,
        studentInsights: false
    },
    support: {
        prioritySupport: false,
        dedicatedManager: false,
        advancedTraining: false,
        marketingSupport: false
    }
};

let premiumStats = {
    averageIncrease: 40, // percentage
    monthlyFee: 19.99,
    trialDays: 30,
    platformFeeReduction: 5 // from 15% to 10%
};

// Premium Features Functions
function upgradePremium() {
    openPremiumModal();
}

function viewPremiumDetails() {
    openPremiumModal();
}

function openPremiumModal() {
    const premiumModal = document.createElement('div');
    premiumModal.className = 'modal';
    premiumModal.id = 'premiumModal';
    premiumModal.style.display = 'block';
    
    premiumModal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <span class="close" onclick="closePremiumModal()">&times;</span>
            <div style="text-align: center; margin-bottom: 30px;">
                <h3>⭐ Premium Tutor Benefits</h3>
                <p style="color: #666; font-size: 1.1rem;">Unlock advanced features to boost your tutoring success and earn more students</p>
            </div>
            
            <!-- Pricing Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <div style="font-size: 2.5rem; font-weight: 600; margin-bottom: 10px;">£${premiumStats.monthlyFee}</div>
                <div style="font-size: 1.1rem; opacity: 0.9;">per month</div>
                <div style="background: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 15px;">
                    🎉 ${premiumStats.trialDays}-day FREE trial • Cancel anytime
                </div>
            </div>
            
            <!-- Features Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 30px;">
                <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="background: #4CAF50; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            🚀
                        </div>
                        <h4 style="margin: 0; color: #333;">Boost Your Visibility</h4>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Priority placement in search results
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Premium tutor badge on profile
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Featured in student recommendations
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Advanced profile customization
                        </li>
                    </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="background: #2196F3; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            📊
                        </div>
                        <h4 style="margin: 0; color: #333;">Advanced Analytics</h4>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Detailed performance metrics
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Student engagement insights
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Earnings optimization tips
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Competition analysis
                        </li>
                    </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="background: #FF9800; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            💰
                        </div>
                        <h4 style="margin: 0; color: #333;">Higher Earnings</h4>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Reduced platform fee (10% vs 15%)
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Premium pricing suggestions
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Bonus student matches
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Early access to high-value requests
                        </li>
                    </ul>
                </div>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="background: #9C27B0; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                            🎯
                        </div>
                        <h4 style="margin: 0; color: #333;">Better Matching</h4>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            AI-powered student matching
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Compatibility scoring
                        </li>
                        <li style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Automatic proposal submissions
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Student preference insights
                        </li>
                    </ul>
                </div>
            </div>
            
            <!-- Success Stats -->
            <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                <h4 style="margin: 0 0 15px 0;">🎉 Premium Success Statistics</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
                    <div>
                        <div style="font-size: 2rem; font-weight: 600;">${premiumStats.averageIncrease}%</div>
                        <div style="opacity: 0.9;">More Earnings</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 600;">3x</div>
                        <div style="opacity: 0.9;">More Student Views</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 600;">60%</div>
                        <div style="opacity: 0.9;">Faster Bookings</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: 600;">95%</div>
                        <div style="opacity: 0.9;">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
            
            <!-- Premium Tools Preview -->
            <div style="margin-bottom: 30px;">
                <h4 style="text-align: center; margin-bottom: 20px;">🛠️ Exclusive Premium Tools</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    ${generatePremiumToolsGrid()}
                </div>
            </div>
            
            <!-- Testimonials -->
            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                <h4 style="text-align: center; margin-bottom: 20px;">💬 What Premium Tutors Say</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #FF9800; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
                        <p style="margin: 0 0 15px 0; font-style: italic;">"Premium features doubled my student bookings in just 2 months. The AI matching is incredible!"</p>
                        <div style="font-weight: 600; color: #333;">- Sarah K., Algebra Tutor</div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="color: #FF9800; margin-bottom: 10px;">⭐⭐⭐⭐⭐</div>
                        <p style="margin: 0 0 15px 0; font-style: italic;">"The reduced platform fee alone pays for itself. Plus the advanced analytics help me optimize my rates."</p>
                        <div style="font-weight: 600; color: #333;">- Michael R., Calculus Tutor</div>
                    </div>
                </div>
            </div>
            
            <!-- CTA Buttons -->
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                <button class="btn" onclick="startPremiumTrial()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; color: white; padding: 15px 30px; font-size: 1.1rem; border-radius: 8px; cursor: pointer;">
                    🚀 Start Free Trial (${premiumStats.trialDays} Days)
                </button>
                <button class="btn btn-secondary" onclick="comparePlans()" style="padding: 15px 30px; font-size: 1.1rem;">
                    📊 Compare Plans
                </button>
                <button class="btn btn-secondary" onclick="closePremiumModal()" style="padding: 15px 30px; font-size: 1.1rem;">
                    Maybe Later
                </button>
            </div>
            
            <!-- Money Back Guarantee -->
            <div style="text-align: center; margin-top: 20px; color: #666;">
                <small>💯 30-day money-back guarantee • Cancel anytime • No setup fees</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(premiumModal);
}

function generatePremiumToolsGrid() {
    const premiumTools = [
        { name: 'AI Student Matcher', icon: '🤖', description: 'Smart algorithm finds perfect student matches' },
        { name: 'Advanced Scheduler', icon: '📅', description: 'Intelligent scheduling with conflict resolution' },
        { name: 'Performance Analyzer', icon: '📈', description: 'Deep insights into your tutoring metrics' },
        { name: 'Marketing Booster', icon: '📢', description: 'Automated profile promotion tools' },
        { name: 'Price Optimizer', icon: '💡', description: 'Dynamic pricing recommendations' },
        { name: 'Student Insights', icon: '👥', description: 'Detailed student learning profiles' }
    ];

    return premiumTools.map(tool => `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 2rem; margin-bottom: 10px;">${tool.icon}</div>
            <div style="font-weight: 600; margin-bottom: 8px; color: #333;">${tool.name}</div>
            <div style="font-size: 0.9rem; color: #666; line-height: 1.4;">${tool.description}</div>
        </div>
    `).join('');
}

function startPremiumTrial() {
    // Show trial confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal';
    confirmModal.id = 'premiumConfirmModal';
    confirmModal.style.display = 'block';
    
    confirmModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close" onclick="closePremiumConfirmModal()">&times;</span>
            <div style="text-align: center;">
                <h3>🎉 Start Your Premium Trial</h3>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 10px;">30-Day FREE Trial</div>
                    <div>Then £${premiumStats.monthlyFee}/month</div>
                </div>
                
                <div style="text-align: left; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4>✅ Trial includes:</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>All premium features unlocked</li>
                        <li>Reduced platform fee (10% vs 15%)</li>
                        <li>Priority student matching</li>
                        <li>Advanced analytics dashboard</li>
                        <li>Premium support</li>
                    </ul>
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <strong>💡 Pro Tip:</strong> Most tutors see a 40% increase in bookings within the first week!
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button class="btn" onclick="confirmPremiumTrial()" style="background: #4CAF50; padding: 15px 25px;">
                        🚀 Activate Trial Now
                    </button>
                    <button class="btn btn-secondary" onclick="closePremiumConfirmModal()">
                        Cancel
                    </button>
                </div>
                
                <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                    Cancel anytime during trial • No charges until trial ends
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
}

function confirmPremiumTrial() {
    premiumActive = true;
    
    // Update all premium features to active
    Object.keys(premiumFeatures).forEach(category => {
        Object.keys(premiumFeatures[category]).forEach(feature => {
            premiumFeatures[category][feature] = true;
        });
    });
    
    // Update premium card status
    updatePremiumCardStatus();
    
    // Show success notification
    showNotification('🎉 Premium trial activated! All features unlocked for 30 days.', 'success');
    
    // Close modals
    closePremiumConfirmModal();
    closePremiumModal();
    
    // Update progress if this was the last step
    updateProgress();
}

function updatePremiumCardStatus() {
    const premiumCard = document.getElementById('premiumCard');
    if (premiumCard) {
        const statusIndicator = premiumCard.querySelector('.status-indicator');
        const statusSpan = statusIndicator.querySelector('span');
        const statusDot = statusIndicator.querySelector('.status-dot');
        
        if (premiumActive) {
            statusIndicator.style.background = '#e8f5e8';
            statusIndicator.style.color = '#4CAF50';
            statusDot.style.background = '#4CAF50';
            statusSpan.textContent = 'Premium Active';
            
            // Update card actions
            const cardActions = premiumCard.querySelector('.card-actions');
            cardActions.innerHTML = `
                <button class="btn btn-secondary" onclick="managePremium()">Manage Premium</button>
                <button class="btn btn-secondary" onclick="viewPremiumAnalytics()">Premium Analytics</button>
            `;
        }
    }
}

function comparePlans() {
    const compareModal = document.createElement('div');
    compareModal.className = 'modal';
    compareModal.id = 'compareModal';
    compareModal.style.display = 'block';
    
    compareModal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="closeCompareModal()">&times;</span>
            <h3>📊 Plan Comparison</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">
                <!-- Standard Plan -->
                <div style="border: 2px solid #e0e0e0; border-radius: 12px; padding: 25px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h4>Standard Tutor</h4>
                        <div style="font-size: 2rem; font-weight: 600; color: #666;">FREE</div>
                        <div style="color: #666;">Always free</div>
                    </div>
                    
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Basic profile listing
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Standard search visibility
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            Basic analytics
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            15% platform fee
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #f44336; margin-right: 10px;">✗</span>
                            <span style="color: #999;">Priority placement</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #f44336; margin-right: 10px;">✗</span>
                            <span style="color: #999;">AI student matching</span>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #f44336; margin-right: 10px;">✗</span>
                            <span style="color: #999;">Advanced analytics</span>
                        </li>
                    </ul>
                </div>
                
                <!-- Premium Plan -->
                <div style="border: 3px solid #667eea; border-radius: 12px; padding: 25px; position: relative; background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);">
                    <div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: #667eea; color: white; padding: 8px 20px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                        MOST POPULAR
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 20px; margin-top: 10px;">
                        <h4>Premium Tutor</h4>
                        <div style="font-size: 2rem; font-weight: 600; color: #667eea;">£${premiumStats.monthlyFee}</div>
                        <div style="color: #666;">per month</div>
                    </div>
                    
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Priority profile placement</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Premium badge & visibility</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Advanced analytics suite</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Reduced 10% platform fee</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>AI-powered student matching</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Automatic proposal submissions</strong>
                        </li>
                        <li style="padding: 8px 0; display: flex; align-items: center;">
                            <span style="color: #4CAF50; margin-right: 10px;">✓</span>
                            <strong>Priority customer support</strong>
                        </li>
                    </ul>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button class="btn" onclick="startPremiumTrial()" style="background: #667eea; width: 100%; padding: 12px;">
                            Start Free Trial
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeCompareModal()">Close Comparison</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(compareModal);
}

function managePremium() {
    showNotification('Premium management panel opened', 'info');
}

function viewPremiumAnalytics() {
    openAnalyticsDashboard(); // Reuse analytics dashboard with premium features
    showNotification('Premium analytics features unlocked', 'success');
}

function closePremiumModal() {
    const modal = document.getElementById('premiumModal');
    if (modal) {
        modal.remove();
    }
}

function closePremiumConfirmModal() {
    const modal = document.getElementById('premiumConfirmModal');
    if (modal) {
        modal.remove();
    }
}

function closeCompareModal() {
    const modal = document.getElementById('compareModal');
    if (modal) {
        modal.remove();
    }
}
