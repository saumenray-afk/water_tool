// ===== RTM MOBILE PWA - MAIN APPLICATION =====
// Mobile-first Sales & Distribution Management Tool

// Global State
const AppState = {
    currentUser: null,
    currentView: 'dashboard',
    distributors: [],
    pois: [],
    visits: [],
    orders: [],
    retailers: [],
    expenses: [],
    map: null,
    mapMarkers: [],
    userLocation: null,
    isOnline: navigator.onLine,
    lastSync: null,
    loading: false
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('RTM Mobile PWA Initializing...');
    
    // Check if user is already logged in
    const session = getSession();
    if (session && session.user) {
        AppState.currentUser = session.user;
        showApp();
        initializeApp();
    } else {
        showLoginScreen();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup online/offline handlers
    setupConnectivityHandlers();
    
    // Check for updates
    checkForUpdates();
});

// ===== AUTHENTICATION =====
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const sideDrawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('overlay');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sideDrawer.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sideDrawer.classList.remove('open');
            overlay.classList.remove('active');
            closeFABMenu();
        });
    }
    
    // Navigation items
    setupNavigationListeners();
    
    // Sync button
    const syncBtn = document.getElementById('syncBtn');
    if (syncBtn) {
        syncBtn.addEventListener('click', syncDataNow);
    }
    
    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('userRole').value;
    const errorDiv = document.getElementById('loginError');
    
    // Show loading
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    
    // Simulate API call
    setTimeout(() => {
        // Validate credentials
        const user = VALID_USERS[username];
        
        if (user && user.password === password && user.role === role) {
            // Success
            AppState.currentUser = {
                username: username,
                name: user.name,
                email: user.email,
                role: user.role
            };
            
            // Save session
            saveSession(AppState.currentUser);
            
            // Show app
            showApp();
            initializeApp();
            
            // Show success toast
            showToast('success', 'Welcome!', `Logged in as ${user.name}`);
        } else {
            // Error
            errorDiv.textContent = 'Invalid username, password, or role. Please try again.';
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    }, 1000);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearSession();
        AppState.currentUser = null;
        showLoginScreen();
        showToast('info', 'Logged Out', 'You have been logged out successfully');
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // Update UI with user info
    updateUserProfile();
    
    // Set role-based visibility
    document.body.dataset.role = AppState.currentUser.role;
}

function updateUserProfile() {
    const user = AppState.currentUser;
    if (!user) return;
    
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Update drawer profile
    const drawerAvatar = document.getElementById('drawerAvatar');
    const drawerUserName = document.getElementById('drawerUserName');
    const drawerUserRole = document.getElementById('drawerUserRole');
    
    if (drawerAvatar) drawerAvatar.textContent = initials;
    if (drawerUserName) drawerUserName.textContent = user.name;
    if (drawerUserRole) drawerUserRole.textContent = getRoleLabel(user.role);
    
    // Update settings profile
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) profileName.textContent = user.name;
    if (profileRole) profileRole.textContent = getRoleLabel(user.role);
    if (profileEmail) profileEmail.textContent = user.email;
}

function getRoleLabel(role) {
    const labels = {
        'admin': 'Administrator',
        'manager': 'Sales Manager',
        'sales': 'Sales Person',
        'distributor': 'Distributor'
    };
    return labels[role] || role;
}

// ===== SESSION MANAGEMENT =====
function saveSession(user) {
    const session = {
        user: user,
        timestamp: Date.now(),
        expiresIn: SESSION_CONFIG.timeout * 60 * 1000
    };
    localStorage.setItem(SESSION_CONFIG.storageKey, JSON.stringify(session));
}

function getSession() {
    const sessionStr = localStorage.getItem(SESSION_CONFIG.storageKey);
    if (!sessionStr) return null;
    
    try {
        const session = JSON.parse(sessionStr);
        const now = Date.now();
        
        // Check if session expired
        if (now - session.timestamp > session.expiresIn) {
            clearSession();
            return null;
        }
        
        return session;
    } catch (e) {
        console.error('Error parsing session:', e);
        return null;
    }
}

function clearSession() {
    localStorage.removeItem(SESSION_CONFIG.storageKey);
}

// ===== APP INITIALIZATION =====
async function initializeApp() {
    showLoading(true);
    
    try {
        // Update current date
        updateCurrentDate();
        
        // Load data
        await loadAllData();
        
        // Initialize map
        initializeMap();
        
        // Populate initial view
        populateDashboard();
        
        // Start GPS tracking if enabled
        if (APP_CONFIG.features.gpsTracking) {
            startGPSTracking();
        }
        
        // Setup auto-sync
        if (APP_CONFIG.sync.autoSync) {
            setupAutoSync();
        }
        
        showLoading(false);
        showToast('success', 'Ready!', 'App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showLoading(false);
        showToast('error', 'Error', 'Failed to initialize app');
    }
}

function updateCurrentDate() {
    const dateElement = document.getElementById('headerSubtitle');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-IN', options);
    }
}

// ===== DATA LOADING =====
async function loadAllData() {
    console.log('Loading data...');
    
    // Load from cache first
    loadCachedData();
    
    // If online, fetch fresh data
    if (AppState.isOnline) {
        try {
            await Promise.all([
                loadDistributors(),
                loadPOIs()
            ]);
            AppState.lastSync = new Date();
            saveCachedData();
        } catch (error) {
            console.error('Error fetching fresh data:', error);
            showToast('warning', 'Offline', 'Using cached data');
        }
    } else {
        showToast('info', 'Offline Mode', 'Using cached data');
    }
}

async function loadDistributors() {
    // Process distributor data
    AppState.distributors = DISTRIBUTORS_DATA.map((dist, index) => {
        const achievement = dist.target > 0 ? (dist.sales / dist.target) * 100 : 0;
        const rating = getPerformanceRating(achievement);
        
        return {
            ...dist,
            index: index,
            achievement: achievement,
            rating: rating
        };
    });
    
    console.log(`Loaded ${AppState.distributors.length} distributors`);
}

async function loadPOIs() {
    // In production, this would load from the ZIP file
    // For now, we'll use a placeholder
    console.log('POI loading from:', POI_ZIP_URL);
    
    // Check cache
    const cachedPOIs = localStorage.getItem(APP_CONFIG.storageKeys.pois);
    if (cachedPOIs) {
        try {
            AppState.pois = JSON.parse(cachedPOIs);
            console.log(`Loaded ${AppState.pois.length} POIs from cache`);
        } catch (e) {
            console.error('Error parsing cached POIs:', e);
        }
    }
    
    // TODO: Implement actual ZIP file loading
    // This would use JSZip to extract and parse the CSV
}

function loadCachedData() {
    // Load visits
    const cachedVisits = localStorage.getItem(APP_CONFIG.storageKeys.visits);
    if (cachedVisits) {
        try {
            AppState.visits = JSON.parse(cachedVisits);
        } catch (e) {
            AppState.visits = [];
        }
    }
    
    // Load orders
    const cachedOrders = localStorage.getItem(APP_CONFIG.storageKeys.orders);
    if (cachedOrders) {
        try {
            AppState.orders = JSON.parse(cachedOrders);
        } catch (e) {
            AppState.orders = [];
        }
    }
    
    // Load retailers
    const cachedRetailers = localStorage.getItem(APP_CONFIG.storageKeys.retailers);
    if (cachedRetailers) {
        try {
            AppState.retailers = JSON.parse(cachedRetailers);
        } catch (e) {
            AppState.retailers = [];
        }
    }
}

function saveCachedData() {
    localStorage.setItem(APP_CONFIG.storageKeys.distributors, JSON.stringify(AppState.distributors));
    localStorage.setItem(APP_CONFIG.storageKeys.pois, JSON.stringify(AppState.pois));
    localStorage.setItem(APP_CONFIG.storageKeys.visits, JSON.stringify(AppState.visits));
    localStorage.setItem(APP_CONFIG.storageKeys.orders, JSON.stringify(AppState.orders));
    localStorage.setItem(APP_CONFIG.storageKeys.retailers, JSON.stringify(AppState.retailers));
    localStorage.setItem(APP_CONFIG.storageKeys.lastSync, AppState.lastSync.toISOString());
}

function getPerformanceRating(achievement) {
    const ratings = APP_CONFIG.performanceRatings;
    if (achievement >= ratings.excellent.min) return 'excellent';
    if (achievement >= ratings.good.min) return 'good';
    if (achievement >= ratings.average.min) return 'average';
    return 'below';
}

// ===== NAVIGATION =====
function setupNavigationListeners() {
    // Side menu navigation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) {
                navigateToView(view);
                // Close drawer
                document.getElementById('sideDrawer').classList.remove('open');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    });
    
    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view) {
                navigateToView(view);
            }
        });
    });
}

function navigateToView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(`${viewName}View`);
    if (targetView) {
        targetView.classList.add('active');
        AppState.currentView = viewName;
        
        // Update header title
        updateViewTitle(viewName);
        
        // Update active nav items
        updateActiveNavigation(viewName);
        
        // Populate view-specific content
        populateView(viewName);
    }
}

function updateViewTitle(viewName) {
    const titles = {
        'dashboard': 'Dashboard',
        'map': 'Map View',
        'distributors': 'Distributors',
        'retailers': 'Retailers',
        'visits': 'My Visits',
        'orders': 'Orders',
        'reports': 'Reports',
        'expansion': 'Market Expansion',
        'targets': 'Targets',
        'team': 'Team Performance',
        'settings': 'Settings'
    };
    
    const viewTitle = document.getElementById('viewTitle');
    if (viewTitle) {
        viewTitle.textContent = titles[viewName] || viewName;
    }
}

function updateActiveNavigation(viewName) {
    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function populateView(viewName) {
    switch(viewName) {
        case 'dashboard':
            populateDashboard();
            break;
        case 'map':
            if (AppState.map) {
                setTimeout(() => AppState.map.invalidateSize(), 100);
            }
            break;
        case 'distributors':
            populateDistributors();
            break;
        case 'retailers':
            populateRetailers();
            break;
        case 'visits':
            populateVisits();
            break;
        case 'orders':
            populateOrders();
            break;
        case 'expansion':
            populateExpansion();
            break;
        case 'team':
            populateTeam();
            break;
    }
}

// ===== DASHBOARD =====
function populateDashboard() {
    updateDashboardStats();
    populateSchedule();
    populateActivities();
    if (AppState.currentUser.role === 'manager' || AppState.currentUser.role === 'admin') {
        populateLeaderboard();
    }
}

function updateDashboardStats() {
    // Calculate today's stats
    const todaySales = calculateTodaySales();
    const todayOrders = AppState.orders.filter(o => isToday(new Date(o.date))).length;
    const todayVisits = AppState.visits.filter(v => isToday(new Date(v.date)) && v.status === 'completed').length;
    
    // Calculate target achievement
    const monthlyTarget = 500000; // ₹5L
    const monthlyAchieved = 325000; // ₹3.25L
    const targetPercent = (monthlyAchieved / monthlyTarget) * 100;
    
    // Update UI
    document.getElementById('todaySales').textContent = formatCurrency(todaySales);
    document.getElementById('todayOrders').textContent = todayOrders;
    document.getElementById('todayVisits').textContent = todayVisits;
    document.getElementById('targetPercent').textContent = targetPercent.toFixed(0) + '%';
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    if (progressBar) progressBar.style.width = targetPercent + '%';
    if (progressPercent) progressPercent.textContent = targetPercent.toFixed(0) + '%';
}

function calculateTodaySales() {
    const today = new Date();
    const todayOrders = AppState.orders.filter(order => {
        const orderDate = new Date(order.date);
        return isToday(orderDate);
    });
    
    return todayOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function populateSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    if (!scheduleList) return;
    
    // Get today's planned visits
    const todayVisits = AppState.visits.filter(v => {
        return isToday(new Date(v.date)) && v.status === 'planned';
    }).slice(0, 5);
    
    if (todayVisits.length === 0) {
        scheduleList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No visits scheduled for today</p>';
        return;
    }
    
    scheduleList.innerHTML = todayVisits.map(visit => `
        <div class="schedule-item" onclick="viewVisit('${visit.id}')">
            <div class="schedule-time">${visit.time || '10:00 AM'}</div>
            <div class="schedule-details">
                <div class="schedule-title">${visit.name}</div>
                <div class="schedule-location">📍 ${visit.location || 'Bangalore'}</div>
            </div>
        </div>
    `).join('');
}

function populateActivities() {
    const activityTimeline = document.getElementById('activityTimeline');
    if (!activityTimeline) return;
    
    // Generate sample activities
    const activities = [
        { time: '2 hours ago', title: 'Order Created', desc: 'Order #1234 - ₹45,000' },
        { time: '4 hours ago', title: 'Visit Completed', desc: 'Garuda Enterprises' },
        { time: '6 hours ago', title: 'New Retailer Added', desc: 'ABC Store, Koramangala' },
        { time: 'Yesterday', title: 'Payment Received', desc: '₹1,25,000 from PVR Enterprises' }
    ];
    
    activityTimeline.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.desc}</div>
            </div>
        </div>
    `).join('');
}

function populateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    // Sample team data
    const teamMembers = [
        { rank: 1, name: 'Rajesh Kumar', target: '₹8L', value: '₹7.2L', achievement: 90 },
        { rank: 2, name: 'Priya Sharma', target: '₹6L', value: '₹5.1L', achievement: 85 },
        { rank: 3, name: 'Amit Patel', target: '₹5L', value: '₹4L', achievement: 80 }
    ];
    
    leaderboardList.innerHTML = teamMembers.map(member => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank ${member.rank <= 3 ? ['gold', 'silver', 'bronze'][member.rank - 1] : ''}">
                ${member.rank}
            </div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${member.name}</div>
                <div class="leaderboard-target">${member.value} / ${member.target}</div>
            </div>
            <div class="leaderboard-value">${member.achievement}%</div>
        </div>
    `).join('');
}

// ===== DISTRIBUTORS =====
function populateDistributors(filter = 'all') {
    const distributorsList = document.getElementById('distributorsList');
    if (!distributorsList) return;
    
    let filtered = AppState.distributors;
    
    // Apply filter
    if (filter !== 'all') {
        filtered = filtered.filter(d => d.rating === filter);
    }
    
    if (filtered.length === 0) {
        distributorsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No distributors found</p>';
        return;
    }
    
    distributorsList.innerHTML = filtered.map(dist => `
        <div class="distributor-item" onclick="viewDistributor(${dist.index})">
            <div class="distributor-header">
                <div>
                    <div class="distributor-name">${dist.name}</div>
                    <div class="distributor-city">📍 ${dist.city}</div>
                </div>
                <div class="performance-badge ${dist.rating}">
                    ${dist.achievement.toFixed(0)}%
                </div>
            </div>
            <div class="distributor-stats">
                <div class="dist-stat">
                    <span class="dist-stat-value">${dist.retailers}</span>
                    <span class="dist-stat-label">Retailers</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${formatCurrency(dist.sales)}</span>
                    <span class="dist-stat-label">Sales</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${formatCurrency(dist.target)}</span>
                    <span class="dist-stat-label">Target</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Setup filter listeners
    setupDistributorFilters();
}

function setupDistributorFilters() {
    const filterChips = document.querySelectorAll('#distributorsView .filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Update active state
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Filter distributors
            const filter = this.dataset.filter;
            populateDistributors(filter);
        });
    });
}

function viewDistributor(index) {
    const dist = AppState.distributors[index];
    if (!dist) return;
    
    // Show detailed view (would be a modal or new screen)
    showToast('info', dist.name, `${dist.retailers} retailers • ${dist.city}`);
    // TODO: Implement full distributor detail view
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(value) {
    if (!value || value === 0) return '₹0';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    
    // Indian number format
    if (num >= 10000000) {
        return '₹' + (num / 10000000).toFixed(2) + 'Cr';
    } else if (num >= 100000) {
        return '₹' + (num / 100000).toFixed(2) + 'L';
    } else if (num >= 1000) {
        return '₹' + (num / 1000).toFixed(1) + 'K';
    } else {
        return '₹' + num.toLocaleString('en-IN');
    }
}

function showLoading(show) {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        if (show) {
            loadingScreen.classList.remove('hidden');
        } else {
            loadingScreen.classList.add('hidden');
        }
    }
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${getToastIcon(type)}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// ===== CONNECTIVITY =====
function setupConnectivityHandlers() {
    window.addEventListener('online', () => {
        AppState.isOnline = true;
        showToast('success', 'Online', 'Connection restored');
        syncDataNow();
    });
    
    window.addEventListener('offline', () => {
        AppState.isOnline = false;
        showToast('warning', 'Offline', 'Working in offline mode');
    });
}

function syncDataNow() {
    if (!AppState.isOnline) {
        showToast('warning', 'Offline', 'Cannot sync while offline');
        return;
    }
    
    const syncIcon = document.querySelector('.sync-icon');
    if (syncIcon) syncIcon.classList.add('spinning');
    
    showToast('info', 'Syncing', 'Updating data...');
    
    // Simulate sync
    setTimeout(() => {
        loadAllData().then(() => {
            if (syncIcon) syncIcon.classList.remove('spinning');
            showToast('success', 'Synced', 'Data updated successfully');
            populateView(AppState.currentView);
        });
    }, 2000);
}

function setupAutoSync() {
    setInterval(() => {
        if (AppState.isOnline && APP_CONFIG.sync.autoSync) {
            loadAllData();
        }
    }, APP_CONFIG.sync.syncInterval * 60 * 1000);
}

// ===== MAP FUNCTIONALITY =====
function initializeMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Initialize Leaflet map
    AppState.map = L.map('map').setView(APP_CONFIG.map.center, APP_CONFIG.map.zoom);
    
    // Add tile layer
    L.tileLayer(APP_CONFIG.map.tileLayer, {
        attribution: APP_CONFIG.map.attribution,
        minZoom: APP_CONFIG.map.minZoom,
        maxZoom: APP_CONFIG.map.maxZoom
    }).addTo(AppState.map);
    
    // Add distributors to map
    addDistributorsToMap();
    
    // Add plants to map
    addPlantsToMap();
    
    // Map controls
    setupMapControls();
}

function addDistributorsToMap() {
    AppState.distributors.forEach(dist => {
        const marker = L.marker([dist.lat, dist.lng], {
            icon: L.divIcon({
                className: 'custom-marker distributor-marker',
                html: '<div style="background: #4CAF50; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>'
            })
        }).addTo(AppState.map);
        
        marker.bindPopup(`
            <div style="padding: 8px;">
                <strong>${dist.name}</strong><br>
                ${dist.city}<br>
                <small>Achievement: ${dist.achievement.toFixed(0)}%</small><br>
                <button onclick="viewDistributor(${dist.index})" style="margin-top: 8px; padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">View Details</button>
            </div>
        `);
        
        AppState.mapMarkers.push(marker);
    });
}

function addPlantsToMap() {
    Object.values(PLANTS).forEach(plant => {
        const marker = L.marker([plant.lat, plant.lng], {
            icon: L.divIcon({
                className: 'custom-marker plant-marker',
                html: '<div style="background: #9C27B0; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px;">🏭</div>'
            })
        }).addTo(AppState.map);
        
        marker.bindPopup(`
            <div style="padding: 8px;">
                <strong>${plant.name}</strong><br>
                Capacity: ${plant.capacity}
            </div>
        `);
        
        AppState.mapMarkers.push(marker);
    });
}

function setupMapControls() {
    // My Location button
    const myLocationBtn = document.getElementById('myLocationBtn');
    if (myLocationBtn) {
        myLocationBtn.addEventListener('click', () => {
            if (AppState.userLocation) {
                AppState.map.setView([AppState.userLocation.lat, AppState.userLocation.lng], 15);
            } else {
                startGPSTracking();
            }
        });
    }
}

// ===== GPS TRACKING =====
function startGPSTracking() {
    if (!navigator.geolocation) {
        showToast('error', 'GPS Error', 'Geolocation not supported');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            AppState.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Add marker to map
            if (AppState.map) {
                // Remove old marker
                if (AppState.userLocationMarker) {
                    AppState.map.removeLayer(AppState.userLocationMarker);
                }
                
                // Add new marker
                AppState.userLocationMarker = L.marker([AppState.userLocation.lat, AppState.userLocation.lng], {
                    icon: L.divIcon({
                        className: 'custom-marker user-marker',
                        html: '<div style="background: #F44336; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>'
                    })
                }).addTo(AppState.map);
                
                AppState.map.setView([AppState.userLocation.lat, AppState.userLocation.lng], 13);
            }
            
            showToast('success', 'Location Found', 'GPS tracking enabled');
        },
        (error) => {
            console.error('GPS Error:', error);
            showToast('error', 'GPS Error', 'Could not get your location');
        }
    );
}

// ===== RETAILERS =====
function populateRetailers() {
    const retailersList = document.getElementById('retailersList');
    if (!retailersList) return;
    
    if (AppState.retailers.length === 0) {
        retailersList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No retailers yet<br><button onclick="addNewRetailer()" style="margin-top: 16px; padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Add First Retailer</button></p>';
        return;
    }
    
    retailersList.innerHTML = AppState.retailers.map((retailer, index) => `
        <div class="distributor-item" onclick="viewRetailer(${index})">
            <div class="distributor-header">
                <div>
                    <div class="distributor-name">${retailer.name}</div>
                    <div class="distributor-city">📍 ${retailer.address}</div>
                </div>
                <div class="performance-badge ${retailer.status || 'active'}">
                    ${retailer.status || 'Active'}
                </div>
            </div>
            <div class="distributor-stats">
                <div class="dist-stat">
                    <span class="dist-stat-value">${retailer.contact || 'N/A'}</span>
                    <span class="dist-stat-label">Contact</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${retailer.type || 'Retail'}</span>
                    <span class="dist-stat-label">Type</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${retailer.lastVisit || 'Never'}</span>
                    <span class="dist-stat-label">Last Visit</span>
                </div>
            </div>
        </div>
    `).join('');
}

function addNewRetailer() {
    showToast('info', 'Coming Soon', 'Add retailer form will open here');
    // TODO: Implement retailer form modal
}

function viewRetailer(index) {
    const retailer = AppState.retailers[index];
    if (!retailer) return;
    showToast('info', retailer.name, retailer.address);
}

// ===== VISITS =====
function populateVisits() {
    const visitsList = document.getElementById('visitsList');
    if (!visitsList) return;
    
    if (AppState.visits.length === 0) {
        visitsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No visits recorded<br><button onclick="startNewVisit()" style="margin-top: 16px; padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Start First Visit</button></p>';
        return;
    }
    
    visitsList.innerHTML = AppState.visits.map((visit, index) => `
        <div class="distributor-item" onclick="viewVisit('${visit.id}')">
            <div class="distributor-header">
                <div>
                    <div class="distributor-name">${visit.name}</div>
                    <div class="distributor-city">📍 ${visit.location} • ${visit.date}</div>
                </div>
                <div class="performance-badge ${visit.status}">
                    ${visit.status}
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 12px; color: #666;">
                ${visit.notes || 'No notes'}
            </div>
        </div>
    `).join('');
}

function startNewVisit() {
    showToast('info', 'New Visit', 'Starting new visit...');
    // TODO: Implement visit form with GPS check-in
}

function viewVisit(visitId) {
    const visit = AppState.visits.find(v => v.id === visitId);
    if (!visit) return;
    showToast('info', 'Visit Details', visit.name);
}

// ===== ORDERS =====
function populateOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (AppState.orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No orders yet<br><button onclick="createNewOrder()" style="margin-top: 16px; padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">Create First Order</button></p>';
        return;
    }
    
    ordersList.innerHTML = AppState.orders.map((order, index) => `
        <div class="distributor-item" onclick="viewOrder('${order.id}')">
            <div class="distributor-header">
                <div>
                    <div class="distributor-name">Order #${order.id}</div>
                    <div class="distributor-city">📅 ${order.date} • ${order.customer}</div>
                </div>
                <div class="performance-badge ${order.status}">
                    ${order.status}
                </div>
            </div>
            <div class="distributor-stats">
                <div class="dist-stat">
                    <span class="dist-stat-value">${formatCurrency(order.amount)}</span>
                    <span class="dist-stat-label">Amount</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${order.items || 0}</span>
                    <span class="dist-stat-label">Items</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${order.payment || 'Pending'}</span>
                    <span class="dist-stat-label">Payment</span>
                </div>
            </div>
        </div>
    `).join('');
}

function createNewOrder() {
    showToast('info', 'New Order', 'Order form will open here');
    // TODO: Implement order form
}

function viewOrder(orderId) {
    const order = AppState.orders.find(o => o.id === orderId);
    if (!order) return;
    showToast('info', 'Order Details', `Order #${order.id}`);
}

// ===== EXPANSION =====
function populateExpansion() {
    populateCoverageGaps();
}

function populateCoverageGaps() {
    const coverageGapList = document.getElementById('coverageGapList');
    if (!coverageGapList) return;
    
    const gaps = [
        { area: 'Whitefield', pois: 45, revenue: '₹12L', priority: 'high' },
        { area: 'Electronic City', pois: 38, revenue: '₹10L', priority: 'medium' },
        { area: 'Yelahanka', pois: 32, revenue: '₹8L', priority: 'medium' },
        { area: 'BTM Layout', pois: 28, revenue: '₹7L', priority: 'low' }
    ];
    
    coverageGapList.innerHTML = gaps.map(gap => `
        <div class="category-item" onclick="viewCoverageArea('${gap.area}')">
            <span class="cat-icon">📍</span>
            <div class="cat-info">
                <span class="cat-name">${gap.area}</span>
                <span class="cat-desc">${gap.pois} POIs • ${gap.revenue} potential</span>
            </div>
            <span class="cat-count" style="background: ${gap.priority === 'high' ? '#dc3545' : gap.priority === 'medium' ? '#ffc107' : '#28a745'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px;">
                ${gap.priority.toUpperCase()}
            </span>
        </div>
    `).join('');
}

function viewCoverageArea(area) {
    showToast('info', area, 'Viewing coverage area details');
}

function filterPOICategory(category) {
    showToast('info', 'Filter', `Filtering by ${category}`);
}

function exportPOIsByRadius() {
    showToast('success', 'Exported', 'POI data exported successfully');
}

function exportCoverageReport() {
    showToast('success', 'Exported', 'Coverage report exported');
}

function exportExpansionPlan() {
    showToast('success', 'Exported', 'Expansion plan exported');
}

// ===== REPORTS =====
function generateDailySalesReport() {
    showToast('info', 'Generating', 'Sales report is being prepared...');
}

function generateVisitReport() {
    showToast('info', 'Generating', 'Visit report is being prepared...');
}

function generatePerformanceReport() {
    showToast('info', 'Generating', 'Performance report is being prepared...');
}

function generateDistributorAnalysis() {
    showToast('info', 'Generating', 'Distributor analysis is being prepared...');
}

function generateExpansionReport() {
    showToast('info', 'Generating', 'Expansion report is being prepared...');
}

function generateTeamReport() {
    showToast('info', 'Generating', 'Team report is being prepared...');
}

// ===== TEAM (Manager Only) =====
function populateTeam() {
    const teamMembersList = document.getElementById('teamMembersList');
    if (!teamMembersList) return;
    
    const team = [
        { name: 'Rajesh Kumar', role: 'Sales Person', target: '₹8L', achieved: '₹7.2L', percent: 90, visits: 45 },
        { name: 'Priya Sharma', role: 'Sales Person', target: '₹6L', achieved: '₹5.1L', percent: 85, visits: 38 },
        { name: 'Amit Patel', role: 'Sales Person', target: '₹5L', achieved: '₹4L', percent: 80, visits: 32 },
        { name: 'Sneha Reddy', role: 'Sales Person', target: '₹5L', achieved: '₹3.5L', percent: 70, visits: 28 }
    ];
    
    teamMembersList.innerHTML = team.map((member, index) => `
        <div class="distributor-item" onclick="viewTeamMember(${index})">
            <div class="distributor-header">
                <div>
                    <div class="distributor-name">${member.name}</div>
                    <div class="distributor-city">${member.role}</div>
                </div>
                <div class="performance-badge ${member.percent >= 85 ? 'excellent' : member.percent >= 70 ? 'good' : 'average'}">
                    ${member.percent}%
                </div>
            </div>
            <div class="distributor-stats">
                <div class="dist-stat">
                    <span class="dist-stat-value">${member.achieved}</span>
                    <span class="dist-stat-label">Achieved</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${member.target}</span>
                    <span class="dist-stat-label">Target</span>
                </div>
                <div class="dist-stat">
                    <span class="dist-stat-value">${member.visits}</span>
                    <span class="dist-stat-label">Visits</span>
                </div>
            </div>
        </div>
    `).join('');
}

function viewTeamMember(index) {
    showToast('info', 'Team Member', 'Viewing team member details');
}

// ===== FAB MENU =====
function openFABMenu() {
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
        fabMenu.classList.remove('hidden');
    }
}

function closeFABMenu() {
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
        fabMenu.classList.add('hidden');
    }
}

// Quick action functions
function addExpense() {
    closeFABMenu();
    showToast('info', 'Add Expense', 'Expense form will open here');
}

function viewNearbyPOIs() {
    showToast('info', 'Nearby POIs', 'Showing nearby points of interest');
    navigateToView('map');
}

function viewMyRoute() {
    showToast('info', 'My Route', 'Viewing today\'s route');
    navigateToView('visits');
}

function viewAllActivities() {
    showToast('info', 'Activities', 'Viewing all activities');
}

function viewOnMap(type) {
    navigateToView('map');
}

// ===== SETTINGS =====
function clearLocalCache() {
    if (confirm('Are you sure you want to clear the cache? This will remove all offline data.')) {
        localStorage.clear();
        showToast('success', 'Cache Cleared', 'All cached data has been removed');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

function exportAllData() {
    showToast('success', 'Exported', 'All data exported successfully');
}

// ===== NOTIFICATIONS =====
function showNotifications() {
    const notifications = [
        { type: 'success', title: 'Order Delivered', message: 'Order #1234 delivered successfully', time: '2h ago' },
        { type: 'warning', title: 'Low Stock Alert', message: 'Product XYZ running low at ABC Store', time: '4h ago' },
        { type: 'info', title: 'New Target Assigned', message: 'Monthly target updated to ₹5.5L', time: '1d ago' }
    ];
    
    // Would show notifications panel/modal
    showToast('info', 'Notifications', `You have ${notifications.length} notifications`);
}

// ===== UPDATE CHECK =====
function checkForUpdates() {
    // Check for app updates
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
    }
}

// ===== INITIALIZE ON LOAD =====
console.log('RTM Mobile PWA Loaded - Version', APP_CONFIG.version);
