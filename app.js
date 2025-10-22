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
    'admin': 'admin2024!',
    'manager': 'manager123',
    'soumen': 'soumen123',
    'client': 'client123',
    'test': 'test2024!'
};

const SESSION_TIMEOUT = 120; // minutes

// Actual distributor data from your CSV file
const distributorsData = [
    {name: 'ADHITHYA EDIFICE CONCEPTZ(NEW)', city: 'Bangalore', retailers: 195, lat: 12.9386, lng: 77.5441, target: 14000000, sales: 8873418, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'ADHITHYA ESSENTIALS', city: 'Bangalore', retailers: 155, lat: 12.9616, lng: 77.5385, target: 5000000, sales: 2697819, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'AKSHAYA AURA', city: 'Bangalore', retailers: 1, lat: 12.9762, lng: 77.5735, target: 0, sales: 10169, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'AURA ENTERPRISES (Bengaluru)', city: 'Bengaluru', retailers: 55, lat: 13.0382, lng: 77.5156, target: 100000, sales: 239293, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'B P AGENCY', city: 'Bengaluru', retailers: 55, lat: 12.9702, lng: 77.5619, target: 1200000, sales: 1205502, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'BHARATH CARE (BANGALORE)', city: 'Bengaluru', retailers: 19, lat: 13.0116, lng: 77.7263, target: 8000000, sales: 3806435, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'BHASKAR-GOWRIBIDNUR', city: 'Tumkur', retailers: 38, lat: 13.522, lng: 77.2373, target: 120000, sales: 460946, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'DINESH KUMAR (BENGALURU)', city: 'Bengaluru', retailers: 21, lat: 12.7981, lng: 77.6846, target: 90000, sales: 159636, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'EPOCH FILMING', city: 'Bangalore', retailers: 20, lat: 13.0382, lng: 77.5156, target: 90000, sales: 86796, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'ETERNAL TRADERS', city: 'Bangalore', retailers: 149, lat: 13.0214, lng: 77.6585, target: 11000000, sales: 4098238, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'G S Enterprises(Bengaluru) NEW', city: 'Bengaluru', retailers: 216, lat: 13.1391, lng: 77.4876, target: 2200000, sales: 4321530, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'GARUDA ENTERPRISES', city: 'Bangalore', retailers: 156, lat: 12.926, lng: 77.5293, target: 3200000, sales: 2092637, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'HANVIK CREATIONS', city: 'Bangalore', retailers: 38, lat: 12.9917, lng: 77.5073, target: 100000, sales: 167667, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'HIMESH FOODS PRIVATE LIMITED(BANGALORE)', city: 'Bangalore', retailers: 11, lat: 13.0096, lng: 77.556, target: 48000, sales: 50000, tsm: 'Not Assigned', classification: 'Retailer'},
    {name: 'JUBILANT FOODWORKS LTD (BANGALORE)', city: 'Bengaluru', retailers: 109, lat: 12.8381, lng: 77.6715, target: 50000, sales: 529836, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'K B C DISTRIBUTORS', city: 'Bengaluru', retailers: 269, lat: 12.8452, lng: 77.6604, target: 1800000, sales: 920798, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'KUSH ENTERPRISES', city: 'Bengaluru', retailers: 18, lat: 13.0714, lng: 77.6783, target: 320000, sales: 154189, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'P G C (BANGLORE)', city: 'Bengaluru', retailers: 59, lat: 12.9732, lng: 77.5286, target: 3200000, sales: 2755869, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'PNS ENTERPRISES (Vijayapura)', city: 'Bengaluru', retailers: 22, lat: 13.0916, lng: 77.6866, target: 100000, sales: 278531, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'POPKART INDIA PRIVATE LIMITED', city: 'Bengaluru', retailers: 118, lat: 12.9568, lng: 77.7286, target: 200000, sales: 1069068, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'PVR ENTERPRISES (BANGLORE)', city: 'Bengaluru', retailers: 605, lat: 12.9966, lng: 77.7136, target: 45000000, sales: 28402423, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'RAVI KH', city: 'Bengaluru', retailers: 24, lat: 12.9181, lng: 77.5442, target: 100000, sales: 103670, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'S L V enterprises (Bengaluru)', city: 'Bengaluru', retailers: 22, lat: 12.9181, lng: 77.5442, target: 120000, sales: 627077, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SAANVI ENTERPRISES', city: 'Bengaluru', retailers: 21, lat: 12.9568, lng: 77.7286, target: 90000, sales: 92376, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SAI ESHWAR ENTERPRISES', city: 'Bengaluru', retailers: 43, lat: 12.9896, lng: 77.5811, target: 7000000, sales: 4371139, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'SAKSHI ENTERPRISES(BENGALURU)', city: 'Bengaluru', retailers: 22, lat: 12.9846, lng: 77.5362, target: 100000, sales: 414261, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SANGVI AGRO PULSES', city: 'Bangalore', retailers: 107, lat: 13.0112, lng: 77.5192, target: 10000000, sales: 1019460, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'SANGVI AGRO PULSES (BANGALORE)', city: 'Bangalore', retailers: 276, lat: 13.0112, lng: 77.5192, target: 55000000, sales: 25069953, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'SBM Enterprises', city: 'Bengaluru', retailers: 190, lat: 12.8001, lng: 77.6092, target: 1800000, sales: 621439, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Shashank Enterprises', city: 'Bengaluru', retailers: 134, lat: 12.8826, lng: 77.6412, target: 5000000, sales: 953899, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SM ELIXIR', city: 'Bengaluru', retailers: 4, lat: 12.9352, lng: 77.5838, target: 160000, sales: 372438, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SM INFRA ELECTRADE', city: 'Bangalore', retailers: 6, lat: 12.9352, lng: 77.5838, target: 300000, sales: 189238, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SRI BASAVESHWARA ENTERPRISES', city: 'Bangalore', retailers: 40, lat: 13.0916, lng: 77.6866, target: 3000000, sales: 544236, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SRI DEVIRAMMA FOODS AND BEVERAGES', city: 'Bangalore', retailers: 13, lat: 12.9582, lng: 77.5116, target: 0, sales: 56946, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'Sri Lakshmi Narasimha Swamy Enterprises', city: 'Bangalore', retailers: 41, lat: 13.0714, lng: 77.6783, target: 10000000, sales: 178303, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Sri Lakshmi Narasimha Swamy Enterprises (BANGALORE)', city: 'Bangalore', retailers: 5, lat: 13.0714, lng: 77.6783, target: 4000000, sales: 2543899, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Sri Lakshmi Venkateshwra Enterprises Pure Water Supply', city: 'Bangalore', retailers: 43, lat: 12.9496, lng: 77.6226, target: 2000000, sales: 744752, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Sri Mangala Agencies', city: 'Tumkur', retailers: 138, lat: 13.3409, lng: 77.101, target: 90000, sales: 225081, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SRI MANJUNATHA ENTERPRISES', city: 'Tumkur', retailers: 22, lat: 13.3409, lng: 77.101, target: 2000000, sales: 911792, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Sri Manjunatha Enterprises(NELAMANGALA)', city: 'Bengaluru', retailers: 46, lat: 12.7981, lng: 77.6846, target: 90000, sales: 476985, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'SRI VEERABHADRASWAMY AGENCIES', city: 'Bengaluru', retailers: 38, lat: 13.3326, lng: 77.5376, target: 160000, sales: 165928, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'Sri Vinayaka Enterprises (Banglore)', city: 'Bangalore', retailers: 42, lat: 13.0714, lng: 77.6783, target: 3200000, sales: 683462, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'VENNA VENKATARAMA (Nagabhushan)', city: 'Bangalore', retailers: 19, lat: 13.2186, lng: 77.2062, target: 90000, sales: 83832, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'VIVAN WORLD WIDES', city: 'Bengaluru', retailers: 123, lat: 13.0285, lng: 77.5406, target: 1800000, sales: 2217457, tsm: 'Not Assigned', classification: 'Distributor'},
    {name: 'OYO HOTELS AND HOMES PRIVATE LIMITED (Karnataka)', city: 'Bengaluru', retailers: 16, lat: 13.0086, lng: 77.6956, target: 0, sales: 70272, tsm: 'Tejas Manjunath(Bengaluru)-Horeca', classification: 'Distributor'},
    {name: 'JAI MARUTHI ENTERPRISES (BANGLORE)', city: 'Bangalore', retailers: 47, lat: 13.0056, lng: 77.5562, target: 0, sales: 204901, tsm: 'Not Assigned', classification: 'Distributor'}
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
let currentViewPOIs = [];
let currentViewStats = {
    totalInRadius: 0,
    filtered: 0,
    radius: 0,
    category: 'all',
    subCategory: 'all'
};

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

    // Update total distributors count in UI
    document.getElementById('totalDist').textContent = distributors.length;
    const totalRetailers = distributors.reduce((sum, d) => sum + d.retailers, 0);
    document.getElementById('totalRetailers').textContent = totalRetailers.toLocaleString() + '+';

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

    // Reset current view stats
    currentViewPOIs = [];
    currentViewStats = {
        totalInRadius: 0,
        filtered: 0,
        radius: currentRadius,
        category: activeCategoryFilter,
        subCategory: activeSubCategoryFilter
    };

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
        let poisInRadius = pois;

        // First filter by radius if active
        if (currentRadius > 0) {
            poisInRadius = poisInRadius.filter(poi => {
                return Object.values(plants).some(plant => {
                    const distance = calculateDistance(poi.Latitude, poi.Longitude, plant.lat, plant.lng);
                    return distance <= currentRadius;
                });
            });
        }

        // Update total POIs in radius
        currentViewStats.totalInRadius = poisInRadius.length;

        // Apply category filter
        let filteredPOIs = poisInRadius;
        if (activeCategoryFilter !== 'all') {
            filteredPOIs = filteredPOIs.filter(poi => poi.Category === activeCategoryFilter);
        }

        // Apply sub-category filter (only if Distribution is selected)
        if (activeCategoryFilter === 'Distribution' && activeSubCategoryFilter !== 'all') {
            filteredPOIs = filteredPOIs.filter(poi => poi.Sub_Category === activeSubCategoryFilter);
        }

        // Store filtered POIs for export
        currentViewPOIs = filteredPOIs;
        currentViewStats.filtered = filteredPOIs.length;

        // Update UI with current stats
        updateCurrentViewStats();

        // Display POIs on map (sample for performance)
        const displayPOIs = filteredPOIs.filter((_, index) => index % 10 === 0);

        displayPOIs.forEach(poi => {
            // Check if this POI is selected
            const isSelected = selectedPOIs.has(poi.POI_ID);
            
            // Use gold color for selected POIs, otherwise normal category color
            const color = isSelected ? '#FFD700' : getMarkerColor(poi.Category);
            const size = poi.Priority === 'High' ? 8 : 5;
            const selectedSize = isSelected ? size + 3 : size;
            
            const marker = L.circleMarker([poi.Latitude, poi.Longitude], {
                radius: selectedSize,
                fillColor: color,
                color: isSelected ? '#FF8C00' : 'white',
                weight: isSelected ? 2 : 1,
                fillOpacity: isSelected ? 1.0 : 0.7
            }).bindPopup(createPOIPopup(poi), { maxWidth: 380 })
            .addTo(map);
            
            // Add click handler for selection if selection mode is enabled
            if (poiSelectionEnabled) {
                marker.on('click', function(e) {
                    L.DomEvent.stopPropagation(e);
                    selectPOI(poi.POI_ID);
                });
            }
            
            const tooltipContent = `
                <div style="text-align: center;">
                    <b>${poi.Business_Name || poi.POI_ID}</b><br>
                    <span style="font-size: 11px;">${poi.Sub_Category || poi.Category} • ${poi.City}</span><br>
                    <span style="font-size: 11px; color: #667eea;">${formatNumber(poi.Monthly_Requirement_Liters)} L/month</span>
                    ${isSelected ? '<br><span style="color: #FFD700; font-weight: bold;">⭐ SELECTED</span>' : ''}
                </div>
            `;
            marker.bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                offset: [0, -5]
            });
            
            mapMarkers.push(marker);
        });
    } else {
        updateCurrentViewStats();
    }
    
    // Draw distance lines
    drawPlantDistributorLines();
}

function updateCurrentViewStats() {
    document.getElementById('currentRadiusPOIs').textContent = currentViewStats.totalInRadius.toLocaleString();
    document.getElementById("totalVisiblePOIs").textContent = currentViewStats.filtered.toLocaleString();
    document.getElementById('filteredPOIs').textContent = currentViewStats.filtered.toLocaleString();
    
    // Update active radius display
    if (currentViewStats.radius > 0) {
        document.getElementById('activeRadiusDisplay').textContent = currentViewStats.radius + ' KM';
    } else {
        document.getElementById('activeRadiusDisplay').textContent = 'None (All POIs)';
    }
    
    // Update active filter display
    let filterText = currentViewStats.category === 'all' ? 'All Categories' : currentViewStats.category;
    if (currentViewStats.category === 'Distribution' && currentViewStats.subCategory !== 'all') {
        filterText += ` > ${currentViewStats.subCategory}`;
    }
    document.getElementById('activeFilterDisplay').textContent = filterText;
}

function exportCurrentViewPOIs() {
    if (currentViewPOIs.length === 0) {
        if (pois.length === 0) {
            alert('No POI data available. Please wait for data to load.');
        } else {
            alert('No POIs match the current filters and radius. Please adjust your filters or radius.');
        }
        return;
    }

    // Create descriptive filename
    const radiusText = currentViewStats.radius > 0 ? `${currentViewStats.radius}KM` : 'AllRadius';
    const categoryText = currentViewStats.category === 'all' ? 'AllCategories' : currentViewStats.category.replace(/\s+/g, '_');
    const subCategoryText = currentViewStats.subCategory !== 'all' ? `_${currentViewStats.subCategory.replace(/\s+/g, '_')}` : '';
    const date = new Date().toISOString().split('T')[0];
    
    const filename = `POIs_${radiusText}_${categoryText}${subCategoryText}_${date}.csv`;
    
    // Add export metadata to POIs
    const enrichedPOIs = currentViewPOIs.map(poi => {
        // Find nearest plant for each POI
        const nearestPlant = findNearestPlant(poi.Latitude, poi.Longitude);
        
        return {
            Export_Date: new Date().toISOString(),
            Export_Radius_KM: currentViewStats.radius || 'All',
            Export_Category_Filter: currentViewStats.category,
            Export_SubCategory_Filter: currentViewStats.subCategory !== 'all' ? currentViewStats.subCategory : 'All',
            Nearest_Plant_Name: nearestPlant.name,
            Distance_To_Plant_KM: nearestPlant.distance.toFixed(2),
            ...poi
        };
    });
    
    exportPOIsToCSV(enrichedPOIs, filename);
    
    // Show detailed export confirmation
    const categoryInfo = currentViewStats.category === 'all' ? 'All Categories' : 
                        currentViewStats.subCategory !== 'all' ? 
                        `${currentViewStats.category} > ${currentViewStats.subCategory}` : 
                        currentViewStats.category;
    
    alert(`✅ Export Successful!\n\n` +
          `POIs Exported: ${currentViewPOIs.length.toLocaleString()}\n` +
          `Radius: ${currentViewStats.radius > 0 ? currentViewStats.radius + ' KM' : 'All POIs'}\n` +
          `Filter: ${categoryInfo}\n\n` +
          `File: ${filename}`);
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

// Filter POIs by Category
function filterPOIsByCategory(category, element) {
    console.log('Filtering by category:', category);
    
    // Remove active class from ALL category filter chips (not sub-category)
    const allChips = document.querySelectorAll('#expansion-tab .control-section:first-child .filter-chip');
    allChips.forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Add active class to clicked element
    element.classList.add('active');
    
    // Update the active filter
    activeCategoryFilter = category;
    
    // Show/hide sub-category filters for Distribution
    const subFilters = document.getElementById('distributionSubFilters');
    if (category === 'Distribution') {
        subFilters.classList.add('active');
        // Reset sub-category filter to 'all'
        activeSubCategoryFilter = 'all';
        // Reset sub-category chips to show 'All Distribution' as active
        document.querySelectorAll('.sub-category-filters .filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        document.querySelector('.sub-category-filters .filter-chip').classList.add('active');
    } else {
        subFilters.classList.remove('active');
        activeSubCategoryFilter = 'all';
    }
    
    console.log('Active category:', activeCategoryFilter);
    console.log('Active sub-category:', activeSubCategoryFilter);
    
    // Update the map with new filters
    updateMap();
}

// Filter POIs by Sub-Category (Distribution only)
function filterPOIsBySubCategory(subCategory, element) {
    console.log('Filtering by sub-category:', subCategory);
    
    // Update active filter chip for sub-categories only
    document.querySelectorAll('.sub-category-filters .filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    element.classList.add('active');
    
    // Update the active sub-category filter
    activeSubCategoryFilter = subCategory;
    
    console.log('Active sub-category:', activeSubCategoryFilter);
    
    // Update the map with new filters
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

function selectDistributorForPOIExport(index) {
    selectedDistributorForExport = index;
    const dist = distributors[index];
    
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

function populateDistributorDropdown() {
    const select = document.getElementById('distributorSelect');
    
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    const sortedDistributors = [...distributors].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedDistributors.forEach((dist, originalIndex) => {
        const option = document.createElement('option');
        option.value = dist.index;
        option.textContent = `${dist.name} (${dist.city})`;
        select.appendChild(option);
    });
}

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
    
    exportPOIsByDistributor(distIndex, coverageRadius);
}

function exportPOIs() {
    if (pois.length === 0) {
        alert('No POI data available to export. Please wait for data to load.');
        return;
    }
    
    exportPOIsToCSV(pois, `all_pois_export_${new Date().toISOString().split('T')[0]}.csv`);
    alert(`✅ Exported all ${pois.length.toLocaleString()} POIs`);
}

function exportPOIsToCSV(poisArray, filename) {
    if (poisArray.length === 0) {
        alert('No POIs to export');
        return;
    }
    
    const allHeaders = new Set();
    poisArray.forEach(poi => {
        Object.keys(poi).forEach(key => allHeaders.add(key));
    });
    
    const headers = Array.from(allHeaders);
    
    let csv = headers.map(h => `"${h}"`).join(',') + '\n';
    
    poisArray.forEach(poi => {
        const row = headers.map(h => {
            const val = poi[h] !== undefined ? poi[h] : '';
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

// ============================================================
// FEATURE 1: MULTIPLE POI SELECTION
// ============================================================

let selectedPOIs = new Set();
let poiSelectionEnabled = false;

function togglePOISelection() {
    poiSelectionEnabled = document.getElementById('poiSelectionMode').checked;
    document.getElementById('selectedPOIPanel').style.display = poiSelectionEnabled ? 'block' : 'none';
    
    if (poiSelectionEnabled) {
        alert('✅ POI Selection Enabled!\n\nClick on any POI marker to select/deselect it.\nSelected POIs will turn GOLD.');
    } else {
        clearSelectedPOIs();
    }
    
    updateMap();
}

function selectPOI(poiId) {
    if (!poiSelectionEnabled) return;
    
    if (selectedPOIs.has(poiId)) {
        // Deselect
        selectedPOIs.delete(poiId);
    } else {
        // Select
        selectedPOIs.add(poiId);
    }
    
    updateSelectedPOIPanel();
    updateMap(); // Refresh map to show selected POIs in different color
}

function updateSelectedPOIPanel() {
    const count = selectedPOIs.size;
    document.getElementById('selectedCount').textContent = count;
    document.getElementById('totalSelectedPOIs').textContent = count;
    
    if (count === 0) {
        document.getElementById('selectedPOIList').innerHTML = '<div style="color: rgba(255,255,255,0.8); font-size: 12px; font-style: italic; text-align: center; padding: 8px;">No POIs selected</div>';
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 6px;">';
    selectedPOIs.forEach(poiId => {
        const poi = pois.find(p => p.POI_ID === poiId);
        if (poi) {
            const name = poi.Business_Name || poi.POI_ID;
            const truncatedName = name.length > 35 ? name.substring(0, 35) + '...' : name;
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.95); border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 12px; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${truncatedName}</div>
                        <div style="font-size: 10px; color: #666; margin-top: 2px;">${poi.Sub_Category || poi.Category}</div>
                    </div>
                    <button onclick="selectPOI('${poiId}')" style="padding: 4px 8px; background: rgba(220,53,69,0.1); color: #dc3545; border: 1px solid rgba(220,53,69,0.3); border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; transition: all 0.2s; flex-shrink: 0; margin-left: 8px;">✕</button>
                </div>
            `;
        }
    });
    html += '</div>';
    
    document.getElementById('selectedPOIList').innerHTML = html;
}

function clearSelectedPOIs() {
    selectedPOIs.clear();
    updateSelectedPOIPanel();
    updateMap();
}

function exportSelectedPOIs() {
    if (selectedPOIs.size === 0) {
        alert('❌ No POIs selected!\n\nPlease select POIs first by clicking on them.');
        return;
    }
    
    let csvContent = 'POI Name,Category,Sub-Category,Latitude,Longitude,City,State\n';
    
    selectedPOIs.forEach(poiId => {
        const poi = pois.find(p => p.id === poiId);
        if (poi) {
            csvContent += `"${poi.name}","${poi.category}","${poi.subCategory}",${poi.lat},${poi.lng},"${poi.city || ''}","${poi.state || ''}"\n`;
        }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected_pois_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert(`✅ Exported ${selectedPOIs.size} POIs to CSV!`);
}

// ============================================================
// FEATURE 2: TERRITORY DRAWING & EXPORT
// ============================================================

let drawnItems;
let drawControl;
let territoryPOIs = [];

function enableTerritoryDrawing() {
    if (!map) {
        alert('❌ Map not initialized yet. Please wait...');
        return;
    }
    
    // Initialize FeatureGroup for drawn items if not exists
    if (!drawnItems) {
        drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        
        // Initialize draw control
        drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems,
                remove: true
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    drawError: {
                        color: '#e1e100',
                        message: '<strong>Error:</strong> Shape edges cannot cross!'
                    },
                    shapeOptions: {
                        color: '#667eea',
                        weight: 3,
                        opacity: 0.8,
                        fillOpacity: 0.2
                    }
                },
                polyline: false,
                circle: false,
                marker: false,
                circlemarker: false,
                rectangle: {
                    shapeOptions: {
                        color: '#667eea',
                        weight: 3,
                        opacity: 0.8,
                        fillOpacity: 0.2
                    }
                }
            }
        });
        map.addControl(drawControl);
        
        // Handle draw created
        map.on(L.Draw.Event.CREATED, function (e) {
            const layer = e.layer;
            drawnItems.addLayer(layer);
            calculateTerritoryPOIs(layer);
        });
        
        // Handle draw edited
        map.on(L.Draw.Event.EDITED, function (e) {
            const layers = e.layers;
            layers.eachLayer(function (layer) {
                calculateTerritoryPOIs(layer);
            });
        });
        
        // Handle draw deleted
        map.on(L.Draw.Event.DELETED, function (e) {
            if (drawnItems.getLayers().length === 0) {
                territoryPOIs = [];
                updateTerritoryPanel();
            }
        });
    }
    
    alert('✅ Territory Drawing Enabled!\n\n1. Use the drawing tools in the top-right corner\n2. Draw a polygon or rectangle around your target area\n3. POIs within the territory will be calculated automatically\n4. Export the POIs when done');
    
    document.getElementById('territoryPanel').style.display = 'block';
}

function calculateTerritoryPOIs(layer) {
    const bounds = layer.getBounds ? layer.getBounds() : null;
    
    if (!bounds) return;
    
    territoryPOIs = [];
    
    pois.forEach(poi => {
        const latlng = L.latLng(poi.lat, poi.lng);
        
        // Check if point is in polygon for polygon layers
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            if (isPointInPolygon(latlng, layer.getLatLngs()[0])) {
                territoryPOIs.push(poi);
            }
        }
    });
    
    updateTerritoryPanel(layer);
}

function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lat, yi = polygon[i].lng;
        const xj = polygon[j].lat, yj = polygon[j].lng;
        
        const intersect = ((yi > point.lng) !== (yj > point.lng))
            && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function updateTerritoryPanel(layer) {
    const count = territoryPOIs.length;
    document.getElementById('territoryPOICount').textContent = count;
    document.getElementById('totalTerritoryPOIs').textContent = count;
    
    // Calculate area
    if (layer && layer.getBounds) {
        const bounds = layer.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        
        // Rough area calculation in km²
        const latDiff = ne.lat - sw.lat;
        const lngDiff = ne.lng - sw.lng;
        const area = Math.abs(latDiff * lngDiff * 111 * 111); // Very rough approximation
        
        document.getElementById('territoryArea').textContent = area.toFixed(2);
    }
}

function exportTerritoryPOIs() {
    if (territoryPOIs.length === 0) {
        alert('❌ No territory defined!\n\nPlease draw a territory first using the drawing tools.');
        return;
    }
    
    let csvContent = 'POI Name,Category,Sub-Category,Latitude,Longitude,City,State\n';
    
    territoryPOIs.forEach(poi => {
        csvContent += `"${poi.name}","${poi.category}","${poi.subCategory}",${poi.lat},${poi.lng},"${poi.city || ''}","${poi.state || ''}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `territory_pois_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    alert(`✅ Exported ${territoryPOIs.length} POIs from territory to CSV!`);
}

function clearTerritory() {
    if (confirm('Are you sure you want to clear the territory?')) {
        if (drawnItems) {
            drawnItems.clearLayers();
        }
        territoryPOIs = [];
        updateTerritoryPanel();
        document.getElementById('territoryPanel').style.display = 'none';
        alert('✅ Territory cleared!');
    }
}

console.log('✅ Enhanced features loaded successfully!');
console.log('📌 New Features Available:');
console.log('   1. Multiple POI Selection - Select individual POIs by clicking');
console.log('   2. Territory Definition - Draw custom areas and export all POIs within');

