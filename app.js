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

// Sample distributor data with wholesaler classifications
const distributorsData = [
    {name: 'ADHITHYA EDIFICE CONCEPTZ(NEW)', city: 'Bangalore', retailers: 195, lat: 12.9386, lng: 77.5441, target: 14000000, sales: 8873418, tsm: 'Shivakumar HC', classification: 'Super Stockist'},
    {name: 'ADHITHYA ESSENTIALS', city: 'Bangalore', retailers: 155, lat: 12.9616, lng: 77.5385, target: 5000000, sales: 2697819, tsm: 'Shivakumar HC', classification: 'Distributor'},
    {name: 'AQUAQUEST VENTURES', city: 'Mysuru', retailers: 284, lat: 12.2958, lng: 76.6394, target: 6000000, sales: 3304994, tsm: 'Vacant', classification: 'Super Stockist'},
    {name: 'B P AGENCY', city: 'Bengaluru', retailers: 55, lat: 12.9702, lng: 77.5619, target: 1200000, sales: 1205502, tsm: 'Shivakumar HC', classification: 'Sub Distributor'},
    {name: 'ETERNAL TRADERS', city: 'Bangalore', retailers: 149, lat: 13.0214, lng: 77.6585, target: 11000000, sales: 4098238, tsm: 'Vacant', classification: 'Distributor'},
    {name: 'G S Enterprises(Bengaluru) NEW', city: 'Bengaluru', retailers: 216, lat: 13.1391, lng: 77.4876, target: 2200000, sales: 4321530, tsm: 'Srikanth BN', classification: 'Distributor'},
    {name: 'GARUDA ENTERPRISES', city: 'Bangalore', retailers: 156, lat: 12.926, lng: 77.5293, target: 3200000, sales: 2092637, tsm: 'Shivakumar HC', classification: 'Sub Distributor'},
    {name: 'K B C DISTRIBUTORS', city: 'Bengaluru', retailers: 269, lat: 12.8452, lng: 77.6604, target: 1800000, sales: 920798, tsm: 'Shivakumar HC', classification: 'Distributor'},
    {name: 'PVR ENTERPRISES (BANGLORE)', city: 'Bengaluru', retailers: 605, lat: 12.9966, lng: 77.7136, target: 45000000, sales: 28402423, tsm: 'Vacant', classification: 'Super Stockist'},
    {name: 'SANGVI AGRO PULSES (BANGALORE)', city: 'Bangalore', retailers: 276, lat: 13.0112, lng: 77.5192, target: 55000000, sales: 25069953, tsm: 'Vacant', classification: 'Super Stockist'}
];

// Plant locations
const plants = {
    plant1: {name: 'Bangalore Plant (Main)', lat: 12.996663, lng: 76.982185},
    plant2: {name: 'Secondary Plant', lat: 12.9386, lng: 77.5441}
};

// Global variables
let map, currentRadius = 50;
let activeCategoryFilter = 'all';
let activeSubCategoryFilter = 'all';
let mapMarkers = [], coverageCircles = [], distributors = [], distanceLines = [];
let pois = [], poisLoaded = false;
let selectedPlantForExport = null;
let selectedDistributorForExport = null;
let customRadiusEnabled = false;

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
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Helper function to format currency
function formatCurrency(value) {
    if (!value) return 'N/A';
    const num = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return value;
    return '₹' + num.toLocaleString('en-IN');
}

// Helper function to format numbers
function formatNumber(value) {
    if (!value) return 'N/A';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-IN');
}

// Calculate distance between two points
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

// Find nearest plant for a given location
function findNearestPlant(lat, lng) {
    let nearestPlant = null;
    let minDistance = Infinity;
    
    Object.entries(plants).forEach(([key, plant]) => {
        const distance = calculateDistance(lat, lng, plant.lat, plant.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPlant = {key, ...plant, distance};
        }
    });
    
    return nearestPlant;
}

// Create detailed POI popup content
function createPOIPopup(poi) {
    const priority = poi.Priority || 'N/A';
    const priorityClass = priority === 'High' ? 'badge-excellent' : 
                          priority === 'Medium' ? 'badge-good' : 'badge-average';
    
    const consumption = poi.Water_Consumption || 'N/A';
    const consumptionClass = consumption === 'High' ? 'badge-below' : 
                             consumption === 'Medium' ? 'badge-average' : 'badge-good';
    
    return `
        <div style="min-width: 280px; max-width: 350px; font-family: 'Segoe UI', sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
                <div style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">
                    ${poi.Business_Name || poi.POI_ID || 'Unknown Business'}
                </div>
                <div style="font-size: 11px; opacity: 0.9;">
                    ${poi.Sub_Category || poi.Category || 'Business'}
                </div>
            </div>
            
            <div style="padding: 8px 0;">
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #666; width: 45%;">📍 Location:</td>
                        <td style="padding: 4px 0; font-weight: 600;">${poi.City || poi.Area || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">📮 Pincode:</td>
                        <td style="padding: 4px 0; font-weight: 600;">${poi.Pincode || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">🏢 Type:</td>
                        <td style="padding: 4px 0; font-weight: 600;">${poi.Business_Type || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">📏 Distance:</td>
                        <td style="padding: 4px 0; font-weight: 600;">${poi.Distance_From_Plant_KM ? poi.Distance_From_Plant_KM + ' KM' : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">🏭 Plant:</td>
                        <td style="padding: 4px 0; font-size: 11px;">${poi.Nearest_Plant || 'N/A'}</td>
                    </tr>
                </table>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; margin: 8px 0; padding-top: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #667eea; margin-bottom: 6px;">💧 WATER REQUIREMENTS</div>
                <table style="width: 100%; font-size: 12px;">
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Daily:</td>
                        <td style="padding: 3px 0; font-weight: 600; text-align: right;">${formatNumber(poi.Daily_Requirement_Liters)} L</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Monthly:</td>
                        <td style="padding: 3px 0; font-weight: 600; text-align: right;">${formatNumber(poi.Monthly_Requirement_Liters)} L</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Consumption:</td>
                        <td style="padding: 3px 0; text-align: right;">
                            <span class="performance-badge ${consumptionClass}" style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;">
                                ${consumption}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; margin: 8px 0; padding-top: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #667eea; margin-bottom: 6px;">💰 BUSINESS POTENTIAL</div>
                <table style="width: 100%; font-size: 12px;">
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Revenue:</td>
                        <td style="padding: 3px 0; font-weight: 600; text-align: right;">${formatCurrency(poi.Revenue_Potential)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Priority:</td>
                        <td style="padding: 3px 0; text-align: right;">
                            <span class="performance-badge ${priorityClass}" style="display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600;">
                                ${priority}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Lead Score:</td>
                        <td style="padding: 3px 0; font-weight: 600; text-align: right;">${poi.Lead_Score || 'N/A'}/100</td>
                    </tr>
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Price Sensitivity:</td>
                        <td style="padding: 3px 0; font-weight: 600; text-align: right;">${poi.Price_Sensitivity || 'N/A'}</td>
                    </tr>
                </table>
            </div>
            
            <div style="border-top: 1px solid #e0e0e0; margin: 8px 0; padding-top: 8px;">
                <div style="font-size: 11px; font-weight: 700; color: #667eea; margin-bottom: 6px;">📞 CONTACT INFO</div>
                <table style="width: 100%; font-size: 11px;">
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Status:</td>
                        <td style="padding: 2px 0; font-weight: 600;">${poi.Contact_Status || 'New Lead'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Sales Stage:</td>
                        <td style="padding: 2px 0; font-weight: 600;">${poi.Sales_Stage || 'Prospecting'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Best Time:</td>
                        <td style="padding: 2px 0;">${poi.Best_Contact_Time || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Current Supplier:</td>
                        <td style="padding: 2px 0;">${poi.Current_Water_Supplier || 'Unknown'}</td>
                    </tr>
                </table>
            </div>
            
            ${poi.Landmark ? `
            <div style="background: #f8f9ff; padding: 8px; border-radius: 6px; margin-top: 8px; font-size: 11px;">
                <strong style="color: #667eea;">📍 Landmark:</strong> ${poi.Landmark}
            </div>
            ` : ''}
            
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #999; text-align: center;">
                ID: ${poi.POI_ID || 'N/A'} • Created: ${poi.Created_Date || 'N/A'}
            </div>
        </div>
    `;
}

// Create detailed Distributor popup content
function createDistributorPopup(dist) {
    const achievementPercent = dist.achievement.toFixed(1);
    const achievementClass = dist.achievement >= 90 ? 'badge-excellent' :
                             dist.achievement >= 75 ? 'badge-good' :
                             dist.achievement >= 60 ? 'badge-average' : 'badge-below';
    
    const nearestPlant = findNearestPlant(dist.lat, dist.lng);
    
    return `
        <div style="min-width: 280px; font-family: 'Segoe UI', sans-serif;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px; margin: -10px -10px 10px -10px; border-radius: 4px 4px 0 0;">
                <div style="font-size: 15px; font-weight: 700; margin-bottom: 4px;">
                    📦 ${dist.name}
                </div>
                <div style="font-size: 11px; opacity: 0.9;">
                    ${dist.classification} - ${dist.city}
                </div>
            </div>
            
            <div style="padding: 8px 0;">
                <div style="text-align: center; margin: 10px 0;">
                    <div style="font-size: 32px; font-weight: 700; color: ${dist.achievement >= 75 ? '#28a745' : dist.achievement >= 60 ? '#ffc107' : '#dc3545'};">
                        ${achievementPercent}%
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 4px;">
                        <span class="performance-badge ${achievementClass}" style="display: inline-block; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                            ${dist.rating}
                        </span>
                    </div>
                </div>
                
                <table style="width: 100%; font-size: 12px; margin-top: 10px;">
                    <tr style="background: #f8f9ff;">
                        <td style="padding: 6px; color: #666;">🎯 Target:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">₹${(dist.target / 100000).toFixed(1)}L</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; color: #666;">💰 Sales:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">₹${(dist.sales / 100000).toFixed(1)}L</td>
                    </tr>
                    <tr style="background: #f8f9ff;">
                        <td style="padding: 6px; color: #666;">📍 Retailers:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">${dist.retailers}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; color: #666;">👤 TSM:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">${dist.tsm}</td>
                    </tr>
                    <tr style="background: #f8f9ff;">
                        <td style="padding: 6px; color: #666;">🏙️ City:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">${dist.city}</td>
                    </tr>
                    <tr>
                        <td style="padding: 6px; color: #666;">🏭 Nearest Plant:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">${nearestPlant.distance.toFixed(1)} KM</td>
                    </tr>
                    <tr style="background: #f8f9ff;">
                        <td style="padding: 6px; color: #666;">🏢 Type:</td>
                        <td style="padding: 6px; font-weight: 600; text-align: right;">${dist.classification}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 12px; padding: 10px; background: ${dist.achievement >= 90 ? '#d4edda' : dist.achievement >= 75 ? '#fff3cd' : '#f8d7da'}; border-radius: 6px; border-left: 4px solid ${dist.achievement >= 90 ? '#28a745' : dist.achievement >= 75 ? '#ffc107' : '#dc3545'};">
                    <div style="font-size: 11px; font-weight: 600; margin-bottom: 4px;">
                        ${dist.achievement >= 90 ? '🌟 Excellent Performance!' : 
                          dist.achievement >= 75 ? '✅ Good Performance' : 
                          dist.achievement >= 60 ? '⚠️ Average Performance' : '❌ Below Target'}
                    </div>
                    <div style="font-size: 10px;">
                        Gap: ₹${((dist.target - dist.sales) / 100000).toFixed(1)}L
                    </div>
                </div>
                
                <button onclick="selectDistributorForPOIExport(${dist.index})" style="width: 100%; margin-top: 10px; padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
                    📍 Export POIs Around This Distributor
                </button>
            </div>
        </div>
    `;
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
    
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    const delimiter = commaCount > tabCount ? ',' : '\t';
    
    console.log(`🔧 Delimiter: ${delimiter === ',' ? 'COMMA' : 'TAB'}`);
    
    const headers = parseCSVLine(firstLine, delimiter);
    console.log(`📋 Headers (${headers.length}):`, headers.slice(0, 20));
    
    let latCol = headers.findIndex(h => 
        h.toLowerCase() === 'latitude' || h.toLowerCase() === 'lat'
    );
    let lngCol = headers.findIndex(h => 
        h.toLowerCase() === 'longitude' || h.toLowerCase() === 'lng' || h.toLowerCase() === 'long'
    );
    
    console.log(`📍 Latitude column: ${latCol} ("${headers[latCol]}")`);
    console.log(`📍 Longitude column: ${lngCol} ("${headers[lngCol]}")`);
    
    if (latCol === -1 || lngCol === -1) {
        throw new Error(`Could not find lat/lng columns`);
    }
    
    pois = [];
    let validCount = 0;
    let invalidCount = 0;
    
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
            
            if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) {
                invalidCount++;
                continue;
            }
            
            poi.Latitude = lat;
            poi.Longitude = lng;
            pois.push(poi);
            validCount++;
            
            if (i % 10000 === 0) {
                console.log(`⏳ Processing: ${i.toLocaleString()}/${lines.length.toLocaleString()} rows (${validCount.toLocaleString()} valid)`);
                document.getElementById('poiStatusText').textContent = 
                    `Processing: ${i.toLocaleString()}/${lines.length.toLocaleString()} rows...`;
                
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        } catch (parseError) {
            invalidCount++;
        }
    }
    
    console.log(`\n✅ SUCCESS! Loaded ${validCount.toLocaleString()} POIs (${invalidCount.toLocaleString()} invalid)`);
    
    if (validCount === 0) {
        throw new Error(`No valid POIs found!`);
    }
    
    poisLoaded = true;
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

// Draw distance lines between plants and distributors
function drawPlantDistributorLines() {
    // Clear existing lines
    distanceLines.forEach(line => map.removeLayer(line));
    distanceLines = [];
    
    if (!document.getElementById('showDistLines').checked) {
        return;
    }
    
    distributors.forEach(dist => {
        const nearestPlant = findNearestPlant(dist.lat, dist.lng);
        
        const line = L.polyline(
            [[nearestPlant.lat, nearestPlant.lng], [dist.lat, dist.lng]],
            {
                color: '#FF6B6B',
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 10'
            }
        ).addTo(map);
        
        // Add tooltip to the line showing distance
        line.bindTooltip(
            `<div style="text-align: center;">
                <b>${dist.name}</b><br>
                Distance: ${nearestPlant.distance.toFixed(2)} KM<br>
                From: ${nearestPlant.name}
            </div>`,
            {
                permanent: false,
                direction: 'center'
            }
        );
        
        distanceLines.push(line);
    });
}

// Application initialization
function initializeApp() {
    distributorsData.forEach((d, index) => {
        const achievement = d.target > 0 ? (d.sales / d.target * 100) : 0;
        let rating = 'Below Average';
        if (achievement >= 90) rating = 'Excellent';
        else if (achievement >= 75) rating = 'Good';
        else if (achievement >= 60) rating = 'Average';

        distributors.push({...d, achievement, rating, index});
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
            .bindPopup(`<div style="text-align: center; padding: 5px;"><b style="font-size: 14px;">🏭 ${plant.name}</b><br><span style="font-size: 12px; color: #666;">Water Production Facility</span></div>`)
            .addTo(map);
    });

    setupEventListeners();
    updateDistributorList();
    populateDistributorDropdown();
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
            customRadiusEnabled = false;
            document.getElementById('customRadiusInput').value = '';
            updateMap();
        });
    });
}

function toggleCustomRadius() {
    customRadiusEnabled = document.getElementById('useCustomRadius').checked;
    document.getElementById('customRadiusInput').disabled = !customRadiusEnabled;
    
    if (customRadiusEnabled) {
        document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
    }
}

function applyCustomRadius() {
    const input = document.getElementById('customRadiusInput');
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 1 || value > 500) {
        alert('Please enter a valid radius between 1 and 500 KM');
        return;
    }
    
    currentRadius = value;
    customRadiusEnabled = true;
    document.getElementById('useCustomRadius').checked = true;
    document.querySelectorAll('.radius-btn').forEach(b => b.classList.remove('active'));
    updateMap();
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
                ${dist.city} • ${dist.retailers} retailers • ${dist.classification}
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

    if (currentRadius > 0 && document.getElementById('showPlants').checked) {
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
                .bindPopup(createDistributorPopup(dist), { maxWidth: 350 })
                .addTo(map);
            
            marker.bindTooltip(`<b>${dist.name}</b><br>${dist.achievement.toFixed(1)}% • ${dist.classification}`, {
                permanent: false,
                direction: 'top'
            });
            
            mapMarkers.push(marker);
        });
    }

    if (document.getElementById('showCoverage').checked) {
        const coverageRadius = parseInt(document.getElementById('coverageRadius').value) || 25;
        distributors.forEach(dist => {
            const circle = L.circle([dist.lat, dist.lng], {
                radius: coverageRadius * 1000,
                color: '#28a745',
                fillColor: '#28a745',
                fillOpacity: 0.08,
                weight: 1
            }).addTo(map);
            
            // Add tooltip showing coverage radius
            circle.bindTooltip(
                `<div style="text-align: center;">
                    <b>${dist.name}</b><br>
                    Coverage: ${coverageRadius} KM
                </div>`,
                {
                    permanent: false,
                    direction: 'center'
                }
            );
            
            coverageCircles.push(circle);
        });
    }

    if (document.getElementById('showPOIs').checked && pois.length > 0) {
        let filteredPOIs = pois;

        // Apply category filter
        if (activeCategoryFilter !== 'all') {
            filteredPOIs = filteredPOIs.filter(poi => poi.Category === activeCategoryFilter);
        }

        // Apply sub-category filter (only if Distribution is selected)
        if (activeCategoryFilter === 'Distribution' && activeSubCategoryFilter !== 'all') {
            filteredPOIs = filteredPOIs.filter(poi => poi.Sub_Category === activeSubCategoryFilter);
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
            }).bindPopup(createPOIPopup(poi), { maxWidth: 380 })
            .addTo(map);
            
            const tooltipContent = `
                <div style="text-align: center;">
                    <b>${poi.Business_Name || poi.POI_ID}</b><br>
                    <span style="font-size: 11px;">${poi.Sub_Category || poi.Category} • ${poi.City}</span><br>
                    <span style="font-size: 11px; color: #667eea;">${formatNumber(poi.Monthly_Requirement_Liters)} L/month</span>
                </div>
            `;
            marker.bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                offset: [0, -5]
            });
            
            mapMarkers.push(marker);
        });
    }
    
    // Draw distance lines
    drawPlantDistributorLines();
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
    const classFilter = document.getElementById('classFilter').value;
    
    const filtered = distributors.filter(d => {
        const perfMatch = perfFilter === 'all' || d.rating === perfFilter;
        const cityMatch = cityFilter === 'all' || d.city === cityFilter;
        const classMatch = classFilter === 'all' || d.classification === classFilter;
        return perfMatch && cityMatch && classMatch;
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
                ${dist.city} • ${dist.retailers} retailers • ${dist.classification}
            </div>
        `;
        
        list.appendChild(item);
    });
}

// NEW: Filter POIs by Category
function filterPOIsByCategory(category, element) {
    // Update active filter chip
    document.querySelectorAll('#expansion-tab .filter-chip').forEach(chip => {
        if (!chip.parentElement.classList.contains('sub-category-filters')) {
            chip.classList.remove('active');
        }
    });
    element.classList.add('active');
    
    activeCategoryFilter = category;
    
    // Show/hide sub-category filters for Distribution
    const subFilters = document.getElementById('distributionSubFilters');
    if (category === 'Distribution') {
        subFilters.classList.add('active');
    } else {
        subFilters.classList.remove('active');
        activeSubCategoryFilter = 'all';
    }
    
    updateMap();
}

// NEW: Filter POIs by Sub-Category (Distribution only)
function filterPOIsBySubCategory(subCategory, element) {
    // Update active filter chip
    document.querySelectorAll('.sub-category-filters .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    element.classList.add('active');
    
    activeSubCategoryFilter = subCategory;
    updateMap();
}

function showPerformanceReport() {
    const modal = document.getElementById('reportModal');
    const content = document.getElementById('modalContent');
    
    const excellent = distributors.filter(d => d.rating === 'Excellent');
    const good = distributors.filter(d => d.rating === 'Good');
    const average = distributors.filter(d => d.rating === 'Average');
    const below = distributors.filter(d => d.rating === 'Below Average');
    
    // Classification breakdown
    const classifications = {};
    distributors.forEach(d => {
        classifications[d.classification] = (classifications[d.classification] || 0) + 1;
    });
    
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
        
        <div class="report-section">
            <div class="report-title">Classification Breakdown</div>
            <table>
                <tr><th>Type</th><th>Count</th><th>% of Total</th></tr>
                ${Object.entries(classifications).map(([type, count]) => `
                    <tr><td>${type}</td><td>${count}</td><td>${(count/distributors.length*100).toFixed(1)}%</td></tr>
                `).join('')}
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

// Export POIs by plant
function exportPOIsByPlant() {
    if (pois.length === 0) {
        alert('No POI data available. Please wait for data to load.');
        return;
    }
    
    const plantKey = document.getElementById('plantSelect').value;
    if (!plantKey) {
        alert('Please select a plant first.');
        return;
    }
    
    const plant = plants[plantKey];
    const radiusKM = currentRadius > 0 ? currentRadius : 150;
    
    const filteredPOIs = pois.filter(poi => {
        const distance = calculateDistance(poi.Latitude, poi.Longitude, plant.lat, plant.lng);
        return distance <= radiusKM;
    });
    
    if (filteredPOIs.length === 0) {
        alert(`No POIs found within ${radiusKM} KM of ${plant.name}`);
        return;
    }
    
    exportPOIsToCSV(filteredPOIs, `POIs_${plantKey}_${radiusKM}KM_${new Date().toISOString().split('T')[0]}.csv`);
    alert(`✅ Exported ${filteredPOIs.length.toLocaleString()} POIs from ${plant.name} within ${radiusKM} KM radius`);
}

// Select distributor for POI export
function selectDistributorForPOIExport(index) {
    selectedDistributorForExport = index;
    const dist = distributors[index];
    
    // Show modal for radius selection
    const modal = document.getElementById('reportModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="modal-header">📍 Export POIs Around ${dist.name}</div>
        <div class="report-section">
            <div class="report-title">Select Export Radius</div>
            <p style="margin-bottom: 15px;">Choose the radius around this distributor to export POIs:</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 10)">10 KM</button>
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 25)">25 KM</button>
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 50)">50 KM</button>
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 75)">75 KM</button>
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 100)">100 KM</button>
                <button class="action-btn" onclick="exportPOIsByDistributor(${index}, 150)">150 KM</button>
            </div>
            <div style="margin-top: 20px;">
                <label style="font-weight: 600; margin-bottom: 8px; display: block;">Custom Radius (KM):</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" id="distCustomRadius" min="1" max="500" placeholder="Enter radius" style="flex: 1; padding: 10px; border: 2px solid #e0e0e0; border-radius: 6px;">
                    <button class="action-btn" style="flex: 0 0 auto; width: auto; padding: 10px 20px;" onclick="exportPOIsByDistributorCustom(${index})">Export</button>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

// Export POIs around distributor
function exportPOIsByDistributor(index, radiusKM) {
    if (pois.length === 0) {
        alert('No POI data available. Please wait for data to load.');
        return;
    }
    
    const dist = distributors[index];
    
    const filteredPOIs = pois.filter(poi => {
        const distance = calculateDistance(poi.Latitude, poi.Longitude, dist.lat, dist.lng);
        return distance <= radiusKM;
    });
    
    if (filteredPOIs.length === 0) {
        alert(`No POIs found within ${radiusKM} KM of ${dist.name}`);
        return;
    }
    
    // Add distributor info to each POI
    const enrichedPOIs = filteredPOIs.map(poi => {
        const distance = calculateDistance(poi.Latitude, poi.Longitude, dist.lat, dist.lng);
        return {
            Distributor_Name: dist.name,
            Distributor_City: dist.city,
            Distributor_Classification: dist.classification,
            Distance_To_Distributor_KM: distance.toFixed(2),
            ...poi
        };
    });
    
    exportPOIsToCSV(enrichedPOIs, `POIs_${dist.name.replace(/[^a-zA-Z0-9]/g, '_')}_${radiusKM}KM_${new Date().toISOString().split('T')[0]}.csv`);
    closeModal();
    alert(`✅ Exported ${filteredPOIs.length.toLocaleString()} POIs within ${radiusKM} KM of ${dist.name}`);
}

// Export POIs with custom radius
function exportPOIsByDistributorCustom(index) {
    const radiusInput = document.getElementById('distCustomRadius');
    const radiusKM = parseInt(radiusInput.value);
    
    if (isNaN(radiusKM) || radiusKM < 1 || radiusKM > 500) {
        alert('Please enter a valid radius between 1 and 500 KM');
        return;
    }
    
    exportPOIsByDistributor(index, radiusKM);
}

function exportDistributors() {
    let csv = 'Name,City,Classification,Retailers,Achievement_%,Rating,Sales,Target,TSM,Nearest_Plant,Distance_To_Plant_KM\n';
    distributors.forEach(d => {
        const nearestPlant = findNearestPlant(d.lat, d.lng);
        csv += `"${d.name}","${d.city}","${d.classification}",${d.retailers},${d.achievement.toFixed(2)},"${d.rating}",${d.sales},${d.target},"${d.tsm}","${nearestPlant.name}",${nearestPlant.distance.toFixed(2)}\n`;
    });
    downloadCSV(csv, 'distributors_with_classification.csv');
}

// NEW: Populate distributor dropdown
function populateDistributorDropdown() {
    const select = document.getElementById('distributorSelect');
    
    // Clear existing options except first
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Sort distributors by name
    const sortedDistributors = [...distributors].sort((a, b) => a.name.localeCompare(b.name));
    
    // Add distributor options
    sortedDistributors.forEach((dist, originalIndex) => {
        const option = document.createElement('option');
        option.value = dist.index;
        option.textContent = `${dist.name} (${dist.city})`;
        select.appendChild(option);
    });
}

// NEW: Update distributor export info display
function updateDistributorExportInfo() {
    const select = document.getElementById('distributorSelect');
    const infoDiv = document.getElementById('distExportInfo');
    const infoText = document.getElementById('distInfoText');
    
    if (select.value) {
        const distIndex = parseInt(select.value);
        const dist = distributors[distIndex];
        const coverageRadius = parseInt(document.getElementById('coverageRadius').value) || 25;
        
        infoText.innerHTML = `
            <div style="margin-bottom: 3px;">${dist.name}</div>
            <div style="font-size: 11px; color: #666;">${dist.city} • ${dist.classification} • ${coverageRadius} KM radius</div>
        `;
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}

// NEW: Export POIs by selected distributor from dropdown
function exportPOIsBySelectedDistributor() {
    const select = document.getElementById('distributorSelect');
    
    if (!select.value) {
        alert('Please select a distributor first.');
        return;
    }
    
    if (pois.length === 0) {
        alert('No POI data available. Please wait for data to load.');
        return;
    }
    
    const distIndex = parseInt(select.value);
    const coverageRadius = parseInt(document.getElementById('coverageRadius').value) || 25;
    
    // Use the existing export function
    exportPOIsByDistributor(distIndex, coverageRadius);
}

function exportPOIs() {
    if (pois.length === 0) {
        alert('No POI data available to export. Please wait for data to load.');
        return;
    }
    
    const exportLimit = 10000; // Export first 10,000 POIs or all if less
    const poisToExport = pois.slice(0, exportLimit);
    
    exportPOIsToCSV(poisToExport, `all_pois_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    if (pois.length > exportLimit) {
        alert(`✅ Exported ${exportLimit.toLocaleString()} POIs (limited from ${pois.length.toLocaleString()} total)`);
    } else {
        alert(`✅ Exported all ${poisToExport.length.toLocaleString()} POIs`);
    }
}

// NEW: Comprehensive POI export function with ALL details
function exportPOIsToCSV(poisArray, filename) {
    if (poisArray.length === 0) {
        alert('No POIs to export');
        return;
    }
    
    // Get all unique headers from all POIs
    const allHeaders = new Set();
    poisArray.forEach(poi => {
        Object.keys(poi).forEach(key => allHeaders.add(key));
    });
    
    const headers = Array.from(allHeaders);
    
    // Create CSV with all headers
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    
    // Add all POI data
    poisArray.forEach(poi => {
        const row = headers.map(h => {
            const val = poi[h] !== undefined ? poi[h] : '';
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const strVal = String(val);
            if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
                return `"${strVal.replace(/"/g, '""')}"`;
            }
            return strVal;
        });
        csv += row.join(',') + '\n';
    });
    
    downloadCSV(csv, filename);
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
