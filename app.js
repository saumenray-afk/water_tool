// Configuration - IMPORTANT: Update these values with your GitHub repository details
const GITHUB_CONFIG = {
    username: 'saumenray-afk',
    repo: 'water_tool',
    branch: 'main',
    dataFile: 'DENSE_CONTINUOUS_POI_150KM_20251010_225505.zip'
};

// Construct the GitHub raw URL
const POI_ZIP_URL = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}`;

// User authentication
const VALID_USERS = {
    'admin': 'admin123',
    'manager': 'manager123',
    'soumen': 'soumen123',
    'client': 'client123',
    'test': 'test123'
};

const SESSION_TIMEOUT = 120; // minutes

// Sample distributor data
const distributorsData = [
    {name: 'ADHITHYA EDIFICE CONCEPTZ(NEW)', city: 'Bangalore', retailers: 195, lat: 12.9386, lng: 77.5441, target: 14000000, sales: 8873418, tsm: 'Shivakumar HC'},
    {name: 'ADHITHYA ESSENTIALS', city: 'Bangalore', retailers: 155, lat: 12.9616, lng: 77.5385, target: 5000000, sales: 2697819, tsm: 'Shivakumar HC'},
    {name: 'AQUAQUEST VENTURES', city: 'Mysuru', retailers: 284, lat: 12.2958, lng: 76.6394, target: 6000000, sales: 3304994, tsm: 'Vacant'},
    {name: 'B P AGENCY', city: 'Bengaluru', retailers: 55, lat: 12.9702, lng: 77.5619, target: 1200000, sales: 1205502, tsm: 'Shivakumar HC'},
    {name: 'ETERNAL TRADERS', city: 'Bangalore', retailers: 149, lat: 13.0214, lng: 77.6585, target: 11000000, sales: 4098238, tsm: 'Vacant'},
    {name: 'G S Enterprises(Bengaluru) NEW', city: 'Bengaluru', retailers: 216, lat: 13.1391, lng: 77.4876, target: 2200000, sales: 4321530, tsm: 'Srikanth BN'},
    {name: 'GARUDA ENTERPRISES', city: 'Bangalore', retailers: 156, lat: 12.926, lng: 77.5293, target: 3200000, sales: 2092637, tsm: 'Shivakumar HC'},
    {name: 'K B C DISTRIBUTORS', city: 'Bengaluru', retailers: 269, lat: 12.8452, lng: 77.6604, target: 1800000, sales: 920798, tsm: 'Shivakumar HC'},
    {name: 'PVR ENTERPRISES (BANGLORE)', city: 'Bengaluru', retailers: 605, lat: 12.9966, lng: 77.7136, target: 45000000, sales: 28402423, tsm: 'Vacant'},
    {name: 'SANGVI AGRO PULSES (BANGALORE)', city: 'Bangalore', retailers: 276, lat: 13.0112, lng: 77.5192, target: 55000000, sales: 25069953, tsm: 'Vacant'}
];

// Plant locations
const plants = {
    plant1: {name: 'Bangalore Plant (Main)', lat: 12.996663, lng: 76.982185},
    plant2: {name: 'Secondary Plant', lat: 12.9386, lng: 77.5441}
};

// Global variables
let map, currentRadius = 50, activeFilter = 'all';
let mapMarkers = [], coverageCircles = [], distributors = [];
let pois = [], poisLoaded = false;

// Robust CSV Parser that handles quoted fields
function parseCSVLine(line, delimiter = ',') {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote mode
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Push last field
    result.push(current.trim());
    
    return result;
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');
    
    if (VALID_USERS[username] && VALID_USERS[username] === password) {
        errorMsg.classList.remove('show');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').classList.add('active');
        document.getElementById('userDisplay').textContent = `👤 ${username}`;
        
        const loginTime = new Date().getTime();
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('loginTime', loginTime);
        
        initializeApp();
    } else {
        errorMsg.classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        location.reload();
    }
}

function checkSessionTimeout() {
    const loginTime = sessionStorage.getItem('loginTime');
    if (loginTime) {
        const currentTime = new Date().getTime();
        const elapsed = (currentTime - loginTime) / 1000 / 60;
        
        if (elapsed > SESSION_TIMEOUT) {
            alert('⏰ Session expired. Please login again.');
            sessionStorage.clear();
            location.reload();
        }
    }
}

window.addEventListener('load', function() {
    if (sessionStorage.getItem('loggedIn') === 'true') {
        checkSessionTimeout();
        
        if (sessionStorage.getItem('loggedIn') === 'true') {
            const username = sessionStorage.getItem('username');
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('app').classList.add('active');
            document.getElementById('userDisplay').textContent = `👤 ${username}`;
            initializeApp();
        }
    }
});

setInterval(checkSessionTimeout, 5 * 60 * 1000);

// POI Data Loading Functions
async function loadPOIData() {
    try {
        console.log('📥 Loading POI data from GitHub...');
        console.log('📍 GitHub URL:', POI_ZIP_URL);
        document.getElementById('poiStatusText').textContent = 'Loading from GitHub...';
        
        const response = await fetch(POI_ZIP_URL);
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`File not found (404). Please check your configuration.`);
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log('📦 Downloaded:', blob.size.toLocaleString(), 'bytes');
        
        if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
        }
        
        await loadPOIDataFromBlob(blob);
        
    } catch (error) {
        console.error('❌ Error loading from GitHub:', error);
        document.getElementById('poiStatusText').innerHTML = 
            `<span style="color: #dc3545;">⚠️ ${error.message}</span>`;
    }
}

async function loadPOIDataFromBlob(blob) {
    try {
        console.log('📦 Processing file, size:', blob.size, 'bytes');
        console.log('📦 Extracting ZIP...');
        document.getElementById('poiStatusText').textContent = 'Extracting ZIP file...';
        
        const zip = await JSZip.loadAsync(blob);
        const fileNames = Object.keys(zip.files);
        console.log('📁 Files in ZIP:', fileNames);
        
        if (fileNames.length === 0) {
            throw new Error('ZIP file contains no files');
        }
        
        const csvFileName = fileNames.find(name => 
            !name.startsWith('__MACOSX') && 
            !name.startsWith('.') &&
            (name.toLowerCase().endsWith('.csv') || 
             name.toLowerCase().endsWith('.txt') || 
             name.toLowerCase().endsWith('.tsv'))
        );
        
        if (!csvFileName) {
            throw new Error('No CSV file found in ZIP');
        }
        
        console.log(`📄 Extracting file: ${csvFileName}`);
        document.getElementById('poiStatusText').textContent = `Extracting ${csvFileName}...`;
        
        const csvText = await zip.files[csvFileName].async('text');
        console.log(`✅ CSV extracted: ${csvText.length.toLocaleString()} characters`);
        
        if (csvText.length === 0) {
            throw new Error('CSV file is empty');
        }
        
        console.log('📝 First 300 chars:', csvText.substring(0, 300));
        
        await parsePOIData(csvText, csvFileName);
        
    } catch (error) {
        console.error('❌ ERROR:', error);
        document.getElementById('poiStatusText').innerHTML = 
            `<span style="color: #dc3545;">⚠️ Error: ${error.message}</span>`;
        throw error;
    }
}

async function parsePOIData(csvText, fileName) {
    console.log('🔍 Parsing CSV data with robust parser...');
    document.getElementById('poiStatusText').textContent = 'Parsing CSV data...';
    
    const lines = csvText.trim().split('\n');
    console.log(`📊 Total lines: ${lines.length.toLocaleString()}`);
    
    if (lines.length < 2) {
        throw new Error('CSV has no data rows');
    }
    
    // Detect delimiter from first line
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const delimiter = commaCount > tabCount ? ',' : '\t';
    
    console.log(`🔧 Delimiter: ${delimiter === ',' ? 'COMMA' : 'TAB'} (commas: ${commaCount}, tabs: ${tabCount})`);
    
    // Parse headers using robust parser
    const headers = parseCSVLine(firstLine, delimiter);
    console.log(`📋 Headers (${headers.length}):`, headers.slice(0, 20));
    
    // Find lat/lng columns
    let latCol = headers.findIndex(h => 
        h.toLowerCase() === 'latitude' || h.toLowerCase() === 'lat'
    );
    let lngCol = headers.findIndex(h => 
        h.toLowerCase() === 'longitude' || h.toLowerCase() === 'lng' || h.toLowerCase() === 'long'
    );
    
    console.log(`📍 Latitude column: ${latCol} ("${headers[latCol]}")`);
    console.log(`📍 Longitude column: ${lngCol} ("${headers[lngCol]}")`);
    
    // Sample first data row
    if (lines.length > 1) {
        const sampleValues = parseCSVLine(lines[1], delimiter);
        console.log('📊 Sample row parsed (first 15 columns):');
        for (let i = 0; i < Math.min(15, sampleValues.length); i++) {
            console.log(`  [${i}] ${headers[i]}: "${sampleValues[i]}"`);
        }
        console.log(`  Sample Latitude [${latCol}]: "${sampleValues[latCol]}"`);
        console.log(`  Sample Longitude [${lngCol}]: "${sampleValues[lngCol]}"`);
    }
    
    if (latCol === -1 || lngCol === -1) {
        throw new Error(`Could not find lat/lng columns. Lat: ${latCol}, Lng: ${lngCol}`);
    }
    
    // Parse POI data
    pois = [];
    let validCount = 0;
    let invalidCount = 0;
    let errorSamples = [];
    
    console.log('\n🔄 Starting row processing...');
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        try {
            const values = parseCSVLine(line, delimiter);
            
            if (values.length < headers.length - 5) {
                invalidCount++;
                continue;
            }
            
            const poi = {};
            headers.forEach((header, index) => {
                poi[header] = values[index] ? values[index].trim() : '';
            });
            
            const lat = parseFloat(values[latCol]);
            const lng = parseFloat(values[lngCol]);
            
            // Validate coordinates
            if (isNaN(lat) || isNaN(lng)) {
                invalidCount++;
                if (errorSamples.length < 3) {
                    errorSamples.push({
                        line: i,
                        reason: 'non-numeric',
                        lat: values[latCol],
                        lng: values[lngCol]
                    });
                }
                continue;
            }
            
            if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                invalidCount++;
                if (errorSamples.length < 3) {
                    errorSamples.push({
                        line: i,
                        reason: 'out of range',
                        lat: lat,
                        lng: lng
                    });
                }
                continue;
            }
            
            if (lat === 0 && lng === 0) {
                invalidCount++;
                continue;
            }
            
            poi.Latitude = lat;
            poi.Longitude = lng;
            pois.push(poi);
            validCount++;
            
            // Progress updates
            if (i % 10000 === 0) {
                console.log(`⏳ Processing: ${i.toLocaleString()}/${lines.length.toLocaleString()} rows (${validCount.toLocaleString()} valid)`);
                document.getElementById('poiStatusText').textContent = 
                    `Processing: ${i.toLocaleString()}/${lines.length.toLocaleString()} rows...`;
                
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        } catch (parseError) {
            invalidCount++;
            if (errorSamples.length < 3) {
                errorSamples.push({
                    line: i,
                    reason: 'parse error',
                    error: parseError.message
                });
            }
        }
    }
    
    console.log('\n📊 PARSING COMPLETE:');
    console.log(`   ✅ Valid POIs: ${validCount.toLocaleString()}`);
    console.log(`   ❌ Invalid rows: ${invalidCount.toLocaleString()}`);
    
    if (errorSamples.length > 0) {
        console.log('\n📋 Sample errors:', errorSamples);
    }
    
    if (validCount === 0) {
        throw new Error(`No valid POIs found! All ${invalidCount} rows were invalid.`);
    }
    
    poisLoaded = true;
    console.log(`\n✅ SUCCESS! Loaded ${validCount.toLocaleString()} POIs`);
    
    updatePOIStats();
    updateMap();
}

function updatePOIStats() {
    document.getElementById('totalPOIs').textContent = pois.length.toLocaleString();
    document.getElementById('poiCountHeader').textContent = pois.length.toLocaleString();
    document.getElementById('poiStatusText').textContent = 
        `✅ ${pois.length.toLocaleString()} POIs loaded successfully`;
    
    const totalRetailers = distributors.reduce((sum, d) => sum + d.retailers, 0);
    const coverage = totalRetailers > 0 && pois.length > 0 ? (totalRetailers / pois.length * 100) : 0;
    document.getElementById('coverage').textContent = coverage.toFixed(1) + '%';
    
    const wsNeeded = Math.ceil(pois.length / 150);
    document.getElementById('newWSNeeded').textContent = wsNeeded + '+';
    document.getElementById('investment').textContent = '₹' + Math.ceil(wsNeeded * 0.6) + 'Cr';
    document.getElementById('monthlyRev').textContent = '₹' + Math.ceil(wsNeeded * 0.3) + 'Cr';
}

// Application initialization
function initializeApp() {
    distributorsData.forEach(d => {
        const achievement = d.target > 0 ? (d.sales / d.target * 100) : 0;
        let rating = 'Below Average';
        if (achievement >= 90) rating = 'Excellent';
        else if (achievement >= 75) rating = 'Good';
        else if (achievement >= 60) rating = 'Average';

        distributors.push({...d, achievement, rating});
    });

    map = L.map('map').setView([12.9716, 77.5946], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
    }).addTo(map);

    const plantIcon = L.divIcon({
        html: '<div style="background: #FF6B6B; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">🏭</div>',
        className: '',
        iconSize: [30, 30]
    });

    Object.values(plants).forEach(plant => {
        L.marker([plant.lat, plant.lng], {icon: plantIcon})
            .bindPopup(`<b>${plant.name}</b><br>Water Production Facility`)
            .addTo(map);
    });

    setupEventListeners();
    updateDistributorList();
    updateMap();
    loadPOIData();

    console.log(`✅ App Initialized: ${distributors.length} Distributors`);
}

function setupEventListeners() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-tab').classList.add('active');
        });
    });

    document.querySelectorAll('.radius-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentRadius = parseInt(this.dataset.radius);
            updateMap();
        });
    });
}

function updateDistributorList() {
    const list = document.getElementById('distributorList');
    list.innerHTML = '';
    
    distributors.forEach((dist, index) => {
        const item = document.createElement('div');
        item.className = 'distributor-item';
        item.onclick = () => focusOnDistributor(index);
        
        const badgeClass = 
            dist.rating === 'Excellent' ? 'badge-excellent' :
            dist.rating === 'Good' ? 'badge-good' :
            dist.rating === 'Average' ? 'badge-average' : 'badge-below';
        
        item.innerHTML = `
            <div class="distributor-name">
                ${dist.name}
                <span class="performance-badge ${badgeClass}">
                    ${dist.achievement.toFixed(1)}%
                </span>
            </div>
            <div class="distributor-meta">
                ${dist.city} • ${dist.retailers} retailers
            </div>
        `;
        
        list.appendChild(item);
    });
}

function focusOnDistributor(index) {
    const dist = distributors[index];
    map.setView([dist.lat, dist.lng], 13);
    
    document.querySelectorAll('.distributor-item').forEach((item, i) => {
        item.classList.toggle('selected', i === index);
    });
}

function updateMap() {
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];
    coverageCircles.forEach(circle => map.removeLayer(circle));
    coverageCircles = [];

    if (currentRadius > 0) {
        Object.values(plants).forEach(plant => {
            const circle = L.circle([plant.lat, plant.lng], {
                radius: currentRadius * 1000,
                color: '#667eea',
                fillColor: '#667eea',
                fillOpacity: 0.15,
                weight: 2
            }).addTo(map);
            coverageCircles.push(circle);
        });
    }

    if (document.getElementById('showDistributors').checked) {
        distributors.forEach(dist => {
            const color = dist.achievement >= 75 ? '#28a745' : 
                         dist.achievement >= 60 ? '#ffc107' : '#dc3545';
            const distIcon = L.divIcon({
                html: `<div style="background: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
                className: '',
                iconSize: [20, 20]
            });

            const marker = L.marker([dist.lat, dist.lng], {icon: distIcon})
                .bindPopup(`<b>${dist.name}</b><br>Achievement: ${dist.achievement.toFixed(1)}%<br>Retailers: ${dist.retailers}<br>City: ${dist.city}`)
                .addTo(map);
            
            mapMarkers.push(marker);
        });
    }

    if (document.getElementById('showCoverage').checked) {
        distributors.forEach(dist => {
            const circle = L.circle([dist.lat, dist.lng], {
                radius: 25000,
                color: '#28a745',
                fillColor: '#28a745',
                fillOpacity: 0.08,
                weight: 1
            }).addTo(map);
            coverageCircles.push(circle);
        });
    }

    if (document.getElementById('showPOIs').checked && pois.length > 0) {
        let filteredPOIs = pois;

        if (activeFilter !== 'all') {
            filteredPOIs = pois.filter(poi => poi.Category === activeFilter);
        }

        if (currentRadius > 0) {
            filteredPOIs = filteredPOIs.filter(poi => {
                return Object.values(plants).some(plant => {
                    const distance = calculateDistance(poi.Latitude, poi.Longitude, plant.lat, plant.lng);
                    return distance <= currentRadius;
                });
            });
        }

        const displayPOIs = filteredPOIs.filter((_, index) => index % 10 === 0);

        displayPOIs.forEach(poi => {
            const color = getMarkerColor(poi.Category);
            const size = poi.Priority === 'High' ? 8 : 5;
            
            const marker = L.circleMarker([poi.Latitude, poi.Longitude], {
                radius: size,
                fillColor: color,
                color: 'white',
                weight: 1,
                fillOpacity: 0.7
            }).bindPopup(`
                <b>${poi.Business_Name || poi.POI_ID}</b><br>
                Category: ${poi.Category || 'N/A'}<br>
                ${poi.Monthly_Requirement_Liters ? `Monthly: ${poi.Monthly_Requirement_Liters}L` : ''}
            `).addTo(map);
            
            mapMarkers.push(marker);
        });
    }
}

function getMarkerColor(category) {
    const colors = {
        'Distribution': '#4ECDC4',
        'Retail': '#FFD93D',
        'Food & Beverage': '#6BCB77',
        'Hospitality': '#FF6B6B',
        'Corporate': '#9D84B7',
        'Healthcare': '#E74C3C'
    };
    return colors[category] || '#95A5A6';
}

function filterDistributors() {
    const perfFilter = document.getElementById('perfFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    
    const filtered = distributors.filter(d => {
        const perfMatch = perfFilter === 'all' || d.rating === perfFilter;
        const cityMatch = cityFilter === 'all' || d.city === cityFilter;
        return perfMatch && cityMatch;
    });
    
    const list = document.getElementById('distributorList');
    list.innerHTML = '';
    
    filtered.forEach((dist) => {
        const item = document.createElement('div');
        item.className = 'distributor-item';
        item.onclick = () => focusOnDistributor(distributors.indexOf(dist));
        
        const badgeClass = 
            dist.rating === 'Excellent' ? 'badge-excellent' :
            dist.rating === 'Good' ? 'badge-good' :
            dist.rating === 'Average' ? 'badge-average' : 'badge-below';
        
        item.innerHTML = `
            <div class="distributor-name">
                ${dist.name}
                <span class="performance-badge ${badgeClass}">
                    ${dist.achievement.toFixed(1)}%
                </span>
            </div>
            <div class="distributor-meta">
                ${dist.city} • ${dist.retailers} retailers
            </div>
        `;
        
        list.appendChild(item);
    });
}

function filterPOIs(category, element) {
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    element.classList.add('active');
    activeFilter = category;
    updateMap();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function showPerformanceReport() {
    const modal = document.getElementById('reportModal');
    const content = document.getElementById('modalContent');
    
    const excellent = distributors.filter(d => d.rating === 'Excellent');
    const good = distributors.filter(d => d.rating === 'Good');
    const average = distributors.filter(d => d.rating === 'Average');
    const below = distributors.filter(d => d.rating === 'Below Average');
    
    content.innerHTML = `
        <div class="modal-header">📊 Distributor Performance Report</div>
        <div class="report-section">
            <div class="report-title">Performance Summary</div>
            <table>
                <tr><th>Level</th><th>Count</th><th>%</th><th>Sales</th></tr>
                <tr><td>🌟 Excellent (90%+)</td><td>${excellent.length}</td><td>${(excellent.length/distributors.length*100).toFixed(1)}%</td><td>₹${(excellent.reduce((sum, d) => sum + d.sales, 0)/100000).toFixed(1)}L</td></tr>
                <tr><td>✅ Good (75-90%)</td><td>${good.length}</td><td>${(good.length/distributors.length*100).toFixed(1)}%</td><td>₹${(good.reduce((sum, d) => sum + d.sales, 0)/100000).toFixed(1)}L</td></tr>
                <tr><td>⚠️ Average (60-75%)</td><td>${average.length}</td><td>${(average.length/distributors.length*100).toFixed(1)}%</td><td>₹${(average.reduce((sum, d) => sum + d.sales, 0)/100000).toFixed(1)}L</td></tr>
                <tr><td>❌ Below (<60%)</td><td>${below.length}</td><td>${(below.length/distributors.length*100).toFixed(1)}%</td><td>₹${(below.reduce((sum, d) => sum + d.sales, 0)/100000).toFixed(1)}L</td></tr>
            </table>
        </div>
    `;
    modal.classList.add('active');
}

function showCoverageGaps() {
    if (pois.length === 0) {
        alert('Please wait for POI data to load first.');
        return;
    }
    
    const wsNeeded = Math.ceil(pois.length / 150);
    const investment = Math.ceil(wsNeeded * 0.6);
    
    alert(`🎯 Coverage Gap Analysis\n\nBased on ${pois.length.toLocaleString()} POIs:\n\n• ${wsNeeded}+ new distributors needed\n• Investment: ₹${investment} Crores\n• Expected ROI: 6-8 months\n\nTop priority areas identified for expansion.`);
}

function showNewWSPlan() {
    alert('⭐ New WS Appointment Plan\n\n• High Priority: 50 locations\n• Medium Priority: 150 locations\n• Low Priority: 300 locations\n\nTotal investment: ₹300Cr\nProjected revenue: ₹150Cr/month');
}

function closeModal() {
    document.getElementById('reportModal').classList.remove('active');
}

function exportDistributors() {
    let csv = 'Name,City,Retailers,Achievement_%,Rating,Sales,Target\n';
    distributors.forEach(d => {
        csv += `"${d.name}","${d.city}",${d.retailers},${d.achievement.toFixed(2)},"${d.rating}",${d.sales},${d.target}\n`;
    });
    downloadCSV(csv, 'distributors.csv');
}

function exportPOIs() {
    if (pois.length === 0) {
        alert('No POI data available to export. Please wait for data to load.');
        return;
    }
    
    const headers = Object.keys(pois[0]);
    let csv = headers.join(',') + '\n';
    
    pois.slice(0, 5000).forEach(poi => {
        const row = headers.map(h => {
            const val = poi[h] || '';
            return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        });
        csv += row.join(',') + '\n';
    });
    
    downloadCSV(csv, 'pois_export.csv');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}




