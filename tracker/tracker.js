// Field Tracker PWA - Main JavaScript
// With LocalStorage for persistent history

let map, userLocation, territoryData, pois = [], visits = [];
let deferredPrompt;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Field Tracker App Starting...');
    
    // Check authentication
    checkAuth();
    
    // Load user data
    loadUserData();
    
    // Load visits from localStorage
    loadVisitsFromStorage();
    
    // Initialize map
    initMap();
    
    // Load POIs
    loadPOIs();
    
    // Update stats
    updateStats();
    
    // Setup navigation
    setupNavigation();
    
    // Setup PWA install prompt
    setupPWAInstall();
    
    // Register service worker
    registerServiceWorker();
    
    console.log('✅ App initialized');
});

// Authentication
function checkAuth() {
    const user = localStorage.getItem('fieldTrackerUser');
    if (!user) {
        // Redirect to login or create simple login
        const username = prompt('Enter your name:');
        if (username) {
            localStorage.setItem('fieldTrackerUser', username);
            document.getElementById('userName').textContent = username;
        } else {
            alert('Login required!');
            location.reload();
        }
    } else {
        document.getElementById('userName').textContent = user;
    }
}

function logout() {
    if (confirm('Logout and clear all data?')) {
        localStorage.clear();
        location.reload();
    }
}

// Load user territory data
function loadUserData() {
    // In production, this would come from your main tool's export
    // For now, using sample data
    territoryData = {
        id: 'T001',
        name: 'North Bangalore Territory',
        salesPerson: localStorage.getItem('fieldTrackerUser') || 'Sales Person',
        monthlyTarget: 50000,
        center: [12.9716, 77.5946] // Bangalore coordinates
    };
    
    document.getElementById('territoryName').textContent = territoryData.name;
    document.getElementById('territoryDetails').textContent = 
        `Assigned to: ${territoryData.salesPerson} | Monthly Target: ₹${territoryData.monthlyTarget.toLocaleString('en-IN')}`;
}

// Initialize map
function initMap() {
    map = L.map('map').setView(territoryData.center, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add user marker
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            userLocation = [pos.coords.latitude, pos.coords.longitude];
            L.marker(userLocation, {
                icon: L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background: #667eea; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>'
                })
            }).addTo(map).bindPopup('📍 You are here');
            
            map.setView(userLocation, 14);
        });
    }
}

// Load POIs (sample data - in production, import from main tool export)
function loadPOIs() {
    // Sample POIs - Replace with actual data from your territory export
    pois = [
        {
            id: 'POI001',
            name: 'ABC Juice Center',
            category: 'Retail',
            subCategory: 'Juice Center',
            address: 'MG Road, Bangalore',
            city: 'Bangalore',
            lat: 12.9758,
            lng: 77.6060,
            monthlyReq: 5000,
            status: 'pending'
        },
        {
            id: 'POI002',
            name: 'XYZ Restaurant',
            category: 'F&B',
            subCategory: 'Restaurant',
            address: 'Brigade Road, Bangalore',
            city: 'Bangalore',
            lat: 12.9720,
            lng: 77.6050,
            monthlyReq: 8000,
            status: 'pending'
        },
        {
            id: 'POI003',
            name: 'City Hospital',
            category: 'Healthcare',
            subCategory: 'Hospital',
            address: 'Indiranagar, Bangalore',
            city: 'Bangalore',
            lat: 12.9716,
            lng: 77.6412,
            monthlyReq: 15000,
            status: 'pending'
        }
    ];
    
    // Update POI statuses from visits
    updatePOIStatuses();
    
    // Render POIs on map
    renderPOIsOnMap();
    
    // Render POI list
    renderPOIList();
    
    // Populate POI select
    populatePOISelect();
}

function updatePOIStatuses() {
    visits.forEach(visit => {
        const poi = pois.find(p => p.id === visit.poiId);
        if (poi) {
            poi.status = visit.status;
            poi.lastVisit = visit.timestamp;
        }
    });
}

function renderPOIsOnMap() {
    pois.forEach(poi => {
        const color = poi.status === 'visited' || poi.status === 'converted' ? '#28a745' : '#dc3545';
        
        const marker = L.circleMarker([poi.lat, poi.lng], {
            radius: 8,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
            <strong>${poi.name}</strong><br>
            ${poi.category} - ${poi.subCategory}<br>
            ${poi.address}<br>
            Status: ${poi.status || 'Pending'}
        `);
    });
}

function renderPOIList() {
    const listDiv = document.getElementById('poiList');
    
    if (pois.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No POIs in your territory</div>';
        return;
    }
    
    let html = '';
    pois.forEach(poi => {
        const statusClass = poi.status || 'pending';
        const statusText = poi.status === 'converted' ? '🎉 Converted' :
                          poi.status === 'visited' ? '✅ Visited' :
                          '⏳ Pending';
        
        html += `
            <div class="poi-item" onclick="viewPOI('${poi.id}')">
                <div class="poi-item-header">
                    <div>
                        <div class="poi-name">${poi.name}</div>
                        <div class="poi-category">${poi.category} • ${poi.subCategory}</div>
                        <div class="poi-address">📍 ${poi.address}</div>
                    </div>
                    <div class="poi-status ${statusClass}">${statusText}</div>
                </div>
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function populatePOISelect() {
    const select = document.getElementById('poiSelect');
    let html = '<option value="">Choose a POI...</option>';
    
    pois.forEach(poi => {
        html += `<option value="${poi.id}">${poi.name} - ${poi.address}</option>`;
    });
    
    select.innerHTML = html;
}

function filterPOIs(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter POI list
    const items = document.querySelectorAll('.poi-item');
    items.forEach(item => {
        const status = item.querySelector('.poi-status').classList;
        if (filter === 'all' || status.contains(filter)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function viewPOI(poiId) {
    const poi = pois.find(p => p.id === poiId);
    if (poi && map) {
        map.setView([poi.lat, poi.lng], 16);
        
        // Switch to territory view if not already there
        switchView('my-territory');
    }
}


// Check-in functions
function selectPOI() {
    const select = document.getElementById('poiSelect');
    const poiId = select.value;
    
    if (!poiId) {
        document.getElementById('selectedPOIInfo').style.display = 'none';
        return;
    }
    
    const poi = pois.find(p => p.id === poiId);
    if (poi) {
        document.getElementById('selectedPOIName').textContent = poi.name;
        document.getElementById('selectedPOIAddress').textContent = `📍 ${poi.address}`;
        document.getElementById('selectedPOICategory').textContent = `${poi.category} - ${poi.subCategory}`;
        document.getElementById('selectedPOIInfo').style.display = 'block';
    }
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('❌ Geolocation is not supported by your device');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        position => {
            hideLoading();
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            document.getElementById('locationInfo').style.display = 'block';
            document.getElementById('locationText').textContent = 
                `✅ Location captured: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            // Store location for submit
            userLocation = [lat, lng];
        },
        error => {
            hideLoading();
            alert('❌ Unable to get location: ' + error.message);
        }
    );
}

function submitCheckIn() {
    const poiId = document.getElementById('poiSelect').value;
    const status = document.getElementById('visitStatus').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const notes = document.getElementById('visitNotes').value;
    const photoInput = document.getElementById('visitPhoto');
    
    if (!poiId) {
        alert('❌ Please select a POI');
        return;
    }
    
    if (!userLocation) {
        alert('❌ Please capture your location first');
        return;
    }
    
    showLoading();
    
    // Handle photo if uploaded
    let photoData = null;
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoData = e.target.result;
            saveVisit();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveVisit();
    }
    
    function saveVisit() {
        const visit = {
            id: 'V' + Date.now(),
            poiId: poiId,
            status: status,
            contactPerson: contactPerson,
            contactPhone: contactPhone,
            notes: notes,
            photo: photoData,
            location: userLocation,
            timestamp: new Date().toISOString(),
            user: localStorage.getItem('fieldTrackerUser')
        };
        
        // Save to visits array
        visits.push(visit);
        
        // Save to localStorage
        saveVisitsToStorage();
        
        // Update POI status
        updatePOIStatuses();
        renderPOIList();
        renderPOIsOnMap();
        
        // Update stats
        updateStats();
        
        hideLoading();
        
        // Clear form
        clearCheckInForm();
        
        // Show success and switch to history
        alert('✅ Check-in saved successfully!');
        switchView('history');
        renderHistory();
    }
}

function clearCheckInForm() {
    document.getElementById('poiSelect').value = '';
    document.getElementById('visitStatus').value = 'visited';
    document.getElementById('contactPerson').value = '';
    document.getElementById('contactPhone').value = '';
    document.getElementById('visitNotes').value = '';
    document.getElementById('visitPhoto').value = '';
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('selectedPOIInfo').style.display = 'none';
    document.getElementById('locationInfo').style.display = 'none';
}

// Photo preview
document.getElementById('visitPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').innerHTML = 
                `<img src="${e.target.result}" alt="Visit photo">`;
        };
        reader.readAsDataURL(file);
    }
});

// LocalStorage functions
function saveVisitsToStorage() {
    try {
        localStorage.setItem('fieldTrackerVisits', JSON.stringify(visits));
        console.log('✅ Visits saved to localStorage');
    } catch (e) {
        console.error('❌ Failed to save visits:', e);
        alert('Warning: Unable to save data locally');
    }
}

function loadVisitsFromStorage() {
    try {
        const stored = localStorage.getItem('fieldTrackerVisits');
        if (stored) {
            visits = JSON.parse(stored);
            console.log(`✅ Loaded ${visits.length} visits from localStorage`);
        }
    } catch (e) {
        console.error('❌ Failed to load visits:', e);
        visits = [];
    }
}

// History functions
function renderHistory() {
    const listDiv = document.getElementById('historyList');
    
    if (visits.length === 0) {
        listDiv.innerHTML = '<div class="no-data">No visit history yet. Start checking in!</div>';
        return;
    }
    
    // Sort by timestamp descending
    const sortedVisits = [...visits].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    let html = '';
    sortedVisits.forEach(visit => {
        const poi = pois.find(p => p.id === visit.poiId);
        const poiName = poi ? poi.name : visit.poiId;
        const date = new Date(visit.timestamp);
        const dateStr = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusEmoji = visit.status === 'converted' ? '🎉' :
                           visit.status === 'visited' ? '✅' :
                           visit.status === 'not-interested' ? '❌' : '🔄';
        
        html += `
            <div class="history-item">
                <div class="history-item-header">
                    <div>
                        <div class="history-poi-name">${statusEmoji} ${poiName}</div>
                        <div class="history-date">📅 ${dateStr}</div>
                    </div>
                </div>
                <div class="history-details">
                    <div><strong>Status:</strong> ${visit.status}</div>
                    ${visit.contactPerson ? `<div><strong>Contact:</strong> ${visit.contactPerson}</div>` : ''}
                    ${visit.contactPhone ? `<div><strong>Phone:</strong> ${visit.contactPhone}</div>` : ''}
                    ${visit.location ? `<div><strong>Location:</strong> ${visit.location[0].toFixed(5)}, ${visit.location[1].toFixed(5)}</div>` : ''}
                </div>
                ${visit.notes ? `<div class="history-notes">📝 ${visit.notes}</div>` : ''}
                ${visit.photo ? `<div class="history-photo"><img src="${visit.photo}" alt="Visit photo"></div>` : ''}
            </div>
        `;
    });
    
    listDiv.innerHTML = html;
}

function filterHistory(period) {
    // Update active button
    document.querySelectorAll('.history-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const now = new Date();
    const items = document.querySelectorAll('.history-item');
    
    items.forEach((item, index) => {
        const visit = visits[visits.length - 1 - index]; // Reverse order
        const visitDate = new Date(visit.timestamp);
        
        let show = true;
        
        if (period === 'today') {
            show = visitDate.toDateString() === now.toDateString();
        } else if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            show = visitDate >= weekAgo;
        } else if (period === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            show = visitDate >= monthAgo;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
}

function exportHistory() {
    if (visits.length === 0) {
        alert('❌ No history to export');
        return;
    }
    
    let csv = 'Visit ID,Date,Time,POI Name,Status,Contact Person,Phone,Notes,Latitude,Longitude\n';
    
    visits.forEach(visit => {
        const poi = pois.find(p => p.id === visit.poiId);
        const poiName = poi ? poi.name : visit.poiId;
        const date = new Date(visit.timestamp);
        const dateStr = date.toLocaleDateString('en-IN');
        const timeStr = date.toLocaleTimeString('en-IN');
        
        csv += `"${visit.id}","${dateStr}","${timeStr}","${poiName}","${visit.status}","${visit.contactPerson || ''}","${visit.contactPhone || ''}","${visit.notes || ''}","${visit.location ? visit.location[0] : ''}","${visit.location ? visit.location[1] : ''}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visit_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert(`✅ Exported ${visits.length} visits!`);
}

// Update stats
function updateStats() {
    const now = new Date();
    const today = now.toDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayVisits = visits.filter(v => new Date(v.timestamp).toDateString() === today).length;
    const weekVisits = visits.filter(v => new Date(v.timestamp) >= weekAgo).length;
    const pendingPOIs = pois.filter(p => p.status === 'pending' || !p.status).length;
    
    document.getElementById('todayVisits').textContent = todayVisits;
    document.getElementById('weekVisits').textContent = weekVisits;
    document.getElementById('totalVisits').textContent = visits.length;
    document.getElementById('pendingPOIs').textContent = pendingPOIs;
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(view) {
    // Update tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-view') === view) {
            tab.classList.add('active');
        }
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(v => {
        v.classList.remove('active');
    });
    document.getElementById(view + '-view').classList.add('active');
    
    // Refresh data for view
    if (view === 'history') {
        renderHistory();
    }
}

// PWA Install
function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installPrompt').style.display = 'block';
    });
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted install');
            }
            deferredPrompt = null;
            document.getElementById('installPrompt').style.display = 'none';
        });
    }
}

function dismissInstall() {
    document.getElementById('installPrompt').style.display = 'none';
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker registration failed:', err));
    }
}

// Loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

console.log('✅ Field Tracker loaded successfully');

