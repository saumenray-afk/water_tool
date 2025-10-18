// ===== CONFIGURATION =====
// This file connects to the same data as your web tool

// GitHub Configuration - Uses same repository as web tool
const GITHUB_CONFIG = {
    username: 'saumenray-afk',
    repo: 'water_tool',
    branch: 'main',
    dataFile: 'DENSE_CONTINUOUS_POI_150KM_20251010_225505.zip'
};

// Construct GitHub URLs
const POI_ZIP_URL = `https://raw.githubusercontent.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.dataFile}`;

// User Authentication - Same as web tool
const VALID_USERS = {
    'admin': {
        password: 'admin2024!',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@rtm.com'
    },
    'manager': {
        password: 'manager123',
        role: 'manager',
        name: 'Sales Manager',
        email: 'manager@rtm.com'
    },
    'soumen': {
        password: 'soumen123',
        role: 'sales',
        name: 'Soumen Ray',
        email: 'soumen@rtm.com'
    },
    'client': {
        password: 'client123',
        role: 'sales',
        name: 'Client User',
        email: 'client@rtm.com'
    },
    'test': {
        password: 'test2024!',
        role: 'sales',
        name: 'Test User',
        email: 'test@rtm.com'
    }
};

// Session Configuration
const SESSION_CONFIG = {
    timeout: 120, // minutes
    storageKey: 'rtm_session',
    rememberMe: true
};

// Distributor Data - Same as web tool
const DISTRIBUTORS_DATA = [
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

// Plant Locations - Same as web tool
const PLANTS = {
    plant1: {
        name: 'Bangalore Plant (Main)',
        lat: 12.996663,
        lng: 76.982185,
        capacity: '50000 L/day'
    },
    plant2: {
        name: 'Secondary Plant',
        lat: 12.9386,
        lng: 77.5441,
        capacity: '30000 L/day'
    }
};

// App Configuration
const APP_CONFIG = {
    name: 'RTM Mobile',
    version: '1.0.0',
    build: 'PWA-2025.10',
    defaultRadius: 50, // km
    maxRadius: 150, // km
    minRadius: 5, // km
    coverageRadius: 25, // km for distributors
    
    // Map Settings
    map: {
        center: [12.9716, 77.5946], // Bangalore
        zoom: 11,
        minZoom: 8,
        maxZoom: 18,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
    },
    
    // Feature Flags
    features: {
        offlineMode: true,
        gpsTracking: true,
        photoCapture: true,
        voiceNotes: false,
        digitalSignature: false,
        biometricAuth: false
    },
    
    // Performance Ratings
    performanceRatings: {
        excellent: { min: 90, label: 'Excellent', color: '#28a745' },
        good: { min: 75, label: 'Good', color: '#17a2b8' },
        average: { min: 60, label: 'Average', color: '#ffc107' },
        below: { min: 0, label: 'Below Average', color: '#dc3545' }
    },
    
    // POI Categories
    poiCategories: {
        'Distribution': {
            icon: '🏪',
            subCategories: ['Bulk Supplier', 'Cash & Carry', 'Distributor', 'Stockist', 'Wholesaler']
        },
        'Retail': {
            icon: '🛒',
            subCategories: ['Supermarket', 'Mini Market', 'Grocery Store', 'Convenience Store']
        },
        'Food & Beverage': {
            icon: '🍽️',
            subCategories: ['Restaurant', 'Cafe', 'Fast Food', 'Cloud Kitchen', 'Catering']
        },
        'Hospitality': {
            icon: '🏨',
            subCategories: ['Hotel', 'Resort', 'Guest House', 'Hostel']
        },
        'Corporate': {
            icon: '🏢',
            subCategories: ['Office', 'IT Park', 'Factory', 'Warehouse']
        },
        'Healthcare': {
            icon: '🏥',
            subCategories: ['Hospital', 'Clinic', 'Pharmacy', 'Lab']
        }
    },
    
    // Sync Settings
    sync: {
        autoSync: true,
        syncInterval: 30, // minutes
        maxRetries: 3,
        retryDelay: 5000 // ms
    },
    
    // Storage Keys
    storageKeys: {
        distributors: 'rtm_distributors',
        pois: 'rtm_pois',
        visits: 'rtm_visits',
        orders: 'rtm_orders',
        expenses: 'rtm_expenses',
        retailers: 'rtm_retailers',
        settings: 'rtm_settings',
        lastSync: 'rtm_last_sync'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GITHUB_CONFIG,
        POI_ZIP_URL,
        VALID_USERS,
        SESSION_CONFIG,
        DISTRIBUTORS_DATA,
        PLANTS,
        APP_CONFIG
    };
}
