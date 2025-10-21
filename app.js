// ============================================================
// COMPLETE FIX - Copy this ENTIRE section into your app.js
// Insert this RIGHT AFTER: const SESSION_TIMEOUT = 120;
// ============================================================

// Session management
let sessionTimeout;

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    if (VALID_USERS[username] === password) {
        // Successful login
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('app').classList.add('active');
        document.getElementById('userDisplay').textContent = username;
        
        // Set session
        sessionStorage.setItem('user', username);
        sessionStorage.setItem('loginTime', new Date().getTime());
        
        // Start session timeout
        resetSessionTimeout();
        
        // Initialize the application
        initializeApp();
    } else {
        // Failed login
        errorMessage.textContent = 'Invalid username or password';
        errorMessage.classList.add('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('loginTime');
        clearTimeout(sessionTimeout);
        location.reload();
    }
}

function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        alert('Session expired. Please login again.');
        logout();
    }, SESSION_TIMEOUT * 60 * 1000);
}

function checkSession() {
    const user = sessionStorage.getItem('user');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (user && loginTime) {
        const elapsed = (new Date().getTime() - loginTime) / 1000 / 60;
        
        if (elapsed < SESSION_TIMEOUT) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('app').classList.add('active');
            document.getElementById('userDisplay').textContent = user;
            resetSessionTimeout();
            initializeApp();
        } else {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('loginTime');
        }
    }
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-tab');
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Find and activate the clicked tab button
    const allTabs = document.querySelectorAll('.tab');
    allTabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(tabName) || 
            tab.onclick && tab.onclick.toString().includes(tabName)) {
            tab.classList.add('active');
        }
    });
    
    // Update specific content when switching tabs
    if (tabName === 'distributors') {
        filterDistributors();
    } else if (tabName === 'selection') {
        // Update selection features if they exist
        if (typeof updateSelectedPOIPanel === 'function') {
            updateSelectedPOIPanel();
        }
        if (typeof updateTerritoryUI === 'function') {
            updateTerritoryUI();
        }
    }
}

// Modal management
function closeModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showModal(content) {
    const modal = document.getElementById('reportModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent) {
        modalContent.innerHTML = content;
        modal.classList.add('show');
    }
}

// Report functions
function showPerformanceReport() {
    const excellentDist = distributors.filter(d => d.rating === 'Excellent');
    const goodDist = distributors.filter(d => d.rating === 'Good');
    const avgDist = distributors.filter(d => d.rating === 'Average');
    const belowDist = distributors.filter(d => d.rating === 'Below Average');
    
    const content = `
        <h2 style="color: #667eea; margin-bottom: 20px;">📊 Distributor Performance Report</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; font-weight: 700;">${excellentDist.length}</div>
                <div style="font-size: 14px; opacity: 0.9;">Excellent (90%+)</div>
            </div>
            <div style="background: linear-gradient(135deg, #20c997, #17a2b8); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; font-weight: 700;">${goodDist.length}</div>
                <div style="font-size: 14px; opacity: 0.9;">Good (75-90%)</div>
            </div>
            <div style="background: linear-gradient(135deg, #ffc107, #ff9800); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; font-weight: 700;">${avgDist.length}</div>
                <div style="font-size: 14px; opacity: 0.9;">Average (60-75%)</div>
            </div>
            <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                <div style="font-size: 32px; font-weight: 700;">${belowDist.length}</div>
                <div style="font-size: 14px; opacity: 0.9;">Below Average (<60%)</div>
            </div>
        </div>
        <h3 style="color: #333; margin: 20px 0 10px;">Top Performers:</h3>
        <div style="max-height: 300px; overflow-y: auto;">
            ${excellentDist.slice(0, 10).map((d, i) => `
                <div style="padding: 12px; margin: 8px 0; background: #f8f9fa; border-left: 4px solid #28a745; border-radius: 6px;">
                    <div style="font-weight: 600;">${i + 1}. ${d.name}</div>
                    <div style="font-size: 13px; color: #666; margin-top: 4px;">
                        ${d.city} • Achievement: ${d.achievement.toFixed(1)}% • ${d.retailers} retailers
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    showModal(content);
}

function showCoverageGaps() {
    const content = `
        <h2 style="color: #667eea; margin-bottom: 20px;">🎯 Coverage Gap Analysis</h2>
        <p style="color: #666; margin-bottom: 20px;">
            Analyzing areas with low distributor coverage and high POI density...
        </p>
        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <strong>Recommendation:</strong> Focus on areas with 50+ POIs but no nearby distributors within 25 KM.
        </div>
        <p style="color: #666;">
            Use the map filters to identify specific gaps in your territory coverage.
        </p>
    `;
    
    showModal(content);
}

function showNewWSPlan() {
    const wsNeeded = Math.ceil(pois.length / 150);
    const investment = (wsNeeded * 0.6).toFixed(1);
    const monthlyRev = (wsNeeded * 0.3).toFixed(1);
    
    const content = `
        <h2 style="color: #667eea; margin-bottom: 20px;">⭐ New Water Station Opportunities</h2>
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                <div>
                    <div style="font-size: 28px; font-weight: 700;">${wsNeeded}+</div>
                    <div style="font-size: 13px; opacity: 0.9;">New WS Needed</div>
                </div>
                <div>
                    <div style="font-size: 28px; font-weight: 700;">₹${investment}Cr</div>
                    <div style="font-size: 13px; opacity: 0.9;">Investment</div>
                </div>
                <div>
                    <div style="font-size: 28px; font-weight: 700;">₹${monthlyRev}Cr</div>
                    <div style="font-size: 13px; opacity: 0.9;">Monthly Revenue</div>
                </div>
            </div>
        </div>
        <h3 style="color: #333; margin: 20px 0 10px;">Implementation Strategy:</h3>
        <ol style="color: #666; line-height: 1.8;">
            <li>Identify high-density POI clusters</li>
            <li>Calculate optimal WS locations</li>
            <li>Assess infrastructure requirements</li>
            <li>Develop phased rollout plan</li>
            <li>Monitor and optimize coverage</li>
        </ol>
    `;
    
    showModal(content);
}

// Utility functions
function formatNumber(num) {
    if (!num || isNaN(num)) return '0';
    return parseFloat(num).toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
}

// Initialize on page load
window.addEventListener('load', function() {
    console.log('🚀 Application starting...');
    checkSession();
});

// Keep session alive on user activity
document.addEventListener('click', function() {
    if (sessionTimeout) resetSessionTimeout();
});

document.addEventListener('keypress', function() {
    if (sessionTimeout) resetSessionTimeout();
});

console.log('✅ Core functions loaded successfully');

// ============================================================
// END OF COMPLETE FIX
// Your existing code continues below...
// ============================================================
