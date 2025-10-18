// ===== PWA.JS - PWA Installation & Service Worker Management =====

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/mobile/service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 New service worker found');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Service Worker registration failed:', error);
            });
        
        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                showUpdateNotification();
            }
        });
    });
}

// Install Prompt Handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Install prompt available');
    
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event so it can be triggered later
    deferredPrompt = e;
    
    // Show custom install prompt
    showInstallPrompt();
});

// Show custom install prompt banner
function showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    const installButton = document.getElementById('installButton');
    const installClose = document.getElementById('installClose');
    
    if (!installPrompt) return;
    
    // Check if already dismissed
    if (localStorage.getItem('installPromptDismissed')) {
        return;
    }
    
    // Show the prompt
    installPrompt.classList.remove('hidden');
    
    // Install button click
    if (installButton) {
        installButton.addEventListener('click', async () => {
            // Hide the prompt
            installPrompt.classList.add('hidden');
            
            if (!deferredPrompt) {
                console.log('❌ Install prompt not available');
                return;
            }
            
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
                showToast('success', 'Installing...', 'RTM Mobile is being installed');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            
            // Clear the deferredPrompt
            deferredPrompt = null;
        });
    }
    
    // Close button click
    if (installClose) {
        installClose.addEventListener('click', () => {
            installPrompt.classList.add('hidden');
            localStorage.setItem('installPromptDismissed', 'true');
        });
    }
}

// Track when app is installed
window.addEventListener('appinstalled', () => {
    console.log('✅ RTM Mobile has been installed');
    showToast('success', 'Installed!', 'RTM Mobile is now installed on your device');
    
    // Hide install prompt
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.classList.add('hidden');
    }
    
    // Clear dismissed flag
    localStorage.removeItem('installPromptDismissed');
});

// Handle iOS Install Instructions
function showIOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true;
    
    if (isIOS && !isStandalone) {
        console.log('📱 iOS detected - showing install instructions');
        
        // Check if already shown
        if (sessionStorage.getItem('iosInstructionsShown')) {
            return;
        }
        
        // Show iOS-specific instructions
        setTimeout(() => {
            const message = `
                To install RTM Mobile on iOS:
                1. Tap the Share button (square with arrow)
                2. Scroll down and tap "Add to Home Screen"
                3. Tap "Add" in the top right corner
            `;
            
            if (confirm(message)) {
                sessionStorage.setItem('iosInstructionsShown', 'true');
            }
        }, 3000);
    }
}

// Show update notification
function showUpdateNotification() {
    const updateAvailable = confirm(
        'A new version of RTM Mobile is available! Would you like to update now?'
    );
    
    if (updateAvailable) {
        // Reload to activate new service worker
        window.location.reload();
    }
}

// Check if running as installed PWA
function isRunningAsP WA() {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')
    );
}

// PWA Detection and UI Adjustments
window.addEventListener('DOMContentLoaded', () => {
    if (isRunningAsPWA()) {
        console.log('✅ Running as installed PWA');
        document.body.classList.add('pwa-mode');
        
        // Hide install prompt if running as PWA
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.classList.add('hidden');
        }
    } else {
        console.log('🌐 Running in browser');
        
        // Show iOS instructions if applicable
        showIOSInstallInstructions();
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('✅ Back online');
    document.body.classList.remove('offline-mode');
});

window.addEventListener('offline', () => {
    console.log('❌ Gone offline');
    document.body.classList.add('offline-mode');
});

// Background Sync (if supported)
if ('sync' in navigator.serviceWorker.registration) {
    console.log('✅ Background Sync supported');
    
    // Register sync when data needs to be uploaded
    window.addEventListener('online', async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-data');
            console.log('🔄 Background sync registered');
        } catch (error) {
            console.error('❌ Background sync registration failed:', error);
        }
    });
}

// Push Notifications (if supported)
if ('Notification' in window && 'serviceWorker' in navigator) {
    console.log('✅ Push Notifications supported');
    
    // Request permission when user enables notifications in settings
    window.requestNotificationPermission = async function() {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('✅ Notification permission granted');
            showToast('success', 'Enabled', 'Push notifications enabled');
            
            // Subscribe to push notifications
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });
            
            console.log('Push subscription:', subscription);
            // Send subscription to server
        } else {
            console.log('❌ Notification permission denied');
            showToast('warning', 'Disabled', 'Push notifications are disabled');
        }
    };
}

// Utility: Convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Share API (if supported)
if (navigator.share) {
    console.log('✅ Web Share API supported');
    
    window.shareContent = async function(title, text, url) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
            console.log('✅ Content shared successfully');
        } catch (error) {
            console.error('❌ Share failed:', error);
        }
    };
}

// Add to Homescreen prompt tracking
let installPromptEvent;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPromptEvent = e;
    
    // Track that prompt is available
    localStorage.setItem('installPromptAvailable', 'true');
});

// Manual install trigger
window.triggerInstall = async function() {
    if (!installPromptEvent) {
        showToast('info', 'Not Available', 'Install prompt is not available');
        return;
    }
    
    installPromptEvent.prompt();
    
    const { outcome } = await installPromptEvent.userChoice;
    
    if (outcome === 'accepted') {
        console.log('✅ User accepted install');
        showToast('success', 'Installing', 'App is being installed...');
    } else {
        console.log('❌ User dismissed install');
    }
    
    installPromptEvent = null;
};

console.log('✅ PWA features initialized');
