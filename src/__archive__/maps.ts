
// Google Maps API configuration
export const GOOGLE_MAPS_CONFIG = {
  // This will be replaced with the actual API key from Supabase secrets
  API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
  LIBRARIES: ['places', 'geometry'] as const,
};

// Extend Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}

// Load Google Maps script
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=${GOOGLE_MAPS_CONFIG.LIBRARIES.join(',')}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    
    document.head.appendChild(script);
  });
};
